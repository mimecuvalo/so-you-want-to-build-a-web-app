import { defineConfig } from 'vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import mdx from '@mdx-js/rollup';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import { PAGES } from './lib/constants.ts';

export default defineConfig({
  server: { port: 3000 },
  resolve: { tsconfigPaths: true },
  // prismjs language components register onto a global `Prism` (see util/prism.ts). Left external,
  // Node hoists them above that setup; bundled, they evaluate in import order.
  ssr: { noExternal: ['prismjs'] },
  plugins: [
    // content/pages/*.mdx compile to React components; their frontmatter is exported as `frontmatter`.
    { enforce: 'pre', ...mdx({ remarkPlugins: [remarkGfm, remarkFrontmatter, remarkMdxFrontmatter] }) },
    // The whole book is prerendered to static HTML at build time - there is no server at runtime.
    // Vercel just uploads dist/client, which is what keeps deploys fast.
    tanstackStart({
      srcDirectory: 'app',
      router: { routesDirectory: 'routes' },
      pages: [
        ...PAGES.map((page) => ({ path: `/${page.slug}` })),
        // Vercel serves a top-level 404.html for any path that has no file.
        { path: '/404', prerender: { outputPath: '/404.html' } },
      ],
      prerender: {
        enabled: true,
        crawlLinks: true,
        // Writes /slug.html rather than /slug/index.html, served extensionless via `cleanUrls`.
        autoSubfolderIndex: false,
        // `/` is a redirect, handled by vercel.json in production. Crawled `#anchor` links point at
        // pages that are already rendered.
        filter: ({ path }) => path !== '/' && !path.includes('#'),
      },
    }),
    viteReact({ include: /\.(mdx|[jt]sx?)$/ }),
  ],
});
