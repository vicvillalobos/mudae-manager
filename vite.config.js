import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: { dedupe: ["vue"] },
  plugins: [vue()],
  server: {
    host: "0.0.0.0",
  },
  build: {
    outDir: "docs",
  }
});
