import { useState } from 'react';
import {
  Icon,
  IconButton,
  type IconButtonProps,
  type IconButtonSize,
  type IconButtonVariant,
} from 'zukki-design-system';

import { Demo, Showcase } from './Showcase';

const VARIANTS: IconButtonVariant[] = [
  'primary',
  'secondary',
  'primary-exposed',
  'secondary-exposed',
];

const SIZES: IconButtonSize[] = ['sm', 'md'];

/**
 * よく使う組み合わせを固定したラッパー
 */
const CloseButton = (props: Omit<IconButtonProps, 'children' | 'aria-label'>) => (
  <IconButton {...props} aria-label="閉じる">
    <Icon name="close" width={20} height={20} />
  </IconButton>
);

export const IconButtonShowcase = () => {
  const [pinned, setPinned] = useState(false);
  const [loading, setLoading] = useState(false);

  const runLoading = () => {
    setLoading(true);
    window.setTimeout(() => setLoading(false), 1600);
  };

  return (
    <Showcase
      id="icon-button"
      title="IconButton"
      summary={
        <>
          アイコンだけのボタン。ラベルテキストを持たないため <code>aria-label</code> は必須。
        </>
      }
    >
      <Demo label="variant + aria-label（必須）" layout="grid">
        {VARIANTS.map((variant) => (
          <span key={variant} className="iconTile">
            <IconButton variant={variant} aria-label={`${variant} のアイコンボタン`}>
              <Icon name="plus" width={20} height={20} />
            </IconButton>
            <code>{variant}</code>
          </span>
        ))}
      </Demo>

      <Demo label="size">
        {SIZES.map((size) => (
          <IconButton key={size} size={size} aria-label={`size ${size}`}>
            <Icon name="calendarMonth" width={size === 'sm' ? 16 : 20} height={size === 'sm' ? 16 : 20} />
          </IconButton>
        ))}
      </Demo>

      <Demo label="selected" hint="押すと選択状態が切り替わる。">
        <IconButton
          variant="secondary-exposed"
          selected={pinned}
          aria-pressed={pinned}
          aria-label={pinned ? 'ピン留めを外す' : 'ピン留めする'}
          onClick={() => setPinned((value) => !value)}
        >
          <Icon name={pinned ? 'checkboxMarkedCircle' : 'outlineCheck'} width={20} height={20} />
        </IconButton>
      </Demo>

      <Demo label="disabled">
        <IconButton disabled aria-label="無効な primary">
          <Icon name="close" width={20} height={20} />
        </IconButton>
        <IconButton variant="secondary-exposed" size="sm" disabled aria-label="無効な secondary-exposed">
          <Icon name="close" width={16} height={16} />
        </IconButton>
      </Demo>

      <Demo label="loading" hint="処理中はクリックとキーボード操作が無視される。">
        <IconButton
          variant="primary"
          loading={loading}
          aria-label="読み込みを開始"
          onClick={runLoading}
        >
          <Icon name="windowRestore" width={20} height={20} />
        </IconButton>
        {VARIANTS.map((variant) => (
          <IconButton key={variant} variant={variant} loading aria-label={`${variant} は処理中`}>
            <Icon name="plus" width={20} height={20} />
          </IconButton>
        ))}
      </Demo>

      <Demo label="button のネイティブ属性 + props 型のラッパー">
        <CloseButton variant="secondary" size="sm" type="button" title="ラッパー経由" />
      </Demo>
    </Showcase>
  );
};
