import { readdirSync } from 'node:fs';
import { PAGES } from 'lib/constants';

// The page route 404s any slug missing from PAGES, and the build only prerenders what PAGES lists.
describe('PAGES', () => {
  it('mirrors content/pages', () => {
    const files = readdirSync('content/pages')
      .filter((file) => file.endsWith('.mdx'))
      .map((file) => file.replace(/\.mdx$/, ''));
    expect(PAGES.map((page) => page.slug).sort()).toEqual(files.sort());
  });
});
