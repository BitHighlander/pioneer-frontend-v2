import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig, loadEnv } from "vite";
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'
import rollupNodePolyFill from 'rollup-plugin-node-polyfills'
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import nodePolyfills from 'rollup-plugin-polyfill-node';

export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '')
  return {
    // vite config
    define: {
      'process.env': {},
      'process.cwd': {},
      __APP_ENV__: env.APP_ENV,
    },
    plugins: [react()],
    resolve: {
      alias: {
        path: 'rollup-plugin-node-polyfills/polyfills/path',
        process: 'rollup-plugin-node-polyfills/polyfills/process',
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
        ]
      }
    },
    build: {
      rollupOptions: {
        external: [
          /^node:.*/,
          ""
        ],
        plugins: [
          typescript(),
          nodePolyfills({ include: null}),
          commonjs(),
          // Enable rollup polyfills plugin
          // used during production bundling
          rollupNodePolyFill()
        ]
      }
    },
  }
})