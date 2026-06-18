import type {
    LanguageInfo,
    QuicktypeRequest,
    QuicktypeResponse,
} from "../types";

export type WorkerRequest =
    | { type: "init" }
    | ({ type: "run" } & QuicktypeRequest);

export type WorkerResponse =
    | { type: "languages"; languages: LanguageInfo[] }
    | ({ type: "run" } & QuicktypeResponse);

export function defaultOptionsForLanguage(
    languages: LanguageInfo[],
    languageName: string,
): Record<string, string | boolean> {
    const lang = languages.find((l) => l.name === languageName);
    if (!lang) {
        return {};
    }

    return Object.fromEntries(
        lang.optionDefinitions.map((opt) => [opt.name, opt.defaultValue]),
    );
}

export const APP_VERSION =
    import.meta.env.VITE_APP_VERSION?.trim() || "dev";
