import { useState } from 'react';
import { InputNumber, type InputNumberProps, type InputNumberSize } from 'zukki-design-system';

import { Demo, Showcase } from './Showcase';

const SIZES: InputNumberSize[] = ['sm', 'md'];

/** 範囲を固定したラッパー */
const PercentInput = (props: Omit<InputNumberProps, 'min' | 'max' | 'step'>) => (
  <InputNumber {...props} min={0} max={100} step={1} />
);

export const InputNumberShowcase = () => {
  const [quantity, setQuantity] = useState(1);

  return (
    <Showcase
      id="input-number"
      title="InputNumber"
      summary={
        <>
          数値入力。モバイルのソフトキーボードは <code>step</code> と <code>min</code>{' '}
          から自動で出し分けられる。
        </>
      }
    >
      <Demo label="size" layout="column">
        {SIZES.map((size) => (
          <InputNumber key={size} size={size} defaultValue={size === 'sm' ? 1 : 2} min={0} />
        ))}
      </Demo>

      <Demo label="error" layout="column">
        <InputNumber error defaultValue={999} min={0} max={100} />
        <InputNumber error size="sm" defaultValue={-1} min={0} />
      </Demo>

      <Demo label="disabled" hint="スピンボタンも一緒に無効になる。" layout="column">
        <InputNumber disabled defaultValue={3} />
        <InputNumber disabled size="sm" defaultValue={3} />
      </Demo>

      <Demo
        label="input のネイティブ属性（min / max / step / value / onChange / inputMode …）"
        hint={
          <>
            負の値を受け付けるときはキーパッドにマイナス記号が無い環境があるため、
            <code>inputMode</code> を明示的に上書きする。
          </>
        }
        layout="column"
      >
        <InputNumber
          name="quantity"
          value={quantity}
          min={1}
          max={10}
          step={1}
          required
          onChange={(event) => setQuantity(Number(event.target.value))}
        />
        <InputNumber defaultValue={0.5} min={0} max={1} step={0.1} placeholder="小数（decimal）" />
        <InputNumber defaultValue={0} min={-100} max={100} inputMode="text" placeholder="負の値も入る" />
        <InputNumber defaultValue="" step="any" placeholder="step=any" />
        <PercentInput defaultValue={50} name="ratio" />
      </Demo>
    </Showcase>
  );
};
