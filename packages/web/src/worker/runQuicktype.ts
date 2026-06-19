import { GraphQLInput } from "quicktype-graphql-input";
import { InputData, jsonInputForTargetLanguage } from "quicktype-core/dist/input/Inputs";
import { JSONSchemaInput } from "quicktype-core/dist/input/JSONSchemaInput";
import { all as defaultTargetLanguages } from "quicktype-core/dist/language/All";
import { quicktype } from "quicktype-core/dist/Run";

import type { LanguageInfo, QuicktypeRequest, QuicktypeResponse } from "../types";

export function getLanguageCatalog(): LanguageInfo[] {
    return defaultTargetLanguages.map((lang) => ({
        name: lang.names[0],
        displayName: lang.displayName,
        optionDefinitions: lang.optionDefinitions.map((opt) => ({
            name: opt.name,
            description: opt.description,
            kind: opt.kind,
            optionType: opt.optionType,
            defaultValue: opt.defaultValue,
            values:
                opt.optionType === "enum" && opt.values
                    ? Object.keys(opt.values)
                    : undefined,
        })),
    }));
}

export async function runQuicktype(
    request: QuicktypeRequest,
): Promise<QuicktypeResponse> {
    try {
        const inputData = new InputData();

        switch (request.inputKind) {
            case "json": {
                const jsonInput = jsonInputForTargetLanguage(
                    request.languageName as Parameters<
                        typeof jsonInputForTargetLanguage
                    >[0],
                );
                await jsonInput.addSource({
                    name: request.typeName,
                    samples: [request.inputText],
                });
                inputData.addInput(jsonInput);
                break;
            }
            case "schema": {
                const schemaInput = new JSONSchemaInput(undefined);
                await schemaInput.addSource({
                    name: request.typeName,
                    schema: request.inputText,
                });
                inputData.addInput(schemaInput);
                break;
            }
            case "typescript":
                return {
                    ok: false,
                    error: "TypeScript input is not yet supported in the browser build. Paste JSON or JSON Schema instead, or use the CLI.",
                };
            case "graphql": {
                let parsed: { schema?: unknown; query?: string };
                try {
                    parsed = JSON.parse(request.inputText) as {
                        schema?: unknown;
                        query?: string;
                    };
                } catch {
                    return {
                        ok: false,
                        error: "GraphQL input must be JSON with { schema, query } fields.",
                    };
                }

                if (parsed.schema === undefined || parsed.query === undefined) {
                    return {
                        ok: false,
                        error: 'GraphQL input JSON must include "schema" (introspection result) and "query" (GraphQL query string).',
                    };
                }

                const graphqlInput = new GraphQLInput();
                await graphqlInput.addSource({
                    name: request.typeName,
                    schema: parsed.schema,
                    query: parsed.query,
                });
                inputData.addInput(graphqlInput);
                break;
            }
            default:
                return { ok: false, error: "Unknown input kind." };
        }

        const result = await quicktype({
            inputData,
            lang: request.languageName as Parameters<
                typeof quicktype
            >[0]["lang"],
            rendererOptions: request.rendererOptions,
        });

        return { ok: true, code: result.lines.join("\n") };
    } catch (error) {
        const message =
            error instanceof Error ? error.message : String(error);
        return { ok: false, error: message };
    }
}
