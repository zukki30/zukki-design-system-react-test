import { useRef } from 'react';
import { Icon, iconNames, type IconName, type IconProps } from 'zukki-design-system';

import { Demo, Showcase } from './Showcase';

/**
 * props 型が公開されているので、既定値を固定したラッパーを作れる
 */
const LargeIcon = (props: Omit<IconProps, 'width' | 'height'>) => (
  <Icon {...props} width={32} height={32} />
);

const LABELLED_ICON: IconName = 'checkboxMarkedCircle';

export const IconShowcase = () => {
  // ref はそのまま svg 要素へ転送される
  const svgRef = useRef<SVGSVGElement>(null);

  return (
    <Showcase
      id="icon"
      title="Icon"
      summary={
        <>
          組み込みのアイコン。<code>name</code> で選ぶ。サイズは <code>width</code> /{' '}
          <code>height</code> で指定する（<code>size</code> prop は無い）。
        </>
      }
    >
      <Demo
        label="name — iconNames の全 18 種"
        hint={
          <>
            <code>iconNames</code> を値としても export しているので、一覧の描画に使える。
          </>
        }
        layout="grid"
      >
        {iconNames.map((name) => (
          <span key={name} className="iconTile">
            <Icon name={name} />
            <code>{name}</code>
          </span>
        ))}
      </Demo>

      <Demo
        label="aria-label"
        hint={
          <>
            渡すと意味のある画像として、渡さないと装飾（<code>aria-hidden</code>
            ）として扱われる。
          </>
        }
      >
        <Icon name={LABELLED_ICON} aria-label="登録済み" />
        <Icon name={LABELLED_ICON} />
      </Demo>

      <Demo label="width / height / className / style / ref（svg のネイティブ属性）">
        <Icon name="home" width={16} height={16} />
        <Icon name="home" width={24} height={24} />
        <LargeIcon name="home" />
        <Icon name="home" width={32} height={32} className="iconAccent" />
        <Icon name="home" width={32} height={32} style={{ opacity: 0.4 }} />
        <Icon name="home" width={32} height={32} ref={svgRef} data-testid="icon-with-ref" />
      </Demo>
    </Showcase>
  );
};
