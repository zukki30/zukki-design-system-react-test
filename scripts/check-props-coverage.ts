/**
 * zukki-design-system が宣言している props を、このリポジトリが全部使えているかを検証する。
 *
 * install 済みの `dist/main.d.ts` から export されている `〜Props` 型を読み、
 * 型リテラルで宣言されているメンバー（＝デザインシステム自身の props）を集める。
 * ネイティブ属性の交差部分（`Omit<ComponentPropsWithRef<'button'>, …>` など）は
 * 数が発散するうえ利用側の関心でもないため、意図的に対象外にしている。
 *
 * 使い方: pnpm check:props
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

import ts from 'typescript';

const PACKAGE_NAME = 'zukki-design-system';
const ENTRY = resolve('node_modules', PACKAGE_NAME, 'dist/main.d.ts');
const SRC_DIR = resolve('src');

/**
 * compound components のルート。`CardTitleProps` → `Card.Title` のように、
 * 型名から JSX のタグ名へ変換するときに使う
 */
const COMPOUND_ROOTS = ['FormField', 'Dialog', 'Steps', 'Card'];

/**
 * コンポーネントではない型。props ではなくオブジェクトとして渡すため、
 * JSX の属性ではなくオブジェクトリテラルのキーとして使われているかを見る
 */
const OBJECT_TYPES = ['BreadcrumbItem'];

type Coverage = {
  /** 型名（BreadcrumbProps など） */
  typeName: string;
  /** JSX のタグ名（Card.Title など）。オブジェクト型のときは型名のまま */
  target: string;
  declared: string[];
  used: string[];
  missing: string[];
};

// ---------------------------------------------------------------- d.ts 側

const memberName = (name: ts.PropertyName): string | undefined => {
  if (ts.isIdentifier(name) || ts.isStringLiteral(name)) {
    return name.text;
  }

  return undefined;
};

/**
 * 型リテラルで直接宣言されているメンバー名を集める。
 * 交差型は型リテラルの部分だけを見る（ネイティブ属性側には降りない）
 */
const collectDeclaredProps = (node: ts.TypeNode, found: Set<string>): void => {
  if (ts.isParenthesizedTypeNode(node)) {
    collectDeclaredProps(node.type, found);
    return;
  }

  if (ts.isIntersectionTypeNode(node)) {
    for (const type of node.types) {
      collectDeclaredProps(type, found);
    }
    return;
  }

  if (!ts.isTypeLiteralNode(node)) {
    return;
  }

  for (const member of node.members) {
    if (!ts.isPropertySignature(member) && !ts.isMethodSignature(member)) {
      continue;
    }

    const name = memberName(member.name);
    if (name !== undefined) {
      found.add(name);
    }
  }
};

/**
 * `ButtonProps` → `Button`、`CardTitleProps` → `Card.Title`
 */
const toTagName = (typeName: string): string => {
  const base = typeName.replace(/Props$/, '');
  const root = COMPOUND_ROOTS.find((name) => base.startsWith(name) && base.length > name.length);

  return root === undefined ? base : `${root}.${base.slice(root.length)}`;
};

const readDeclaredProps = () => {
  const program = ts.createProgram([ENTRY], {
    target: ts.ScriptTarget.ESNext,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    jsx: ts.JsxEmit.ReactJSX,
    skipLibCheck: true,
    noEmit: true,
  });

  const checker = program.getTypeChecker();
  const entrySource = program.getSourceFile(ENTRY);
  if (entrySource === undefined) {
    throw new Error(`${PACKAGE_NAME} が install されていない（${ENTRY} が読めない）`);
  }

  const moduleSymbol = checker.getSymbolAtLocation(entrySource);
  if (moduleSymbol === undefined) {
    throw new Error(`${ENTRY} からモジュールの symbol を取得できなかった`);
  }

  const exportedNames: string[] = [];
  const declared = new Map<string, Set<string>>();

  for (const exportSymbol of checker.getExportsOfModule(moduleSymbol)) {
    exportedNames.push(exportSymbol.name);

    const isTarget =
      exportSymbol.name.endsWith('Props') || OBJECT_TYPES.includes(exportSymbol.name);
    if (!isTarget) {
      continue;
    }

    const symbol =
      (exportSymbol.flags & ts.SymbolFlags.Alias) !== 0
        ? checker.getAliasedSymbol(exportSymbol)
        : exportSymbol;

    const declaration = symbol.declarations?.find(ts.isTypeAliasDeclaration);
    if (declaration === undefined) {
      continue;
    }

    const props = new Set<string>();
    collectDeclaredProps(declaration.type, props);

    if (props.size > 0) {
      declared.set(exportSymbol.name, props);
    }
  }

  return { declared, exportedNames };
};

// ------------------------------------------------------------------ src 側

const listSourceFiles = (dir: string): string[] =>
  readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);

    if (statSync(path).isDirectory()) {
      return listSourceFiles(path);
    }

    return path.endsWith('.tsx') || path.endsWith('.ts') ? [path] : [];
  });

const jsxTagName = (node: ts.JsxOpeningElement | ts.JsxSelfClosingElement): string =>
  node.tagName.getText();

const hasMeaningfulChildren = (node: ts.JsxElement): boolean =>
  node.children.some((child) => !ts.isJsxText(child) || child.text.trim() !== '');

/**
 * `const SubmitButton = (props) => <Button {...props} type="submit" />` のような
 * 薄いラッパーを辿れるよう、ローカル名 → 返している JSX のタグ名を集める
 */
const collectAliases = (source: ts.SourceFile, aliases: Map<string, string>): void => {
  const rootTag = (node: ts.Node): string | undefined => {
    if (ts.isParenthesizedExpression(node)) {
      return rootTag(node.expression);
    }
    if (ts.isJsxSelfClosingElement(node)) {
      return jsxTagName(node);
    }
    if (ts.isJsxElement(node)) {
      return jsxTagName(node.openingElement);
    }

    return undefined;
  };

  const visit = (node: ts.Node): void => {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.initializer) {
      const initializer = node.initializer;

      if (ts.isArrowFunction(initializer)) {
        const tag = rootTag(initializer.body);

        if (tag !== undefined) {
          aliases.set(node.name.text, tag);
        }
      }
    }

    ts.forEachChild(node, visit);
  };

  visit(source);
};

type Usage = {
  /** タグ名 → 使われた属性名 */
  attributes: Map<string, Set<string>>;
  /** オブジェクトリテラルで使われたキー名 */
  objectKeys: Set<string>;
  /** import されている識別子 */
  imported: Set<string>;
};

const collectUsage = (sources: ts.SourceFile[], aliases: Map<string, string>): Usage => {
  const attributes = new Map<string, Set<string>>();
  const objectKeys = new Set<string>();
  const imported = new Set<string>();

  /** ラッパーを辿って最終的な JSX タグ名を返す（循環は打ち切る） */
  const resolveTag = (tag: string): string => {
    const seen = new Set<string>();
    let current = tag;

    while (aliases.has(current) && !seen.has(current)) {
      seen.add(current);
      current = aliases.get(current) as string;
    }

    return current;
  };

  const addAttribute = (tag: string, name: string): void => {
    const resolved = resolveTag(tag);
    const names = attributes.get(resolved) ?? new Set<string>();

    names.add(name);
    attributes.set(resolved, names);
  };

  const visitAttributes = (node: ts.JsxOpeningElement | ts.JsxSelfClosingElement): void => {
    const tag = jsxTagName(node);

    for (const attribute of node.attributes.properties) {
      if (ts.isJsxAttribute(attribute)) {
        addAttribute(tag, attribute.name.getText());
      }
    }
  };

  for (const source of sources) {
    const visit = (node: ts.Node): void => {
      if (ts.isImportDeclaration(node) && node.importClause?.namedBindings) {
        const bindings = node.importClause.namedBindings;

        if (ts.isNamedImports(bindings)) {
          for (const element of bindings.elements) {
            imported.add((element.propertyName ?? element.name).text);
          }
        }
      }

      if (ts.isJsxSelfClosingElement(node)) {
        visitAttributes(node);
      }

      if (ts.isJsxElement(node)) {
        visitAttributes(node.openingElement);

        // JSX の子要素は children prop を渡していることと同じ
        if (hasMeaningfulChildren(node)) {
          addAttribute(jsxTagName(node.openingElement), 'children');
        }
      }

      if (ts.isObjectLiteralExpression(node)) {
        for (const property of node.properties) {
          if (
            (ts.isPropertyAssignment(property) || ts.isShorthandPropertyAssignment(property)) &&
            ts.isIdentifier(property.name)
          ) {
            objectKeys.add(property.name.text);
          }
        }
      }

      ts.forEachChild(node, visit);
    };

    visit(source);
  }

  return { attributes, objectKeys, imported };
};

// ---------------------------------------------------------------------- 実行

const { declared, exportedNames } = readDeclaredProps();

const sourcePaths = listSourceFiles(SRC_DIR);
const sources = sourcePaths.map((path) =>
  ts.createSourceFile(path, readFileSync(path, 'utf8'), ts.ScriptTarget.ESNext, true, ts.ScriptKind.TSX)
);

const aliases = new Map<string, string>();
for (const source of sources) {
  collectAliases(source, aliases);
}

const usage = collectUsage(sources, aliases);

const coverages: Coverage[] = [...declared.entries()]
  .map(([typeName, props]) => {
    const isObjectType = OBJECT_TYPES.includes(typeName);
    const target = isObjectType ? typeName : toTagName(typeName);
    const used = isObjectType ? usage.objectKeys : (usage.attributes.get(target) ?? new Set());

    const declaredProps = [...props].sort();

    return {
      typeName,
      target,
      declared: declaredProps,
      used: declaredProps.filter((prop) => used.has(prop)),
      missing: declaredProps.filter((prop) => !used.has(prop)),
    };
  })
  .sort((a, b) => a.typeName.localeCompare(b.typeName));

const unusedExports = exportedNames
  .filter((name) => !usage.imported.has(name))
  .sort((a, b) => a.localeCompare(b));

console.log(`${PACKAGE_NAME} の props 利用状況（対象: ${relative(process.cwd(), SRC_DIR)}）\n`);

const nameWidth = Math.max(...coverages.map((coverage) => coverage.target.length));

for (const coverage of coverages) {
  const mark = coverage.missing.length === 0 ? '✓' : '✗';
  const ratio = `${coverage.used.length}/${coverage.declared.length}`;
  const detail = coverage.missing.length === 0 ? '' : `  未使用: ${coverage.missing.join(', ')}`;

  console.log(`  ${mark} ${coverage.target.padEnd(nameWidth)}  ${ratio.padStart(5)}${detail}`);
}

const totalDeclared = coverages.reduce((sum, coverage) => sum + coverage.declared.length, 0);
const totalUsed = coverages.reduce((sum, coverage) => sum + coverage.used.length, 0);

console.log(`\n  合計: ${totalUsed}/${totalDeclared} props`);
console.log(`  export の参照: ${exportedNames.length - unusedExports.length}/${exportedNames.length}`);

if (unusedExports.length > 0) {
  console.log(`  未参照の export: ${unusedExports.join(', ')}`);
}

const failed = totalUsed !== totalDeclared || unusedExports.length > 0;

if (failed) {
  console.error('\n使われていない props / export がある');
  process.exit(1);
}

console.log('\nすべての props と export を利用している');
