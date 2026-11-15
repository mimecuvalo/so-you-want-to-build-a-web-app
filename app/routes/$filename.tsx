// ugh, complicado. see: https://github.com/FormidableLabs/prism-react-renderer
import 'util/prism-languages';

import { createFileRoute, notFound } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { staticFunctionMiddleware } from '@tanstack/start-static-server-functions';
import { useTina } from 'tinacms/dist/react';
import { client } from '@/tina/__generated__/client';
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import { Grid, Link, Typography, styled } from 'components';
import { PAGES, SITE_NAME, SITE_URL } from '@/application/constants';
import { pageUrl } from 'util/url-factory';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { Page as TinaPage } from '@/tina/__generated__/types';
import { Box, Divider } from '@mui/material';
import { Prism } from 'tinacms/dist/rich-text/prism';

const MarkdownStyling = styled('div')`
  h1,
  h2,
  h3 {
    font-family: ${(props) => props.theme.typography.h1.fontFamily};
  }

  h1 {
    font-size: ${(props) => props.theme.typography.h1.fontSize};
  }

  h2 {
    margin-top: ${(props) => props.theme.spacing(4)};
    font-size: ${(props) => props.theme.typography.h3.fontSize};
  }

  h3 {
    margin-top: ${(props) => props.theme.spacing(3)};
    font-size: ${(props) => props.theme.typography.h4.fontSize};
  }

  h1::first-letter {
    font-size: 3rem;
    margin-right: -1rem;
  }

  ul,
  ol {
    padding: 0;
    margin-inline-start: 1.5rem;
  }

  p,
  code,
  pre,
  ul,
  ol,
  blockquote {
    margin-bottom: 1rem;
  }

  ul ul,
  ol ol {
    margin-bottom: 0;
  }

  ul,
  ol {
    margin-top: 0;
  }

  blockquote {
    border-inline-start: 1px solid ${(props) => props.theme.palette.grey[400]};
    padding-inline-start: 1.5rem;
    margin-inline-start: 0rem;
    font-style: italic;
  }

  pre {
    padding: 0.5rem;
    font-size: ${(props) => props.theme.typography.body2.fontSize};
  }

  code {
    border-radius: 1px;
    line-height: 1.6;
    padding: 2px 0 1px;
    border: 1px solid #e6e8eb;
    color: #1e1919;
    background-color: #f7f5f2;
    border-color: hsla(36, 23%, 55%, 0.2);
  }

  hr {
    margin: ${(props) => props.theme.spacing(6, 0)};
  }

  ${(props) =>
    props.theme.applyStyles('dark', {
      code: {
        color: '#f7f5f2',
        backgroundColor: '#242121',
        borderColor: 'hsla(34, 3%, 54%, .2)',
      },
    })}

  a code {
    color: ${(props) => props.theme.palette.primary.main};
  }
`;

const TLDRPageHeader = styled(Typography)`
  margin-left: -1rem;
  padding-left: 1.5rem;
  text-indent: -1.75rem;

  &::first-letter {
    font-size: 1.5rem;
    margin-right: -1rem;
  }
`;

const TLDRListItem = styled('li')`
  margin-left: 3.25rem;
  font-size: 1.25rem;
  font-family: ${(props) => props.theme.typography.h1.fontFamily};
`;

const TLDRBody = styled('ul')`
  font-size: 1rem;
  font-family: ${(props) => props.theme.typography.fontFamily};
  list-style-type: disc;
  margin-left: -3.25rem !important;
`;

const Figure = styled('span')<{
  $float: string;
}>`
  display: block;
  margin: 2rem 0;
  text-align: center;

  img {
    max-width: 100%;
  }

  .caption {
    display: block;
    font-size: ${(props) => props.theme.typography.subtitle1.fontSize};
    font-style: italic;
    text-align: center;
  }

  ${(props) =>
    props.$float === 'right-33' &&
    `
    & {
      float: right;
      width: 33%;
      margin-left: ${props.theme.spacing(2)};
    }
  `}
`;

// Prism picks its theme in JS, so it cannot follow a CSS variable the way everything else does.
// Render both and let the color-scheme class reveal one; `display: none` also keeps the hidden
// copy out of the accessibility tree, so screen readers still see each block exactly once.
const LightSchemeOnly = styled('div')(({ theme }) => theme.applyStyles('dark', { display: 'none' }));

const DarkSchemeOnly = styled('div')(({ theme }) => ({
  display: 'none',
  ...theme.applyStyles('dark', { display: 'block' }),
}));

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
  h1: (props: any) => (
    <Typography variant="h2" id={getId(props.children)}>
      {props.children}
    </Typography>
  ),

  // N.B. We only want one H1 on the page, and that's the title, so we downstep everything else.
  h2: (props: any) => (
    <Typography variant="h3" id={getId(props.children)}>
      {props.children}
    </Typography>
  ),

  // N.B. We only want one H1 on the page, and that's the title, so we downstep everything else.
  h3: (props: any) => <Typography variant="h4">{props.children}</Typography>,

  code_block: (props: any) => (
    <>
      <LightSchemeOnly>
        <Prism {...props} theme="nightOwlLight" />
      </LightSchemeOnly>
      <DarkSchemeOnly>
        <Prism {...props} theme="nightOwl" />
      </DarkSchemeOnly>
    </>
  ),

  // N.B. This div/span wrapper matches the structure, more or less, of the Outline editor's img wrapper.
  img: (props: any) => (
    <Figure $float={props.caption}>
      {/* eslint-disable-next-line */}
      <img src={props.url} alt={props.alt} />
      <span className="caption">{props.alt}</span>
    </Figure>
  ),

  hr: () => <Divider />,

  TableOfContents: () => (
    <ol>
      {PAGES.map((page) => (
        <li key={page.slug} style={{ margin: '8px 0' }}>
          <Link href={`/${page.slug}`}>{page.title}</Link>
        </li>
      ))}
    </ol>
  ),

  TLDR: () => {
    return (
      <ol style={{ listStyleType: 'decimal-leading-zero' }}>
        {PAGES.map((orderedPage) => (
          <TLDRListItem key={orderedPage.slug}>
            <TLDRPageHeader variant="h2">
              <Link href={`/${orderedPage.slug}`}>{orderedPage.title}</Link>
            </TLDRPageHeader>
            <TLDRBody>
              <TinaMarkdown
                content={allPages
                  .find((pageData) => orderedPage.slug === pageData._sys.filename)
                  ?._body?.children.find((child: any) => child.type === 'ul')}
              />
            </TLDRBody>
          </TLDRListItem>
        ))}
      </ol>
    );
  },

  YouTube: (props: any) => (
    <Grid container sx={{ justifyContent: 'center' }}>
      <iframe
        width="560"
        height="315"
        src={props.href}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>
    </Grid>
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
      <Divider sx={{ mt: 6 }} />
      <Grid container sx={{ justifyContent: 'space-between', mt: 4 }}>
        {prev && currentPageIndex < PAGES.length - 1 && (
          <Link sx={{ fontWeight: 'bold' }} href={`/${prev.slug}`}>
            <ArrowBack /> {prev.title}
          </Link>
        )}
        {next && currentPageIndex < PAGES.length - 2 && (
          <Link sx={{ fontWeight: 'bold' }} href={`/${next.slug}`}>
            {next.title} <ArrowForward />
          </Link>
        )}
        {currentPageIndex === PAGES.length - 2 && <Box sx={{ fontFamily: 'cursive' }}>the end</Box>}
      </Grid>
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
      <MarkdownStyling>
        <Typography
          variant="h1"
          sx={{
            textWrap: 'balance',
            marginInlineStart: { sm: '-4.25rem' },
            paddingLeft: { sm: '4.25rem' },
            textIndent: { sm: '-4.75rem' },
          }}
        >
          {title}
        </Typography>
        <TinaMarkdown
          components={customRenderers(props.allPages)}
          content={slug === 'tldr' ? _body?.children.slice(0, -1) : _body}
        />
      </MarkdownStyling>
      <Pagination slug={slug} />
    </>
  );
}
