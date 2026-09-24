import { useState } from 'react';
import { Checkbox, type CheckboxProps, type CheckboxSize } from 'zukki-design-system';

import { Demo, Showcase } from './Showcase';

const SIZES: CheckboxSize[] = ['sm', 'md'];

const TOPICS = ['React', 'TypeScript', 'CSS'];

/** name を固定したラッパー */
const TopicCheckbox = (props: Omit<CheckboxProps, 'name'>) => <Checkbox {...props} name="topics" />;

export const CheckboxShowcase = () => {
  const [checkedTopics, setCheckedTopics] = useState<string[]>([TOPICS[0]]);

  const allChecked = checkedTopics.length === TOPICS.length;
  const someChecked = checkedTopics.length > 0 && !allChecked;

  const toggleTopic = (topic: string, checked: boolean) => {
    setCheckedTopics((current) =>
      checked ? [...current, topic] : current.filter((value) => value !== topic)
    );
  };

  return (
    <Showcase
      id="checkbox"
      title="Checkbox"
      summary={
        <>
          複数選択のチェックボックス。<code>indeterminate</code>{' '}
          に対応する。小さくなるのは見た目だけで、クリック領域は 24 × 24 px のまま。
        </>
      }
    >
      <Demo label="children（ラベル）" layout="column">
        <Checkbox defaultChecked>ラベルつき</Checkbox>
        <Checkbox aria-label="ラベルなしのチェックボックス" />
      </Demo>

      <Demo label="size" layout="column">
        {SIZES.map((size) => (
          <Checkbox key={size} size={size} defaultChecked>
            size = {size}
          </Checkbox>
        ))}
      </Demo>

      <Demo
        label="indeterminate"
        hint="DOM プロパティなので毎コミット同期される。全選択チェックの中間状態に使う。"
        layout="column"
      >
        <Checkbox
          checked={allChecked}
          indeterminate={someChecked}
          onChange={(event) => setCheckedTopics(event.target.checked ? [...TOPICS] : [])}
        >
          すべて選択（{checkedTopics.length} / {TOPICS.length}）
        </Checkbox>

        <div className="stack indentedStack">
          {TOPICS.map((topic) => (
            <TopicCheckbox
              key={topic}
              value={topic}
              checked={checkedTopics.includes(topic)}
              onChange={(event) => toggleTopic(topic, event.target.checked)}
            >
              {topic}
            </TopicCheckbox>
          ))}
        </div>
      </Demo>

      <Demo label="disabled" layout="column">
        <Checkbox disabled>未チェックで無効</Checkbox>
        <Checkbox disabled defaultChecked>
          チェック済みで無効
        </Checkbox>
        <Checkbox disabled indeterminate size="sm">
          中間状態で無効（sm）
        </Checkbox>
      </Demo>

      <Demo
        label="input のネイティブ属性（checked / onChange / name / value / required / ref …）"
        layout="column"
      >
        <Checkbox name="terms" value="agreed" required defaultChecked data-testid="checkbox">
          利用規約に同意する（required）
        </Checkbox>
        <Checkbox readOnly checked onChange={() => undefined} className="checkboxHighlight">
          className も転送される
        </Checkbox>
      </Demo>
    </Showcase>
  );
};
