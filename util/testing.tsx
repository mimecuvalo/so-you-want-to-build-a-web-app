import type { ReactElement } from 'react';
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';
import { render, screen } from '@testing-library/react';

// Renders `ui` as the page at `path` inside a real TanStack router, so router-aware components
// (Link, Header's useLocation) work without the generated route tree.
export async function renderWithRouter(ui: ReactElement, { path = '/' }: { path?: string } = {}) {
  const rootRoute = createRootRoute();
  const pageRoute = createRoute({ getParentRoute: () => rootRoute, path: '$', component: () => ui });
  const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: () => ui });
  const router = createRouter({
    routeTree: rootRoute.addChildren([indexRoute, pageRoute]),
    history: createMemoryHistory({ initialEntries: [path] }),
  });

  const result = render(<RouterProvider router={router} />);
  await router.load();
  return { ...result, router };
}

export * from '@testing-library/react';
export { screen };
