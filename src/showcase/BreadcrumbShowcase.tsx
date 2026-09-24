import {
  Breadcrumb,
  Icon,
  type BreadcrumbItem,
  type BreadcrumbProps,
  type BreadcrumbVariant,
} from 'zukki-design-system';

import { Demo, Showcase } from './Showcase';

const VARIANTS: BreadcrumbVariant[] = ['default', 'profile', 'works', 'outputs'];

const HOME_ICON = <Icon name="home" width={16} height={16} />;

/**
 * BreadcrumbItem は label / href / icon の 3 つを持つ。
 * 配列の末尾が現在地として扱われ、末尾の href は無視される
 */
const ITEMS: BreadcrumbItem[] = [
  { label: 'ホーム', href: '#breadcrumb', icon: HOME_ICON },
  { label: 'コンポーネント', href: '#breadcrumb' },
  { label: 'Breadcrumb' },
];

/**
 * href を持たない中間項目はリンクにならない（ただのテキストとして描画される）
 */
const ITEMS_WITHOUT_HREF: BreadcrumbItem[] = [
  { label: 'ホーム', icon: HOME_ICON },
  { label: 'リンクにならない中間項目' },
  { label: '現在地', href: '#breadcrumb' },
];

/**
 * aria-label を固定したラッパー
 */
const SiteBreadcrumb = (props: Omit<BreadcrumbProps, 'aria-label'>) => (
  <Breadcrumb {...props} aria-label="サイト内の現在地" />
);

export const BreadcrumbShowcase = () => {
  return (
    <Showcase
      id="breadcrumb"
      title="Breadcrumb"
      summary={
        <>
          現在地までの階層を示すパンくずリスト。<code>items</code> 配列で渡し、末尾が現在地になる。
        </>
      }
    >
      <Demo
        label="items（label / href / icon）"
        hint="先頭にアイコン付きの項目、末尾に現在地。末尾に href を書いても無視される。"
        layout="column"
      >
        <Breadcrumb items={ITEMS} />
        <Breadcrumb items={ITEMS_WITHOUT_HREF} />
      </Demo>

      <Demo label="variant — 現在地の色テーマ" layout="column">
        {VARIANTS.map((variant) => (
          <Breadcrumb
            key={variant}
            items={[{ label: 'ホーム', href: '#breadcrumb', icon: HOME_ICON }, { label: variant }]}
            variant={variant}
          />
        ))}
      </Demo>

      <Demo
        label="aria-label"
        hint={
          <>
            既定は「パンくずリスト」。複数置くときは区別できる名前を付ける。
          </>
        }
        layout="column"
      >
        <Breadcrumb items={ITEMS} aria-label="記事のパンくずリスト" />
        <SiteBreadcrumb items={ITEMS} variant="works" />
      </Demo>

      <Demo
        label="nav のネイティブ属性（className / style / id / ref など）"
        hint={
          <>
            <code>children</code> は受け取らない。中身は <code>items</code> だけで決まる。
          </>
        }
        layout="column"
      >
        <Breadcrumb
          items={ITEMS}
          variant="outputs"
          className="breadcrumbBoxed"
          style={{ borderRadius: 'var(--border-radius-md)' }}
          id="breadcrumb-with-native-props"
          data-testid="breadcrumb"
        />
      </Demo>
    </Showcase>
  );
};
