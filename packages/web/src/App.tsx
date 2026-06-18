import { useEffect, useMemo, useState } from "react";

import { useQuicktypeWorker } from "./hooks/useQuicktypeWorker";
import {
    APP_VERSION,
    defaultOptionsForLanguage,
} from "./lib/languages";
import type { InputKind, PersistedAppState } from "./types";
import {
    DEFAULT_GRAPHQL_SAMPLE,
    DEFAULT_JSON_SAMPLE,
    DEFAULT_SCHEMA_SAMPLE,
    DEFAULT_TYPESCRIPT_SAMPLE,
} from "./types";

const STORAGE_KEY = "go-quicktype-app-state";

const INPUT_KINDS: Array<{ id: InputKind; label: string }> = [
    { id: "json", label: "JSON" },
    { id: "schema", label: "JSON Schema" },
    { id: "typescript", label: "TypeScript" },
    { id: "graphql", label: "GraphQL" },
];

function loadPersistedState(): Omit<PersistedAppState, "rendererOptions"> & {
    rendererOptions?: Record<string, string | boolean>;
} {
    const fallback = {
        inputKind: "json" as InputKind,
        inputText: DEFAULT_JSON_SAMPLE,
        typeName: "Welcome",
        languageName: "go",
    };

    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            return fallback;
        }
        return { ...fallback, ...(JSON.parse(raw) as PersistedAppState) };
    } catch {
        return fallback;
    }
}

function sampleForInputKind(kind: InputKind): string {
    switch (kind) {
        case "json":
            return DEFAULT_JSON_SAMPLE;
        case "schema":
            return DEFAULT_SCHEMA_SAMPLE;
        case "typescript":
            return DEFAULT_TYPESCRIPT_SAMPLE;
        case "graphql":
            return DEFAULT_GRAPHQL_SAMPLE;
    }
}

export default function App() {
    const { languages, ready, code, error, running, run } =
        useQuicktypeWorker();
    const [persisted, setPersisted] = useState(loadPersistedState);
    const [showOptions, setShowOptions] = useState(true);

    const state = useMemo((): PersistedAppState => {
        return {
            ...persisted,
            rendererOptions:
                persisted.rendererOptions ??
                defaultOptionsForLanguage(languages, persisted.languageName),
        };
    }, [languages, persisted]);

    const currentLanguage = useMemo(
        () =>
            languages.find((l) => l.name === state.languageName) ??
            languages[0],
        [languages, state.languageName],
    );

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, [state]);

    useEffect(() => {
        if (!ready) {
            return;
        }
        const timer = window.setTimeout(() => {
            run({
                inputKind: state.inputKind,
                inputText: state.inputText,
                typeName: state.typeName,
                languageName: state.languageName,
                rendererOptions: state.rendererOptions,
            });
        }, 400);

        return () => window.clearTimeout(timer);
    }, [ready, run, state]);

    const update = (patch: Partial<PersistedAppState>) => {
        setPersisted((prev) => ({ ...prev, ...patch }));
    };

    const onLanguageChange = (languageName: string) => {
        update({
            languageName,
            rendererOptions: defaultOptionsForLanguage(
                languages,
                languageName,
            ),
        });
    };

    const onInputKindChange = (inputKind: InputKind) => {
        update({
            inputKind,
            inputText: sampleForInputKind(inputKind),
        });
    };

    const copyOutput = async () => {
        if (!code) {
            return;
        }
        await navigator.clipboard.writeText(code);
    };

    const downloadOutput = () => {
        if (!code || !currentLanguage) {
            return;
        }
        const blob = new Blob([code], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = `${state.typeName}.${currentLanguage.name === "csharp" ? "cs" : currentLanguage.name}`;
        anchor.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="flex h-full min-h-screen flex-col bg-gradient-to-br from-zinc-950 via-zinc-900 to-slate-950">
            <header className="border-b border-zinc-800/80 bg-zinc-950/70 px-4 py-3 backdrop-blur">
                <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-lg font-semibold tracking-tight text-zinc-50">
                            go-quicktype
                        </h1>
                        <p className="text-xs text-zinc-400">
                            Backendless — all transformations run in your browser
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
                        <span className="rounded-full border border-zinc-700 px-2 py-1">
                            v{APP_VERSION}
                        </span>
                        <a
                            className="rounded-full border border-zinc-700 px-2 py-1 hover:border-sky-500 hover:text-sky-300"
                            href="https://github.com/eSlider/go-quicktype"
                            target="_blank"
                            rel="noreferrer"
                        >
                            GitHub
                        </a>
                    </div>
                </div>
            </header>

            {!ready ? (
                <div className="flex flex-1 items-center justify-center text-sm text-zinc-400">
                    Loading quicktype engine…
                </div>
            ) : (
                <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col gap-3 p-4 lg:flex-row">
                    <aside
                        className={`flex flex-col gap-3 lg:w-72 ${showOptions ? "" : "hidden lg:flex"}`}
                    >
                        <section className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3">
                            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-zinc-400">
                                Top-level name
                            </label>
                            <input
                                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-sky-500"
                                value={state.typeName}
                                onChange={(e) =>
                                    update({ typeName: e.target.value })
                                }
                            />
                        </section>

                        <section className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3">
                            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-zinc-400">
                                Input
                            </label>
                            <div className="grid grid-cols-2 gap-1">
                                {INPUT_KINDS.map((kind) => (
                                    <button
                                        key={kind.id}
                                        type="button"
                                        className={`rounded-lg px-2 py-1.5 text-xs font-medium transition ${
                                            state.inputKind === kind.id
                                                ? "bg-sky-600 text-white"
                                                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                                        }`}
                                        onClick={() =>
                                            onInputKindChange(kind.id)
                                        }
                                    >
                                        {kind.label}
                                    </button>
                                ))}
                            </div>
                            {state.inputKind === "graphql" && (
                                <p className="mt-2 text-[11px] leading-relaxed text-amber-300/90">
                                    Paste JSON:{" "}
                                    {'{ "schema": <introspection>, "query": "..." }'}.
                                    Remote introspection may fail due to CORS.
                                </p>
                            )}
                        </section>

                        <section className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3">
                            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-zinc-400">
                                Output language
                            </label>
                            <select
                                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-sky-500"
                                value={state.languageName}
                                onChange={(e) =>
                                    onLanguageChange(e.target.value)
                                }
                            >
                                {languages.map((lang) => (
                                    <option key={lang.name} value={lang.name}>
                                        {lang.displayName}
                                    </option>
                                ))}
                            </select>
                        </section>

                        <section className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3">
                            <div className="mb-2 flex items-center justify-between">
                                <h2 className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                                    Options
                                </h2>
                                <button
                                    type="button"
                                    className="text-xs text-zinc-400 hover:text-zinc-200 lg:hidden"
                                    onClick={() => setShowOptions(false)}
                                >
                                    Hide
                                </button>
                            </div>
                            <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
                                {currentLanguage?.optionDefinitions.map(
                                    (opt) => (
                                        <label
                                            key={opt.name}
                                            className="flex items-start gap-2 text-xs text-zinc-300"
                                        >
                                            {opt.kind === "boolean" ? (
                                                <input
                                                    type="checkbox"
                                                    className="mt-0.5"
                                                    checked={Boolean(
                                                        state.rendererOptions[
                                                            opt.name
                                                        ],
                                                    )}
                                                    onChange={(e) =>
                                                        update({
                                                            rendererOptions: {
                                                                ...state.rendererOptions,
                                                                [opt.name]:
                                                                    e.target
                                                                        .checked,
                                                            },
                                                        })
                                                    }
                                                />
                                            ) : (
                                                <input
                                                    type="text"
                                                    className="w-full rounded border border-zinc-700 bg-zinc-950 px-2 py-1"
                                                    value={String(
                                                        state.rendererOptions[
                                                            opt.name
                                                        ] ?? opt.defaultValue,
                                                    )}
                                                    onChange={(e) =>
                                                        update({
                                                            rendererOptions: {
                                                                ...state.rendererOptions,
                                                                [opt.name]:
                                                                    e.target
                                                                        .value,
                                                            },
                                                        })
                                                    }
                                                />
                                            )}
                                            <span>{opt.description}</span>
                                        </label>
                                    ),
                                )}
                            </div>
                        </section>
                    </aside>

                    <main className="flex min-h-[70vh] flex-1 flex-col gap-3">
                        <div className="flex items-center justify-between lg:hidden">
                            <button
                                type="button"
                                className="rounded-lg border border-zinc-700 px-3 py-1 text-xs"
                                onClick={() => setShowOptions(true)}
                            >
                                Options
                            </button>
                            {running && (
                                <span className="text-xs text-sky-300">
                                    Generating…
                                </span>
                            )}
                        </div>

                        <div className="grid min-h-0 flex-1 gap-3 lg:grid-cols-2">
                            <section className="flex min-h-[320px] flex-col rounded-xl border border-zinc-800 bg-zinc-900/50">
                                <div className="border-b border-zinc-800 px-3 py-2 text-xs font-medium uppercase tracking-wide text-zinc-400">
                                    Input
                                </div>
                                <textarea
                                    className="min-h-0 flex-1 resize-none bg-transparent p-3 text-sm leading-relaxed text-zinc-100 outline-none"
                                    spellCheck={false}
                                    value={state.inputText}
                                    onChange={(e) =>
                                        update({ inputText: e.target.value })
                                    }
                                />
                            </section>

                            <section className="flex min-h-[320px] flex-col rounded-xl border border-zinc-800 bg-zinc-900/50">
                                <div className="flex items-center justify-between border-b border-zinc-800 px-3 py-2">
                                    <span className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                                        Output
                                    </span>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            className="rounded border border-zinc-700 px-2 py-0.5 text-xs hover:border-zinc-500 disabled:opacity-40"
                                            disabled={!code}
                                            onClick={() => void copyOutput()}
                                        >
                                            Copy
                                        </button>
                                        <button
                                            type="button"
                                            className="rounded border border-zinc-700 px-2 py-0.5 text-xs hover:border-zinc-500 disabled:opacity-40"
                                            disabled={!code}
                                            onClick={downloadOutput}
                                        >
                                            Download
                                        </button>
                                    </div>
                                </div>
                                {error ? (
                                    <pre className="overflow-auto p-3 text-sm text-rose-300">
                                        {error}
                                    </pre>
                                ) : (
                                    <pre className="min-h-0 flex-1 overflow-auto p-3 text-sm leading-relaxed text-emerald-100/90">
                                        {running && !code
                                            ? "Generating…"
                                            : code || " "}
                                    </pre>
                                )}
                            </section>
                        </div>
                    </main>
                </div>
            )}
        </div>
    );
}
