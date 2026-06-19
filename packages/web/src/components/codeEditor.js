import { EditorState, Compartment } from "@codemirror/state";
import {
    EditorView,
    keymap,
    lineNumbers,
    highlightActiveLine,
    highlightActiveLineGutter,
    drawSelection,
    dropCursor,
    rectangularSelection,
    crosshairCursor,
    highlightSpecialChars,
} from "@codemirror/view";
import {
    defaultHighlightStyle,
    syntaxHighlighting,
    bracketMatching,
    foldGutter,
    indentOnInput,
    LanguageDescription,
} from "@codemirror/language";
import { languages } from "@codemirror/language-data";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { json } from "@codemirror/lang-json";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";

const { h, onMounted, onBeforeUnmount, watch, ref } = globalThis.Vue;

const LANG_ALIASES = {
    js: "javascript",
    cs: "csharp",
    csharp: "csharp",
    cpp: "cpp",
    ts: "typescript",
    typescript: "typescript",
    py: "python",
    python: "python",
    rs: "rust",
    rust: "rust",
    kt: "kotlin",
    kotlin: "kotlin",
    rb: "ruby",
    ruby: "ruby",
    go: "go",
    java: "java",
    php: "php",
    swift: "swift",
    scala: "scala",
    scala3: "scala",
    elm: "elm",
    dart: "dart",
    graphql: "graphql",
    haskell: "haskell",
    flow: "javascript",
    "javascript-prop-types": "javascript",
    objc: "objective-c",
    "objective-c": "objective-c",
};

function languageExtension(name) {
    const normalized = LANG_ALIASES[name] ?? name ?? "plaintext";

    if (normalized === "json") {
        return json();
    }
    if (normalized === "javascript" || normalized === "typescript") {
        return javascript({ typescript: normalized === "typescript" });
    }

    const description = LanguageDescription.matchLanguageName(languages, normalized, {
        prefix: normalized,
    });
    return description?.support ?? [];
}

const editorTheme = EditorView.theme({
    "&": {
        height: "100%",
        fontSize: "13px",
    },
    ".cm-scroller": {
        overflow: "auto",
        fontFamily:
            'ui-monospace, "Cascadia Code", "Fira Code", "JetBrains Mono", monospace',
        lineHeight: "1.5",
    },
    ".cm-content": {
        minHeight: "100%",
    },
    "&.cm-focused": {
        outline: "none",
    },
});

function readonlyExtensions(enabled) {
    return enabled ? [EditorState.readOnly.of(true), EditorView.editable.of(false)] : [];
}

export const CodeEditor = {
    name: "CodeEditor",
    props: {
        modelValue: {
            type: String,
            default: "",
        },
        readonly: {
            type: Boolean,
            default: false,
        },
        language: {
            type: String,
            default: "json",
        },
        dark: {
            type: Boolean,
            default: false,
        },
    },
    emits: ["update:modelValue"],
    setup(props, { emit }) {
        const host = ref(null);
        let view = null;
        const themeCompartment = new Compartment();
        const languageCompartment = new Compartment();
        const readonlyCompartment = new Compartment();

        function createView() {
            if (!host.value) {
                return;
            }

            view = new EditorView({
                parent: host.value,
                state: EditorState.create({
                    doc: props.modelValue,
                    extensions: [
                        lineNumbers(),
                        highlightSpecialChars(),
                        history(),
                        foldGutter(),
                        drawSelection(),
                        dropCursor(),
                        indentOnInput(),
                        syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
                        bracketMatching(),
                        highlightActiveLine(),
                        highlightActiveLineGutter(),
                        rectangularSelection(),
                        crosshairCursor(),
                        keymap.of([...defaultKeymap, ...historyKeymap]),
                        editorTheme,
                        EditorView.updateListener.of((update) => {
                            if (update.docChanged) {
                                emit("update:modelValue", update.state.doc.toString());
                            }
                        }),
                        themeCompartment.of(props.dark ? oneDark : []),
                        languageCompartment.of(languageExtension(props.language)),
                        readonlyCompartment.of(readonlyExtensions(props.readonly)),
                    ],
                }),
            });
        }

        function replaceDocument(value) {
            if (!view || view.state.doc.toString() === value) {
                return;
            }
            view.dispatch({
                changes: {
                    from: 0,
                    to: view.state.doc.length,
                    insert: value,
                },
            });
        }

        onMounted(createView);

        onBeforeUnmount(() => {
            view?.destroy();
            view = null;
        });

        watch(
            () => props.modelValue,
            (value) => replaceDocument(value ?? ""),
        );

        watch(
            () => props.language,
            (language) => {
                view?.dispatch({
                    effects: languageCompartment.reconfigure(languageExtension(language)),
                });
            },
        );

        watch(
            () => props.dark,
            (dark) => {
                view?.dispatch({
                    effects: themeCompartment.reconfigure(dark ? oneDark : []),
                });
            },
        );

        watch(
            () => props.readonly,
            (readonly) => {
                view?.dispatch({
                    effects: readonlyCompartment.reconfigure(readonlyExtensions(readonly)),
                });
            },
        );

        return () => h("div", { ref: host, class: "code-editor-host" });
    },
};
