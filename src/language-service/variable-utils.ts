import { TextDocument } from 'vscode-languageserver-textdocument';
import { Position, Range, MarkupKind, CompletionItem, CompletionItemKind } from 'vscode-languageserver-types';
import { Values, Value, ValueObject } from '../types';
import { TNAME, Token } from '../parsing';
import { HoverV2 } from './language-service.types';
import { toTruncatedJsonString, valueTypeName } from './ls-utils';

type Span = { token: Token; start: number; end: number };

function isNameToken(t: Token): boolean {
  return t.type === TNAME;
}

function isDotToken(t: Token): boolean {
  return t.value === '.';
}

function findNameIndexAt(spans: Span[], offset: number): number | undefined {
  const hitIndex = spans.findIndex(s => {
    return offset >= s.start && offset <= s.end;
  });

  if (hitIndex < 0) {
    return undefined;
  }

  const token = spans[hitIndex].token;

  if (isNameToken(token)) {
    return hitIndex;
  }

  if (isDotToken(token)) {
    const right = hitIndex + 1;
    if (isNameToken(spans[right]?.token)) {
      return right;
    }

    const left = hitIndex - 1;
    if (isNameToken(spans[left]?.token)) {
      return left;
    }
  }

  return undefined;
}

/**
 * Extracts the path from a span array, starting from the center index.
 * @param spans Token spans.
 * @param cursorIndex The index of the center token.
 */
function extractPathFromSpans(
  spans: Span[],
  cursorIndex: number
): { parts: string[]; firstIndex: number } | undefined {
  if (!isNameToken(spans[cursorIndex].token)) {
    return undefined;
  }

  const leftParts: string[] = [];
  let index = cursorIndex - 1;

  while (index - 1 >= 0) {
    const dot = spans[index];
    const name = spans[index - 1];

    if (!isDotToken(dot.token) || !isNameToken(name.token)) {
      break;
    }

    leftParts.unshift(String(name.token.value));
    index -= 2;
  }

  const center = String(spans[cursorIndex].token.value);
  const parts = [...leftParts, center];

  const firstIndex = cursorIndex - leftParts.length * 2;

  return { parts, firstIndex };
}

function resolveValueAtPath(vars: Values | undefined, parts: string[]): Value | undefined {
  if (!vars) {
    return undefined;
  }

  const isPlainObject = (v: unknown): v is Record<string, unknown> => {
    return v !== null && typeof v === 'object' && !Array.isArray(v);
  };

  let node: Value = vars;

  for (const segment of parts) {
    if (!isPlainObject(node)) {
      return undefined;
    }
    if (!Object.prototype.hasOwnProperty.call(node, segment)) {
      return undefined;
    }
    node = (node as ValueObject)[segment];
  }

  return node;
}

class VarTrieNode {
  children: Record<string, VarTrieNode> = {};
  value: Value | undefined = undefined;
}

class VarTrie {
  root: VarTrieNode = new VarTrieNode();

  private static isValueObject(v: Value): v is ValueObject {
    return v !== null && typeof v === 'object' && !Array.isArray(v);
  }

  buildFromValues(vars: Record<string, unknown>): void {
    const walk = (obj: Record<string, unknown>, node: VarTrieNode) => {
      for (const key of Object.keys(obj)) {
        if (!node.children[key]) {
          node.children[key] = new VarTrieNode();
        }

        const child = node.children[key];
        const val = obj[key] as Value;
        child.value = val;

        if (VarTrie.isValueObject(val)) {
          walk(val, child);
        }
      }
    };

    walk(vars, this.root);
  }

  search(path: string[]): VarTrieNode | undefined {
    let node: VarTrieNode | undefined = this.root;

    for (const seg of path) {
      if (!node) {
        return undefined;
      }
      node = node.children[seg];
      if (!node) {
        return undefined;
      }
    }

    return node;
  }
}

/**
 * Tries to resolve a variable hover using spans.
 * @param textDocument The document containing the variable name.
 * @param position The current position of the cursor.
 * @param variables The variables to resolve the hover against.
 * @param spans The spans of the document.
 * @returns A hover with the variable name and its value, or undefined if the variable cannot be resolved.
 * @privateRemarks Resolves everything to the left of the cursor. Hovering over a variable in the middle of a path will resolve it up until that point.
 */
export function tryVariableHoverUsingSpans(
  textDocument: TextDocument,
  position: Position,
  variables: Values | undefined,
  spans: Span[]
): HoverV2 | undefined {
  if (!variables) {
    return undefined;
  }

  if (spans.length === 0) {
    return undefined;
  }

  const offset = textDocument.offsetAt(position);
  const nameIndex = findNameIndexAt(spans, offset);

  if (nameIndex == null) {
    return undefined;
  }

  const extracted = extractPathFromSpans(spans, nameIndex);

  if (!extracted) {
    return undefined;
  }

  const { parts, firstIndex } = extracted;

  if (parts.length === 0) {
    return undefined;
  }

  const leftCount = Math.max(0, Math.floor((nameIndex - firstIndex) / 2));
  const partsUpToHovered = parts.slice(0, leftCount + 1);

  const value = resolveValueAtPath(variables, partsUpToHovered);

  if (value === undefined) {
    return undefined;
  }

  const span = spans[nameIndex];
  const range: Range = {
    start: textDocument.positionAt(span.start),
    end: textDocument.positionAt(span.end)
  };

  const fullPath = partsUpToHovered.join('.');

  return {
    contents: {
      kind: MarkupKind.Markdown,
      value:
                `${fullPath}: Variable (${valueTypeName(value)})` +
                `\n\n**Value Preview**\n\n${toTruncatedJsonString(value)}`
    },
    range
  };
}

/**
 * Returns a list of completions for variables in the given path.
 * @param vars The variables to complete against.
 * @param prefix The prefix of the variable name, including the dot.
 * @param rangePartial The range of the variable name, excluding the dot. Used to replace the variable name in the completion item.
 * @returns An array of completion items.
 */
export function pathVariableCompletions(vars: Values | undefined, prefix: string, rangePartial?: Range): CompletionItem[] {
  if (!vars) {
    return [];
  }

  const trie = new VarTrie();
  trie.buildFromValues(vars as Record<string, unknown>);

  const lastDot = prefix.lastIndexOf('.');
  const endsWithDot = prefix.endsWith('.');

  const basePath = endsWithDot
    ? prefix.slice(0, -1)
    : lastDot >= 0
      ? prefix.slice(0, lastDot)
      : '';

  const baseParts = basePath ? basePath.split('.') : [];
  const partial = endsWithDot ? '' : prefix.slice(lastDot + 1);
  const lowerPartial = partial.toLowerCase();

  const baseNode = trie.search(baseParts);
  if (!baseNode) {
    return [];
  }

  const items: CompletionItem[] = [];

  for (const key of Object.keys(baseNode.children)) {
    if (partial && !key.toLowerCase().startsWith(lowerPartial)) {
      continue;
    }

    const child = baseNode.children[key];
    const label = [...baseParts, key].join('.');
    const detail = child.value !== undefined ? valueTypeName(child.value) : 'object';

    items.push({
      label,
      kind: CompletionItemKind.Variable,
      detail,
      insertText: key,
      textEdit: rangePartial ? { range: rangePartial, newText: key } : undefined
    });
  }

  return items;
}
