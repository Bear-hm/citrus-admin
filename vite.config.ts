/*
 * @Author: xiong x1253780359@outlook.com
 * @Date: 2025-10-10 08:42:06
 * @LastEditors: xiong x1253780359@outlook.com
 * @LastEditTime: 2026-03-31 11:55:54
 * @FilePath: \citrus-frontendd:\FileData\school\citrus\citrus-admin\vite.config.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE;
 */
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

export default defineConfig({
  plugins: [vue()],
  base: "./",
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "@/styles/var.scss" as *;
        `,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // 分包
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return id
              .toString()
              .split("node_modules/")[1]
              .split("/")[0]
              .toString();
          }
        },
      },
    },
  },
});
// //3、vue.config.ts配置
// module.exports = {
//   //额外的webpack配置使用一个回调函数来返回新的config
// configureWebpack: (config:any) => {
//     config.externals = {'AMap': 'AMap'};
// },
// }
