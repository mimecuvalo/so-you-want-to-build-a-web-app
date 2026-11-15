import { SITE_URL } from 'lib/constants';

export function prettifyUrl(url: string) {
  return url.replace(/ /g, '+');
}

export function pageUrl(slug: string) {
  return `${import.meta.env.DEV ? 'http://localhost:3000' : SITE_URL}/${slug}`;
}
