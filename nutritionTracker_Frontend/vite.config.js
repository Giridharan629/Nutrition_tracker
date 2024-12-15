import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from 'dotenv'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define:{
    'process.env.REACT_APP_API_URL':JSON.stringify(process.env.REACT_APP_API_URL)
  },
  server: {
      proxy: {
          '/track': {
              target: 'http://localhost:8000',
              changeOrigin: true,
              secure: false
          }
      }
  }
});
