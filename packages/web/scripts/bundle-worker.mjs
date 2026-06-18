import * as esbuild from "esbuild";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const outFile = join(here, "../src/worker/quicktype.worker.bundle.js");
const emptyModule = join(here, "empty-module.js");

mkdirSync(dirname(outFile), { recursive: true });

const nodeBuiltins = [
    "node:fs",
    "node:path",
    "node:crypto",
    "node:vm",
    "node:module",
    "node:util",
    "node:url",
    "node:os",
    "node:repl",
    "node:assert",
    "node:console",
    "node:perf_hooks",
    "fs",
    "path",
    "crypto",
    "vm",
    "module",
    "util",
    "url",
    "os",
    "repl",
    "assert",
    "console",
    "perf_hooks",
];

await esbuild.build({
    entryPoints: [join(here, "../src/worker/quicktype.worker.ts")],
    bundle: true,
    outfile: outFile,
    format: "esm",
    platform: "browser",
    target: "es2022",
    sourcemap: true,
    logLevel: "info",
    plugins: [
        {
            name: "node-builtins-empty",
            setup(build) {
                for (const builtin of nodeBuiltins) {
                    build.onResolve({ filter: new RegExp(`^${builtin}$`) }, () => ({
                        path: emptyModule,
                    }));
                }
            },
        },
    ],
});

console.log(`Bundled worker -> ${outFile}`);
