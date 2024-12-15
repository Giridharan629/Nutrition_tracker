import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from 'dotenv'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {
      VITE_API_URL: process.env.VITE_API_URL || 'http://localhost:8000', // Fallback to localhost if undefined
    },
  },
  server: {
      proxy: {
          '/track': {
              target: `${import.meta.env.VITE_API_URL}`,
              changeOrigin: true,
              secure: false
          }
      }
  }
});
