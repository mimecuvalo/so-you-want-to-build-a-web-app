import { createFileRoute, redirect } from '@tanstack/react-router';

// Production serves this redirect from vercel.json (the page is static); this covers dev.
export const Route = createFileRoute('/')({
  beforeLoad: () => {
    throw redirect({ to: '/$filename', params: { filename: 'so-you-want-to-build-a-web-app' } });
  },
});
