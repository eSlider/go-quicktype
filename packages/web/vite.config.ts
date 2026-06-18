import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
    base: "/go-quicktype/",
    plugins: [react(), tailwindcss()],
    define: {
        "process.env.NODE_ENV": JSON.stringify(
            process.env.NODE_ENV ?? "production",
        ),
        global: "globalThis",
    },
    build: {
        commonjsOptions: {
            transformMixedEsModules: true,
            defaultIsModuleExports: true,
        },
        sourcemap: true,
    },
    worker: {
        format: "es",
        rollupOptions: {
            output: {
                inlineDynamicImports: false,
            },
        },
    },
    optimizeDeps: {
        include: ["quicktype-core", "quicktype-graphql-input"],
    },
});
