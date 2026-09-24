import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// コンポーネントより先に読み込む。配色も余白もすべて CSS 変数で定義されているため、
// これが無いと無スタイルで描画される。
// light-dark() で両配色を持つ版を使い、切り替えは color-scheme で行う
// （固定したいだけなら styles-light.css / styles-dark.css を使う）
import 'zukki-design-system/styles.css';

import { App } from './App';
import { ThemeProvider } from './theme/ThemeProvider';

// ライブラリの CSS を上書きできるよう、デモ側の CSS は後に読み込む
import './styles/app.css';

const container = document.getElementById('root');

if (container === null) {
  throw new Error('#root が見つかりません');
}

createRoot(container).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>
);
