import React from 'react';
import { InferGetStaticPropsType } from 'next';
import { useTina } from 'tinacms/dist/react';
import { client } from '../tina/__generated__/client';
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import { Grid, Link, Typography, styled } from 'components';
import Head from 'next/head';
import { PAGES, SITE_NAME, SITE_URL } from 'app/constants';
import { pageUrl } from 'util/url-factory';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { Page } from '@/tina/__generated__/types';
import { Divider } from '@mui/material';

const MarkdownStyling = styled('div')`
  h1,
  h2,
  h3 {
    font-family: ${props => props.theme.typography.h1.fontFamily};
  }

  h1 {
    font-size: ${props => props.theme.typography.h1.fontSize};
  }

  h2 {
    font-size: ${props => props.theme.typography.h3.fontSize};
  }

  h3 {
    font-size: ${props => props.theme.typography.h4.fontSize};
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

  blockquote {
    border-inline-start: 1px solid ${props => props.theme.palette.grey[400]};
    padding-inline-start: 1.5rem;
    margin-inline-start: 0rem;
    font-style: italic;
  }
`

const TLDRPageHeader = styled(Typography)`
  margin-left: -1rem;
  padding-left: 1.5rem;
  text-indent: -1.75rem;

  &::first-letter {
    font-size: 1.5rem;
    margin-right: -1rem;
  }
`

const TLDRListItem = styled('li')`
  margin-left: 3.25rem;
  font-size: 1.25rem;
  font-family: ${props => props.theme.typography.h1.fontFamily};
`

const TLDRBody = styled('ul')`
  font-size: 1rem;
  font-family: ${props => props.theme.typography.fontFamily};
  list-style-type: disc;
  margin-left: -3.25rem !important;
`

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
    font-size: ${props => props.theme.typography.subtitle1.fontSize};
    font-style: italic;
    text-align: center;
  }

  ${props => props.$float === 'right-25' && `
    & {
      float: right;
      width: 25%;
      margin-left: ${props.theme.spacing(2)};
    }
  `}
`

const customRenderers = (allPages: Page[]) => ({
  a: (props: any) => (
    <Link href={props.url} target="_blank">{props.children}</Link>
  ),

  // N.B. We only want one H1 on the page, and that's the title, so we downstep everything else.
  h1: (props: any) => (
    <Typography variant="h2">{props.children}</Typography>
  ),

  // N.B. We only want one H1 on the page, and that's the title, so we downstep everything else.
  h2: (props: any) => (
    <Typography variant="h3">{props.children}</Typography>
  ),

  // N.B. We only want one H1 on the page, and that's the title, so we downstep everything else.
  h3: (props: any) => (
    <Typography variant="h4">{props.children}</Typography>
  ),

  // N.B. This div/span wrapper matches the structure, more or less, of the Outline editor's img wrapper.
  // eslint-disable-next-line
  img: (props: any) => (
    <Figure $float={props.caption}>
      {/* eslint-disable-next-line */}
      <img
        src={props.url}
        alt={props.alt}
      />
      <span className="caption">{props.alt}</span>
    </Figure>
  ),

  TableOfContents: () => (
    <ol>
    {PAGES.map(page => <li key={page.slug} style={{margin: '8px 0'}}><Link href={`/${page.slug}`}>{page.title}</Link></li>)}
  </ol>
  ),

  TLDR: () => {
    return (
      <ol style={{    listStyleType: 'decimal-leading-zero'}}>
      {PAGES.map(orderedPage => 
      <TLDRListItem key={orderedPage.slug}>
        <TLDRPageHeader variant="h2"><Link href={pageUrl(orderedPage.slug)}>{orderedPage.title}</Link></TLDRPageHeader>
      <TLDRBody><TinaMarkdown content={allPages.find(pageData => orderedPage.slug === pageData._sys.filename)?._body.children.find((child: any) => child.type === 'ul')} /></TLDRBody>
      </TLDRListItem>)}
    </ol>
    )
  }
});

function ContentHead({title, url}: {title: string, url: string}) {
  return <Head><title>{title}</title>
  <meta property="og:title" content={title} />
  <meta property="og:description" content="A discerning guide to showing you the ropes." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={url} />
  <meta property="og:site_name" content={SITE_NAME} />
  <meta property="og:image" content={`${SITE_URL}/favicon.jpg`} />

  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: `
      {
        "@context": "http://schema.org",
        "@type": "NewsArticle",
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": "${url}"
        },
        "headline": "${title}",
        "image": [
          "${SITE_URL}/favicon.jpg"
        ],
        "datePublished": "2023-11-15T08:00:00+08:00",
        "author": {
          "@type": "Person",
          "name": "Mime Čuvalo"
        },
        "publisher": {
          "@type": "Organization",
          "name": "${SITE_NAME}",
          "logo": {
            "@type": "ImageObject",
            "url": "${SITE_URL}/favicon.jpg"
          }
        },
        "description": "A discerning guide to showing you the ropes."
      }
      `,
    }}
  />
</Head>
}

function Pagination({slug}: {slug: string}) {
  const currentPageIndex = PAGES.findIndex(page => page.slug === slug);
  const prev = PAGES[currentPageIndex - 1];
  const next = PAGES[currentPageIndex + 1];

  if (currentPageIndex === 0) {
    return null
  }

  return <><Divider sx={{mt: 4}} /><Grid container justifyContent="space-between" sx={{mt: 4}}>
    {prev && currentPageIndex < PAGES.length - 1 && <Link sx={{fontWeight: 'bold'}} href={pageUrl(prev.slug)}><ArrowBack /> {prev.title}</Link>}
    {next && currentPageIndex < PAGES.length - 2 && <Link sx={{fontWeight: 'bold'}} href={pageUrl(next.slug)}>{next.title} <ArrowForward /></Link>}
  </Grid>
  </>
}

export default function Page(props: InferGetStaticPropsType<typeof getStaticProps>) {
  const { data: {page: {title, _body}} } = useTina(props);
  const slug = props.variables.relativePath.replace('.mdx', '');
  const url = pageUrl(slug);

  return   <>
    <ContentHead title={title} url={url} />
  <MarkdownStyling>
    <Typography variant="h1" sx={{marginInlineStart: '-4.25rem', paddingLeft: '4.25rem', textIndent: '-4.75rem'}}>{title}</Typography>
    <TinaMarkdown components={customRenderers(props.allPages as Page[])} content={slug === 'tldr' ? _body.children.slice(0, -1): _body} />
    </MarkdownStyling>
    <Pagination slug={slug} />
    </>;
}

export const getStaticProps = async ({ params }: { params: { filename: string } }) => {
  const tinaProps = await client.queries.contentQuery({
    relativePath: `${params.filename}.mdx`,
  });
  const pagesListData = await client.queries.pageConnection();

  const props = {
    ...tinaProps,
    allPages: pagesListData.data.pageConnection?.edges?.map((page) => page?.node),
    enableVisualEditing: process.env.VERCEL_ENV === 'preview',
  };
  return {
    props: JSON.parse(JSON.stringify(props)) as typeof props,
  };
};

export const getStaticPaths = async () => {
  const pagesListData = await client.queries.pageConnection();
  return {
    paths: pagesListData.data.pageConnection?.edges?.map((page) => ({
      params: { filename: page?.node?._sys.filename },
    })),
    fallback: false,
  };
};
