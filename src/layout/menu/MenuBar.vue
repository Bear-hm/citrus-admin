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
$menu-bg: linear-gradient(180deg, #1c1917 0%, #292524 100%);
$hover-bg: rgba(255, 255, 255, 0.06);
$active-left-border: #f97316;

.el-menu-vertical-demo:not(.el-menu--collapse) {
  min-height: 400px;
  background: $menu-bg;
}

.el-menu {
  border-right: none;
  background: $menu-bg;
}

// 通用菜单项样式
:deep(.el-menu-item) {
  color: rgba(255, 255, 255, 0.72);
  font-size: 14px;
  height: 44px;
  line-height: 44px;
  margin: 2px 8px;
  border-radius: 8px;
  border-left: 3px solid transparent;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

// Hover 状态：左边框 + 背景微亮
:deep(.el-menu-item:hover) {
  background: $hover-bg !important;
  color: #ffffff !important;
  border-left: 3px solid rgba(249, 115, 22, 0.5);
  transform: translateX(2px);
}

// Active 状态：左边框高亮 + 渐变背景
:deep(.el-menu-item.is-active) {
  color: #ffffff !important;
  background: linear-gradient(135deg, rgba(249, 115, 22, 0.15) 0%, rgba(234, 179, 8, 0.1) 100%) !important;
  border-left: 4px solid $active-left-border;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(249, 115, 22, 0.2);
  transform: translateX(2px);
}

// 子菜单展开后的子菜单项容器 - 仅透明背景，不影响内部 item
:deep(.is-opened > .el-menu--inline) {
  background: transparent !important;
}

// 子菜单标题 - 与父菜单区分：字号稍小、左侧缩进
:deep(.el-sub-menu .el-sub-menu__title) {
  color: rgba(255, 255, 255, 0.65);
  font-size: 14px;
  height: 44px;
  line-height: 44px;
  margin: 2px 8px;
  padding-left: 14px !important;
  border-radius: 8px;
  border-left: 3px solid transparent;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 500;
}

:deep(.el-sub-menu__title) {
  background: transparent !important;
}

:deep(.el-sub-menu__title:hover) {
  background: $hover-bg !important;
  color: #ffffff !important;
  border-left: 3px solid rgba(249, 115, 22, 0.5);
  transform: translateX(2px);
}

// 激活的子菜单（父级）
:deep(.el-sub-menu.is-active > .el-sub-menu__title) {
  color: #ffffff !important;
  border-left: 4px solid $active-left-border;
  font-weight: 600;
  background: linear-gradient(135deg, rgba(249, 115, 22, 0.15) 0%, rgba(234, 179, 8, 0.1) 100%) !important;
  box-shadow: 0 2px 8px rgba(249, 115, 22, 0.2);
}

:deep(.el-menu-item-group__title) {
  padding: 0;
}

:deep(.el-menu--collapse) {
  background: $menu-bg;
  width: 64px;
}

// 子菜单内的菜单项 - 缩进 + 字号更小 + 颜色更浅
:deep(.el-sub-menu .el-menu--inline .el-menu-item) {
  padding-left: 44px !important;
  font-size: 13px;
  height: 40px;
  line-height: 40px;
  margin: 1px 8px 1px 0;
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.55);
}

:deep(.el-sub-menu .el-menu--inline .el-menu-item:hover) {
  background: rgba(255, 255, 255, 0.05) !important;
  color: rgba(255, 255, 255, 0.9) !important;
  border-left: 3px solid rgba(249, 115, 22, 0.4);
}

:deep(.el-sub-menu .el-menu--inline .el-menu-item.is-active) {
  background: linear-gradient(135deg, rgba(249, 115, 22, 0.2) 0%, rgba(234, 179, 8, 0.12) 100%) !important;
  color: #ffffff !important;
  border-left: 4px solid $active-left-border;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(249, 115, 22, 0.2);
}
:deep(.el-menu--popup) {
  background: #292524;
  border-radius: 10px;
  padding: 6px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

:deep(.el-menu--popup .el-menu-item) {
  color: rgba(255, 255, 255, 0.72);
  border-radius: 6px;
  margin: 2px 0;
  &:hover {
    background: $hover-bg !important;
    color: #ffffff !important;
  }
  &.is-active {
    background: linear-gradient(135deg, rgba(249, 115, 22, 0.2) 0%, rgba(234, 179, 8, 0.15) 100%) !important;
    color: #ffffff !important;
    font-weight: 600;
  }
}

// 图标对齐
:deep(.el-menu-item .el-icon),
:deep(.el-sub-menu__title .el-icon) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  margin-right: 10px;
  font-size: 18px;
}

// 子菜单内的图标 - 更小更轻
:deep(.el-sub-menu .el-menu--inline .el-menu-item .el-icon) {
  width: 16px;
  height: 16px;
  margin-right: 8px;
  font-size: 15px;
  opacity: 0.8;
}

// 子菜单展开箭头
:deep(.el-sub-menu .el-sub-menu__title .el-sub-menu__icon-arrow) {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.4);
}

:deep(.el-menu),
:deep(.el-menu .el-sub-menu),
:deep(.el-menu .el-menu-item),
:deep(.el-menu .el-sub-menu__title) {
  backface-visibility: hidden;
}
</style>
