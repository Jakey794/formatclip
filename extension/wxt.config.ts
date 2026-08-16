import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "wxt";

export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  srcDir: "src",
  manifestVersion: 3,
  manifest: {
    name: "FormatClip",
    short_name: "FormatClip",
    version: "1.0.0",
    description:
      "Save text snippets locally and format them on demand from Chrome's side panel.",
    action: {
      default_title: "Open FormatClip",
      default_icon: {
        16: "/icon-16.png",
        32: "/icon-32.png",
      },
    },
    icons: {
      16: "/icon-16.png",
      32: "/icon-32.png",
      48: "/icon-48.png",
      128: "/icon-128.png",
    },
    permissions: ["sidePanel", "storage"],
    host_permissions: ["http://127.0.0.1:8000/*", "http://localhost:8000/*"],
    side_panel: {
      default_path: "sidepanel.html",
    },
  },
  vite: () => ({
    plugins: [tailwindcss()],
    build: {
      sourcemap: false,
    },
  }),
});
