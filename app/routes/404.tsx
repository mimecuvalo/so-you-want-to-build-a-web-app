import { createFileRoute } from '@tanstack/react-router';
import NotFound from 'components/error/NotFound';

// Prerendered to /404.html, which the static host serves for every unknown path.
export const Route = createFileRoute('/404')({
  head: () => ({ meta: [{ title: 'Not found' }] }),
  component: NotFound,
});
