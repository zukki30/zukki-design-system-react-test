import { useState } from 'react';
import {
  Button,
  Icon,
  IconButton,
  Switch,
  Tooltip,
  type TooltipPlacement,
  type TooltipProps,
} from 'zukki-design-system';

import { Demo, Showcase } from './Showcase';

const PLACEMENTS: TooltipPlacement[] = [
  'top',
  'topLeft',
  'topRight',
  'bottom',
  'bottomLeft',
  'bottomRight',
  'left',
  'right',
];

/**
 * 置き場所を固定したラッパー
 */
const HintTooltip = (props: Omit<TooltipProps, 'placement'>) => (
  <Tooltip {...props} placement="bottom" />
);

export const TooltipShowcase = () => {
  const [alwaysOpen, setAlwaysOpen] = useState(false);

  return (
    <Showcase
      id="tooltip"
      title="Tooltip"
      summary={
        <>
          補足を示す吹き出し。<code>children</code> に対象要素、<code>content</code>{' '}
          に吹き出しの中身を渡す。
        </>
      }
    >
      <Demo
        label="content / children"
        hint="ホバーとフォーカスの両方で表示される。キーボードでも確認できる。"
      >
        <Tooltip content="保存せずに閉じます">
          <Button variant="secondary">ホバー / フォーカスで表示</Button>
        </Tooltip>
        <Tooltip content={<strong>ReactNode も渡せる</strong>}>
          <IconButton variant="secondary-exposed" aria-label="ヘルプ">
            <Icon name="checkboxMarkedCircle" width={20} height={20} />
          </IconButton>
        </Tooltip>
      </Demo>

      <Demo label="placement — 8 方向" layout="grid">
        {PLACEMENTS.map((placement) => (
          <Tooltip key={placement} content={`placement = ${placement}`} placement={placement}>
            <Button size="sm">{placement}</Button>
          </Tooltip>
        ))}
      </Demo>

      <Demo
        label="open"
        hint="指定すると常に表示される（未指定のときはホバー・フォーカスで表示）。"
        layout="column"
      >
        <Switch checked={alwaysOpen} onChange={(event) => setAlwaysOpen(event.target.checked)}>
          open で固定表示する
        </Switch>

        <div className="demo__stage" data-layout="row" style={{ paddingBlock: 32 }}>
          <Tooltip content="open={true} なので出たまま" placement="bottom" open={alwaysOpen}>
            <Button variant="primary">対象の要素</Button>
          </Tooltip>
        </div>
      </Demo>

      <Demo label="span のネイティブ属性（className / style / id など）">
        <HintTooltip content="ラッパー経由で placement を固定" className="tooltipInline" id="tooltip-demo">
          <span className="linkLikeText">補足つきのテキスト</span>
        </HintTooltip>
        <Tooltip
          content="style も転送される"
          placement="right"
          style={{ display: 'inline-flex' }}
          data-testid="tooltip"
        >
          <Button size="sm" variant="secondary">
            右に表示
          </Button>
        </Tooltip>
      </Demo>
    </Showcase>
  );
};
