import { ConfigEnv, defineConfig } from "vite"
import { resolve } from "path"
import vue from "@vitejs/plugin-vue"
import eslintPlugin from "vite-plugin-eslint"
import DefineOptions from "unplugin-vue-define-options/vite"
import requireTransform from "vite-plugin-require-transform"
import commonjs from "@rollup/plugin-commonjs"
import { visualizer } from "rollup-plugin-visualizer"
import externalGlobals from "rollup-plugin-external-globals"
import viteCompression from "vite-plugin-compression"
import removeConsole from "vite-plugin-remove-console"
import autoprefixer from "autoprefixer"
import chunks from "./chunks.conf"

// https://vitejs.dev/config/
// eslint-disable-next-line max-lines-per-function
export default defineConfig(({ command }: ConfigEnv) => {
  const isBuild = command === "build"
  return {
    define: {
      "APP_VERSION": JSON.stringify(process.env.npm_package_version),
    },
    base: "/",
    server: {
      port: 4000,
    },
    build: {
      target: "esnext",
      rollupOptions: {
        output: {
          dir: "dist",
          /** 引入文件名的名称 */
          chunkFileNames: "js/[name]-[hash].js",
          /** 包的入口文件名称 */
          entryFileNames: "js/[name]-[hash].js",
          /** 资源文件像 字体，图片等 */
          assetFileNames: "[ext]/[name]-[hash].[ext]",
          manualChunks: {
            ...chunks,
          },
        },
        external: ["typescript", "highlight.js"],
        plugins: [
          externalGlobals({
            typescript: "ts",
          }),
          viteCompression({
            algorithm: "gzip",
            threshold: 10240,
            verbose: true,
            ext: ".gz",
            deleteOriginFile: false,
          }),
        ],
      },
      esbuild: isBuild
        ? {
            /** 打包时移除 debugger */
            drop: ["debugger"],
            /** 打包时移除所有注释 */
            legalComments: "none",
          }
        : undefined,
    },
    plugins: [
      vue(),
      DefineOptions(),
      eslintPlugin({
        include: ["src/**/*.ts", "src/**/*.vue"],
      }),
      commonjs(),
      /** 兼容使用require */
      requireTransform({
        fileRegex: /.js$|.ts$/,
      }),
      /** 查看打包大小 */
      visualizer({ open: true }),
      removeConsole({
        external: ["src/utils/services/console-service.ts"],
        includes: ["log", "warn", "info"],
      }),
    ],
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
        "@assets": resolve(__dirname, "src/assets"),
        "@views": resolve(__dirname, "src/views"),
        "@components": resolve(__dirname, "src/components"),
        "@utils": resolve(__dirname, "src/utils"),
        "@type": resolve(__dirname, "src/type"),
        "@store": resolve(__dirname, "src/store"),
        "@hooks": resolve(__dirname, "src/hooks"),
        "@scripts": resolve(__dirname, "src/scripts"),
        "@plugins": resolve(__dirname, "src/plugins"),
      },
      extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"],
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: "@use \"sass:map\";@import \"@/styles/index.scss\";",
        },
      },
      postcss: {
        plugins: [
          autoprefixer({
            overrideBrowserslist: [
                "Android 4.1",
                "iOS 7.1",
                "Chrome > 31",
                "ff > 31",
                "ie >= 8",
            ],
            grid: true,
          }) as any,
        ],
      },
    },
  }
})
