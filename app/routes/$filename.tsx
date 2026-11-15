// ugh, complicado. see: https://github.com/FormidableLabs/prism-react-renderer
import 'util/prism-languages';

import { createFileRoute, notFound } from '@tanstack/react-router';
import { ArrowLeftIcon, ArrowRightIcon } from '@radix-ui/react-icons';
import classNames from 'classnames';
import type { MDXComponents, MDXContent } from 'mdx/types';
import { Highlight, themes } from 'prism-react-renderer';
import { Children, isValidElement, Suspense, use, type ReactElement, type ReactNode } from 'react';
import { Link } from 'components';
import { PAGES, SITE_NAME, SITE_URL } from 'lib/constants';
import { loadPage } from 'lib/content';
import { pageUrl } from 'util/url-factory';
import styles from 'styles/page.module.css';

const textOf = (node: ReactNode): string =>
  Children.toArray(node)
    .map((child) =>
      typeof child === 'string' || typeof child === 'number'
        ? String(child)
        : isValidElement<{ children?: ReactNode }>(child)
          ? textOf(child.props.children)
          : ''
    )
    .join('');

const getId = (children: ReactNode) => textOf(children).replace(/\W/g, '-');

// An MDX page's top-level blocks. With no `wrapper` component, MDXContent returns a fragment of them
// directly, which is what lets a page drop or pick out individual blocks.
const topLevelBlocks = (Content: MDXContent, components: MDXComponents) =>
  Children.toArray((Content({ components }) as ReactElement<{ children: ReactNode }>).props.children).filter(
    isValidElement
  );

function CodeBlock({ code, language, theme }: { code: string; language: string; theme: keyof typeof themes }) {
  return (
    <Highlight theme={themes[theme]} code={code} language={language}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={className} style={style}>
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line })}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
}

function TLDR() {
  return (
    <ol className={styles.tldr}>
      {PAGES.map((page) => {
        const { default: Content } = use(loadPage(page.slug));
        // Each page's summary is the first bulleted list in it.
        const summary = topLevelBlocks(Content, components).find((block) => block.type === 'ul') as
          | ReactElement<{ children: ReactNode }>
          | undefined;

        return (
          <li key={page.slug} className={styles.tldrItem}>
            <h2 className={styles.tldrHeader}>
              <Link href={`/${page.slug}`}>{page.title}</Link>
            </h2>
            <ul className={styles.tldrBody}>{summary?.props.children}</ul>
          </li>
        );
      })}
    </ol>
  );
}

const components: MDXComponents = {
  a: ({ href = '', children }) => (
    <Link href={href} target={href.startsWith('/') ? '' : '_blank'}>
      {children}
    </Link>
  ),

  // N.B. We only want one H1 on the page, and that's the title, so we downstep everything else.
  h1: ({ children }) => <h2 id={getId(children)}>{children}</h2>,
  h2: ({ children }) => <h3 id={getId(children)}>{children}</h3>,
  h3: ({ children }) => <h4>{children}</h4>,

  pre: ({ children }) => {
    const { className = '', children: code } = (children as ReactElement<{ className?: string; children: string }>)
      .props;
    const props = { code: code.replace(/\n$/, ''), language: className.replace(/^language-/, '') };

    return (
      <>
        <div className={styles.lightSchemeOnly}>
          <CodeBlock {...props} theme="nightOwlLight" />
        </div>
        <div className={styles.darkSchemeOnly}>
          <CodeBlock {...props} theme="nightOwl" />
        </div>
      </>
    );
  },

  // A markdown image's title (`![alt](src "right-33")`) picks its float.
  img: ({ src, alt, title }) => (
    <span className={styles.figure} data-float={title}>
      <img src={src} alt={alt} />
      <span className={styles.caption}>{alt}</span>
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

  TLDR,

  YouTube: ({ href }: { href: string }) => (
    <div className={styles.video}>
      <iframe
        width="560"
        height="315"
        src={href}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>
    </div>
  ),
};

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

export const Route = createFileRoute('/$filename')({
  loader: async ({ params: { filename } }) => {
    // PAGES mirrors content/pages, so anything else has no MDX file to load.
    if (!PAGES.some((page) => page.slug === filename)) {
      throw notFound();
    }
    // The tl;dr page summarizes every other page, so it needs them all loaded.
    const slugs = filename === 'tldr' ? PAGES.map((page) => page.slug) : [filename];
    const [{ frontmatter }] = await Promise.all([loadPage(filename), ...slugs.map(loadPage)]);
    return { title: frontmatter.title };
  },
  head: ({ params, loaderData }) => (loaderData ? contentHead(loaderData.title, pageUrl(params.filename)) : {}),
  component: Page,
});

function Page() {
  const { filename: slug } = Route.useParams();
  const { title } = Route.useLoaderData();

  return (
    <>
      <div className={styles.markdown}>
        <h1 className={styles.title}>{title}</h1>
        {/* Hydration doesn't rerun the loader, so the page's chunk may still be in flight; the
            prerendered HTML stays on screen until it lands. */}
        <Suspense>
          <Body slug={slug} />
        </Suspense>
      </div>
      <Pagination slug={slug} />
    </>
  );
}

function Body({ slug }: { slug: string }) {
  const { default: Content } = use(loadPage(slug));

  // The tl;dr page's own summary (its last block) is shown inside <TLDR> instead.
  return slug === 'tldr' ? topLevelBlocks(Content, components).slice(0, -1) : <Content components={components} />;
}
