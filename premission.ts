import router from "./src/router/index";
import Cookies from "js-cookie";

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 获取本地 Cookie 中的 auth_token
  const authToken = Cookies.get("auth_token");

  if (authToken) {
    if (to.path === "/login") {
      next("/");
    } else {
      next();
    }
  } else {
    if (to.path === "/login" || to.path === "/register") {
      next();
    } else {
      next({ path: "/login" });
      // next({ path: '/login', query: { redirect: to.path } });
    }
  }
});

// 全局后置守卫
router.afterEach((to, from) => {
  document.title = (to.meta.title as string) || " ";
});
