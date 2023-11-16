import { SITE_URL } from 'app/constants';

export function prettifyUrl(url: string) {
  return url.replace(/ /g, '+');
}

export function pageUrl(slug: string) {
  return `${process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : SITE_URL}/${slug}`;
}
