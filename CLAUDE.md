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
