import '@fontsource-variable/inter';
import 'styles/fonts.css';
import '@fontsource/noto-color-emoji';
import 'styles/globals.css';

import { HeadContent, Outlet, Scripts, createRootRouteWithContext } from '@tanstack/react-router';
import { CacheProvider } from '@emotion/react';
import { Container, Header } from 'components';
import { createEmotionCache, createTheme } from 'styles';
import { Analytics } from '@vercel/analytics/react';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import classNames from 'classnames';
import { useState, type ReactNode } from 'react';
import { SITE_NAME } from '@/application/constants';
import type { RouterContext } from '../router';

// Created at module load in the browser, i.e. before hydration starts, so Emotion can hoist the
// <style> tags it inlined during SSR into <head> before React walks the DOM.
const clientSideEmotionCache = typeof document !== 'undefined' ? createEmotionCache() : undefined;

// The theme is scheme-agnostic (both palettes ship as CSS variables), so it never depends on
// render-time state and can be created once for the lifetime of the module.
const muiTheme = createTheme();

const generateCsp = (nonce: string) => {
  const isDevelopment = import.meta.env.DEV;
  const cspDirectives: { [key: string]: string[] } = {
    'connect-src': isDevelopment
      ? ['*']
      : ["'self'", 'https://*.ingest.sentry.io', 'https://vitals.vercel-insights.com'],
    'default-src': ["'self'"],
    'font-src': ["'self'", 'https:'],
    // TODO(mime)
    //'frame-ancestors': ["'self'"],
    'frame-src': ["'self'", 'http:', 'https:'],
    'img-src': ['data:', 'http:', 'https:'],
    'manifest-src': ["'self'"],
    'media-src': ["'self'", 'blob:'],
    'object-src': ["'self'"],
    // TODO(mime)
    //'report-uri': ['/api/report-csp-violation'],
    'script-src': [
      "'self'",
      'https://cdn.vercel-insights.com',
      'https://va.vercel-scripts.com',
      'https://unpkg.com/react-scan/dist/auto.global.js',
    ].concat(isDevelopment ? ["'unsafe-inline'", "'unsafe-eval'"] : [`'nonce-${nonce}'`]),

    // XXX(mime): we have inline styles around - can we pass nonce around the app properly?
    'style-src': ["'self'", 'https:', "'unsafe-inline'"],
  };
  if (!isDevelopment) {
    cspDirectives['upgrade-insecure-requests'] = [];
  }
  return Object.keys(cspDirectives)
    .map((directive) => `${directive} ${cspDirectives[directive].join(' ')}`)
    .join('; ');
};

export const Route = createRootRouteWithContext<RouterContext>()({
  head: ({ match }) => {
    const nonce = match.context.nonce ?? '';
    return {
      meta: [
        { charSet: 'utf-8' },
        { name: 'viewport', content: 'minimum-scale=1, width=device-width' },
        { property: 'csp-nonce', content: nonce },
        { httpEquiv: 'Content-Security-Policy', content: generateCsp(nonce) },
        { title: SITE_NAME },
        { name: 'description', content: 'website created using all-the-things.' },
        { name: 'generator', content: 'all-the-things. https://github.com/mimecuvalo/all-the-things' },
      ],
      links: [
        { rel: 'icon', href: '/favicon.jpg', sizes: '32x32' },
        { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
        { rel: 'apple-touch-icon', href: '/favicon.jpg' },
        { rel: 'author', href: '/humans.txt' },
        { rel: 'search', href: '/opensearch.xml', type: 'application/opensearchdescription+xml', title: SITE_NAME },
        // manifest.json provides metadata used when your web app is added to the homescreen on Android.
        // See https://developers.google.com/web/fundamentals/web-app-manifest/
        { rel: 'manifest', href: '/manifest.json' },
      ],
    };
  },
  component: RootComponent,
});

function RootComponent() {
  const { nonce } = Route.useRouteContext();
  // On the server a fresh cache per render keeps styles from leaking between pages.
  const [emotionCache] = useState(() => clientSideEmotionCache ?? createEmotionCache());

  return (
    <RootDocument nonce={nonce}>
      <CacheProvider value={emotionCache}>
        {/* defaultMode="system" follows prefers-color-scheme until the user picks a mode, which
            MUI then persists to localStorage and InitColorSchemeScript replays before first paint. */}
        <ThemeProvider theme={muiTheme} defaultMode="system">
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <div
            className={classNames({
              'App-logged-in': true,
              'App-is-development': import.meta.env.DEV,
            })}
          >
            <Header />
            <Container sx={{ my: 8, width: { xs: '100%', sm: 'clamp(45ch, 80%, 75ch)' } }}>
              <Outlet />
            </Container>
            <Analytics />
          </div>

          <noscript>You need to enable JavaScript to run this app.</noscript>
        </ThemeProvider>
      </CacheProvider>
    </RootDocument>
  );
}

function RootDocument({ nonce, children }: { nonce?: string; children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {/* Sets the light/dark class on <html> before first paint, from the user's stored
            choice or prefers-color-scheme. Must run ahead of the app and its `attribute`
            has to match the theme's cssVariables.colorSchemeSelector. */}
        <InitColorSchemeScript attribute="class" defaultMode="system" nonce={nonce} />

        {children}

        <WindowErrorScript nonce={nonce} />

        <Scripts />
      </body>
    </html>
  );
}

// If there is an error that occurs upon page load, i.e. when executing the initial app code,
// then we send the error up to the server via this mechanism.
// Once the app is loaded, then the rest of error reporting goes through error.js -> logError.
function WindowErrorScript({ nonce }: { nonce?: string }) {
  return (
    <script
      nonce={nonce}
      dangerouslySetInnerHTML={{
        __html: `
        var hasGlobalErrorFired = false;
        window.onerror = function(message, file, line, column, error) {
          if (hasGlobalErrorFired) {
            return;
          }
          hasGlobalErrorFired = true;

          var data = {
            random: Math.random(),
            context: navigator.userAgent,
            message: message,
            file: file,
            line: line,
            column: column,
            url: window.location.href
          };
          var img = new Image();
          img.src = '/api/report-error?data=' + encodeURIComponent(JSON.stringify(data));
        };`,
      }}
    />
  );
}
