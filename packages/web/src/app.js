import {
    STORAGE_KEY,
    defaultOptionsForLanguage,
    loadPersistedState,
    sampleForInputKind,
    INPUT_KINDS,
    savePersistedState,
} from "./constants.js";
import { CodeEditor } from "./assets/codeEditor.js";

const { createApp, ref, computed, watch, onMounted, toRaw } = Vue;
const { createVuetify } = Vuetify;

const APP_VERSION = "__APP_VERSION__";

/** Worker postMessage requires plain structured-cloneable data, not Vue proxies. */
function toPlain(value) {
    return JSON.parse(JSON.stringify(toRaw(value)));
}

function workerUrl() {
    return new URL("assets/quicktype.worker.js", document.baseURI).href;
}

function inputEditorLanguage(inputKind) {
    switch (inputKind) {
        case "typescript":
            return "typescript";
        case "json":
        case "json-schema":
        case "graphql":
        default:
            return "json";
    }
}

const vuetify = createVuetify({
    theme: {
        defaultTheme: "system",
    },
});

createApp({
    components: {
        CodeEditor,
    },
    setup() {
        const theme = Vuetify.useTheme();
        const drawer = ref(true);
        const ready = ref(false);
        const running = ref(false);
        const languages = ref([]);
        const code = ref("");
        const error = ref(null);
        const snackbar = ref(false);
        const snackbarText = ref("");

        const persisted = ref(loadPersistedState());
        const rendererOptions = ref({});

        const isDark = computed(() => theme.global.current.value.dark);

        const inputLanguage = computed(() =>
            inputEditorLanguage(persisted.value.inputKind),
        );

        const outputLanguage = computed(
            () => persisted.value.languageName ?? "plaintext",
        );

        const outputText = computed(() => {
            if (error.value) {
                return "";
            }
            if (running.value && !code.value) {
                return "Generating…";
            }
            return code.value;
        });

        const state = computed(() => ({
            inputKind: persisted.value.inputKind,
            inputText: persisted.value.inputText,
            typeName: persisted.value.typeName,
            languageName: persisted.value.languageName,
            rendererOptions: rendererOptions.value,
        }));

        const languageItems = computed(() =>
            languages.value.map((l) => ({
                title: l.displayName,
                value: l.name,
            })),
        );

        const currentLanguage = computed(
            () =>
                languages.value.find(
                    (l) => l.name === persisted.value.languageName,
                ) ?? languages.value[0],
        );

        const optionDefinitions = computed(
            () => currentLanguage.value?.optionDefinitions ?? [],
        );

        let worker = null;
        let debounceTimer = null;

        function scheduleRun() {
            if (!ready.value || !worker) {
                return;
            }
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                running.value = true;
                worker.postMessage(
                    toPlain({
                        type: "run",
                        inputKind: persisted.value.inputKind,
                        inputText: persisted.value.inputText,
                        typeName: persisted.value.typeName,
                        languageName: persisted.value.languageName,
                        rendererOptions: rendererOptions.value,
                    }),
                );
            }, 400);
        }

        function applyLanguageDefaults(name) {
            rendererOptions.value = defaultOptionsForLanguage(
                languages.value,
                name,
            );
        }

        function onLanguageChange(name) {
            persisted.value.languageName = name;
            applyLanguageDefaults(name);
            scheduleRun();
        }

        function onInputKindChange(kind) {
            persisted.value.inputKind = kind;
            persisted.value.inputText = sampleForInputKind(kind);
            scheduleRun();
        }

        async function copyOutput() {
            if (!code.value) {
                return;
            }
            await navigator.clipboard.writeText(code.value);
            snackbarText.value = "Copied to clipboard";
            snackbar.value = true;
        }

        function downloadOutput() {
            if (!code.value || !currentLanguage.value) {
                return;
            }
            const ext =
                currentLanguage.value.name === "csharp"
                    ? "cs"
                    : currentLanguage.value.name;
            const blob = new Blob([code.value], { type: "text/plain" });
            const url = URL.createObjectURL(blob);
            const anchor = document.createElement("a");
            anchor.href = url;
            anchor.download = `${persisted.value.typeName}.${ext}`;
            anchor.click();
            URL.revokeObjectURL(url);
        }

        watch(
            state,
            (value) => {
                savePersistedState(toPlain(value));
            },
            { deep: true },
        );

        watch(
            () => [
                persisted.value.inputText,
                persisted.value.typeName,
                persisted.value.inputKind,
                rendererOptions.value,
            ],
            () => scheduleRun(),
            { deep: true },
        );

        onMounted(() => {
            worker = new Worker(workerUrl(), { type: "module" });
            worker.onmessage = (event) => {
                const response = event.data;
                if (response.type === "languages") {
                    languages.value = response.languages;
                    if (
                        !languages.value.some(
                            (l) => l.name === persisted.value.languageName,
                        )
                    ) {
                        persisted.value.languageName =
                            languages.value[0]?.name ?? "go";
                    }
                    rendererOptions.value =
                        persisted.value.rendererOptions ??
                        defaultOptionsForLanguage(
                            languages.value,
                            persisted.value.languageName,
                        );
                    ready.value = true;
                    scheduleRun();
                    return;
                }
                if (response.ok) {
                    code.value = response.code;
                    error.value = null;
                } else {
                    code.value = "";
                    error.value = response.error;
                }
                running.value = false;
            };
            worker.onerror = (event) => {
                error.value = event.message || "Worker failed";
                running.value = false;
            };
            worker.postMessage({ type: "init" });
        });

        return {
            APP_VERSION,
            drawer,
            ready,
            running,
            persisted,
            rendererOptions,
            code,
            error,
            snackbar,
            snackbarText,
            isDark,
            inputLanguage,
            outputLanguage,
            outputText,
            INPUT_KINDS,
            languageItems,
            optionDefinitions,
            onLanguageChange,
            onInputKindChange,
            copyOutput,
            downloadOutput,
        };
    },
    template: `
<v-app>
  <v-app-bar color="surface" elevation="1" density="comfortable">
    <v-app-bar-nav-icon @click="drawer = !drawer" />
    <v-app-bar-title>
      <span class="font-weight-bold">go-quicktype</span>
      <span class="text-caption text-medium-emphasis ms-2 d-none d-sm-inline">Backendless browser codegen</span>
    </v-app-bar-title>
    <v-spacer />
    <v-chip size="small" variant="outlined" class="me-2">v{{ APP_VERSION }}</v-chip>
    <v-btn href="https://github.com/eSlider/go-quicktype" target="_blank" icon="mdi-github" variant="text" />
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" width="320">
    <v-container class="py-4">
      <v-text-field
        v-model="persisted.typeName"
        label="Top-level name"
        variant="outlined"
        density="compact"
        hide-details
        class="mb-4"
      />

      <div class="text-caption text-medium-emphasis mb-2">Input</div>
      <v-btn-toggle
        :model-value="persisted.inputKind"
        @update:model-value="onInputKindChange"
        mandatory
        divided
        color="primary"
        class="mb-4 flex-wrap"
        density="compact"
      >
        <v-btn v-for="kind in INPUT_KINDS" :key="kind.value" :value="kind.value" size="small">
          {{ kind.title }}
        </v-btn>
      </v-btn-toggle>

      <v-alert
        v-if="persisted.inputKind === 'graphql'"
        type="warning"
        variant="tonal"
        density="compact"
        class="mb-4 text-caption"
      >
        Paste JSON: { "schema": &lt;introspection&gt;, "query": "..." }. Remote URLs may fail due to CORS.
      </v-alert>

      <v-select
        :model-value="persisted.languageName"
        @update:model-value="onLanguageChange"
        :items="languageItems"
        label="Output language"
        variant="outlined"
        density="compact"
        hide-details
        class="mb-4"
      />

      <div class="text-caption text-medium-emphasis mb-2">Options</div>
      <div v-for="opt in optionDefinitions" :key="opt.name" class="mb-3">
        <v-switch
          v-if="opt.kind === 'boolean'"
          v-model="rendererOptions[opt.name]"
          :label="opt.description"
          density="compact"
          hide-details
          color="primary"
        />
        <v-text-field
          v-else
          v-model="rendererOptions[opt.name]"
          :label="opt.description"
          variant="outlined"
          density="compact"
          hide-details
        />
      </div>
    </v-container>
  </v-navigation-drawer>

  <v-main class="editor-main">
    <v-container v-if="!ready" fluid class="fill-height d-flex align-center justify-center">
      <div class="text-center">
        <v-progress-circular indeterminate color="primary" size="48" />
        <div class="mt-4 text-medium-emphasis">Loading quicktype engine…</div>
      </div>
    </v-container>

    <v-container v-else fluid class="editor-shell pa-4">
      <v-row class="editor-grid" dense>
        <v-col cols="12" md="6" class="editor-col">
          <v-card variant="outlined" class="editor-card">
            <v-card-title class="text-subtitle-2 py-2">Input</v-card-title>
            <v-divider />
            <v-card-text class="editor-pane pa-0">
              <code-editor
                v-model="persisted.inputText"
                :language="inputLanguage"
                :dark="isDark"
              />
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="6" class="editor-col">
          <v-card variant="outlined" class="editor-card">
            <v-card-title class="d-flex align-center py-2">
              <span class="text-subtitle-2">Output</span>
              <v-spacer />
              <v-progress-circular v-if="running" indeterminate size="20" width="2" class="me-2" />
              <v-btn size="small" variant="tonal" :disabled="!code" @click="copyOutput" prepend-icon="mdi-content-copy">
                Copy
              </v-btn>
              <v-btn size="small" variant="tonal" :disabled="!code" @click="downloadOutput" prepend-icon="mdi-download" class="ms-2">
                Download
              </v-btn>
            </v-card-title>
            <v-divider />
            <v-alert v-if="error" type="error" variant="tonal" class="ma-3" density="compact">{{ error }}</v-alert>
            <v-card-text v-else class="editor-pane pa-0">
              <code-editor
                :model-value="outputText"
                :language="outputLanguage"
                :dark="isDark"
                readonly
              />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>

  <v-snackbar v-model="snackbar" timeout="2000">{{ snackbarText }}</v-snackbar>
</v-app>
`,
})
    .use(vuetify)
    .mount("#app");
