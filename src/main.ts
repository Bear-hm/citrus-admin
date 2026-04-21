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
import { useUserStore } from "@/store/user";
import message from "@/utils/message";

const pinia = createPinia();
const app = createApp(App);

// 先注册 pinia，确保 store 可以正常工作
app.use(pinia);

// 初始化用户状态（从 localStorage 恢复）
const userStore = useUserStore();
userStore.initFromStorage();

app
  .use(router, AMap)
  .use(store, key)
  .use(ElementPlus, { locale: zhCn })
  .mount("#app");

app.config.globalProperties.$msg = message;

Object.keys(Icons).forEach((key) => {
  app.component(key, Icons[key as keyof typeof Icons]);
});
