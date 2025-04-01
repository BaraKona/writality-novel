import { resolve } from "path";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import react from "@vitejs/plugin-react";
// @ts-expect-error - This is a bug in the plugin
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
// @ts-expect-error - This is a bug in the plugin
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        "@shared": resolve("src/shared"),
        "@api": resolve("src/api/*"),
        "@": resolve("src/renderer/src"),
      },
    },
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
  },
  renderer: {
    resolve: {
      alias: {
        "@": resolve("src/renderer/src"),
        "@renderer": resolve("src/renderer/src"),
        "@shared": resolve("src/shared"),
      },
    },
    plugins: [react(), TanStackRouterVite(), tailwindcss()],
  },
});
