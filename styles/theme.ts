import { breakpoints, shape } from './constants';

import components from './components';
import createCache from '@emotion/cache';
import { createTheme as createMuiTheme } from '@mui/material/styles';
import palette from './palette';
import { muiTypography as typography } from './typography';

// Tells MUI's types that CSS variables are enabled, so `theme.vars` is non-optional.
declare module '@mui/material/styles' {
  interface CssThemeVariables {
    enabled: true;
  }
}

// One theme carrying both color schemes as CSS variables, selected by a `light`/`dark` class
// on <html>. InitColorSchemeScript (see _document) sets that class before first paint, so the
// SSR'd markup is scheme-agnostic and there is no light-to-dark flash after hydration.
// N.B. Anything that needs to differ per scheme must use theme.applyStyles('dark', ...) or
// theme.vars.* - reading theme.palette.mode at render time resolves to 'light' on the server
// and would bake the wrong colors into the static HTML.
const createTheme = () =>
  createMuiTheme({
    cssVariables: { colorSchemeSelector: 'class' },
    colorSchemes: {
      light: { palette },
      dark: { palette },
    },
    typography,
    components,
    breakpoints: {
      values: {
        ...breakpoints,
      },
    },
    shape,
  });

export default createTheme;

// prepend: true moves MUI styles to the top of the <head> so they're loaded first.
// It allows developers to easily override MUI styles with other styling solutions, like CSS modules.
export function createEmotionCache() {
  return createCache({ key: 'css', prepend: true });
}
