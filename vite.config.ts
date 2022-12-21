import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'
import rollupPluginPolyfillNode from 'rollup-plugin-polyfill-node'

// @ts-ignore
export default defineConfig(({}) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  // const env = loadEnv(mode, process.cwd(), '')
  return {
    // vite config
    define: {
      'process.env': {},
    },
    plugins: [react()],
    resolve: {
      alias: {
        lib: resolve(__dirname, "src/lib"),
        routes: resolve(__dirname, "src/routes"),
      },
    },
    optimizeDeps: {
      esbuildOptions: {
        // Node.js global to browser globalThis
        define: {
          global: 'globalThis'
        },
        // Enable esbuild polyfill plugins
        plugins: [
          NodeGlobalsPolyfillPlugin({
            process: true,
            buffer: true
          }),
          NodeModulesPolyfillPlugin()
        ],
      }
    },
    build: {
      rollupOptions: {
        external: [
          /^node:.*/,
          ""
        ],
        plugins: [
          NodeGlobalsPolyfillPlugin({
            process: true,
            buffer: true
          }),
          rollupPluginPolyfillNode()
        ]
      }
    },
  }
})