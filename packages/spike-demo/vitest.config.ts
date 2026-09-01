import { mergeConfig } from "vite";
import { defineConfig } from "vitest/config";
import viteConfig from "./vite.config";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      server: {
        deps: {
          // @elah/core 0.4.1 ships extensionless ESM imports that Node cannot
          // load directly. Browser/Vite consumption is valid, so keep the
          // dependency behind the adapter and let Vite resolve it in tests.
          inline: ["@elah/core"],
        },
      },
    },
  }),
);
