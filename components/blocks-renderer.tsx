import type { Page, PageBlocks } from '../tina/__generated__/types';
import { Content } from './blocks/content';
import { tinaField } from 'tinacms/dist/react';

export const Blocks = (props: Omit<Page, 'id' | '_sys' | '_values'>) => {
  return (
    <>
      {props.blocks
        ? props.blocks.map(function (block, i) {
            return block ? (
              <div key={i} data-tina-field={tinaField(block)}>
                <Block {...block} />
              </div>
            ) : null;
          })
        : null}
    </>
  );
};

const Block = (block: PageBlocks) => {
  switch (block.__typename) {
    case 'PageBlocksContent':
      return <Content data={block} />;
    default:
      return null;
  }
};
