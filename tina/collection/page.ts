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
    // Configure the admin interface for filename generation
    filename: {
      slugify: (values) => {
        // Generate filename from title, removing emojis and special chars
        const title = values?.title || '';
        return title
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '') // Remove special chars except spaces and hyphens
          .replace(/\s+/g, '-');
      },
    },
  },
  fields: [
    {
      type: 'string',
      label: 'Title',
      name: 'title',
      description: 'The title of the page. This is used to display the title in the CMS',
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
      ],
      isBody: true,
    },
  ],
};

export default Page;
