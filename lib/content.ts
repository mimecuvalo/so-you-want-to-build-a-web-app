import type { MDXContent } from 'mdx/types';

export type PageModule = { default: MDXContent; frontmatter: { title: string } };

// Lazy, so each page compiles to its own chunk and a reader only downloads the one they're on.
const modules = import.meta.glob<PageModule>('/content/pages/*.mdx');

const cache = new Map<string, Promise<PageModule>>();

export function loadPage(slug: string): Promise<PageModule> {
  let promise = cache.get(slug);
  if (!promise) {
    // `use()` only reads a promise synchronously once it carries these fields; otherwise it
    // suspends for a tick even when the page has already loaded.
    const tracked = modules[`/content/pages/${slug}.mdx`]().then((mod) => {
      Object.assign(tracked, { status: 'fulfilled', value: mod });
      return mod;
    });
    promise = tracked;
    cache.set(slug, promise);
  }
  return promise;
}
