import { Button, Icon, type IconName } from 'zukki-design-system';

import { useTheme, type Theme, themes } from './ThemeContext';

const THEME_LABELS = {
  light: 'ライト',
  dark: 'ダーク',
  system: 'OS 設定',
} as const satisfies Record<Theme, string>;

const THEME_ICONS = {
  light: 'eye',
  dark: 'eyeOff',
  system: 'windowRestore',
} as const satisfies Record<Theme, IconName>;

const ICON_SIZE = 16;

/**
 * 配色を切り替えるセグメントコントロール。
 *
 * 選択中であることを `Button` の `selected` と先頭アイコンの 2 つで示し、
 * 色だけに頼らずに見分けられるようにしている
 */
export const ThemeToggle = () => {
  const {
    state: { theme, resolvedTheme },
    actions: { setTheme },
  } = useTheme();

  return (
    <div className="themeToggle">
      <span className="themeToggle__status">
        表示中: <strong>{THEME_LABELS[resolvedTheme]}</strong>
      </span>

      <div className="themeToggle__group" role="group" aria-label="配色の切り替え">
        {themes.map((value) => (
          <Button
            key={value}
            size="sm"
            variant={value === theme ? 'primary' : 'default'}
            selected={value === theme}
            aria-pressed={value === theme}
            startIcon={<Icon name={THEME_ICONS[value]} width={ICON_SIZE} height={ICON_SIZE} />}
            onClick={() => setTheme(value)}
          >
            {THEME_LABELS[value]}
          </Button>
        ))}
      </div>
    </div>
  );
};
