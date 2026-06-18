export type InputKind = "json" | "schema" | "typescript" | "graphql";

export interface QuicktypeRequest {
    inputKind: InputKind;
    inputText: string;
    typeName: string;
    languageName: string;
    rendererOptions: Record<string, string | boolean>;
}

export interface QuicktypeSuccess {
    ok: true;
    code: string;
}

export interface QuicktypeFailure {
    ok: false;
    error: string;
}

export type QuicktypeResponse = QuicktypeSuccess | QuicktypeFailure;

export interface LanguageInfo {
    name: string;
    displayName: string;
    optionDefinitions: Array<{
        name: string;
        description: string;
        kind: string;
        defaultValue: string | boolean;
    }>;
}

export interface PersistedAppState {
    inputKind: InputKind;
    inputText: string;
    typeName: string;
    languageName: string;
    rendererOptions: Record<string, string | boolean>;
}

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

export const GRAPHQL_SCHEMA_SAMPLE = `{
  "data": {
    "__schema": {
      "queryType": { "name": "Query" },
      "mutationType": null,
      "types": []
    }
  }
}`;

export const GRAPHQL_QUERY_SAMPLE = `query Album {
  album {
    name
  }
}`;
