import { Value, ValueObject } from '../types';

export class VarTrieNode {
    children: Record<string, VarTrieNode> = {};
    value: Value | undefined = undefined;
}

export class VarTrie {
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
                const val = (obj as any)[key];
                child.value = val as Value;
                if (VarTrie.isValueObject(val as Value)) {
                    walk(val as Record<string, unknown>, child);
                }
            }
        };
        walk(vars as Record<string, unknown>, this.root);
    }

    search(path: string[]): VarTrieNode | undefined {
        let node: VarTrieNode | undefined = this.root;
        for (const seg of path) {
            node = node?.children[seg];
            if (!node) return undefined;
        }
        return node;
    }
}
