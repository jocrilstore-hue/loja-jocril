import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const EMAIL_FROM = process.env.EMAIL_FROM || "onboarding@resend.dev";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "jocrilstore@gmail.com";

const accent = "#2DD4CD";
const textDark = "#1A1A1A";
const textMuted = "#6B7280";
const borderLight = "#E5E5E5";
const bgMuted = "#FAFAFA";
const sans = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
const mono = "'SF Mono', 'Consolas', 'Liberation Mono', monospace";

function formatEur(amount: number): string {
  return amount.toFixed(2).replace(".", ",") + "\u00a0€";
}

function baseTemplate(title: string, bodyHtml: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:#F5F5F5;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;font-family:${sans};background-color:#FFFFFF;color:${textDark};line-height:1.6;">
    <div style="text-align:center;padding-bottom:24px;border-bottom:1px dashed ${borderLight};margin-bottom:28px;">
      <h1 style="font-size:26px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0;color:${textDark};">JOCRIL</h1>
      <p style="margin:6px 0 0 0;color:${textMuted};font-size:14px;">Acrílicos de Qualidade</p>
    </div>
    ${bodyHtml}
    <div style="text-align:center;padding-top:28px;margin-top:28px;border-top:1px dashed ${borderLight};color:${textMuted};font-size:13px;">
      <p style="margin:0 0 6px 0;">Dúvidas? Contacte-nos: <a href="mailto:geral@jocril.pt" style="color:${accent};">geral@jocril.pt</a></p>
      <p style="margin:0;font-size:12px;">© ${new Date().getFullYear()} Jocril Acrílicos. Todos os direitos reservados.</p>
    </div>
  </div>
</body>
</html>`;
}

function orderNumberBox(orderNumber: string): string {
  return `<div style="border:1px dashed ${borderLight};padding:20px;margin:16px 0;background-color:${bgMuted};text-align:center;">
    <div style="font-family:${mono};font-size:12px;color:${textMuted};text-transform:uppercase;letter-spacing:1px;">Número da Encomenda</div>
    <div style="font-family:${mono};font-size:22px;font-weight:700;color:${accent};margin-top:6px;">${orderNumber}</div>
  </div>`;
}

// ---------------------------------------------------------------------------

export async function sendOrderConfirmation(data: {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  total: number;
}): Promise<void> {
  const html = baseTemplate(
    `Confirmação de Encomenda ${data.orderNumber} - Jocril`,
    `<div style="text-align:center;margin-bottom:24px;">
      <h2 style="font-size:22px;font-weight:600;margin:0 0 10px 0;">Obrigado pela sua encomenda!</h2>
      <p style="color:${textMuted};margin:0;">Olá ${data.customerName}, a sua encomenda foi recebida com sucesso.</p>
    </div>
    ${orderNumberBox(data.orderNumber)}
    <div style="text-align:center;margin:20px 0;">
      <span style="font-size:14px;color:${textMuted};">Total:</span>
      <span style="font-family:${mono};font-size:20px;font-weight:700;color:${accent};margin-left:8px;">${formatEur(data.total)}</span>
      <div style="font-size:12px;color:${textMuted};margin-top:4px;">IVA incluído</div>
    </div>
    <p style="color:${textMuted};font-size:14px;text-align:center;margin:16px 0 0 0;">
      Irá receber uma notificação quando a encomenda for enviada.<br>
      Se tiver questões, contacte-nos em <a href="mailto:geral@jocril.pt" style="color:${accent};">geral@jocril.pt</a>.
    </p>`
  );

  void resend.emails
    .send({
      from: `Jocril Acrílicos <${EMAIL_FROM}>`,
      to: [data.customerEmail],
      subject: `Confirmação de Encomenda ${data.orderNumber} - Jocril`,
      html,
    })
    .catch((e) => console.error("sendOrderConfirmation failed:", e));
}

// ---------------------------------------------------------------------------

export async function sendAdminNotification(data: {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  total: number;
}): Promise<void> {
  const html = baseTemplate(
    `Nova Encomenda ${data.orderNumber}`,
    `<h2 style="font-size:20px;font-weight:600;margin:0 0 16px 0;">Nova encomenda recebida</h2>
    ${orderNumberBox(data.orderNumber)}
    <table style="width:100%;border-collapse:collapse;margin-top:16px;">
      <tr style="border-bottom:1px solid ${borderLight};">
        <td style="padding:10px 0;font-size:13px;color:${textMuted};font-family:${mono};text-transform:uppercase;letter-spacing:0.5px;width:40%;">Cliente</td>
        <td style="padding:10px 0;font-size:15px;">${data.customerName}</td>
      </tr>
      <tr style="border-bottom:1px solid ${borderLight};">
        <td style="padding:10px 0;font-size:13px;color:${textMuted};font-family:${mono};text-transform:uppercase;letter-spacing:0.5px;">Email</td>
        <td style="padding:10px 0;font-size:15px;"><a href="mailto:${data.customerEmail}" style="color:${accent};">${data.customerEmail}</a></td>
      </tr>
      <tr>
        <td style="padding:10px 0;font-size:13px;color:${textMuted};font-family:${mono};text-transform:uppercase;letter-spacing:0.5px;">Total</td>
        <td style="padding:10px 0;font-family:${mono};font-size:18px;font-weight:700;color:${accent};">${formatEur(data.total)}</td>
      </tr>
    </table>`
  );

  void resend.emails
    .send({
      from: `Jocril Acrílicos <${EMAIL_FROM}>`,
      to: [ADMIN_EMAIL],
      subject: `Nova Encomenda ${data.orderNumber} — ${data.customerName}`,
      html,
    })
    .catch((e) => console.error("sendAdminNotification failed:", e));
}

// ---------------------------------------------------------------------------

export async function sendPaymentReceived(data: {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  total: number;
}): Promise<void> {
  const html = baseTemplate(
    `Pagamento Confirmado — Encomenda ${data.orderNumber} - Jocril`,
    `<div style="text-align:center;margin-bottom:24px;">
      <h2 style="font-size:22px;font-weight:600;margin:0 0 10px 0;">Pagamento confirmado!</h2>
      <p style="color:${textMuted};margin:0;">Olá ${data.customerName}, recebemos o seu pagamento com sucesso.</p>
    </div>
    ${orderNumberBox(data.orderNumber)}
    <div style="text-align:center;margin:20px 0;">
      <span style="font-size:14px;color:${textMuted};">Total pago:</span>
      <span style="font-family:${mono};font-size:20px;font-weight:700;color:${accent};margin-left:8px;">${formatEur(data.total)}</span>
      <div style="font-size:12px;color:${textMuted};margin-top:4px;">IVA incluído</div>
    </div>
    <p style="color:${textMuted};font-size:14px;text-align:center;margin:16px 0 0 0;">
      A sua encomenda está agora em processamento.<br>
      Irá receber uma notificação quando for enviada.
    </p>`
  );

  void resend.emails
    .send({
      from: `Jocril Acrílicos <${EMAIL_FROM}>`,
      to: [data.customerEmail],
      subject: `Pagamento Confirmado — Encomenda ${data.orderNumber} - Jocril`,
      html,
    })
    .catch((e) => console.error("sendPaymentReceived failed:", e));
}
