import { copyFile, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

const root = join(import.meta.dir, "..");
const dist = join(root, "dist");
const version =
    process.env.APP_VERSION?.trim() ||
    JSON.parse(await readFile(join(root, "../../package.json"), "utf8"))
        .version;

await rm(dist, { recursive: true, force: true });
await mkdir(join(dist, "assets"), { recursive: true });
await mkdir(join(dist, "components"), { recursive: true });

await import("./bundle-worker.ts");

let html = await readFile(join(root, "index.html"), "utf8");
html = html.replaceAll("__APP_VERSION__", version);
await writeFile(join(dist, "index.html"), html);

let appJs = await readFile(join(root, "src/app.js"), "utf8");
appJs = appJs.replaceAll("__APP_VERSION__", version);
await writeFile(join(dist, "app.js"), appJs);
await copyFile(join(root, "src/constants.js"), join(dist, "constants.js"));
await copyFile(
    join(root, "src/components/aceEditor.js"),
    join(dist, "components/aceEditor.js"),
);

console.log(`Built dist/ (v${version})`);
