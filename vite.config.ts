import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages のプロジェクトページは /<リポジトリ名>/ 配下に置かれる。
  // 相対パスで出力しておけば、公開先のパスに依存せず dev / preview でもそのまま動く
  base: './',
  build: {
    // zukki-design-system/styles.css は light-dark() で配色を定義している。
    // 既定のブラウザターゲットのままだと light-dark() が古い形へ変換され、
    // color-scheme を要素へ指定して切り替える方式が効かなくなる（OS 設定にしか反応しなくなる）。
    // 値はライブラリ側の対応下限に合わせている
    cssTarget: ['chrome123', 'safari17.5', 'firefox120'],
  },
});
