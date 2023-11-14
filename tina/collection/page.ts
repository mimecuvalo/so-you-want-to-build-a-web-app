import type { Collection } from 'tinacms';
import { contentBlockSchema } from '../../components/blocks/content';

const Page: Collection = {
  label: 'Pages',
  name: 'page',
  path: 'content/pages',
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
      type: 'object',
      list: true,
      name: 'blocks',
      label: 'Sections',
      ui: {
        visualSelector: true,
      },
      templates: [contentBlockSchema],
    },
  ],
};

export default Page;
