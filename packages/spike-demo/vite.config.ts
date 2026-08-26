import { defineConfig } from "vite";

export default defineConfig({
  base: "/salai/",
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
