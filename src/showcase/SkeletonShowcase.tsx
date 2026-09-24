import { useState } from 'react';
import { Button, Card, Skeleton, type SkeletonProps, type SkeletonShape } from 'zukki-design-system';

import { Demo, Showcase } from './Showcase';

const SHAPES: SkeletonShape[] = ['rect', 'circle'];

/**
 * 1 行ぶんのテキストプレースホルダー
 */
const TextSkeleton = (props: Omit<SkeletonProps, 'shape'>) => <Skeleton {...props} shape="rect" />;

export const SkeletonShowcase = () => {
  const [loading, setLoading] = useState(true);

  return (
    <Showcase
      id="skeleton"
      title="Skeleton"
      summary={
        <>
          読み込み中のプレースホルダー。中身を持たない <code>span</code> を描画する（
          <code>children</code> は受け取らない）。
        </>
      }
    >
      <Demo label="shape" layout="grid">
        {SHAPES.map((shape) => (
          <span key={shape} className="iconTile">
            <Skeleton shape={shape} width={shape === 'circle' ? 48 : 160} height={48} />
            <code>{shape}</code>
          </span>
        ))}
      </Demo>

      <Demo
        label="width / height"
        hint={
          <>
            既定は <code>width=&quot;100%&quot;</code> / <code>height=&quot;16px&quot;</code>。
          </>
        }
        layout="column"
      >
        <Skeleton />
        <TextSkeleton width="80%" />
        <TextSkeleton width="60%" height="24px" />
        <Skeleton width={120} height={12} />
      </Demo>

      <Demo
        label="style / className / ref など span のネイティブ属性"
        hint={
          <>
            <code>style</code> に <code>width</code> / <code>height</code> を書くとそちらが優先される。
          </>
        }
      >
        <Skeleton width="200px" height="32px" style={{ width: '120px' }} />
        <Skeleton width={120} height={32} className="skeletonRounded" />
        <Skeleton width={120} height={32} aria-hidden="true" data-testid="skeleton" />
      </Demo>

      <Demo label="読み込み中の差し替え例" layout="column">
        <Button size="sm" onClick={() => setLoading((value) => !value)}>
          {loading ? '読み込み完了にする' : '読み込み中に戻す'}
        </Button>

        <Card size="sm" style={{ maxWidth: 360 }}>
          <Card.Header>
            <Card.Title level={3}>
              {loading ? <Skeleton width={160} height={20} /> : 'デザインシステムの導入'}
            </Card.Title>
          </Card.Header>
          <Card.Body>
            <div className="stack" style={{ flex: 1 }}>
              {loading ? (
                <>
                  <TextSkeleton />
                  <TextSkeleton width="70%" />
                </>
              ) : (
                <p>CSS を読み込めば、あとはコンポーネントを組み合わせるだけで整う。</p>
              )}
            </div>
          </Card.Body>
        </Card>
      </Demo>
    </Showcase>
  );
};
