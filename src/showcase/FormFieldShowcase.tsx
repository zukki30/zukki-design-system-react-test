import { useState } from 'react';
import type { ComponentPropsWithRef } from 'react';
import {
  Button,
  FormField,
  Input,
  Radio,
  Select,
  TextArea,
  useFormFieldContext,
  useFormFieldState,
  type FormFieldContextValue,
  type FormFieldControlProps,
  type FormFieldControlState,
  type FormFieldErrorTextProps,
  type FormFieldHelperTextProps,
  type FormFieldLabelProps,
  type FormFieldOrientation,
  type FormFieldProps,
  type FormFieldRequiredMark,
  type FormFieldResolvedState,
  type FormFieldSize,
} from 'zukki-design-system';

import { Demo, Showcase } from './Showcase';

const ORIENTATIONS: FormFieldOrientation[] = ['horizontal', 'vertical'];
const REQUIRED_MARKS: FormFieldRequiredMark[] = ['badge', 'asterisk', 'both'];
const SIZES: FormFieldSize[] = ['sm', 'md'];

/** パーツの props 型を使って既定値を固定する */
const StrongFormFieldLabel = (props: FormFieldLabelProps) => (
  <FormField.Label {...props} className="formFieldLabelStrong" />
);
const WideFormFieldControl = (props: FormFieldControlProps) => (
  <FormField.Control {...props} data-wide="true" />
);
const MutedHelperText = (props: FormFieldHelperTextProps) => (
  <FormField.HelperText {...props} className="helperTextMuted" />
);
const PoliteErrorText = (props: FormFieldErrorTextProps) => (
  <FormField.ErrorText {...props} role="status" />
);

/** orientation を固定したラッパー */
const StackedFormField = (props: Omit<FormFieldProps, 'orientation'>) => (
  <FormField {...props} orientation="vertical" />
);

/**
 * context から状態を読む独自のパーツ。
 * 「単位」や「文字数」のような補助表示を自前で作るときに使う
 */
const FormFieldStateNote = () => {
  const {
    state: { required, requiredMark, disabled, error, size },
    meta: { labelId, labelledControlId, describedBy },
  }: FormFieldContextValue = useFormFieldContext();

  return (
    <p className="formFieldNote">
      独自パーツから読んだ状態: required={String(required)} / requiredMark={requiredMark} /
      disabled={String(disabled)} / error={String(error)} / size={size}
      <br />
      紐付け: labelId={labelId ?? '—'} / controlId={labelledControlId ?? '—'} / describedBy=
      {describedBy ?? '—'}
    </p>
  );
};

type ColorSwatchProps = {
  colors: string[];
} & FormFieldControlState &
  ComponentPropsWithRef<'div'>;

/**
 * FormField のエラー・無効状態とサイズを引き継ぐ独自の入力コンポーネント。
 *
 * `size` に既定値を書かないのが要点。分割代入で `size = 'md'` と書くと undefined が消え、
 * FormField の指定を常に上書きしてしまう。
 *
 * `FormField.Control` は子が単一要素のとき `id` と ARIA 属性を注入してくるため、
 * 残りの props はそのままルート要素へ転送して受け取れるようにしておく
 */
const ColorSwatch = ({
  colors,
  error: errorProp,
  disabled: disabledProp,
  size: sizeProp,
  ...props
}: ColorSwatchProps) => {
  const { error, disabled, size }: FormFieldResolvedState = useFormFieldState({
    error: errorProp,
    disabled: disabledProp,
    size: sizeProp,
  });
  const [selected, setSelected] = useState(colors[0]);

  return (
    <div
      {...props}
      role="group"
      className="colorSwatch"
      data-error={error}
      data-disabled={disabled}
      data-size={size}
    >
      {colors.map((color) => (
        <button
          key={color}
          type="button"
          disabled={disabled}
          aria-label={color}
          aria-pressed={selected === color}
          className="colorSwatch__item"
          style={{ backgroundColor: color }}
          onClick={() => setSelected(color)}
        />
      ))}
      <span className="colorSwatch__value">
        {selected}（size={size}）
      </span>
    </div>
  );
};

export const FormFieldShowcase = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const emailError = submitted && !email.includes('@') ? 'メールアドレスの形式が正しくない' : null;

  return (
    <Showcase
      id="form-field"
      title="FormField"
      summary={
        <>
          ラベル・補助テキスト・エラーメッセージをまとめるフォームフィールド。状態は context
          で配下の入力要素へ自動的に伝わる。
        </>
      }
    >
      <Demo label="orientation" layout="column">
        {ORIENTATIONS.map((orientation) => (
          <FormField key={orientation} orientation={orientation}>
            <FormField.Label>orientation = {orientation}</FormField.Label>
            <FormField.Control>
              <Input placeholder="入力してください" />
            </FormField.Control>
            <FormField.HelperText>ラベルと入力欄の並び方向が変わる</FormField.HelperText>
          </FormField>
        ))}
      </Demo>

      <Demo
        label="required / requiredMark"
        hint={
          <>
            注入されるのは <code>aria-required</code> だけ。ネイティブ検証が要るなら入力側に{' '}
            <code>required</code> を書く。
          </>
        }
        layout="column"
      >
        {REQUIRED_MARKS.map((requiredMark) => (
          <FormField key={requiredMark} required requiredMark={requiredMark}>
            <FormField.Label>requiredMark = {requiredMark}</FormField.Label>
            <FormField.Control>
              <Input placeholder="必須項目" />
            </FormField.Control>
          </FormField>
        ))}
      </Demo>

      <Demo
        label="size — 配下の入力要素へ伝わる"
        hint="入力要素側で size を指定した場合はそちらが優先される。"
        layout="column"
      >
        {SIZES.map((size) => (
          <FormField key={size} size={size}>
            <FormField.Label>size = {size}</FormField.Label>
            <FormField.Control>
              <Input placeholder="FormField から size を引き継ぐ" />
            </FormField.Control>
            <FormField.HelperText>ラベル・補助テキストの文字サイズは変わらない</FormField.HelperText>
          </FormField>
        ))}

        <FormField size="sm">
          <FormField.Label>入力側で md を明示した場合</FormField.Label>
          <FormField.Control>
            <Input size="md" placeholder="入力側の size が勝つ" />
          </FormField.Control>
        </FormField>
      </Demo>

      <Demo
        label="disabled — 配下の入力要素へ伝わる"
        hint="子に disabled を書き直す必要はない。"
        layout="column"
      >
        <FormField disabled>
          <FormField.Label>無効なフィールド</FormField.Label>
          <FormField.Control>
            <Input defaultValue="編集できない" />
          </FormField.Control>
          <FormField.HelperText>Input 側に disabled は書いていない</FormField.HelperText>
        </FormField>

        <StackedFormField disabled size="sm">
          <FormField.Label>TextArea と Select にも伝わる</FormField.Label>
          <FormField.Control>
            <TextArea rows={2} defaultValue="編集できない" />
          </FormField.Control>
          <FormField.Control>
            <Select placeholder="選べない">
              <option value="a">A</option>
            </Select>
          </FormField.Control>
        </StackedFormField>
      </Demo>

      <Demo
        label="error / FormField.ErrorText"
        hint="error 未指定なら ErrorText の描画有無で決まる。初回描画から確定させたいときだけ明示する。"
        layout="column"
      >
        <FormField>
          <FormField.Label>ErrorText の有無でエラー状態になる</FormField.Label>
          <FormField.Control>
            <Input defaultValue="不正な値" />
          </FormField.Control>
          <FormField.ErrorText>入力し直してください</FormField.ErrorText>
        </FormField>

        <FormField error>
          <FormField.Label>error を明示（メッセージなし）</FormField.Label>
          <FormField.Control>
            <Input defaultValue="不正な値" />
          </FormField.Control>
          <MutedHelperText>ErrorText を描画しなくてもエラー表示になる</MutedHelperText>
        </FormField>

        <FormField error={false}>
          <FormField.Label>error=false は ErrorText より優先される</FormField.Label>
          <FormField.Control>
            <Input defaultValue="エラー表示にはならない" />
          </FormField.Control>
          <PoliteErrorText>role を status に差し替えたメッセージ</PoliteErrorText>
        </FormField>
      </Demo>

      <Demo
        label="FormField.Control が複数のとき"
        hint="子が単一要素のときだけ id と ARIA が注入される。ラジオグループは自分で name を指定する。"
        layout="column"
      >
        <FormField required requiredMark="asterisk">
          <StrongFormFieldLabel>配送方法</StrongFormFieldLabel>
          <WideFormFieldControl>
            <div className="stack">
              <Radio name="delivery" value="normal" defaultChecked aria-required>
                通常配送
              </Radio>
              <Radio name="delivery" value="express" aria-required>
                お急ぎ便
              </Radio>
            </div>
          </WideFormFieldControl>
          <FormField.HelperText>
            複数のコントロールを並べたときはルートが role=&quot;group&quot; になる
          </FormField.HelperText>
        </FormField>
      </Demo>

      <Demo
        label="useFormFieldContext / useFormFieldState（独自パーツ・独自コントロール）"
        layout="column"
      >
        <FormField required requiredMark="both" size="sm" error>
          <FormField.Label>色を選ぶ</FormField.Label>
          <FormField.Control>
            <ColorSwatch colors={['#0e70f1', '#12a150', '#f5a524']} />
          </FormField.Control>
          <FormField.HelperText>ColorSwatch は useFormFieldState で状態を引き継ぐ</FormField.HelperText>
          <FormFieldStateNote />
        </FormField>
      </Demo>

      <Demo
        label="div / label / p のネイティブ属性と実際のフォーム"
        hint="ネイティブ属性はそれぞれの要素に転送される（htmlFor と id は自動で紐付くため受け取らない）。"
        layout="column"
      >
        <form
          className="stack"
          onSubmit={(event) => {
            event.preventDefault();
            setSubmitted(true);
          }}
        >
          <FormField
            required
            orientation="vertical"
            className="formFieldBoxed"
            id="form-field-email"
            data-testid="form-field"
          >
            <FormField.Label title="label の title 属性">メールアドレス</FormField.Label>
            <FormField.Control className="formFieldControlFull">
              <Input
                type="email"
                value={email}
                placeholder="you@example.com"
                required
                onChange={(event) => setEmail(event.target.value)}
              />
            </FormField.Control>
            <FormField.HelperText lang="ja">会社のアドレスを入力してください</FormField.HelperText>
            {emailError !== null && (
              <FormField.ErrorText data-testid="form-field-error">{emailError}</FormField.ErrorText>
            )}
          </FormField>

          <Button type="submit" variant="primary" size="sm">
            検証する
          </Button>
        </form>
      </Demo>
    </Showcase>
  );
};
