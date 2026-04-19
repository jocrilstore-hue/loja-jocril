"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type Theme = "dark" | "light";
type Ctx = { theme: Theme; setTheme: (t: Theme) => void };

const KEY = "jocril-theme";
const StoreThemeContext = createContext<Ctx | null>(null);

export function StoreThemeProvider({ children }: { children: ReactNode }) {
  // SSR gets dark; client useEffect reconciles with localStorage / OS.
  const [theme, setThemeState] = useState<Theme>("dark");

  useEffect(() => {
    let initial: Theme = "dark";
    try {
      const saved = localStorage.getItem(KEY);
      if (saved === "light" || saved === "dark") {
        initial = saved;
      } else if (
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-color-scheme: light)").matches
      ) {
        initial = "light";
      }
    } catch {}
    setThemeState(initial);
    document.documentElement.setAttribute("data-theme", initial);
  }, []);

  const setTheme = useCallback((next: Theme) => {
    const html = document.documentElement;
    html.classList.add("theme-no-transition");
    html.setAttribute("data-theme", next);
    try {
      localStorage.setItem(KEY, next);
    } catch {}
    setThemeState(next);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        html.classList.remove("theme-no-transition");
      });
    });
  }, []);

  return (
    <StoreThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </StoreThemeContext.Provider>
  );
}

export function useStoreTheme(): Ctx {
  const ctx = useContext(StoreThemeContext);
  if (!ctx) throw new Error("useStoreTheme must be used inside StoreThemeProvider");
  return ctx;
}

export function ThemeToggle() {
  const { theme, setTheme } = useStoreTheme();
  return (
    <div className="store-theme-toggle" role="group" aria-label="Tema">
      <button
        data-on={theme === "dark"}
        onClick={() => setTheme("dark")}
        title="Modo escuro"
        aria-label="Modo escuro"
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
        </svg>
      </button>
      <button
        data-on={theme === "light"}
        onClick={() => setTheme("light")}
        title="Modo claro"
        aria-label="Modo claro"
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      </button>
    </div>
  );
}
