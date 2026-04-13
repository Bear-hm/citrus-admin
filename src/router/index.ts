/*
 * @Author: xiong x1253780359@outlook.com
 * @Date: 2025-10-10 08:42:07
 * @LastEditors: xiong x1253780359@outlook.com
 * @LastEditTime: 2026-04-12 18:28:30
 * @FilePath: \citrus\citrus-admin\src\router\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createRouter, createWebHashHistory } from "vue-router";
import { constantRoute } from "./router";
import { useUserStore } from "@/store/user";
import { ElMessage } from "element-plus";

const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoute,
  scrollBehavior() {
    return {
      left: 0,
      top: 0,
    };
  },
});

// 路由守卫：页面刷新后恢复用户状态
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();

  // 已登录状态且有 token，但无 userInfo 时，自动获取用户信息
  if (userStore.token && !userStore.userId) {
    try {
      await userStore.fetchUserInfo();
    } catch {
      // 获取失败，清除状态并重定向到登录页
      userStore.logout();
      ElMessage.error("登录已过期，请重新登录");
      if (to.path !== "/login") {
        next({ path: "/login" });
        return;
      }
    }
  }

  // 未登录且访问非登录页面，重定向到登录页
  if (!userStore.token && to.path !== "/login") {
    next({ path: "/login" });
    return;
  }

  // 已登录用户访问登录页，重定向到首页
  if (userStore.token && to.path === "/login") {
    next({ path: "/" });
    return;
  }

  next();
});

export default router;
