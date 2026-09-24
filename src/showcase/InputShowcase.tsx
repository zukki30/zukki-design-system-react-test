import { useRef, useState } from 'react';
import {
  Button,
  Icon,
  Input,
  type InputProps,
  type InputSize,
} from 'zukki-design-system';

import { Demo, Showcase } from './Showcase';

const SIZES: InputSize[] = ['sm', 'md'];

/** type を固定したラッパー */
const SearchInput = (props: Omit<InputProps, 'type' | 'startIcon'>) => (
  <Input {...props} type="search" startIcon={<Icon name="eye" />} />
);

export const InputShowcase = () => {
  const [value, setValue] = useState('zukki');
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Showcase
      id="input"
      title="Input"
      summary={
        <>
          1 行のテキスト入力。前後に装飾アイコンを置ける。<code>error</code> /{' '}
          <code>disabled</code> / <code>size</code> は未指定なら FormField から引き継ぐ。
        </>
      }
    >
      <Demo
        label="startIcon / endIcon"
        hint={
          <>
            装飾として扱われる（<code>aria-hidden</code>）。操作要素は渡さない。
          </>
        }
        layout="column"
      >
        <Input startIcon={<Icon name="home" />} placeholder="startIcon" />
        <Input endIcon={<Icon name="calendarMonth" />} placeholder="endIcon" />
        <Input
          startIcon={<Icon name="github" />}
          endIcon={<Icon name="chevronRight" />}
          placeholder="両方"
        />
        <SearchInput placeholder="ラッパー経由（type=search）" />
      </Demo>

      <Demo label="size" layout="column">
        {SIZES.map((size) => (
          <Input key={size} size={size} defaultValue={`size = ${size}`} startIcon={<Icon name="home" />} />
        ))}
      </Demo>

      <Demo
        label="error"
        hint={
          <>
            <code>aria-invalid</code> も一緒に立つ。
          </>
        }
        layout="column"
      >
        <Input error defaultValue="不正な値" />
        <Input error size="sm" placeholder="sm でエラー" endIcon={<Icon name="closeCircle" />} />
      </Demo>

      <Demo label="disabled" layout="column">
        <Input disabled defaultValue="編集できない" />
        <Input disabled size="sm" placeholder="sm で無効" startIcon={<Icon name="home" />} />
      </Demo>

      <Demo
        label="input のネイティブ属性（type / value / onChange / readOnly / required / maxLength / ref …）"
        layout="column"
      >
        <Input
          ref={inputRef}
          name="username"
          value={value}
          placeholder="ユーザー名"
          maxLength={20}
          autoComplete="username"
          required
          onChange={(event) => setValue(event.target.value)}
        />
        <Input type="email" placeholder="you@example.com" inputMode="email" />
        <Input type="password" defaultValue="secret" autoComplete="current-password" />
        <Input readOnly defaultValue="読み取り専用" />
        <Button size="sm" variant="secondary" onClick={() => inputRef.current?.focus()}>
          ref でフォーカスする
        </Button>
      </Demo>
    </Showcase>
  );
};
