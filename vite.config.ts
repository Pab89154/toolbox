import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5434,
    strictPort: true,
  },
  preview: {
    port: 5434,
    strictPort: true,
  },
});
