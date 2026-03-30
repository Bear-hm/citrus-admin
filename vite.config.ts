import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

export default defineConfig({
  plugins: [vue()],
  base: "./",
  // server: {
  //   host: "0.0.0.0",
  //   port: 8080,
  //   open: true,
  // },
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
