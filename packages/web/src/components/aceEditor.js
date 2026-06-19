const { h, onMounted, onBeforeUnmount, watch, ref } = globalThis.Vue;

const ACE_BASE =
    "https://cdn.jsdelivr.net/npm/ace-builds@1.43.2/src-noconflict";

const ACE_MODES = {
    json: "ace/mode/json",
    javascript: "ace/mode/javascript",
    js: "ace/mode/javascript",
    typescript: "ace/mode/typescript",
    ts: "ace/mode/typescript",
    go: "ace/mode/golang",
    golang: "ace/mode/golang",
    python: "ace/mode/python",
    py: "ace/mode/python",
    java: "ace/mode/java",
    csharp: "ace/mode/csharp",
    cs: "ace/mode/csharp",
    cpp: "ace/mode/c_cpp",
    "c++": "ace/mode/c_cpp",
    c: "ace/mode/c_cpp",
    rust: "ace/mode/rust",
    rs: "ace/mode/rust",
    ruby: "ace/mode/ruby",
    rb: "ace/mode/ruby",
    php: "ace/mode/php",
    swift: "ace/mode/swift",
    kotlin: "ace/mode/kotlin",
    kt: "ace/mode/kotlin",
    dart: "ace/mode/dart",
    scala: "ace/mode/scala",
    scala3: "ace/mode/scala",
    elm: "ace/mode/elm",
    haskell: "ace/mode/haskell",
    graphql: "ace/mode/graphql",
    flow: "ace/mode/javascript",
    "javascript-prop-types": "ace/mode/javascript",
    objc: "ace/mode/objectivec",
    "objective-c": "ace/mode/objectivec",
    elixir: "ace/mode/elixir",
    html: "ace/mode/html",
    yaml: "ace/mode/yaml",
    plaintext: "ace/mode/plain_text",
};

function aceMode(language) {
    return ACE_MODES[language] ?? "ace/mode/plain_text";
}

function aceTheme(dark) {
    return dark ? "ace/theme/tomorrow_night" : "ace/theme/chrome";
}

function configureAce() {
    if (globalThis.__aceConfigured) {
        return;
    }
    globalThis.ace.config.set("basePath", ACE_BASE);
    globalThis.ace.config.set("useWorker", false);
    globalThis.__aceConfigured = true;
}

export const AceEditor = {
    name: "AceEditor",
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
        let editor = null;
        let resizeObserver = null;

        function syncFromProps() {
            if (!editor) {
                return;
            }
            editor.setTheme(aceTheme(props.dark));
            editor.session.setMode(aceMode(props.language));
            editor.setReadOnly(props.readonly);
        }

        function replaceDocument(value) {
            if (!editor) {
                return;
            }
            const next = value ?? "";
            if (editor.getValue() !== next) {
                editor.setValue(next, -1);
            }
        }

        onMounted(() => {
            configureAce();
            editor = globalThis.ace.edit(host.value, {
                mode: aceMode(props.language),
                theme: aceTheme(props.dark),
                readOnly: props.readonly,
                fontSize: 13,
                wrap: true,
                showPrintMargin: false,
                tabSize: 2,
                useWorker: false,
                highlightActiveLine: !props.readonly,
            });
            editor.setValue(props.modelValue ?? "", -1);
            editor.renderer.setScrollMargin(8, 8, 0, 0);
            editor.session.on("change", () => {
                if (!props.readonly) {
                    emit("update:modelValue", editor.getValue());
                }
            });

            resizeObserver = new ResizeObserver(() => editor.resize());
            resizeObserver.observe(host.value);
        });

        onBeforeUnmount(() => {
            resizeObserver?.disconnect();
            editor?.destroy();
            editor = null;
        });

        watch(
            () => props.modelValue,
            (value) => replaceDocument(value),
        );

        watch(
            () => props.language,
            () => syncFromProps(),
        );

        watch(
            () => props.dark,
            () => syncFromProps(),
        );

        watch(
            () => props.readonly,
            () => syncFromProps(),
        );

        return () => h("div", { ref: host, class: "ace-editor-host" });
    },
};
