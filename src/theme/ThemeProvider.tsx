import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import type { ReactNode } from 'react';

import {
  ThemeContext,
  type ResolvedTheme,
  type Theme,
  type ThemeContextValue,
  themes,
} from './ThemeContext';

/**
 * localStorage のキー。index.html のちらつき防止スクリプトと共有している
 */
const STORAGE_KEY = 'zds-theme';

const DARK_QUERY = '(prefers-color-scheme: dark)';

const isTheme = (value: unknown): value is Theme => themes.includes(value as Theme);

/**
 * 保存された選択を読む。未保存・壊れた値のときは OS 追従に倒す
 */
const readStoredTheme = (): Theme => {
  const stored = localStorage.getItem(STORAGE_KEY);

  return isTheme(stored) ? stored : 'system';
};

const subscribeToSystemTheme = (onStoreChange: () => void) => {
  const query = window.matchMedia(DARK_QUERY);

  query.addEventListener('change', onStoreChange);

  return () => query.removeEventListener('change', onStoreChange);
};

const getSystemTheme = (): ResolvedTheme =>
  window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light';

/**
 * ライト / ダーク / OS 追従を切り替える。
 *
 * zukki-design-system の `styles.css` は `light-dark()` で配色を定義しているため、
 * ルート要素の `color-scheme` を書き換えるだけで全コンポーネントの配色が切り替わる。
 *
 * `styles.css` 自身が `:root { color-scheme: light dark }` を宣言しており、同じ詳細度の
 * セレクタで上書きすると CSS の読み込み順に結果が左右される。そのため常に勝つ
 * インラインスタイルで指定している
 */
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // localStorage の読み出しは初回レンダーの 1 回だけでよいので遅延初期化する
  const [theme, setTheme] = useState<Theme>(readStoredTheme);

  // OS 設定は React の外にある状態なので useSyncExternalStore で購読する。
  // サーバー描画時は matchMedia が無いため light に倒す
  const systemTheme = useSyncExternalStore<ResolvedTheme>(
    subscribeToSystemTheme,
    getSystemTheme,
    () => 'light'
  );

  useEffect(() => {
    document.documentElement.style.colorScheme = theme === 'system' ? 'light dark' : theme;
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const resolvedTheme = theme === 'system' ? systemTheme : theme;

  // context の値は配下すべての再レンダー要因になるため memo 化する
  const handleSetTheme = useCallback((next: Theme) => setTheme(next), []);
  const value = useMemo<ThemeContextValue>(
    () => ({ state: { theme, resolvedTheme }, actions: { setTheme: handleSetTheme } }),
    [theme, resolvedTheme, handleSetTheme]
  );

  return <ThemeContext value={value}>{children}</ThemeContext>;
};
