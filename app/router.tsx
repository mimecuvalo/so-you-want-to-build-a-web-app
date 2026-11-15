import { createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import ErrorScreen from 'components/pages/ErrorScreen';
import NotFound from 'components/pages/NotFound';

export interface RouterContext {
  nonce?: string;
}

export function getRouter() {
  // Minted once per render on the server (i.e. once per page at prerender time) and read back from
  // the page's meta tag on the client, so the router's inline scripts match the page's CSP.
  const nonce =
    typeof window === 'undefined'
      ? crypto.randomUUID()
      : document.querySelector<HTMLMetaElement>('meta[property="csp-nonce"]')?.content;

  return createRouter({
    routeTree,
    context: { nonce } satisfies RouterContext,
    ssr: { nonce },
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultViewTransition: true,
    defaultNotFoundComponent: NotFound,
    defaultErrorComponent: ErrorScreen,
  });
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
