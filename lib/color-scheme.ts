// The site follows prefers-color-scheme until the reader picks a scheme with the header toggle. That
// choice is stored and applied as a `light`/`dark` class on <html>, which styles/theme.css keys off.

export type ColorScheme = 'light' | 'dark';

export const STORAGE_KEY = 'color-scheme';
// Where MUI's color-scheme manager kept the choice, so readers who picked one before keep it.
const LEGACY_STORAGE_KEY = 'mui-mode';

// Runs inline in <head>, before first paint, so a stored choice never flashes the other scheme.
// Kept self-contained (no imports, no closures) because it is serialized into the page.
export function applyStoredColorScheme(storageKey: string, legacyStorageKey: string) {
  try {
    const stored = localStorage.getItem(storageKey) ?? localStorage.getItem(legacyStorageKey);
    if (stored === 'light' || stored === 'dark') {
      document.documentElement.classList.add(stored);
    }
  } catch {
    // Storage can be unavailable (privacy modes); the system scheme still applies.
  }
}

export const colorSchemeScript = `(${applyStoredColorScheme.toString()})(${JSON.stringify(STORAGE_KEY)}, ${JSON.stringify(LEGACY_STORAGE_KEY)});`;

export function getColorScheme(): ColorScheme {
  const { classList } = document.documentElement;
  if (classList.contains('dark')) return 'dark';
  if (classList.contains('light')) return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function setColorScheme(scheme: ColorScheme) {
  const { classList } = document.documentElement;
  classList.remove('light', 'dark');
  classList.add(scheme);
  try {
    localStorage.setItem(STORAGE_KEY, scheme);
    localStorage.removeItem(LEGACY_STORAGE_KEY);
  } catch {
    // Not persisted, but still applied for this page view.
  }
}

export function toggleColorScheme() {
  setColorScheme(getColorScheme() === 'dark' ? 'light' : 'dark');
}
