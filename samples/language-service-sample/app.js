// Theme management
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;
let monacoReady = false;

function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getStoredTheme() {
    return localStorage.getItem('expr-eval-theme');
}

function setTheme(theme) {
    if (theme === 'dark') {
        html.classList.add('dark');
    } else {
        html.classList.remove('dark');
    }
    localStorage.setItem('expr-eval-theme', theme);
    if (monacoReady) {
        updateMonacoTheme();
    }
}

function initTheme() {
    const stored = getStoredTheme();
    const theme = stored || getSystemTheme();
    setTheme(theme);
}

themeToggle.addEventListener('click', () => {
    const isDark = html.classList.contains('dark');
    setTheme(isDark ? 'light' : 'dark');
});

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!getStoredTheme()) {
        setTheme(e.matches ? 'dark' : 'light');
    }
});

initTheme();

// Render examples sidebar
function renderExamplesSidebar() {
    const examplesList = document.getElementById('examplesList');
    if (!examplesList) return;

    examplesList.innerHTML = exampleCases.map(example => `
        <button 
            class="example-item w-full text-left p-3 rounded-lg transition-all duration-200
                   hover:bg-white dark:hover:bg-[#2d2d2d] 
                   hover:shadow-sm hover:border-indigo-200 dark:hover:border-[#3c3c3c]
                   border border-transparent
                   group"
            data-example-id="${example.id}"
        >
            <div class="flex items-start gap-2">
                <div class="flex-shrink-0 w-6 h-6 rounded bg-indigo-100 dark:bg-[#3c3c3c] flex items-center justify-center mt-0.5">
                    <svg class="w-3.5 h-3.5 text-indigo-600 dark:text-[#569cd6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-800 dark:text-[#cccccc] truncate group-hover:text-indigo-600 dark:group-hover:text-[#569cd6]">
                        ${example.title}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-[#808080] mt-0.5 line-clamp-2">
                        ${example.description}
                    </p>
                </div>
            </div>
        </button>
    `).join('');

    // Add click handlers
    examplesList.querySelectorAll('.example-item').forEach(button => {
        button.addEventListener('click', () => {
            const exampleId = button.dataset.exampleId;
            const example = exampleCases.find(e => e.id === exampleId);
            if (example) {
                loadExample(example);
            }
        });
    });
}

// Load example into editors
function loadExample(example) {
    if (typeof expressionEditor !== 'undefined' && expressionEditor) {
        expressionEditor.getModel().setValue(example.expression);
    }
    if (typeof contextEditor !== 'undefined' && contextEditor) {
        contextEditor.getModel().setValue(JSON.stringify(example.context, null, 2));
    }
}

// Initialize sidebar
renderExamplesSidebar();

// Get example ID from URL query parameter
function getExampleFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('example');
}

// Load example from URL if present (called after Monaco initializes)
function loadExampleFromUrl() {
    const exampleId = getExampleFromUrl();
    if (exampleId) {
        const example = exampleCases.find(e => e.id === exampleId);
        if (example) {
            loadExample(example);
            return true;
        }
    }
    return false;
}

// Split pane resizing
(function() {
    const resizer = document.getElementById('resizer');
    const leftPane = document.getElementById('leftPane');
    const rightPane = document.getElementById('rightPane');
    const mainContent = document.getElementById('mainContent');
    let isResizing = false;

    resizer.addEventListener('mousedown', (e) => {
        e.preventDefault();
        isResizing = true;
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;
        e.preventDefault();
        
        const containerRect = mainContent.getBoundingClientRect();
        const containerWidth = containerRect.width;
        const resizerWidth = 6;
        
        let newLeftWidth = e.clientX - containerRect.left;
        newLeftWidth = Math.max(containerWidth * 0.15, Math.min(containerWidth * 0.85, newLeftWidth));
        
        leftPane.style.width = newLeftWidth + 'px';
        rightPane.style.width = (containerWidth - newLeftWidth - resizerWidth) + 'px';
    });

    document.addEventListener('mouseup', () => {
        if (isResizing) {
            isResizing = false;
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        }
    });
})();

// Monaco configuration and initialization
require.config({paths: {'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.49.0/min/vs'}});

let expressionEditor, contextEditor;

function updateMonacoTheme() {
    const theme = html.classList.contains('dark') ? 'vs-dark' : 'vs';
    monaco.editor.setTheme(theme);
}

require(['vs/editor/editor.main'], function () {
    monacoReady = true;
    
    const languageId = 'expr-eval';
    monaco.languages.register({id: languageId});

    // Set initial theme
    const currentTheme = html.classList.contains('dark') ? 'vs-dark' : 'vs';

    // Default values - showcasing nested path access and deeper objects
    const defaultExpression = 'user.profile.score + config.timeout / 1000';
    const defaultContext = JSON.stringify({
        x: 42,
        y: 100,
        multiplier: 2,
        user: {
            name: "Ada",
            profile: {
                email: "ada@example.com",
                score: 95,
                level: 5
            },
            preferences: {
                theme: "dark",
                notifications: true
            }
        },
        config: {
            timeout: 5000,
            retries: 3,
            maxConnections: 10
        },
        items: [1, 2, 3, 4, 5]
    }, null, 2);

    // Load from localStorage or use defaults
    const savedExpression = localStorage.getItem('expr-eval-expression') || defaultExpression;
    const savedContext = localStorage.getItem('expr-eval-context') || defaultContext;

    // Create context editor (JSON)
    const contextModel = monaco.editor.createModel(savedContext, 'json');
    contextEditor = monaco.editor.create(document.getElementById('contextEditor'), {
        model: contextModel,
        theme: currentTheme,
        automaticLayout: true,
        fontSize: 14,
        minimap: {enabled: false},
        lineNumbers: 'on',
        scrollBeyondLastLine: false,
        wordWrap: 'on',
        tabSize: 2
    });

    // Create expression editor
    const expressionModel = monaco.editor.createModel(savedExpression, languageId);
    expressionEditor = monaco.editor.create(document.getElementById('expressionEditor'), {
        model: expressionModel,
        theme: currentTheme,
        automaticLayout: true,
        fontSize: 14,
        minimap: {enabled: false},
        lineNumbers: 'on',
        scrollBeyondLastLine: false,
        wordWrap: 'on'
    });

    // Access expr-eval UMD
    const {createLanguageService, Parser} = window.exprEval || {};
    if (!createLanguageService) {
        console.error('expr-eval not found. Make sure /dist/bundle.js is built.');
        showError({message: 'expr-eval library not loaded. Please run: npm run build'}, null);
        return;
    }

    const ls = createLanguageService();

    // Minimal lsp text document backed by Monaco model
    function makeTextDocument(m) {
        return {
            uri: m.uri.toString(),
            getText: () => m.getValue(),
            positionAt: (offset) => {
                const p = m.getPositionAt(offset);
                return {line: p.lineNumber - 1, character: p.column - 1};
            },
            offsetAt: (pos) => m.getOffsetAt(new monaco.Position(pos.line + 1, pos.character + 1))
        };
    }

    function toLspPosition(mp) {
        return {line: mp.lineNumber - 1, character: mp.column - 1};
    }

    function fromLspPosition(lp) {
        return new monaco.Position(lp.line + 1, lp.character + 1);
    }

    // Get context variables from JSON editor
    function getContextVariables() {
        try {
            const contextText = contextModel.getValue().trim();
            if (!contextText) return {};
            return JSON.parse(contextText);
        } catch (e) {
            return null; // Invalid JSON
        }
    }

    // Completions provider with trigger characters and snippet support
    monaco.languages.registerCompletionItemProvider(languageId, {
        triggerCharacters: ['.'],
        provideCompletionItems: function (model, position) {
            const doc = makeTextDocument(model);
            const variables = getContextVariables() || {};
            const items = ls.getCompletions({
                textDocument: doc,
                position: toLspPosition(position),
                variables
            }) || [];

            function mapKind(k) {
                const map = {
                    3: monaco.languages.CompletionItemKind.Function,
                    6: monaco.languages.CompletionItemKind.Variable,
                    21: monaco.languages.CompletionItemKind.Constant,
                    14: monaco.languages.CompletionItemKind.Keyword
                };
                return map[k] || monaco.languages.CompletionItemKind.Text;
            }

            const suggestions = items.map(it => {
                // Handle textEdit.range if present
                let range;
                if (it.textEdit?.range) {
                    range = new monaco.Range(
                        it.textEdit.range.start.line + 1,
                        it.textEdit.range.start.character + 1,
                        it.textEdit.range.end.line + 1,
                        it.textEdit.range.end.character + 1
                    );
                } else {
                    // Default range - word at position
                    const word = model.getWordUntilPosition(position);
                    range = new monaco.Range(position.lineNumber, word.startColumn, position.lineNumber, word.endColumn);
                }

                return {
                    label: it.label,
                    kind: mapKind(it.kind),
                    detail: it.detail,
                    documentation: it.documentation,
                    insertText: it.textEdit?.newText || it.insertText || it.label,
                    // Add snippet support when insertTextFormat is 2
                    insertTextRules: it.insertTextFormat === 2 
                        ? monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet 
                        : undefined,
                    range
                };
            });

            return {suggestions};
        }
    });

    // Hover provider with MarkupContent support
    monaco.languages.registerHoverProvider(languageId, {
        provideHover: function (model, position) {
            const doc = makeTextDocument(model);
            const variables = getContextVariables() || {};
            const hover = ls.getHover({textDocument: doc, position: toLspPosition(position), variables});
            if (!hover || !hover.contents) return {contents: []};

            // HoverV2 always returns MarkupContent format
            let contents = [];
            if (hover.contents && hover.contents.value) {
                contents = [{value: hover.contents.value}];
            }

            let range = undefined;
            if (hover.range) {
                const start = fromLspPosition(hover.range.start);
                const end = fromLspPosition(hover.range.end);
                range = new monaco.Range(start.lineNumber, start.column, end.lineNumber, end.column);
            }
            return {contents, range};
        }
    });

    // Syntax highlighting
    let highlightDecorations = [];
    
    function applyHighlighting() {
        const doc = makeTextDocument(expressionModel);
        const tokens = ls.getHighlighting(doc);
        const decorations = tokens.map(t => {
            const start = expressionModel.getPositionAt(t.start);
            const end = expressionModel.getPositionAt(t.end);
            return {
                range: new monaco.Range(start.lineNumber, start.column, end.lineNumber, end.column),
                options: { inlineClassName: 'tok-' + t.type }
            };
        });

        // deltaDecorations replaces old decorations with new ones atomically
        highlightDecorations = expressionEditor.deltaDecorations(highlightDecorations, decorations);
    }

    // Result display functions
    function showResult(result) {
        const resultSuccess = document.getElementById('resultSuccess');
        const resultError = document.getElementById('resultError');
        const resultEmpty = document.getElementById('resultEmpty');
        const resultValue = document.getElementById('resultValue');
        const resultType = document.getElementById('resultType');

        resultSuccess.classList.remove('hidden');
        resultError.classList.add('hidden');
        resultEmpty.classList.add('hidden');

        // Format the result
        let displayValue;
        let typeInfo;
        if (result === null) {
            displayValue = 'null';
            typeInfo = 'Type: null';
        } else if (result === undefined) {
            displayValue = 'undefined';
            typeInfo = 'Type: undefined';
        } else if (typeof result === 'object') {
            displayValue = JSON.stringify(result, null, 2);
            typeInfo = Array.isArray(result) ? `Type: array (${result.length} items)` : 'Type: object';
        } else {
            displayValue = String(result);
            typeInfo = `Type: ${typeof result}`;
        }

        resultValue.textContent = displayValue;
        resultType.textContent = typeInfo;
    }

    function showError(error, contextError) {
        const resultSuccess = document.getElementById('resultSuccess');
        const resultError = document.getElementById('resultError');
        const resultEmpty = document.getElementById('resultEmpty');
        const errorMessage = document.getElementById('errorMessage');
        const errorDetails = document.getElementById('errorDetails');
        const footer = document.getElementById('footer');

        resultSuccess.classList.add('hidden');
        resultError.classList.remove('hidden');
        resultEmpty.classList.add('hidden');

        // Shake animation
        footer.classList.add('error-shake');
        setTimeout(() => footer.classList.remove('error-shake'), 300);

        errorMessage.textContent = error.message;

        // Build helpful error details
        let details = [];

        if (contextError) {
            details.push(`<div class="p-2 bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-200 dark:border-amber-800">
                <p class="font-medium text-amber-700 dark:text-amber-400">⚠️ JSON Context Error</p>
                <p class="text-amber-600 dark:text-amber-300 text-sm mt-1">${contextError}</p>
            </div>`);
        }

        // Parse error for more context
        const undefinedMatch = error.message.match(/undefined variable[:\s]*(\w+)/i);
        if (undefinedMatch) {
            const varName = undefinedMatch[1];
            const contextVars = getContextVariables();
            const availableVars = contextVars ? Object.keys(contextVars) : [];
            details.push(`<div class="p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                <p class="font-medium text-blue-700 dark:text-blue-400">💡 Suggestion</p>
                <p class="text-blue-600 dark:text-blue-300 text-sm mt-1">The variable <code class="bg-blue-100 dark:bg-blue-800 px-1 rounded">${varName}</code> is not defined in your context.</p>
                ${availableVars.length > 0 ?
                    `<p class="text-blue-600 dark:text-blue-300 text-sm mt-1">Available variables: <code class="bg-blue-100 dark:bg-blue-800 px-1 rounded">${availableVars.join('</code>, <code class="bg-blue-100 dark:bg-blue-800 px-1 rounded">')}</code></p>` :
                    '<p class="text-blue-600 dark:text-blue-300 text-sm mt-1">Add variables to the JSON context on the left.</p>'}
            </div>`);
        }

        const syntaxMatch = error.message.match(/parse error|unexpected|expected/i);
        if (syntaxMatch) {
            details.push(`<div class="p-2 bg-purple-50 dark:bg-purple-900/20 rounded border border-purple-200 dark:border-purple-800">
                <p class="font-medium text-purple-700 dark:text-purple-400">🔍 Syntax Help</p>
                <p class="text-purple-600 dark:text-purple-300 text-sm mt-1">Check for missing parentheses, brackets, or operators.</p>
            </div>`);
        }

        if (error.message.includes('is not a function')) {
            details.push(`<div class="p-2 bg-orange-50 dark:bg-orange-900/20 rounded border border-orange-200 dark:border-orange-800">
                <p class="font-medium text-orange-700 dark:text-orange-400">📚 Function Help</p>
                <p class="text-orange-600 dark:text-orange-300 text-sm mt-1">Make sure you're using a valid built-in function. Try <code class="bg-orange-100 dark:bg-orange-800 px-1 rounded">sum</code>, <code class="bg-orange-100 dark:bg-orange-800 px-1 rounded">max</code>, <code class="bg-orange-100 dark:bg-orange-800 px-1 rounded">min</code>, <code class="bg-orange-100 dark:bg-orange-800 px-1 rounded">abs</code>, etc.</p>
            </div>`);
        }

        errorDetails.innerHTML = details.join('');
    }

    function showEmpty() {
        document.getElementById('resultSuccess').classList.add('hidden');
        document.getElementById('resultError').classList.add('hidden');
        document.getElementById('resultEmpty').classList.remove('hidden');
    }

    // Evaluation function
    function evaluate() {
        const expression = expressionModel.getValue().trim();

        if (!expression) {
            showEmpty();
            return;
        }

        const contextVars = getContextVariables();
        let contextError = null;

        if (contextVars === null) {
            contextError = 'Invalid JSON in context editor. Please fix the JSON syntax.';
        }

        try {
            const parser = new Parser();
            const evaluationResult = parser.evaluate(expression, contextVars || {});
            showResult(evaluationResult);
        } catch (error) {
            showError(error, contextError);
        }
    }

    // Save functionality
    document.getElementById('saveBtn').addEventListener('click', () => {
        localStorage.setItem('expr-eval-expression', expressionModel.getValue());
        localStorage.setItem('expr-eval-context', contextModel.getValue());

        // Show toast
        const toast = document.getElementById('saveToast');
        toast.classList.remove('translate-y-20', 'opacity-0');
        setTimeout(() => {
            toast.classList.add('translate-y-20', 'opacity-0');
        }, 2000);
    });

    // Initialize
    applyHighlighting();
    evaluate();

    // Load example from URL query parameter if present
    loadExampleFromUrl();

    // Event listeners for changes
    expressionModel.onDidChangeContent(() => {
        applyHighlighting();
        evaluate();
    });

    contextModel.onDidChangeContent(() => {
        evaluate();
    });
});
