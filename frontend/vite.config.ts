import path from 'path'
import react from '@vitejs/plugin-react'
import { defineConfig, UserConfig } from 'vite'

export default defineConfig({
  plugins: [react()] as UserConfig["plugins"],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
