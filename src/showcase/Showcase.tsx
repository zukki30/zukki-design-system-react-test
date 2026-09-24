import type { ReactNode } from 'react';

export type ShowcaseProps = {
  /**
   * サイドナビのアンカーと見出しの紐付けに使う id
   */
  id: string;
  /**
   * コンポーネント名
   */
  title: string;
  /**
   * 何のコンポーネントかの 1 行説明
   */
  summary: ReactNode;
  children: ReactNode;
};

/**
 * コンポーネント 1 つぶんの区画。中身は `Demo` を並べて構成する
 */
export const Showcase = ({ id, title, summary, children }: ShowcaseProps) => {
  return (
    <section id={id} className="showcase" aria-labelledby={`${id}-title`}>
      <div className="showcase__header">
        <h2 id={`${id}-title`} className="showcase__title">
          {title}
        </h2>
        <p className="showcase__summary">{summary}</p>
      </div>

      <div className="showcase__body">{children}</div>
    </section>
  );
};

export type DemoProps = {
  /**
   * この例で確認している props
   */
  label: string;
  /**
   * 補足。挙動の注意点を書く
   */
  hint?: ReactNode;
  /**
   * 例の並べ方
   * @default 'row'
   */
  layout?: 'row' | 'column' | 'grid';
  children: ReactNode;
};

/**
 * 「どの props を確認しているか」をラベルにした 1 例ぶんの枠
 */
export const Demo = ({ label, hint, layout = 'row', children }: DemoProps) => {
  return (
    <div className="demo">
      <div className="demo__meta">
        <code className="demo__label">{label}</code>
        {hint !== undefined && <p className="demo__hint">{hint}</p>}
      </div>

      <div className="demo__stage" data-layout={layout}>
        {children}
      </div>
    </div>
  );
};
