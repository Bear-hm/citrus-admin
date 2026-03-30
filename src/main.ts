import { createApp } from "vue";
import App from "./App.vue";
import router from "@/router/index";
import { store, key } from "@/store/index";
import ElementPlus from "element-plus";
import { createPinia } from "pinia";
import "element-plus/dist/index.css";
import "@/styles/theme.css";
import "@/styles/element/index.scss";
import * as Icons from "@element-plus/icons-vue";
// import "../premission.ts";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import AMap from "vue-amap";

const pinia = createPinia();
const app = createApp(App);
app
  .use(router, AMap)
  .use(store, key)
  .use(pinia)
  .use(ElementPlus, { locale: zhCn })
  .mount("#app");

Object.keys(Icons).forEach((key) => {
  app.component(key, Icons[key as keyof typeof Icons]);
});
