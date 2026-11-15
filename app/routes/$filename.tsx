// ugh, complicado. see: https://github.com/FormidableLabs/prism-react-renderer
import 'util/prism-languages';

import { createFileRoute, notFound } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { staticFunctionMiddleware } from '@tanstack/start-static-server-functions';
import { useTina } from 'tinacms/dist/react';
import { client } from '@/tina/__generated__/client';
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import { ArrowLeftIcon, ArrowRightIcon } from '@radix-ui/react-icons';
import classNames from 'classnames';
import { Link } from 'components';
import { PAGES, SITE_NAME, SITE_URL } from 'lib/constants';
import { pageUrl } from 'util/url-factory';
import { Page as TinaPage } from '@/tina/__generated__/types';
import { Prism } from 'tinacms/dist/rich-text/prism';
import styles from 'styles/page.module.css';

const getId = (children: any) => {
  const firstContent = children.props.content[0];
  const text = firstContent.text || firstContent.children[0].text;

  return text?.replace(/\W/g, '-');
};

const customRenderers = (allPages: TinaPage[]) => ({
  a: (props: any) => (
    <Link href={props.url} target={props.url.startsWith('/') ? '' : '_blank'}>
      {props.children}
    </Link>
  ),

  // N.B. We only want one H1 on the page, and that's the title, so we downstep everything else.
  h1: (props: any) => <h2 id={getId(props.children)}>{props.children}</h2>,

  // N.B. We only want one H1 on the page, and that's the title, so we downstep everything else.
  h2: (props: any) => <h3 id={getId(props.children)}>{props.children}</h3>,

  // N.B. We only want one H1 on the page, and that's the title, so we downstep everything else.
  h3: (props: any) => <h4>{props.children}</h4>,

  code_block: (props: any) => (
    <>
      <div className={styles.lightSchemeOnly}>
        <Prism {...props} theme="nightOwlLight" />
      </div>
      <div className={styles.darkSchemeOnly}>
        <Prism {...props} theme="nightOwl" />
      </div>
    </>
  ),

  // N.B. This div/span wrapper matches the structure, more or less, of the Outline editor's img wrapper.
  img: (props: any) => (
    <span className={styles.figure} data-float={props.caption}>
      <img src={props.url} alt={props.alt} />
      <span className={styles.caption}>{props.alt}</span>
    </span>
  ),

  hr: () => <hr className={styles.divider} />,

  TableOfContents: () => (
    <ol>
      {PAGES.map((page) => (
        <li key={page.slug} className={styles.tocItem}>
          <Link href={`/${page.slug}`}>{page.title}</Link>
        </li>
      ))}
    </ol>
  ),

  TLDR: () => {
    return (
      <ol className={styles.tldr}>
        {PAGES.map((orderedPage) => (
          <li key={orderedPage.slug} className={styles.tldrItem}>
            <h2 className={styles.tldrHeader}>
              <Link href={`/${orderedPage.slug}`}>{orderedPage.title}</Link>
            </h2>
            <ul className={styles.tldrBody}>
              <TinaMarkdown
                content={allPages
                  .find((pageData) => orderedPage.slug === pageData._sys.filename)
                  ?._body?.children.find((child: any) => child.type === 'ul')}
              />
            </ul>
          </li>
        ))}
      </ol>
    );
  },

  YouTube: (props: any) => (
    <div className={styles.video}>
      <iframe
        width="560"
        height="315"
        src={props.href}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>
    </div>
  ),
});

const DESCRIPTION = 'A discerning guide to showing you the ropes.';

function contentHead(title: string, url: string) {
  return {
    meta: [
      { title },
      { property: 'og:title', content: title },
      { property: 'og:description', content: DESCRIPTION },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: url },
      { property: 'og:site_name', content: SITE_NAME },
      { property: 'og:image', content: `${SITE_URL}/favicon.jpg` },
    ],
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'http://schema.org',
          '@type': 'NewsArticle',
          mainEntityOfPage: { '@type': 'WebPage', '@id': url },
          headline: title,
          image: [`${SITE_URL}/favicon.jpg`],
          datePublished: '2023-11-15T08:00:00+08:00',
          author: { '@type': 'Person', name: 'Mime Čuvalo' },
          publisher: {
            '@type': 'Organization',
            name: SITE_NAME,
            logo: { '@type': 'ImageObject', url: `${SITE_URL}/favicon.jpg` },
          },
          description: DESCRIPTION,
        }),
      },
    ],
  };
}

function Pagination({ slug }: { slug: string }) {
  const currentPageIndex = PAGES.findIndex((page) => page.slug === slug);
  const prev = PAGES[currentPageIndex - 1];
  const next = PAGES[currentPageIndex + 1];

  if (currentPageIndex === 0) {
    return null;
  }

  return (
    <>
      <hr className={classNames(styles.divider, styles.paginationDivider)} />
      <nav className={styles.pagination} aria-label="pagination">
        {prev && currentPageIndex < PAGES.length - 1 && (
          <Link href={`/${prev.slug}`}>
            <ArrowLeftIcon width={24} height={24} aria-hidden /> {prev.title}
          </Link>
        )}
        {next && currentPageIndex < PAGES.length - 2 && (
          <Link href={`/${next.slug}`}>
            {next.title} <ArrowRightIcon width={24} height={24} aria-hidden />
          </Link>
        )}
        {currentPageIndex === PAGES.length - 2 && <div className={styles.theEnd}>the end</div>}
      </nav>
    </>
  );
}

// Runs against Tina at prerender time only. staticFunctionMiddleware writes each result to
// /__tsr/staticServerFnCache/*.json, which is what client-side navigations fetch afterwards - so
// neither the Tina token nor a live Tina request ever reaches the browser.
const getPage = createServerFn({ method: 'GET' })
  .middleware([staticFunctionMiddleware])
  .validator((filename: string) => filename)
  .handler(async ({ data: filename }) => {
    const tinaProps = await client.queries.contentQuery({ relativePath: `${filename}.mdx` });

    // pageConnection pulls every page's full body AST (~500KB). Only the <TLDR> renderer reads
    // it, and that component appears solely on the tldr page - so fetching it everywhere would
    // make every other page ship ~16x its own content for nothing.
    const pagesListData = filename === 'tldr' ? await client.queries.pageConnection() : undefined;

    return {
      data: tinaProps.data,
      query: tinaProps.query,
      variables: tinaProps.variables,
      allPages: (pagesListData?.data.pageConnection?.edges?.map((page) => page?.node) ?? []) as TinaPage[],
    };
  });

export const Route = createFileRoute('/$filename')({
  loader: async ({ params: { filename } }) => {
    // PAGES mirrors content/pages, so anything else would only 404 at Tina - and in production
    // there'd be no cached JSON for it either.
    if (!PAGES.some((page) => page.slug === filename)) {
      throw notFound();
    }
    return getPage({ data: filename });
  },
  head: ({ params, loaderData }) =>
    loaderData ? contentHead(loaderData.data.page.title, pageUrl(params.filename)) : {},
  component: Page,
});

function Page() {
  const props = Route.useLoaderData();
  const { filename: slug } = Route.useParams();
  const {
    data: {
      page: { title, _body },
    },
  } = useTina(props);

  const firstChild = _body?.children[0] as { type: string; message?: string; position?: unknown } | undefined;
  if (firstChild?.type === 'invalid_markdown') {
    console.debug('Invalid markdown', firstChild.message, JSON.stringify(firstChild.position, undefined, 2));
  }

  return (
    <>
      <div className={styles.markdown}>
        <h1 className={styles.title}>{title}</h1>
        <TinaMarkdown
          components={customRenderers(props.allPages)}
          content={slug === 'tldr' ? _body?.children.slice(0, -1) : _body}
        />
      </div>
      <Pagination slug={slug} />
    </>
  );
}
