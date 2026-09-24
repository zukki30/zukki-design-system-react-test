import { useState } from 'react';
import { Radio, type RadioProps, type RadioSize } from 'zukki-design-system';

import { Demo, Showcase } from './Showcase';

const SIZES: RadioSize[] = ['sm', 'md'];

const PLANS = [
  { value: 'free', label: '無料プラン' },
  { value: 'pro', label: 'Pro プラン' },
  { value: 'team', label: 'Team プラン' },
];

/** name を固定したラッパー */
const PlanRadio = (props: Omit<RadioProps, 'name'>) => <Radio {...props} name="plan" />;

export const RadioShowcase = () => {
  const [plan, setPlan] = useState('free');

  return (
    <Showcase
      id="radio"
      title="Radio"
      summary={
        <>
          単一選択のラジオボタン。小さくなるのは見た目だけで、クリック領域は 24 × 24 px のまま。
        </>
      }
    >
      <Demo label="children（ラベル）" layout="column">
        <Radio name="radio-label-demo" defaultChecked>
          ラベルつき
        </Radio>
        <Radio name="radio-label-demo" aria-label="ラベルなしのラジオボタン" />
      </Demo>

      <Demo label="size" layout="column">
        {SIZES.map((size) => (
          <Radio key={size} name={`radio-size-${size}`} size={size} defaultChecked>
            size = {size}
          </Radio>
        ))}
      </Demo>

      <Demo
        label="input のネイティブ属性（name / value / checked / onChange / required …）"
        hint={`選択中: ${plan}`}
        layout="column"
      >
        {PLANS.map((item) => (
          <PlanRadio
            key={item.value}
            value={item.value}
            checked={plan === item.value}
            required
            onChange={(event) => setPlan(event.target.value)}
          >
            {item.label}
          </PlanRadio>
        ))}
      </Demo>

      <Demo label="disabled" layout="column">
        <Radio name="radio-disabled-demo" disabled>
          未選択で無効
        </Radio>
        <Radio name="radio-disabled-demo" disabled defaultChecked>
          選択済みで無効
        </Radio>
        <Radio name="radio-disabled-sm" disabled size="sm" className="radioHighlight">
          sm で無効（className つき）
        </Radio>
      </Demo>
    </Showcase>
  );
};
