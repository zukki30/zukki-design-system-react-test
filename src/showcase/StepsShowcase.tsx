import { useState } from 'react';
import {
  Button,
  Steps,
  useStepsContext,
  useStepsItemNumber,
  type StepsContextValue,
  type StepsItemProps,
  type StepsOrientation,
  type StepsProps,
} from 'zukki-design-system';

import { Demo, Showcase } from './Showcase';

const LABELS = ['カート', '配送先', '支払い', '確認'];

const ORIENTATIONS: StepsOrientation[] = ['horizontal', 'vertical'];

/**
 * ラベルを固定したラッパー。props 型を公開しているのでこう書ける
 */
const RequiredStepsItem = (props: StepsItemProps) => <Steps.Item {...props} data-required="true" />;

/**
 * ステップの並びを固定したラッパー
 */
const CheckoutSteps = (props: Omit<StepsProps, 'children'>) => (
  <Steps {...props}>
    {LABELS.map((label) => (
      <Steps.Item key={label}>{label}</Steps.Item>
    ))}
  </Steps>
);

/**
 * context から状態を読む独自のパーツ。
 *
 * `useStepsContext()` で全体の状態を、`useStepsItemNumber()` で自分の番号を受け取る。
 * どちらも `<Steps>` の内側でしか呼べない
 */
const StepsProgressNote = () => {
  const {
    state: { current, total, orientation },
    actions: { select },
  }: StepsContextValue = useStepsContext();
  const stepNumber = useStepsItemNumber();

  return (
    <li className="customStepsNote">
      <span>
        独自パーツ: これは {stepNumber} 番目の子。全 {total} ステップ中 {current} 番目まで進行（
        {orientation}）。
      </span>
      <Button size="sm" variant="secondary" disabled={!select} onClick={() => select?.(1)}>
        {select ? 'context の select で 1 へ戻す' : 'onClick 未指定なので select は undefined'}
      </Button>
    </li>
  );
};

export const StepsShowcase = () => {
  const [current, setCurrent] = useState(2);

  return (
    <Showcase
      id="steps"
      title="Steps"
      summary={
        <>
          手順の進捗を示すステップ。番号は <code>Steps.Item</code>{' '}
          の並び順から自動で採番される（番号を渡す prop は無い）。
        </>
      }
    >
      <Demo label="current / children（Steps.Item）" hint="current より小さい番号が完了になる。" layout="column">
        <Steps current={current}>
          {LABELS.map((label) => (
            <Steps.Item key={label}>{label}</Steps.Item>
          ))}
        </Steps>

        <div className="demo__stage" data-layout="row">
          <Button size="sm" disabled={current <= 1} onClick={() => setCurrent((step) => step - 1)}>
            戻る
          </Button>
          <Button
            size="sm"
            variant="primary"
            disabled={current >= LABELS.length}
            onClick={() => setCurrent((step) => step + 1)}
          >
            進む
          </Button>
        </div>
      </Demo>

      <Demo label="orientation" layout="column">
        {ORIENTATIONS.map((orientation) => (
          <div key={orientation} className="stack">
            <code className="demo__label">{orientation}</code>
            <Steps current={2} orientation={orientation}>
              {LABELS.slice(0, 3).map((label) => (
                <Steps.Item key={label}>{label}</Steps.Item>
              ))}
            </Steps>
          </div>
        ))}
      </Demo>

      <Demo
        label="onClick"
        hint={
          <>
            指定するとステップがボタンになり、ステップ番号（1 始まり）を受け取る。<code>ol</code>{' '}
            のネイティブな <code>onClick</code> は受け取らない。
          </>
        }
      >
        <CheckoutSteps current={current} onClick={(stepNumber) => setCurrent(stepNumber)} />
      </Demo>

      <Demo
        label="useStepsContext / useStepsItemNumber（独自パーツ）"
        hint="Steps の直下に置いた子は、Fragment でなければ独自コンポーネントでもよい。"
      >
        <Steps
          current={2}
          orientation="vertical"
          onClick={(stepNumber) => setCurrent(stepNumber)}
          aria-label="独自パーツを含むステップ"
        >
          <Steps.Item>受付</Steps.Item>
          <Steps.Item>審査</Steps.Item>
          <StepsProgressNote />
        </Steps>
      </Demo>

      <Demo
        label="ol / li のネイティブ属性（className / style / ref / aria-label など）"
        layout="column"
      >
        <Steps
          current={2}
          className="stepsBoxed"
          style={{ borderRadius: 'var(--border-radius-md)' }}
          aria-label="ネイティブ属性つきのステップ"
          data-testid="steps"
        >
          <RequiredStepsItem className="stepsItemHighlight">必須の入力</RequiredStepsItem>
          <Steps.Item style={{ opacity: 0.85 }} title="li の title 属性">
            任意の入力
          </Steps.Item>
          <Steps.Item id="steps-last-item">確認</Steps.Item>
        </Steps>
      </Demo>
    </Showcase>
  );
};
