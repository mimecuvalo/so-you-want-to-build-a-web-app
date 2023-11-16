import type { Collection } from 'tinacms';

const Page: Collection = {
  label: 'Pages',
  name: 'page',
  path: 'content/pages',
  format: 'mdx',
  ui: {
    router: ({ document }) => {
      return `/${document._sys.filename}`;
    },
  },
  fields: [
    {
      type: 'string',
      label: 'Title',
      name: 'title',
      description: 'The title of the page. This is used to display the title in the CMS',
      isTitle: true,
      required: true,
    },
    {
      type: 'rich-text',
      label: 'Body',
      name: '_body',
      templates: [
        {
          name: 'TableOfContents',
          label: 'TOC',
          fields: [
            {
              name: 'children',
              label: 'children',
              type: 'rich-text',
            },
          ],
        },
        {
          name: 'TLDR',
          label: 'TLDR',
          fields: [
            {
              name: 'children',
              label: 'children',
              type: 'rich-text',
            },
          ],
        },
        {
          name: 'YouTube',
          label: 'YouTube',
          fields: [
            {
              type: 'string',
              label: 'href',
              name: 'href',
              required: true,
            },
          ],
        },
        {
          name: 'Twitter',
          label: 'Twitter',
          fields: [
            {
              type: 'string',
              label: 'href',
              name: 'href',
              required: true,
            },
          ],
        },
      ],
      isBody: true,
    },
  ],
};

export default Page;
