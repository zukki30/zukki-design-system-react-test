import { useState } from 'react';
import { Switch, type SwitchProps, type SwitchSize } from 'zukki-design-system';

import { Demo, Showcase } from './Showcase';

const SIZES: SwitchSize[] = ['sm', 'md'];

/** name を固定したラッパー */
const NotificationSwitch = (props: Omit<SwitchProps, 'name'>) => (
  <Switch {...props} name="notification" />
);

export const SwitchShowcase = () => {
  const [enabled, setEnabled] = useState(true);

  return (
    <Showcase
      id="switch"
      title="Switch"
      summary={
        <>
          オン / オフの切り替え。<code>role=&quot;switch&quot;</code> は内部で付くため渡せない。
        </>
      }
    >
      <Demo label="children（ラベル）" layout="column">
        <Switch defaultChecked>ラベルつき</Switch>
        <Switch aria-label="ラベルなしのスイッチ" />
      </Demo>

      <Demo label="size" layout="column">
        {SIZES.map((size) => (
          <Switch key={size} size={size} defaultChecked>
            size = {size}
          </Switch>
        ))}
      </Demo>

      <Demo label="disabled" layout="column">
        <Switch disabled>オフで無効</Switch>
        <Switch disabled defaultChecked>
          オンで無効
        </Switch>
        <Switch disabled size="sm" defaultChecked className="switchHighlight">
          sm で無効（className つき）
        </Switch>
      </Demo>

      <Demo
        label="input のネイティブ属性（checked / onChange / name / value / ref …）"
        hint={`通知は ${enabled ? 'オン' : 'オフ'}`}
        layout="column"
      >
        <NotificationSwitch
          value="email"
          checked={enabled}
          data-testid="switch"
          onChange={(event) => setEnabled(event.target.checked)}
        >
          メール通知を受け取る
        </NotificationSwitch>
      </Demo>
    </Showcase>
  );
};
