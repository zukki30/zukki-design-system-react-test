import { useState } from 'react';
import { Select, type SelectProps, type SelectSize } from 'zukki-design-system';

import { Demo, Showcase } from './Showcase';

const SIZES: SelectSize[] = ['sm', 'md'];

const PREFECTURES = ['東京都', '大阪府', '福岡県', '北海道'];

/** 選択肢を固定したラッパー */
const PrefectureSelect = (props: Omit<SelectProps, 'children'>) => (
  <Select {...props}>
    {PREFECTURES.map((prefecture) => (
      <option key={prefecture} value={prefecture}>
        {prefecture}
      </option>
    ))}
  </Select>
);

export const SelectShowcase = () => {
  const [prefecture, setPrefecture] = useState('');

  return (
    <Showcase
      id="select"
      title="Select"
      summary={
        <>
          ドロップダウンの選択。<code>children</code> に <code>option</code> を並べる。
        </>
      }
    >
      <Demo
        label="placeholder / children"
        hint="未制御かつ初期値なしのときは placeholder が初期選択になる。"
        layout="column"
      >
        <PrefectureSelect placeholder="都道府県を選ぶ" />
        <Select defaultValue="大阪府">
          {PREFECTURES.map((prefecture) => (
            <option key={prefecture} value={prefecture}>
              {prefecture}
            </option>
          ))}
        </Select>
      </Demo>

      <Demo label="size" layout="column">
        {SIZES.map((size) => (
          <PrefectureSelect key={size} size={size} placeholder={`size = ${size}`} />
        ))}
      </Demo>

      <Demo label="error" layout="column">
        <PrefectureSelect error placeholder="選択してください" />
        <PrefectureSelect error size="sm" defaultValue="福岡県" />
      </Demo>

      <Demo label="disabled" layout="column">
        <PrefectureSelect disabled placeholder="選べない" />
        <PrefectureSelect disabled size="sm" defaultValue="北海道" />
      </Demo>

      <Demo
        label="select のネイティブ属性（value / onChange / name / required / optgroup …）"
        hint={prefecture === '' ? '未選択' : `選択中: ${prefecture}`}
        layout="column"
      >
        <Select
          name="prefecture"
          value={prefecture}
          placeholder="都道府県を選ぶ"
          required
          autoComplete="address-level1"
          onChange={(event) => setPrefecture(event.target.value)}
        >
          <optgroup label="関東">
            <option value="東京都">東京都</option>
          </optgroup>
          <optgroup label="関西">
            <option value="大阪府">大阪府</option>
          </optgroup>
          <optgroup label="その他">
            <option value="福岡県">福岡県</option>
            <option value="北海道" disabled>
              北海道（選べない）
            </option>
          </optgroup>
        </Select>
      </Demo>
    </Showcase>
  );
};
