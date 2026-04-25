import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "wxt";

export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  srcDir: "src",
  manifestVersion: 3,
  manifest: {
    name: "FormatClip",
    description: "AI clipboard formatter for messy copied text",
    action: {
      default_title: "FormatClip",
    },
    permissions: ["sidePanel", "storage"],
    side_panel: {
      default_path: "sidepanel.html",
    },
  },
  vite: () => ({
    plugins: [tailwindcss()],
  }),
});
