import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";

const root = join(import.meta.dir, "..");
const outFile = join(root, "dist/assets/quicktype.worker.js");
const emptyModule = join(import.meta.dir, "empty-module.js");

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

await mkdir(dirname(outFile), { recursive: true });

const result = await Bun.build({
    entrypoints: [join(root, "src/worker/quicktype.worker.ts")],
    outdir: join(root, "dist/assets"),
    naming: "quicktype.worker.[ext]",
    target: "browser",
    format: "esm",
    sourcemap: "external",
    minify: true,
    plugins: [
        {
            name: "node-builtins-empty",
            setup(build) {
                for (const builtin of nodeBuiltins) {
                    const escaped = builtin.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
                    build.onResolve(
                        { filter: new RegExp(`^${escaped}$`) },
                        () => ({ path: emptyModule }),
                    );
                }
            },
        },
    ],
});

if (!result.success) {
    console.error(result.logs);
    process.exit(1);
}

console.log(`Bundled worker -> ${outFile}`);
