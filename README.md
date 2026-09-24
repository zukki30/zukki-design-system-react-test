# zukki-design-system-react-test

[zukki-design-system-react](https://github.com/zukki30/zukki-design-system-react) を install して、
実際に使えるかを確認するリポジトリ。

19 コンポーネントすべてを画面に並べ、**デザインシステムが宣言している props を 1 つ残らず使っている**。
ライト / ダークの切り替えも動作確認できる。

## セットアップ

```bash
pnpm install
pnpm dev
```

`http://localhost:5173` が開く。

## スクリプト

| コマンド | 内容 |
| --- | --- |
| `pnpm dev` | 開発サーバーを起動する |
| `pnpm build` | 型チェックと本番ビルドを実行する |
| `pnpm preview` | ビルド結果を確認する |
| `pnpm typecheck` | 型チェックだけ実行する |
| `pnpm check:props` | 全 props を使えているかを検証する |
| `pnpm ds:check` | デザインシステムが最新リリースかを確認する |
| `pnpm ds:update` | 最新リリースへ更新する |
| `pnpm verify` | 上記をまとめて実行する |

## デザインシステムの install

npm には publish されていないため、GitHub から install する。**パッケージ名はリポジトリ名と違い
`zukki-design-system`** なので、import はこの名前で書く。

```bash
pnpm add github:zukki30/zukki-design-system-react#v3.0.0
```

### 常に最新を使う

タグを手で書き換えると更新漏れが起きるため、Releases API から最新タグを取って突き合わせる
スクリプトを用意している。

```bash
pnpm ds:check   # 最新でなければ exit 1
pnpm ds:update  # 最新タグを install し直す
```

## ライト / ダークの切り替え

デザインシステムは 3 種類の CSS を配布している。

| CSS | 配色 |
| --- | --- |
| `zukki-design-system/styles.css` | `color-scheme` に従って切り替わる |
| `zukki-design-system/styles-light.css` | ライト固定 |
| `zukki-design-system/styles-dark.css` | ダーク固定 |

このリポジトリは切り替えができる `styles.css` を使い、**ルート要素の `color-scheme` を
書き換えるだけ**で配色を変えている（`src/theme/ThemeProvider.tsx`）。CSS 自体は差し替えない。

```ts
document.documentElement.style.colorScheme = theme === 'system' ? 'light dark' : theme;
```

実装上の注意が 2 つある。

1. **`styles.css` 自身が `:root { color-scheme: light dark }` を宣言している。**
   同じ詳細度のセレクタで上書きすると CSS の読み込み順に結果が左右されるため、
   常に勝つインラインスタイルで指定している。
2. **ビルド設定で `light-dark()` を残す必要がある。**
   ブラウザターゲットが古いと `light-dark()` が変換され、`color-scheme` による切り替えが
   効かなくなる（OS の設定にしか反応しなくなる）。`vite.config.ts` で下限を指定している。

   ```ts
   build: { cssTarget: ['chrome123', 'safari17.5', 'firefox120'] }
   ```

選択（ライト / ダーク / OS 設定）は `localStorage` に保存し、`index.html` のインラインスクリプトで
React のマウント前に当てて初回描画のちらつきを防いでいる。

## props の網羅

`pnpm check:props` は、install 済みの `dist/main.d.ts` から `〜Props` 型を読み、
**型リテラルで宣言されているメンバー**（＝デザインシステム自身の props）を集めて、
`src/` の JSX で実際に使われているかを突き合わせる。

```
  ✓ Button            8/8
  ✓ Card.Title        2/2
  ✓ Dialog.Close      2/2
  ...
  合計: 83/83 props
  export の参照: 92/92
```

- `Omit<ComponentPropsWithRef<'button'>, …>` のネイティブ属性側は数が発散するため対象外。
  代わりに各 Showcase に「ネイティブ属性」の例を置いている
- `<Button>ラベル</Button>` のような JSX の子は `children` prop の利用として数える
- `const SubmitButton = (props) => <Button {...props} type="submit" />` のような薄いラッパーは
  辿って元のコンポーネントの利用として数える
- デザインシステムの export（コンポーネント・hooks・型）が全部 import されているかも見る

ライブラリ側に props が増えるとこのチェックが落ちるので、更新時に追従漏れへ気付ける。

## ディレクトリ構成

```
├─ src
│  ├─ App.tsx                  --- 画面全体（サイドナビ + 各 Showcase）
│  ├─ main.tsx                 --- エントリポイント。ここで styles.css を読む
│  ├─ theme/                   --- ライト / ダークの切り替え
│  ├─ showcase/                --- コンポーネント 1 つにつき 1 ファイル
│  └─ styles/app.css           --- デモ画面のレイアウト（DS の CSS 変数だけで組んでいる）
└─ scripts
   ├─ check-props-coverage.ts  --- props の網羅を検証する
   └─ update-design-system.ts  --- 最新リリースへ追従する
```

## 確認できること

| 観点 | 置き場所 |
| --- | --- |
| 全 19 コンポーネントの全 props | `src/showcase/*.tsx` |
| compound components の組み方 | Card / Dialog / FormField / Steps の Showcase |
| context を使った独自パーツ | `useCardContext` / `useDialogContext` / `useFormFieldContext` / `useStepsContext` |
| `useFormFieldState` で状態を引き継ぐ独自コントロール | `src/showcase/FormFieldShowcase.tsx` の `ColorSwatch` |
| props 型を使ったラッパー | 各 Showcase 冒頭の `Omit<XxxProps, …>` |
| ライト / ダークの切り替え | ヘッダーのセグメントコントロール |
