<template>
  <MenuLogo></MenuLogo>
  <el-menu
    :default-active="activeMenu"
    :unique-opened="true"
    class="el-menu-vertical-demo"
    :collapse="isCollapse"
    router
    @select="handleMenuSelect"
  >
    <MenuItem :menuList="menuList"> </MenuItem>
  </el-menu>
</template>
<script lang="ts" setup>
import { computed } from "vue";
import { useStore } from "@/store/index";
import MenuItem from "@/layout/menu/MenuItem.vue";
import MenuLogo from "@/layout/menu/MenuLogo.vue";
import { useRouter, useRoute } from "vue-router";
import { constantRoute } from "@/router/router";

const router = useRouter();
const route = useRoute();

const menuList = constantRoute.filter((route) => {
  if (route.meta?.hidden === true) {
    return false;
  }
  if (route.path === "/") {
    return route.children && route.children.length > 0;
  }
  return true;
});

const store = useStore();
const isCollapse = computed(() => {
  return store.getters["getCollapse"];
});

const activeMenu = computed(() => {
  const { path } = route;
  return path;
});

const handleMenuSelect = (index: string) => {
  if (route.path !== index) {
    router.push(index);
  }
};
</script>
<style lang="scss" scoped>
$menu-bg: linear-gradient(180deg, #292524 0%, #44403c 100%);
$hover-bg: rgba(249, 115, 22, 0.18);
$sub-open-bg: rgba(249, 115, 22, 0.1);
$active-gradient: linear-gradient(135deg, #f97316 0%, #eab308 100%);

.el-menu-vertical-demo:not(.el-menu--collapse) {
  min-height: 400px;
  background: $menu-bg;
}

.el-menu {
  border-right: none;
  background: $menu-bg;
}

:deep(.el-sub-menu .el-sub-menu__title) {
  color: rgba(255, 255, 255, 0.92) !important;
  font-size: 14px;
  height: 50px;
  line-height: 50px;
  transition: background-color 0.2s ease, color 0.2s ease;
}

:deep(.el-sub-menu__title) {
  background: transparent !important;
}

:deep(.el-menu .el-menu-item) {
  color: rgba(255, 255, 255, 0.92);
  font-size: 14px;
  height: 50px;
  line-height: 50px;
  transition: background-color 0.2s ease, color 0.2s ease;
  &:nth-last-child(1) {
    border-bottom: 0.1px solid rgba(255, 255, 255, 0.08);
  }
}

:deep(.el-menu-item.is-active) {
  color: #ffffff !important;
  background: $active-gradient !important;
  font-weight: 600;
  box-shadow: 0 2px 10px rgba(249, 115, 22, 0.35);
}

:deep(.is-opened .el-menu-item) {
  background: $sub-open-bg !important;
}

:deep(.el-menu-item:hover) {
  background: $hover-bg !important;
  color: #ffffff !important;
}

:deep(.el-sub-menu__title:hover) {
  background: $hover-bg !important;
  color: #ffffff !important;
}

:deep(.el-sub-menu.is-active .el-sub-menu__title) {
  color: #ffffff !important;
  font-weight: 600;
  background: $active-gradient !important;
}

:deep(.el-menu-item-group__title) {
  padding: 0;
}

:deep(.el-menu--collapse) {
  background: $menu-bg;
}

:deep(.el-menu--popup) {
  background: #44403c;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18);
}

:deep(.el-menu--popup .el-menu-item) {
  color: rgba(255, 255, 255, 0.92);
  &:hover {
    background: $hover-bg !important;
  }
  &.is-active {
    background: $active-gradient !important;
    color: #ffffff !important;
  }
}
</style>
