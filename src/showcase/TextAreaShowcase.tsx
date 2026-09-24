import { useState } from 'react';
import { TextArea, type TextAreaProps, type TextAreaSize } from 'zukki-design-system';

import { Demo, Showcase } from './Showcase';

const SIZES: TextAreaSize[] = ['sm', 'md'];

const MAX_LENGTH = 140;

/** 行数を固定したラッパー */
const CommentTextArea = (props: Omit<TextAreaProps, 'rows'>) => <TextArea {...props} rows={5} />;

export const TextAreaShowcase = () => {
  const [comment, setComment] = useState('');

  return (
    <Showcase
      id="textarea"
      title="TextArea"
      summary={
        <>
          複数行のテキスト入力。<code>error</code> / <code>disabled</code> /{' '}
          <code>size</code> は未指定なら FormField から引き継ぐ。
        </>
      }
    >
      <Demo label="size" layout="column">
        {SIZES.map((size) => (
          <TextArea key={size} size={size} rows={3} defaultValue={`size = ${size}`} />
        ))}
      </Demo>

      <Demo label="error" layout="column">
        <TextArea error rows={3} defaultValue="文字数が足りません" />
        <TextArea error size="sm" rows={2} placeholder="sm でエラー" />
      </Demo>

      <Demo label="disabled" layout="column">
        <TextArea disabled rows={3} defaultValue="編集できない" />
        <TextArea disabled size="sm" rows={2} placeholder="sm で無効" />
      </Demo>

      <Demo
        label="textarea のネイティブ属性（rows / value / onChange / maxLength / placeholder …）"
        hint={`${comment.length} / ${MAX_LENGTH} 文字`}
        layout="column"
      >
        <CommentTextArea
          name="comment"
          value={comment}
          maxLength={MAX_LENGTH}
          placeholder="感想を書く"
          required
          onChange={(event) => setComment(event.target.value)}
        />
        <TextArea readOnly rows={2} defaultValue="読み取り専用" />
        <TextArea rows={2} defaultValue="リサイズを止めた" style={{ resize: 'none' }} />
      </Demo>
    </Showcase>
  );
};
