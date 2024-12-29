import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      //eslint-disable-net-line no-ubdef
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
