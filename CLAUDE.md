# CLAUDE.md

## デザインシステム

このリポジトリは [zukki-design-system-react](https://github.com/zukki30/zukki-design-system-react) を
install して実際に使えるかを確認するためのもの。

パッケージ名は **`zukki-design-system`**（リポジトリ名と違う）。npm には publish されていないため、
GitHub のリリースタグから install している。

ライブラリ側が配布しているエージェント向けガイドを読み込む。型から読み取れないこと
（CSS の import が必須であること・compound components の組み方・アイコン名の一覧）が書かれている。

@./node_modules/zukki-design-system/dist/AGENTS.md

## このリポジトリの決まり

- **依存は常に最新のリリースタグを指す。** `pnpm ds:check` で確認し、`pnpm ds:update` で更新する
- **全コンポーネントの全 props を使い続ける。** `pnpm check:props` が網羅を検証する。
  ライブラリに props が増えたらこのチェックが落ちるので、`src/showcase/` に使用例を足す
- **配色はルート要素の `color-scheme` で切り替える。** `styles.css` は `light-dark()` で
  両配色を持っているため、CSS を差し替える必要はない（`src/theme/ThemeProvider.tsx`）
- **`vite.config.ts` の `build.cssTarget` を下げない。** 下げると `light-dark()` が変換され、
  配色の切り替えが OS 設定にしか反応しなくなる

## git 依存ならではの落とし穴

デザインシステムは `dist` を配布物に含めず、install のたびに `prepare` でビルドされる。
そのため install 環境の影響を受ける。

- **`pnpm.onlyBuiltDependencies` に `zukki-design-system` が必要。**
  pnpm 10 は git 依存の `prepare` を許可制にしている。外すと install が成立しない
- **pnpm の store を `node_modules` の中に置かない。**
  `prepare` は store 内の一時ディレクトリで走る。そこが `node_modules` 配下だと、
  ライブラリ側の vite が package.json を上へ辿る途中で `node_modules` に当たり、
  `Name in package.json is required` で落ちる。
  `pnpm/action-setup` の既定の store がまさにこれなので、CI では store-dir を明示している
