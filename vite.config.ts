import { fileURLToPath, URL } from "node:url";

import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import { convertEnv, getRootPath } from "./build/utils";
import UnoCSS from "unocss/vite";
// @ts-ignore
import { createVitePlugins } from "./build/plugin";

// https://vite.dev/config/
// export default defineConfig({
//   plugins: [vue(), vueDevTools(), UnoCSS()],
//   resolve: {
//     alias: {
//       '~': getRootPath(),
//       '@': fileURLToPath(new URL('./src', import.meta.url)),
//     },
//   },
// })

export default defineConfig(({ command, mode }) => {
  const isBuild = command === 'build'

  const env = loadEnv(mode, process.cwd())
  const viteEnv = convertEnv(env)

  return {
    plugins: createVitePlugins(viteEnv, isBuild),
    resolve: {
      alias: {
        "~": getRootPath(),
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  };
});
