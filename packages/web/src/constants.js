export const STORAGE_KEY = "go-quicktype-app-state";

export const DEFAULT_JSON_SAMPLE = `{
  "name": "How To Live Forever",
  "artist": {
    "name": "Michael Forrest",
    "founded": 1982,
    "members": ["Michael Forrest"]
  },
  "tracks": [
    { "name": "Get Connected", "duration": 208 }
  ]
}`;

export const DEFAULT_SCHEMA_SAMPLE = `{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Album",
  "type": "object",
  "properties": {
    "name": { "type": "string" },
    "artist": {
      "type": "object",
      "properties": {
        "name": { "type": "string" },
        "founded": { "type": "integer" }
      },
      "required": ["name"]
    }
  },
  "required": ["name"]
}`;

export const DEFAULT_TYPESCRIPT_SAMPLE = `interface Person {
  name: string;
  nickname?: string;
  luckyNumber: number;
}`;

export const DEFAULT_GRAPHQL_SAMPLE = `{
  "schema": {},
  "query": "query { __typename }"
}`;

export const INPUT_KINDS = [
    { value: "json", title: "JSON" },
    { value: "schema", title: "JSON Schema" },
    { value: "typescript", title: "TypeScript" },
    { value: "graphql", title: "GraphQL" },
];

export function sampleForInputKind(kind) {
    switch (kind) {
        case "json":
            return DEFAULT_JSON_SAMPLE;
        case "schema":
            return DEFAULT_SCHEMA_SAMPLE;
        case "typescript":
            return DEFAULT_TYPESCRIPT_SAMPLE;
        case "graphql":
            return DEFAULT_GRAPHQL_SAMPLE;
        default:
            return DEFAULT_JSON_SAMPLE;
    }
}

export function defaultOptionsForLanguage(languages, languageName) {
    const lang = languages.find((l) => l.name === languageName);
    if (!lang) {
        return {};
    }
    return Object.fromEntries(
        lang.optionDefinitions.map((opt) => [opt.name, opt.defaultValue]),
    );
}

export function loadPersistedState() {
    const fallback = {
        inputKind: "json",
        inputText: DEFAULT_JSON_SAMPLE,
        typeName: "Welcome",
        languageName: "go",
    };
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            return fallback;
        }
        return { ...fallback, ...JSON.parse(raw) };
    } catch {
        return fallback;
    }
}

export function savePersistedState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
