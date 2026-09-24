/**
 * zukki-design-system を最新リリースへ追従させる。
 *
 * npm に publish されていないため、依存は GitHub のリリースタグを指している。
 * 「最新を使う」を手作業の記憶に頼らず、Releases API から最新タグを取って
 * package.json の指定と突き合わせる。
 *
 * 使い方:
 *   pnpm ds:check   … 最新かどうかを確認するだけ（古ければ exit 1）
 *   pnpm ds:update  … 最新タグを install し直す
 */
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const PACKAGE_NAME = 'zukki-design-system';
const REPOSITORY = 'zukki30/zukki-design-system-react';
const SPEC_PREFIX = `github:${REPOSITORY}#`;

const checkOnly = process.argv.includes('--check');

type Release = { tag_name: string; draft: boolean; prerelease: boolean };

/**
 * `v3.0.0` → `[3, 0, 0]`。数字以外が混ざるタグは後ろへ落とす
 */
const toVersionParts = (tag: string): number[] =>
  tag
    .replace(/^v/, '')
    .split('.')
    .map((part) => Number.parseInt(part, 10))
    .map((value) => (Number.isNaN(value) ? -1 : value));

const compareTags = (a: string, b: string): number => {
  const left = toVersionParts(a);
  const right = toVersionParts(b);
  const length = Math.max(left.length, right.length);

  for (let index = 0; index < length; index += 1) {
    const diff = (left[index] ?? 0) - (right[index] ?? 0);

    if (diff !== 0) {
      return diff;
    }
  }

  return 0;
};

const fetchLatestTag = async (): Promise<string> => {
  const response = await fetch(`https://api.github.com/repos/${REPOSITORY}/releases`, {
    headers: { Accept: 'application/vnd.github+json' },
  });

  if (!response.ok) {
    throw new Error(`Releases API が ${response.status} を返した`);
  }

  const releases = (await response.json()) as Release[];
  const tags = releases
    .filter((release) => !release.draft && !release.prerelease)
    .map((release) => release.tag_name);

  if (tags.length === 0) {
    throw new Error('リリースが 1 件も見つからなかった');
  }

  return tags.sort(compareTags).at(-1) as string;
};

const readCurrentSpec = (): string => {
  const manifest = JSON.parse(readFileSync(resolve('package.json'), 'utf8')) as {
    dependencies?: Record<string, string>;
  };
  const spec = manifest.dependencies?.[PACKAGE_NAME];

  if (spec === undefined) {
    throw new Error(`package.json の dependencies に ${PACKAGE_NAME} がない`);
  }

  return spec;
};

const latestTag = await fetchLatestTag();
const currentSpec = readCurrentSpec();
const currentTag = currentSpec.startsWith(SPEC_PREFIX)
  ? currentSpec.slice(SPEC_PREFIX.length)
  : null;

console.log(`  最新リリース : ${latestTag}`);
console.log(`  現在の指定   : ${currentSpec}`);

if (currentTag === latestTag) {
  console.log('\n最新のバージョンを使っている');
  process.exit(0);
}

if (checkOnly) {
  console.error(`\n最新ではない。pnpm ds:update で ${latestTag} へ更新する`);
  process.exit(1);
}

const nextSpec = `${SPEC_PREFIX}${latestTag}`;
console.log(`\n${nextSpec} を install する`);

execFileSync('pnpm', ['add', nextSpec], { stdio: 'inherit' });

console.log(`\n${latestTag} へ更新した。pnpm check:props で props の網羅を確認する`);
