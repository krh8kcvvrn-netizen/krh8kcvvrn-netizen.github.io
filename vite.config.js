import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { adminApi } from "./server/adminApi.js";

export default defineConfig({
  plugins: [react(), adminApi()],
  server: { port: 5173 },
  preview: {
    host: "127.0.0.1",
    port: 4173,
    strictPort: true,
    allowedHosts: true,
  },
});
