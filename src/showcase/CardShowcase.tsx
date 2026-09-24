import { useRef } from 'react';
import {
  Button,
  Card,
  Icon,
  IconButton,
  Tag,
  useCardContext,
  type CardActionProps,
  type CardBodyProps,
  type CardContextValue,
  type CardFooterProps,
  type CardHeaderProps,
  type CardImageProps,
  type CardProps,
  type CardSize,
  type CardTitleProps,
  type HeadingLevel,
} from 'zukki-design-system';

import { Demo, Showcase } from './Showcase';

const SIZES: CardSize[] = ['md', 'sm'];

const LEVELS: HeadingLevel[] = [2, 3, 4, 5, 6];

/**
 * 外部リクエストを増やさないよう、サムネイルは data URI の SVG で用意する
 */
const THUMBNAIL_SRC =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 120">
      <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#5b9ef5"/><stop offset="100%" stop-color="#0e70f1"/>
      </linearGradient></defs>
      <rect width="320" height="120" fill="url(#g)"/>
      <text x="160" y="68" font-family="sans-serif" font-size="20" fill="#ffffff" text-anchor="middle">Card.Image</text>
    </svg>`
  );

/**
 * context からサイズを読む独自のパーツ。
 * `<Card>` の外側で呼ぶと例外になる
 */
const CardMeta = ({ children }: { children: string }) => {
  const {
    state: { size },
  }: CardContextValue = useCardContext();

  return (
    <div className="cardMeta" data-size={size}>
      <Icon name="calendarMonth" width={16} height={16} />
      <span>
        {children}（このカードの size は <code>{size}</code>）
      </span>
    </div>
  );
};

/** パーツの props 型はすべて公開されているので、こう固定できる */
const WideCardImage = (props: CardImageProps) => <Card.Image {...props} className="cardImageWide" />;
const CompactCardHeader = (props: CardHeaderProps) => <Card.Header {...props} data-compact="true" />;
const MutedCardBody = (props: CardBodyProps) => <Card.Body {...props} className="cardBodyMuted" />;
const RightCardFooter = (props: CardFooterProps) => <Card.Footer {...props} data-align="end" />;
const CardLinkAction = (props: CardActionProps) => <Card.Action {...props} data-kind="link" />;
const SectionCardTitle = (props: Omit<CardTitleProps, 'level'>) => <Card.Title {...props} level={3} />;

/** size を固定したラッパー */
const CompactCard = (props: Omit<CardProps, 'size'>) => <Card {...props} size="sm" />;

export const CardShowcase = () => {
  // Card.Title の ref は level によって転送先のタグが変わるため HTMLElement で受ける
  const titleRef = useRef<HTMLElement>(null);

  return (
    <Showcase
      id="card"
      title="Card"
      summary={
        <>
          情報のまとまりを載せる面。<code>Card.Image</code> / <code>Card.Header</code> /{' '}
          <code>Card.Title</code> / <code>Card.Action</code> / <code>Card.Body</code> /{' '}
          <code>Card.Footer</code> を合成して組み立てる。
        </>
      }
    >
      <Demo
        label="size — パーツの余白が変わる"
        hint="値は context で配下のパーツへ伝わる。入れ子にすると内側の size が効く。"
        layout="grid"
      >
        {SIZES.map((size) => (
          <Card key={size} size={size} style={{ maxWidth: 320 }}>
            <Card.Header>
              <Card.Title level={3}>size = {size}</Card.Title>
            </Card.Header>
            <Card.Body>
              <p style={{ flex: 1 }}>余白がこの size から決まる。</p>
            </Card.Body>
            <Card.Footer>
              <CardMeta>更新日 2026-09-24</CardMeta>
            </Card.Footer>
          </Card>
        ))}
      </Demo>

      <Demo label="全パーツを組み合わせる" layout="grid">
        <Card style={{ maxWidth: 360 }}>
          <Card.Image>
            <img src={THUMBNAIL_SRC} alt="" />
          </Card.Image>
          <Card.Header>
            <Card.Title level={3} ref={titleRef}>
              デザインシステムを導入する
            </Card.Title>
            <Card.Action>
              <IconButton variant="secondary-exposed" size="sm" aria-label="メニューを開く">
                <Icon name="menuDown" width={16} height={16} />
              </IconButton>
            </Card.Action>
          </Card.Header>
          <Card.Body>
            <div className="stack" style={{ flex: 1 }}>
              <p>
                Card.Body は横並びの flex なので、縦積みの内容は子に <code>flex: 1</code> を与える。
              </p>
              <div className="demo__stage" data-layout="row">
                <Tag label="React" variant="blue" />
                <Tag label="CSS" variant="green" />
              </div>
            </div>
          </Card.Body>
          <Card.Footer>
            <Button variant="primary" size="sm">
              詳しく見る
            </Button>
          </Card.Footer>
        </Card>

        <CompactCard style={{ maxWidth: 360 }}>
          <WideCardImage>
            <img src={THUMBNAIL_SRC} alt="" />
          </WideCardImage>
          <CompactCardHeader>
            <SectionCardTitle>ラッパー経由で組んだカード</SectionCardTitle>
            <CardLinkAction>
              <a href="#card">もっと見る</a>
            </CardLinkAction>
          </CompactCardHeader>
          <MutedCardBody>
            <p style={{ flex: 1 }}>各パーツの props 型を使って既定値を固定している。</p>
          </MutedCardBody>
          <RightCardFooter>
            <Button size="sm" variant="secondary">
              閉じる
            </Button>
          </RightCardFooter>
        </CompactCard>
      </Demo>

      <Demo
        label="Card.Title の level"
        hint={
          <>
            省略すると見出しにならない <code>div</code> で描画される。見た目はレベルによらず同じ。
          </>
        }
        layout="column"
      >
        <Card size="sm">
          <Card.Header>
            <Card.Title>level 省略 — div（見出しではない）</Card.Title>
          </Card.Header>
          {LEVELS.map((level) => (
            <Card.Header key={level}>
              <Card.Title level={level}>level = {level}（h{level} として描画）</Card.Title>
            </Card.Header>
          ))}
          <Card.Body>
            <p style={{ flex: 1 }}>周囲の見出し階層に合わせて指定する。</p>
          </Card.Body>
        </Card>
      </Demo>

      <Demo
        label="div のネイティブ属性（className / style / id / ref など）"
        hint="ルートもパーツも、ネイティブ属性と ref はそのまま div へ転送される。"
      >
        <Card
          className="cardOutlined"
          id="card-with-native-props"
          style={{ maxWidth: 320 }}
          data-testid="card"
        >
          <Card.Header className="cardHeaderTight" title="header の title 属性">
            <Card.Title level={4} id="card-native-title">
              ネイティブ属性つき
            </Card.Title>
          </Card.Header>
          <Card.Body aria-describedby="card-native-title">
            <p style={{ flex: 1 }}>id や data 属性もそのまま出力される。</p>
          </Card.Body>
        </Card>
      </Demo>
    </Showcase>
  );
};
