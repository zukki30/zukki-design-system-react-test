import { useState } from 'react';
import {
  Button,
  Icon,
  type ButtonProps,
  type ButtonSize,
  type ButtonVariant,
} from 'zukki-design-system';

import { Demo, Showcase } from './Showcase';

const VARIANTS: ButtonVariant[] = [
  'default',
  'primary',
  'secondary',
  'success',
  'failure',
  'profile',
  'works',
  'outputs',
];

const SIZES: ButtonSize[] = ['sm', 'md'];

const ICON_SIZE = 16;

/**
 * `type` を固定したラッパー。props 型を公開しているのでこう書ける
 */
const SubmitButton = (props: Omit<ButtonProps, 'type'>) => <Button {...props} type="submit" />;

export const ButtonShowcase = () => {
  const [loading, setLoading] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<ButtonVariant>('primary');
  const [clickCount, setClickCount] = useState(0);
  const [submittedAt, setSubmittedAt] = useState<string | null>(null);

  const runLoading = () => {
    setLoading(true);
    window.setTimeout(() => setLoading(false), 1600);
  };

  return (
    <Showcase
      id="button"
      title="Button"
      summary="ラベルを持つボタン。バリアント 8 種 × サイズ 2 段階に、選択・無効・処理中の状態を組み合わせる。"
    >
      <Demo label="variant" layout="grid">
        {VARIANTS.map((variant) => (
          <Button key={variant} variant={variant}>
            {variant}
          </Button>
        ))}
      </Demo>

      <Demo
        label="size"
        hint={
          <>
            <code>sm</code> / <code>md</code> の 2 段階。<code>lg</code> は持たない。
          </>
        }
      >
        {SIZES.map((size) => (
          <Button key={size} variant="primary" size={size}>
            size = {size}
          </Button>
        ))}
      </Demo>

      <Demo label="startIcon / endIcon">
        <Button startIcon={<Icon name="plus" width={ICON_SIZE} height={ICON_SIZE} />}>
          追加する
        </Button>
        <Button
          variant="primary"
          endIcon={<Icon name="chevronRight" width={ICON_SIZE} height={ICON_SIZE} />}
        >
          次へ
        </Button>
        <Button
          variant="secondary"
          startIcon={<Icon name="github" width={ICON_SIZE} height={ICON_SIZE} />}
          endIcon={<Icon name="windowRestore" width={ICON_SIZE} height={ICON_SIZE} />}
        >
          リポジトリを開く
        </Button>
      </Demo>

      <Demo
        label="selected"
        hint="押されている状態を表す。ここでは押したバリアントだけを選択状態にしている。"
      >
        {VARIANTS.slice(0, 4).map((variant) => (
          <Button
            key={variant}
            variant={variant}
            selected={selectedVariant === variant}
            aria-pressed={selectedVariant === variant}
            onClick={() => setSelectedVariant(variant)}
          >
            {variant}
          </Button>
        ))}
      </Demo>

      <Demo label="disabled">
        <Button disabled>default</Button>
        <Button variant="primary" disabled>
          primary
        </Button>
        <Button variant="failure" size="sm" disabled>
          failure / sm
        </Button>
      </Demo>

      <Demo
        label="loading"
        hint="処理中はクリックもキーボード操作も無視され、aria-busy が立つ。フォーカス位置は保たれる。"
      >
        <Button variant="primary" loading={loading} onClick={runLoading}>
          {loading ? '送信中…' : '押すと 1.6 秒 loading'}
        </Button>
        <Button loading>default</Button>
        <Button variant="secondary" size="sm" loading>
          secondary / sm
        </Button>
      </Demo>

      <Demo
        label="button のネイティブ属性（type / onClick / form / autoFocus など）"
        hint={
          <>
            ネイティブ属性はそのまま <code>button</code> に転送される。
            {submittedAt !== null && ` 直近の送信: ${submittedAt}`}
          </>
        }
        layout="column"
      >
        <form
          className="inlineForm"
          id="button-demo-form"
          onSubmit={(event) => {
            event.preventDefault();
            setSubmittedAt(new Date().toLocaleTimeString('ja-JP'));
          }}
        >
          <Button type="button" onClick={() => setClickCount((count) => count + 1)}>
            type=&quot;button&quot;（{clickCount} 回）
          </Button>
          <SubmitButton variant="primary" name="action" value="save">
            type=&quot;submit&quot;（ラッパー経由）
          </SubmitButton>
          <Button type="reset" variant="secondary">
            type=&quot;reset&quot;
          </Button>
        </form>

        {/* form の外に置いたボタンも form 属性で送信できる */}
        <Button form="button-demo-form" type="submit" variant="success" title="form の外から送信">
          form 属性で送信
        </Button>
      </Demo>
    </Showcase>
  );
};
