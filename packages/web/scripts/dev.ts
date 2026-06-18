import { join } from "node:path";
import { watch } from "node:fs";

process.env.APP_VERSION = process.env.APP_VERSION || "dev";

const root = join(import.meta.dir, "..");

async function rebuild() {
    const proc = Bun.spawn(["bun", "scripts/build.ts"], {
        cwd: root,
        stdout: "inherit",
        stderr: "inherit",
    });
    await proc.exited;
}

await rebuild();

const server = Bun.serve({
    port: 5173,
    async fetch(req) {
        const url = new URL(req.url);
        let path = url.pathname;
        const base = "/go-quicktype";
        if (path.startsWith(base)) {
            path = path.slice(base.length) || "/index.html";
        }
        if (path === "/") {
            path = "/index.html";
        }
        const relativePath = path.replace(/^\//, "");
        const file = Bun.file(join(root, "dist", relativePath));
        if (await file.exists()) {
            return new Response(file);
        }
        return new Response("Not found", { status: 404 });
    },
});

console.log(`Dev server http://localhost:${server.port}/go-quicktype/`);

for (const target of ["src", "index.html", "scripts"]) {
    watch(join(root, target), { recursive: true }, () => {
        void rebuild();
    });
}
