import 'sanitize.css/sanitize.css';
import 'sanitize.css/forms.css';
import 'sanitize.css/typography.css';
import 'styles/fonts.css';
import '@fontsource/noto-color-emoji';
import 'styles/globals.css';

import { HeadContent, Outlet, Scripts, createRootRouteWithContext } from '@tanstack/react-router';
import { Analytics } from '@vercel/analytics/react';
import type { ReactNode } from 'react';
import { Header } from 'components';
import DebugWrapper from 'components/internal/DebugWrapper';
import { colorSchemeScript } from 'lib/color-scheme';
import { SITE_NAME } from 'lib/constants';
import styles from 'styles/layout.module.css';
import type { RouterContext } from '../router';

const generateCsp = (nonce: string) => {
  const isDevelopment = import.meta.env.DEV;
  const cspDirectives: { [key: string]: string[] } = {
    'connect-src': isDevelopment
      ? ['*']
      : ["'self'", 'https://*.ingest.sentry.io', 'https://vitals.vercel-insights.com'],
    'default-src': ["'self'"],
    // Vite inlines small font files (some Press Start 2P subsets) as data: URIs.
    'font-src': ["'self'", 'https:', 'data:'],
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

    // prism-react-renderer colors tokens with inline `style` attributes, which a nonce can't cover.
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

  return (
    <RootDocument nonce={nonce}>
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
      <DebugWrapper />
      <Analytics />

      <noscript>You need to enable JavaScript to run this app.</noscript>
    </RootDocument>
  );
}

function RootDocument({ nonce, children }: { nonce?: string; children: ReactNode }) {
  return (
    // The color-scheme script adds a class to <html> before React hydrates.
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        {/* Applies a stored light/dark choice before first paint (see lib/color-scheme.ts). */}
        <script nonce={nonce} suppressHydrationWarning dangerouslySetInnerHTML={{ __html: colorSchemeScript }} />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
