import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";

const root = join(import.meta.dir, "..");
const outFile = join(root, "dist/assets/codeEditor.js");

await mkdir(dirname(outFile), { recursive: true });

const result = await Bun.build({
    entrypoints: [join(root, "src/components/codeEditor.js")],
    outdir: join(root, "dist/assets"),
    naming: "codeEditor.[ext]",
    target: "browser",
    format: "esm",
    minify: true,
});

if (!result.success) {
    console.error(result.logs);
    process.exit(1);
}

console.log(`Bundled editor -> ${outFile}`);
