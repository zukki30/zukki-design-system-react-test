import type { ComponentType } from 'react';

import { ThemeToggle } from './theme/ThemeToggle';
import { BreadcrumbShowcase } from './showcase/BreadcrumbShowcase';
import { ButtonShowcase } from './showcase/ButtonShowcase';
import { CardShowcase } from './showcase/CardShowcase';
import { CheckboxShowcase } from './showcase/CheckboxShowcase';
import { DialogShowcase } from './showcase/DialogShowcase';
import { FormFieldShowcase } from './showcase/FormFieldShowcase';
import { IconButtonShowcase } from './showcase/IconButtonShowcase';
import { IconShowcase } from './showcase/IconShowcase';
import { InputNumberShowcase } from './showcase/InputNumberShowcase';
import { InputShowcase } from './showcase/InputShowcase';
import { RadioShowcase } from './showcase/RadioShowcase';
import { SelectShowcase } from './showcase/SelectShowcase';
import { SkeletonShowcase } from './showcase/SkeletonShowcase';
import { SpinnerShowcase } from './showcase/SpinnerShowcase';
import { StepsShowcase } from './showcase/StepsShowcase';
import { SwitchShowcase } from './showcase/SwitchShowcase';
import { TagShowcase } from './showcase/TagShowcase';
import { TextAreaShowcase } from './showcase/TextAreaShowcase';
import { TooltipShowcase } from './showcase/TooltipShowcase';

type ShowcaseEntry = {
  /** Showcase 側の id と揃える（アンカーに使う） */
  id: string;
  /** サイドナビに出すコンポーネント名 */
  name: string;
  Component: ComponentType;
};

/**
 * 表示順。デザインシステムの export 順（main.tsx）に揃えている
 */
const SHOWCASES: ShowcaseEntry[] = [
  { id: 'icon', name: 'Icon', Component: IconShowcase },
  { id: 'button', name: 'Button', Component: ButtonShowcase },
  { id: 'icon-button', name: 'IconButton', Component: IconButtonShowcase },
  { id: 'spinner', name: 'Spinner', Component: SpinnerShowcase },
  { id: 'skeleton', name: 'Skeleton', Component: SkeletonShowcase },
  { id: 'tag', name: 'Tag', Component: TagShowcase },
  { id: 'breadcrumb', name: 'Breadcrumb', Component: BreadcrumbShowcase },
  { id: 'tooltip', name: 'Tooltip', Component: TooltipShowcase },
  { id: 'steps', name: 'Steps', Component: StepsShowcase },
  { id: 'card', name: 'Card', Component: CardShowcase },
  { id: 'dialog', name: 'Dialog', Component: DialogShowcase },
  { id: 'form-field', name: 'FormField', Component: FormFieldShowcase },
  { id: 'input', name: 'Input', Component: InputShowcase },
  { id: 'input-number', name: 'InputNumber', Component: InputNumberShowcase },
  { id: 'textarea', name: 'TextArea', Component: TextAreaShowcase },
  { id: 'select', name: 'Select', Component: SelectShowcase },
  { id: 'checkbox', name: 'Checkbox', Component: CheckboxShowcase },
  { id: 'radio', name: 'Radio', Component: RadioShowcase },
  { id: 'switch', name: 'Switch', Component: SwitchShowcase },
];

export const App = () => {
  return (
    <div className="app">
      <header className="appHeader">
        <div className="appHeader__inner">
          <div className="appHeader__titles">
            <h1 className="appHeader__title">zukki-design-system playground</h1>
            <p className="appHeader__subtitle">
              GitHub から install した {SHOWCASES.length} コンポーネントの全 props を確認する
            </p>
          </div>

          <ThemeToggle />
        </div>
      </header>

      <div className="appLayout">
        <nav className="appNav" aria-label="コンポーネント一覧">
          <ul className="appNav__list">
            {SHOWCASES.map(({ id, name }) => (
              <li key={id}>
                <a className="appNav__link" href={`#${id}`}>
                  {name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <main className="appMain">
          {SHOWCASES.map(({ id, Component }) => (
            <Component key={id} />
          ))}
        </main>
      </div>
    </div>
  );
};
