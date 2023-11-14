import React from 'react';
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import type { TinaTemplate } from 'tinacms';
import { PageBlocksContent } from '../../tina/__generated__/types';

export const Content = ({ data }: { data: PageBlocksContent }) => {
  return <TinaMarkdown content={data.body} />;
};

export const contentBlockSchema: TinaTemplate = {
  name: 'content',
  label: 'Content',
  ui: {
    previewSrc: '/blocks/content.png',
    defaultItem: {
      body: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros. Nullam malesuada erat ut turpis. Suspendisse urna nibh, viverra non, semper suscipit, posuere a, pede.',
    },
  },
  fields: [
    {
      type: 'rich-text',
      label: 'Body',
      name: 'body',
    },
    {
      type: 'string',
      label: 'Color',
      name: 'color',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Tint', value: 'tint' },
        { label: 'Primary', value: 'primary' },
      ],
    },
  ],
};
