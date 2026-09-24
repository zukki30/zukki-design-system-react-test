import { createContext, use } from 'react';

/**
 * 利用側が選べる配色。
 *
 * `system` は OS の設定に追従する状態で、ライト / ダークのどちらかに固定しない
 */
export const themes = ['light', 'dark', 'system'] as const;
export type Theme = (typeof themes)[number];

/**
 * 実際に表示されている配色。`system` は OS 設定に応じてどちらかへ解決される
 */
export type ResolvedTheme = Exclude<Theme, 'system'>;

export type ThemeContextValue = {
  state: {
    /**
     * 利用側が選んでいる配色
     */
    theme: Theme;
    /**
     * 実際に表示されている配色。`theme` が `system` のときは OS 設定の値になる
     */
    resolvedTheme: ResolvedTheme;
  };
  actions: {
    /**
     * 配色を切り替える。localStorage へ永続化され、次回の読み込みでも復元される
     */
    setTheme: (theme: Theme) => void;
  };
};

export const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * 配色の context を取得する。`<ThemeProvider>` の外側で呼ぶと例外を投げる
 */
export const useTheme = (): ThemeContextValue => {
  const context = use(ThemeContext);

  if (context === null) {
    throw new Error('useTheme は <ThemeProvider> の内側で使用してください');
  }

  return context;
};
