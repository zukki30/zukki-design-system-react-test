import { useState } from 'react';
import {
  Button,
  Tag,
  type TagProps,
  type TagVariant,
  type ZukkiVariantType,
} from 'zukki-design-system';

import { Demo, Showcase } from './Showcase';

/**
 * zukki サイト固有のバリアント。Button / Tag / Breadcrumb で共通に使える
 */
const ZUKKI_VARIANTS: ZukkiVariantType[] = ['profile', 'works', 'outputs'];

const VARIANTS: TagVariant[] = [
  'default',
  'red',
  'blue',
  'green',
  'yellow',
  ...ZUKKI_VARIANTS,
];

const INITIAL_TAGS: TagProps[] = [
  { label: 'React', variant: 'blue' },
  { label: 'TypeScript', variant: 'default' },
  { label: 'CSS Modules', variant: 'green' },
  { label: 'Storybook', variant: 'red' },
];

export const TagShowcase = () => {
  const [tags, setTags] = useState(INITIAL_TAGS);

  const removeTag = (label: string) => {
    setTags((current) => current.filter((tag) => tag.label !== label));
  };

  return (
    <Showcase
      id="tag"
      title="Tag"
      summary={
        <>
          短いラベルを示すタグ。<code>onClose</code> を渡したときだけ閉じるボタンが出る。
        </>
      }
    >
      <Demo label="label + variant" layout="grid">
        {VARIANTS.map((variant) => (
          <Tag key={variant} label={variant} variant={variant} />
        ))}
      </Demo>

      <Demo
        label="onClose"
        hint={
          <>
            閉じるボタンのアクセシブルネームは <code>label</code> から組み立てられる（
            「React を閉じる」）。
          </>
        }
        layout="column"
      >
        <div className="demo__stage" data-layout="row">
          {tags.length === 0 ? (
            <p className="mutedText">すべて閉じられた</p>
          ) : (
            tags.map((tag) => (
              <Tag
                key={tag.label}
                label={tag.label}
                variant={tag.variant}
                onClose={() => removeTag(tag.label)}
              />
            ))
          )}
        </div>

        <Button size="sm" variant="secondary" onClick={() => setTags(INITIAL_TAGS)}>
          元に戻す
        </Button>
      </Demo>

      <Demo
        label="className"
        hint={
          <>
            Tag が受け取るのは <code>label</code> / <code>variant</code> /{' '}
            <code>className</code> / <code>onClose</code> の 4 つだけ（ネイティブ属性は転送しない）。
          </>
        }
      >
        <Tag label="幅を広げたタグ" variant="yellow" className="tagWide" />
        <Tag label="閉じられる + className" variant="works" className="tagWide" onClose={() => undefined} />
      </Demo>
    </Showcase>
  );
};
