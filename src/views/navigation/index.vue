<template>
  <div class="navigation-container">
    <!-- <div class="header">
      <div class="user-info">
        <span>{{ userName }}</span>
        <router-link to="/login" class="logout">注销</router-link>
      </div>
    </div> -->

    <div class="cards-container">
      <div
        v-for="menu in menus"
        :key="menu.id"
        class="nav-card"
        @click="navigateTo(menu.path)"
      >
        <div class="card-icon">
          <i :class="'iconfont icon-' + menu.icon"></i>
        </div>
        <h2>{{ menu.name }}</h2>
        <div class="card-hover-effect"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { constantRoute } from "@/router/router";
const router = useRouter();
const userName = ref("");
const menus = ref(
  constantRoute
    .filter((route) => {
      // 排除登录页和其他隐藏的路由
      if (route.meta?.hidden || route.path === "/login" || route.path === "/") {
        return false;
      }
      if (route.children && route.children.length > 0) {
        // 如果所有子路由都是隐藏的，则不显示该路由
        const allChildrenHidden = route.children.every(
          (child) => child.meta?.hidden === true
        );
        if (allChildrenHidden) {
          return false;
        }
      }
      if (route.path === "/") {
        return route.children && route.children.length > 0;
      }
      return true;
    })
    .map((route) => {
      // 如果有子路由，使用第一个子路由的信息
      if (route.children && route.children.length > 0) {
        const firstChild = route.children[0];
        return {
          path: `${route.path}${firstChild.path ? "/" + firstChild.path : ""}`,
          name: route.meta?.title || firstChild.meta?.title || "",
          icon: route.meta?.icon || firstChild.meta?.icon || "User",
          meta: route.meta || firstChild.meta,
        };
      }
      // 没有子路由的情况
      return {
        path: route.path,
        name: route.meta?.title || "",
        icon: route.meta?.icon || "User",
        meta: route.meta,
      };
    })
);
console.log("menus", menus.value);

const navigateTo = (path) => {
  router.push(path);
};
</script>

<style lang="less" scoped>
.navigation-container {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 20px;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;
    padding: 20px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

    h1 {
      color: #009c74;
      margin: 0;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 16px;

      .logout {
        color: #ff6b6b;
        text-decoration: none;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }

  .cards-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px;
    padding: 20px;
  }

  .nav-card {
    position: relative;
    background: #fff;
    border-radius: 12px;
    padding: 30px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);

      .card-hover-effect {
        transform: scale(1);
      }
    }

    .card-icon {
      font-size: 48px;
      color: #009c74;
      margin-bottom: 20px;
    }

    h2 {
      color: #333;
      margin: 0;
      position: relative;
      z-index: 1;
    }

    .card-hover-effect {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 4px;
      background: #34c9a3;
      transform: scale(0);
      transition: transform 0.3s ease;
      transform-origin: center;
    }
  }
}
</style>
