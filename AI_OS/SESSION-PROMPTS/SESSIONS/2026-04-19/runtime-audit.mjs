import { spawn } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const BASE = process.env.AUDIT_BASE_URL ?? "http://localhost:3000";
const CHROME = process.env.CHROME_BIN ?? "/usr/bin/google-chrome";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitForJson(url, timeoutMs = 8000) {
  const start = Date.now();
  let lastError;
  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) return await response.json();
    } catch (error) {
      lastError = error;
    }
    await wait(150);
  }
  throw lastError ?? new Error(`Timed out waiting for ${url}`);
}

class CDP {
  constructor(wsUrl) {
    this.nextId = 1;
    this.pending = new Map();
    this.events = [];
    this.ws = new WebSocket(wsUrl);
  }

  async open() {
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("CDP websocket timeout")), 8000);
      this.ws.onopen = () => {
        clearTimeout(timer);
        resolve();
      };
      this.ws.onerror = (event) => {
        clearTimeout(timer);
        reject(new Error(`CDP websocket error: ${event.message ?? "unknown"}`));
      };
      this.ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.id && this.pending.has(message.id)) {
          const { resolve, reject } = this.pending.get(message.id);
          this.pending.delete(message.id);
          if (message.error) reject(new Error(message.error.message));
          else resolve(message);
          return;
        }
        this.events.push(message);
      };
    });
  }

  send(method, params = {}, sessionId) {
    const id = this.nextId++;
    const payload = { id, method, params };
    if (sessionId) payload.sessionId = sessionId;
    const promise = new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      setTimeout(() => {
        if (this.pending.has(id)) {
          this.pending.delete(id);
          reject(new Error(`CDP command timed out: ${method}`));
        }
      }, 10000);
    });
    this.ws.send(JSON.stringify(payload));
    return promise;
  }

  close() {
    this.ws.close();
  }
}

async function createBrowser(width, height) {
  const port = 9333 + Math.floor(Math.random() * 500);
  const userDataDir = await mkdtemp(join(tmpdir(), "jocril-audit-chrome-"));
  const chrome = spawn(CHROME, [
    "--headless=new",
    "--no-sandbox",
    "--disable-gpu",
    "--disable-dev-shm-usage",
    "--disable-background-networking",
    "--disable-extensions",
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    "about:blank",
  ], { stdio: ["ignore", "ignore", "pipe"] });

  const version = await waitForJson(`http://127.0.0.1:${port}/json/version`);
  const cdp = new CDP(version.webSocketDebuggerUrl);
  await cdp.open();
  const { result: { targetId } } = await cdp.send("Target.createTarget", { url: "about:blank" });
  const { result: { sessionId } } = await cdp.send("Target.attachToTarget", { targetId, flatten: true });
  for (const method of ["Page.enable", "Runtime.enable", "Network.enable", "Log.enable"]) {
    await cdp.send(method, {}, sessionId);
  }
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: width < 600,
  }, sessionId);

  return {
    cdp,
    chrome,
    sessionId,
    userDataDir,
    async close() {
      try { cdp.close(); } catch {}
      chrome.kill("SIGTERM");
      await rm(userDataDir, { recursive: true, force: true });
    },
  };
}

function eventSummary(events) {
  const consoleMessages = events
    .filter((event) => event.method === "Runtime.consoleAPICalled")
    .map((event) => ({
      type: event.params.type,
      text: (event.params.args ?? []).map((arg) => arg.value ?? arg.description ?? "").join(" "),
    }));
  const logEntries = events
    .filter((event) => event.method === "Log.entryAdded")
    .map((event) => ({
      level: event.params.entry.level,
      text: event.params.entry.text,
      url: event.params.entry.url,
    }));
  const failedNetwork = events
    .filter((event) => event.method === "Network.responseReceived")
    .map((event) => event.params.response)
    .filter((response) => response.status >= 400)
    .map((response) => ({ status: response.status, url: response.url }));
  return { consoleMessages, logEntries, failedNetwork };
}

async function navigate(browser, path, viewport) {
  if (viewport) {
    await browser.cdp.send("Emulation.setDeviceMetricsOverride", {
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: 1,
      mobile: viewport.width < 600,
    }, browser.sessionId);
  }
  browser.cdp.events.length = 0;
  await browser.cdp.send("Page.navigate", { url: new URL(path, BASE).toString() }, browser.sessionId);
  await wait(2400);
  return eventSummary(browser.cdp.events);
}

async function evaluate(browser, expression) {
  const wrapped = `Promise.resolve((async () => { ${expression} })())`;
  const message = await browser.cdp.send("Runtime.evaluate", {
    expression: wrapped,
    awaitPromise: true,
    returnByValue: true,
    userGesture: true,
  }, browser.sessionId);
  if (message.result.exceptionDetails) {
    return { error: message.result.exceptionDetails.text };
  }
  return message.result.result.value;
}

async function status(path) {
  try {
    const response = await fetch(new URL(path, BASE), { redirect: "manual" });
    return {
      path,
      status: response.status,
      location: response.headers.get("location"),
    };
  } catch (error) {
    return { path, error: error.message };
  }
}

async function main() {
  const result = {
    baseUrl: BASE,
    startedAt: new Date().toISOString(),
    routeStatuses: [],
    runtimePages: {},
    plp: {},
    search: {},
    pdpAndCart: {},
    contact: {},
    headerSearch: {},
    mobile: {},
  };

  const searchApi = await fetch(new URL("/api/products/search?q=expositor", BASE));
  const searchJson = await searchApi.json();
  const firstProduct = searchJson.data?.[0];
  const productPath = firstProduct?.slug ? `/produtos/${firstProduct.slug}` : "/produtos/bolsa-resistente-a-agua-autoadesivo-a3";

  const paths = [
    "/", "/produtos", "/produtos?cat=acrilicos-chao", "/categorias",
    "/pesquisa", "/pesquisa?q=expositor", productPath, "/carrinho", "/contacto",
    "/conta", "/encomendas", "/encomenda/AUDIT-NOT-FOUND", "/entrar",
    "/recuperar-password", "/confirmar-email", "/faq", "/sobre", "/processos",
    "/portfolio", "/sitemap", "/legais/cookies", "/legais/devolucoes",
    "/legais/envios", "/legais/privacidade", "/legais/termos", "/manutencao",
    "/admin", "/admin/login", "/admin/produtos", "/admin/produtos/novo",
    "/admin/encomendas", "/admin/clientes", "/admin/definicoes",
    "/termos", "/privacidade", "/politica-privacidade", "/admin/entrar",
    "/admin/escaloes", "/admin/produtos/variante",
  ];
  for (const path of paths) result.routeStatuses.push(await status(path));

  const browser = await createBrowser(1440, 900);
  try {
    for (const path of ["/", "/produtos", "/pesquisa?q=expositor", "/carrinho", "/contacto", "/sitemap"]) {
      const events = await navigate(browser, path);
      const anchors = await evaluate(browser, `
        return Array.from(document.querySelectorAll("a[href]"))
          .map((a) => ({ text: a.textContent.trim().replace(/\\s+/g, " ").slice(0, 80), href: a.getAttribute("href") }))
          .filter((a) => a.href)
          .slice(0, 80);
      `);
      result.runtimePages[path] = { events, anchors };
    }

    await navigate(browser, "/produtos");
    const productSummary = `
      const text = document.body.innerText;
      const cards = Array.from(document.querySelectorAll('a[href^="/produtos/"] article'));
      const countMatch = text.match(/(\\d+)\\s+de\\s+(\\d+)\\s+produtos/);
      return {
        url: location.pathname + location.search,
        countText: countMatch ? countMatch[0] : null,
        cardCount: cards.length,
        firstCards: cards.slice(0, 5).map((card) => {
          const lines = card.innerText.split(/\\n+/).map((line) => line.trim()).filter(Boolean);
          const href = card.closest("a")?.getAttribute("href");
          const price = lines.find((line) => /^€\\s/.test(line)) ?? null;
          return { href, lines: lines.slice(0, 8), price };
        }),
        noResults: text.includes("Nenhum produto corresponde"),
      };
    `;
    const clickText = `
      const isVisible = (node) => !!(node.offsetWidth || node.offsetHeight || node.getClientRects().length);
      const clickByText = (needle) => {
        const el = Array.from(document.querySelectorAll('button, div, label, span'))
          .filter(isVisible)
          .sort((a, b) => a.textContent.length - b.textContent.length)
          .find((node) => node.textContent.trim().replace(/\\s+/g, " ").startsWith(needle));
        if (!el) return false;
        (el.closest("button, div, label") ?? el).click();
        return true;
      };
    `;
    result.plp.initial = await evaluate(browser, productSummary);
    await evaluate(browser, `
      const select = document.querySelector("select");
      select.value = "price-desc";
      select.dispatchEvent(new Event("change", { bubbles: true }));
      return true;
    `);
    await wait(350);
    result.plp.sortPriceDesc = await evaluate(browser, productSummary);
    await evaluate(browser, `${clickText} return clickByText("Limpar tudo");`);
    await wait(250);
    await evaluate(browser, `${clickText} return clickByText("Até €50");`);
    await wait(350);
    result.plp.quickUnder50 = await evaluate(browser, productSummary);
    await evaluate(browser, `${clickText} return clickByText("Limpar tudo");`);
    await wait(250);
    await evaluate(browser, `${clickText} return clickByText("Acrílico 3mm");`);
    await wait(350);
    result.plp.materialAcrylic3mm = await evaluate(browser, productSummary);
    await evaluate(browser, `${clickText} return clickByText("Limpar tudo");`);
    await wait(250);
    await evaluate(browser, `${clickText} return clickByText("A4");`);
    await wait(350);
    result.plp.dimensionA4 = await evaluate(browser, productSummary);
    await evaluate(browser, `${clickText} return clickByText("Limpar tudo");`);
    await wait(250);
    await evaluate(browser, `
      const range = document.querySelector('input[type="range"]');
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
      setter.call(range, "20");
      range.dispatchEvent(new Event("input", { bubbles: true }));
      range.dispatchEvent(new Event("change", { bubbles: true }));
      return true;
    `);
    await wait(350);
    result.plp.maxPrice20 = await evaluate(browser, productSummary);

    await navigate(browser, "/pesquisa?q=expositor");
    const searchSummary = `
      const text = document.body.innerText;
      const productsBadge = text.match(/Produtos relacionados\\s*·\\s*(\\d+)/);
      const headerCount = text.match(/(\\d+)\\s+produtos\\s*·\\s*(\\d+)\\s+categorias/);
      const cards = Array.from(document.querySelectorAll('a[href^="/produtos/"] article'));
      return {
        url: location.pathname + location.search,
        headerCount: headerCount ? headerCount[0] : null,
        productsBadge: productsBadge ? productsBadge[0] : null,
        cardCount: cards.length,
        noResultsHelper: text.includes("Não encontrou o que procura?"),
        firstCards: cards.slice(0, 5).map((card) => card.innerText.split(/\\n+/).map((line) => line.trim()).filter(Boolean).slice(0, 6)),
      };
    `;
    result.search.initial = await evaluate(browser, searchSummary);
    await evaluate(browser, `
      const input = Array.from(document.querySelectorAll("main input")).find((el) => el.offsetParent !== null);
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
      setter.call(input, "zzznadaaudit");
      input.dispatchEvent(new Event("input", { bubbles: true }));
      return true;
    `);
    await wait(1000);
    result.search.noResultsQuery = await evaluate(browser, searchSummary);
    await evaluate(browser, `${clickText} return clickByText("Categorias");`);
    await wait(250);
    result.search.categoryScope = await evaluate(browser, searchSummary);

    await navigate(browser, productPath);
    result.pdpAndCart.productPath = productPath;
    result.pdpAndCart.pdpInitial = await evaluate(browser, `
      const text = document.body.innerText;
      const qty = document.querySelector('input[aria-label="Quantidade"]')?.value;
      return {
        title: document.querySelector("h1")?.textContent.trim(),
        qty,
        addButton: Array.from(document.querySelectorAll("button")).find((b) => b.textContent.includes("Adicionar") || b.textContent.includes("Pedir orçamento"))?.textContent.trim(),
        colorButtons: Array.from(document.querySelectorAll('button[title]')).map((b) => b.getAttribute("title")).filter(Boolean),
        hasSampleButtons: text.includes("Pedir amostra") && text.includes("Orçamento em grandes quantidades"),
      };
    `);
    await evaluate(browser, `
      const input = document.querySelector('input[aria-label="Quantidade"]');
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
      setter.call(input, "2");
      input.dispatchEvent(new Event("input", { bubbles: true }));
      return true;
    `);
    await wait(250);
    await evaluate(browser, `Array.from(document.querySelectorAll("button")).find((b) => b.textContent.includes("Adicionar ao carrinho"))?.click(); return true;`);
    await wait(600);
    result.pdpAndCart.afterAdd = await evaluate(browser, `
      return {
        localStorage: JSON.parse(localStorage.getItem("jocril-cart") ?? "{}"),
        cartLabel: document.querySelector('a[href="/carrinho"]')?.textContent.trim().replace(/\\s+/g, " "),
      };
    `);

    await navigate(browser, "/carrinho");
    result.pdpAndCart.cartInitial = await evaluate(browser, `
      return {
        textHasItem: document.body.innerText.includes("Carrinho ·"),
        cart: JSON.parse(localStorage.getItem("jocril-cart") ?? "{}"),
        step: document.body.innerText.match(/Carrinho\\s+Envio & Pagamento\\s+Confirmação/) ? "stepper visible" : "stepper missing",
        promoDisabled: !!document.querySelector('input[placeholder="Código promocional"][disabled]'),
      };
    `);
    await evaluate(browser, `document.querySelector('button[aria-label="Aumentar quantidade"]')?.click(); return true;`);
    await wait(350);
    result.pdpAndCart.cartAfterIncrement = await evaluate(browser, `return JSON.parse(localStorage.getItem("jocril-cart") ?? "{}");`);
    await evaluate(browser, `Array.from(document.querySelectorAll("button")).find((b) => b.textContent.includes("Continuar para envio"))?.click(); return true;`);
    await wait(350);
    result.pdpAndCart.checkoutStep2Visible = await evaluate(browser, `return document.body.innerText.includes("Dados e morada de envio");`);
    await evaluate(browser, `Array.from(document.querySelectorAll("button")).find((b) => b.textContent.includes("Finalizar encomenda"))?.click(); return true;`);
    await wait(350);
    result.pdpAndCart.checkoutValidation = await evaluate(browser, `
      return {
        hasRequiredError: document.body.innerText.includes("Preencha todos os campos obrigatórios"),
        hasConsentGate: /termos|consentimento|aceito/i.test(document.body.innerText),
        currentTextSample: document.body.innerText.slice(0, 1400),
      };
    `);

    await navigate(browser, "/contacto");
    result.contact.form = await evaluate(browser, `
      const searchButton = Array.from(document.querySelectorAll("button")).find((b) => b.textContent.trim() === "Procurar");
      return {
        fileInputs: document.querySelectorAll('input[type="file"]').length,
        procurarButtonType: searchButton?.getAttribute("type") ?? "default-submit",
        consentRequired: !!document.querySelector('input[name="consent"]')?.required,
        submitButtonText: Array.from(document.querySelectorAll("button")).find((b) => b.textContent.includes("Enviar mensagem"))?.textContent.trim(),
      };
    `);

    await navigate(browser, "/");
    result.headerSearch.before = await evaluate(browser, `return { url: location.pathname + location.search };`);
    await evaluate(browser, `
      const input = document.querySelector('header input[placeholder^="Procurar"]');
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
      setter.call(input, "expositor");
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
      return true;
    `);
    await wait(500);
    result.headerSearch.afterEnter = await evaluate(browser, `return { url: location.pathname + location.search, headerInputValue: document.querySelector('header input[placeholder^="Procurar"]')?.value ?? null };`);

    const mobileEvents = await navigate(browser, "/produtos", { width: 390, height: 844 });
    result.mobile.produtos = await evaluate(browser, `
      return {
        viewport: { width: innerWidth, height: innerHeight },
        title: document.querySelector("h1")?.textContent.trim(),
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        hasHorizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
        bodySample: document.body.innerText.slice(0, 800),
      };
    `);
    result.mobile.produtos.events = mobileEvents;
  } finally {
    await browser.close();
  }

  result.finishedAt = new Date().toISOString();
  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
