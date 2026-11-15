import {
  STORAGE_KEY,
  applyStoredColorScheme,
  colorSchemeScript,
  getColorScheme,
  toggleColorScheme,
} from 'lib/color-scheme';

function mockSystemScheme(scheme: 'light' | 'dark') {
  window.matchMedia = ((query: string) => ({
    matches: query === '(prefers-color-scheme: dark)' && scheme === 'dark',
  })) as typeof window.matchMedia;
}

describe('color scheme', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
    mockSystemScheme('light');
  });

  it('follows the system scheme when nothing is stored', () => {
    applyStoredColorScheme(STORAGE_KEY, 'mui-mode');
    expect(document.documentElement.className).toBe('');

    mockSystemScheme('dark');
    expect(getColorScheme()).toBe('dark');
  });

  it('applies a stored choice, including one saved by MUI', () => {
    localStorage.setItem('mui-mode', 'dark');
    applyStoredColorScheme(STORAGE_KEY, 'mui-mode');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('ignores MUI’s "system" mode', () => {
    localStorage.setItem('mui-mode', 'system');
    applyStoredColorScheme(STORAGE_KEY, 'mui-mode');
    expect(document.documentElement.className).toBe('');
  });

  it('toggles away from the system scheme and remembers the choice', () => {
    mockSystemScheme('dark');
    localStorage.setItem('mui-mode', 'dark');

    toggleColorScheme();
    expect(document.documentElement.className).toBe('light');
    expect(localStorage.getItem(STORAGE_KEY)).toBe('light');
    expect(localStorage.getItem('mui-mode')).toBeNull();

    toggleColorScheme();
    expect(document.documentElement.className).toBe('dark');
    expect(localStorage.getItem(STORAGE_KEY)).toBe('dark');
  });

  it('serializes to a self-contained inline script', () => {
    localStorage.setItem(STORAGE_KEY, 'dark');
    new Function(colorSchemeScript)();
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });
});
