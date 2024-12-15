import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Read the VITE_API_URL from environment variables
const apiUrl = process.env.VITE_API_URL || 'http://localhost:8000'; // Default to localhost if not defined

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/track': {
        target: apiUrl,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
