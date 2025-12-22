import { Values } from '../types';
import { CompletionItem, CompletionItemKind, Range } from 'vscode-languageserver-types';
import { VarTrie } from './var-trie';
import { valueTypeName } from './ls-utils';

export function pathVariableCompletions(vars: Values | undefined, prefix: string, rangePartial?: Range): CompletionItem[] {
    if (!vars) return [];

    const trie = new VarTrie();
    trie.buildFromValues(vars as Record<string, unknown>);

    const lastDot = prefix.lastIndexOf('.');
    const endsWithDot = lastDot === prefix.length - 1;

    const baseParts = (endsWithDot ? prefix.slice(0, -1) : lastDot >= 0 ? prefix.slice(0, lastDot) : '')
        .split('.')
        .filter(Boolean);

    const partial = endsWithDot ? '' : prefix.slice(lastDot + 1);
    const lowerPartial = partial.toLowerCase();

    const baseNode = trie.search(baseParts);
    if (!baseNode) return [];

    return Object.entries(baseNode.children)
        .filter(([k]) => !partial || k.toLowerCase().startsWith(lowerPartial))
        .map(([key, child]) => ({
            label: (baseParts.length ? baseParts.concat(key) : [key]).join('.'),
            kind: CompletionItemKind.Variable,
            detail: child.value !== undefined ? valueTypeName(child.value) : 'object',
            insertText: key,
            textEdit: rangePartial ? { range: rangePartial, newText: key } : undefined,
            documentation: undefined,
        } as CompletionItem));
}
