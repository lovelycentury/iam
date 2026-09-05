export const THEME_STORAGE_KEY = "okkly-iam-theme";
export const THEME_TRANSITION_MS = 220;

export type IamTheme = "light" | "dark";

export function isIamTheme(value: unknown): value is IamTheme {
  return value === "light" || value === "dark";
}

export function readDocumentTheme(): IamTheme {
  return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
}

export function readStoredTheme(): IamTheme | null {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY);
    return isIamTheme(value) ? value : null;
  } catch {
    return null;
  }
}

export function applyIamTheme(theme: IamTheme, options?: { persist?: boolean }) {
  const root = document.documentElement;
  const persist = options?.persist !== false;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!reduceMotion) {
    root.classList.add("okkly-transition-active");
    window.setTimeout(() => {
      root.classList.remove("okkly-transition-active");
    }, THEME_TRANSITION_MS);
  }

  root.setAttribute("data-theme", theme);

  if (!persist) return;

  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Private mode / blocked storage — the session still switches.
  }
}

/** Blocking head script: stored theme, else dark (the designed default). */
export const THEME_BOOTSTRAP_SCRIPT = `(function(){try{var k=${JSON.stringify(THEME_STORAGE_KEY)};var s=localStorage.getItem(k);document.documentElement.setAttribute("data-theme",(s==="light"||s==="dark")?s:"dark");}catch(e){try{document.documentElement.setAttribute("data-theme","dark");}catch(e2){}}})();`;
