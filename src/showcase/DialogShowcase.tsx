import { useRef, useState } from 'react';
import {
  Button,
  Dialog,
  Icon,
  Input,
  useDialogContext,
  type DialogBodyProps,
  type DialogCloseProps,
  type DialogContextValue,
  type DialogFooterProps,
  type DialogHeaderProps,
  type DialogProps,
  type DialogTitleProps,
} from 'zukki-design-system';

import { Demo, Showcase } from './Showcase';

/** パーツの props 型を使って既定値を固定する */
const StickyDialogHeader = (props: DialogHeaderProps) => (
  <Dialog.Header {...props} className="dialogHeaderSticky" />
);
const ScrollableDialogBody = (props: DialogBodyProps) => (
  <Dialog.Body {...props} className="dialogBodyScroll" />
);
const SpreadDialogFooter = (props: DialogFooterProps) => (
  <Dialog.Footer {...props} data-align="between" />
);
const SectionDialogTitle = (props: Omit<DialogTitleProps, 'level'>) => (
  <Dialog.Title {...props} level={3} />
);
const PlainDialogClose = (props: Omit<DialogCloseProps, 'variant'>) => (
  <Dialog.Close {...props} variant="secondary-exposed" />
);

/**
 * context からダイアログを閉じる独自のパーツ。
 * フッターのキャンセルボタンのように、`Dialog.Close` 以外の閉じ方を作るときに使う
 */
const DialogCancelButton = () => {
  const {
    state: { open },
    actions: { close },
  }: DialogContextValue = useDialogContext();

  return (
    <Button variant="secondary" disabled={!open} onClick={close}>
      context の close で閉じる
    </Button>
  );
};

/** open / onClose を固定しないラッパー（props 型の利用例） */
const ConfirmDialog = (props: DialogProps) => <Dialog {...props} closeOnOverlayClick={false} />;

export const DialogShowcase = () => {
  const [basicOpen, setBasicOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [guardedOpen, setGuardedOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [lastAction, setLastAction] = useState<string | null>(null);
  // ref は開閉以外の用途（フォーカス制御など）に使う
  const dialogRef = useRef<HTMLDialogElement>(null);

  // 入力途中は閉じる要求を受けても open を true のままにする
  const handleGuardedClose = () => {
    if (draft !== '') {
      setLastAction('入力途中なので閉じなかった');
      return;
    }

    setGuardedOpen(false);
    setLastAction('閉じた');
  };

  return (
    <Showcase
      id="dialog"
      title="Dialog"
      summary={
        <>
          モーダルダイアログ。開閉は <code>open</code> prop だけで制御し、
          <code>onClose</code> は「閉じる要求」として受け取る。
        </>
      }
    >
      <Demo
        label="open / onClose / children（全パーツ）"
        hint="Escape・オーバーレイ・Dialog.Close のどれで閉じても onClose は 1 回だけ呼ばれる。"
      >
        <Button variant="primary" onClick={() => setBasicOpen(true)}>
          ダイアログを開く
        </Button>

        <Dialog open={basicOpen} onClose={() => setBasicOpen(false)} ref={dialogRef}>
          <Dialog.Header>
            <Dialog.Title>記事を削除しますか？</Dialog.Title>
            <Dialog.Close />
          </Dialog.Header>
          <Dialog.Body>
            <p>削除した記事は元に戻せません。</p>
          </Dialog.Body>
          <Dialog.Footer>
            <DialogCancelButton />
            <Button variant="failure" onClick={() => setBasicOpen(false)}>
              削除する
            </Button>
          </Dialog.Footer>
        </Dialog>
      </Demo>

      <Demo
        label="closeOnOverlayClick"
        hint="false にすると背景クリックでは閉じない（Escape と Dialog.Close は有効）。"
      >
        <Button variant="secondary" onClick={() => setConfirmOpen(true)}>
          背景クリックで閉じないダイアログ
        </Button>

        <ConfirmDialog
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          className="dialogNarrow"
          data-testid="dialog"
        >
          <StickyDialogHeader>
            <SectionDialogTitle>level=3 のタイトル</SectionDialogTitle>
            <PlainDialogClose aria-label="このダイアログを閉じる" size="md">
              <Icon name="closeCircle" width={20} height={20} />
            </PlainDialogClose>
          </StickyDialogHeader>
          <ScrollableDialogBody>
            <p>
              背景をクリックしても閉じない。<code>Dialog.Close</code> は{' '}
              <code>aria-label</code> と <code>children</code> を差し替えられる。
            </p>
          </ScrollableDialogBody>
          <SpreadDialogFooter>
            <Button variant="secondary" onClick={() => setConfirmOpen(false)}>
              キャンセル
            </Button>
            <Button variant="primary" onClick={() => setConfirmOpen(false)}>
              OK
            </Button>
          </SpreadDialogFooter>
        </ConfirmDialog>
      </Demo>

      <Demo
        label="onClose は「閉じる要求」"
        hint={
          <>
            入力があるうちは <code>open</code> を <code>true</code> のままにして閉じない。
            {lastAction !== null && ` 直近: ${lastAction}`}
          </>
        }
      >
        <Button
          onClick={() => {
            setGuardedOpen(true);
            setLastAction(null);
          }}
        >
          入力途中は閉じないダイアログ
        </Button>

        <Dialog open={guardedOpen} onClose={handleGuardedClose}>
          <Dialog.Header>
            <Dialog.Title level={2}>下書きを書く</Dialog.Title>
            <Dialog.Close disabled={draft !== ''} />
          </Dialog.Header>
          <Dialog.Body>
            <div className="stack">
              <p>何か入力すると、Escape でもオーバーレイでも閉じなくなる。</p>
              <Input
                value={draft}
                placeholder="下書き"
                onChange={(event) => setDraft(event.target.value)}
              />
            </div>
          </Dialog.Body>
          <Dialog.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                setDraft('');
                setGuardedOpen(false);
                setLastAction('破棄して閉じた');
              }}
            >
              破棄して閉じる
            </Button>
          </Dialog.Footer>
        </Dialog>
      </Demo>
    </Showcase>
  );
};
