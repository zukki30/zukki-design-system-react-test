import { Button, Spinner, type SpinnerProps, type SpinnerVariant } from 'zukki-design-system';

import { Demo, Showcase } from './Showcase';

const VARIANTS: SpinnerVariant[] = ['light', 'dark', 'primary', 'accent'];

const VARIANT_HINTS = {
  light: '明るい面の上',
  dark: '暗い面の上',
  primary: '面の上でブランド色を見せる',
  accent: '意味カラーの塗りに重ねる',
} as const satisfies Record<SpinnerVariant, string>;

/**
 * 面の上で単体表示するときの既定を固定したラッパー
 */
const PageSpinner = (props: Omit<SpinnerProps, 'variant'>) => <Spinner {...props} variant="primary" />;

export const SpinnerShowcase = () => {
  return (
    <Showcase
      id="spinner"
      title="Spinner"
      summary="読み込み中のスピナー。下地に何があるかで variant を選ぶ。"
    >
      <Demo label="variant" layout="grid">
        {VARIANTS.map((variant) => (
          <span
            key={variant}
            className="spinnerTile"
            data-on-dark={variant === 'dark' || variant === 'accent'}
          >
            <Spinner variant={variant} />
            <code>{variant}</code>
            <small>{VARIANT_HINTS[variant]}</small>
          </span>
        ))}
      </Demo>

      <Demo
        label="aria-label"
        hint={
          <>
            渡すと読み上げ対象になり、渡さないと装飾（<code>aria-hidden</code>）として扱われる。
          </>
        }
      >
        <Spinner variant="primary" aria-label="読み込み中" />
        <Spinner variant="primary" />
      </Demo>

      <Demo label="width / height / className / style（svg のネイティブ属性）">
        <Spinner variant="primary" width={16} height={16} />
        <Spinner variant="primary" width={24} height={24} />
        <PageSpinner width={40} height={40} />
        <Spinner variant="primary" width={40} height={40} style={{ opacity: 0.4 }} />
        <Spinner variant="primary" width={40} height={40} className="spinnerSlow" />
      </Demo>

      <Demo
        label="accent は塗りの上で使う"
        hint="Button の loading が内部で使っている組み合わせ。"
      >
        <span className="accentSurface">
          <Spinner variant="accent" width={20} height={20} aria-label="処理中" />
          処理中です
        </span>
        <Button variant="primary" loading>
          Button の loading
        </Button>
      </Demo>
    </Showcase>
  );
};
