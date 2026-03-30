<template>
  <template v-for="menu in menuList" :key="menu.path">
    <template v-if="!menu.children">
      <el-menu-item
        :index="menu.path"
        v-if="!menu.meta?.hidden"
        style="padding-left: 20px; color: #ffffff"
      >
        <el-icon v-if="menu.meta?.icon">
          <component :is="menu.meta.icon"></component>
        </el-icon>
        <template #title>
          <span>{{ menu.meta?.title }}</span>
        </template>
      </el-menu-item>
    </template>

    <template v-if="menu.children && menu.children.length === 1">
      <el-menu-item
        :index="resolveMenuIndex(menu.path, menu.children[0].path)"
        v-if="!menu.children[0].meta?.hidden"
        style="padding-left: 20px; color: #ffffff"
      >
        <el-icon v-if="menu.children[0].meta?.icon">
          <component :is="menu.children[0].meta.icon"></component>
        </el-icon>
        <template #title>
          <span>{{ menu.children[0].meta?.title }}</span>
        </template>
      </el-menu-item>
    </template>

    <el-sub-menu
      v-if="menu.children && menu.children.length > 1"
      :index="menu.path"
      style="padding-left: 0"
      popper-append-to-body
    >
      <template #title>
        <el-icon v-if="menu.meta?.icon">
          <component :is="menu.meta.icon"></component>
        </el-icon>
        <span>{{ menu.meta?.title }}</span>
      </template>
      <template v-for="child in menu.children" :key="child.path">
        <el-menu-item
          :index="resolveMenuIndex(menu.path, child.path)"
          v-if="!child.meta?.hidden"
          style="padding-left: 40px"
        >
          <el-icon v-if="child.meta?.icon">
            <component :is="child.meta.icon"></component>
          </el-icon>
          <template #title>
            <span>{{ child.meta?.title }}</span>
          </template>
        </el-menu-item>
      </template>
    </el-sub-menu>
  </template>
</template>

<script lang="ts" setup>
import { defineProps } from "vue";

interface MenuItem {
  path: string;
  meta?: {
    title?: string;
    icon?: string;
    hidden?: boolean;
  };
  children?: MenuItem[];
  redirect?: string;
}

defineProps<{
  menuList: MenuItem[];
}>();

const resolveMenuIndex = (parentPath: string, childPath?: string) => {
  const normalizedParent = parentPath.endsWith("/")
    ? parentPath.slice(0, -1)
    : parentPath;
  const normalizedChild = (childPath || "").replace(/^\/+/, "");
  if (!normalizedChild) return normalizedParent || "/";
  return `${normalizedParent}/${normalizedChild}`;
};
</script>

<style lang="scss" scoped>
$hover-bg: rgba(249, 115, 22, 0.18);
$active-gradient: linear-gradient(135deg, #f97316 0%, #eab308 100%);

.el-menu-item {
  background-color: transparent !important;
  margin: 4px 8px;
  border-radius: 8px;
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
}

.el-menu-item.is-active {
  color: #ffffff !important;
  background: $active-gradient !important;
  box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
}

.el-sub-menu__title {
  color: rgba(255, 255, 255, 0.92) !important;
  padding-left: 20px !important;
}

:deep(.el-sub-menu .el-menu) {
  background-color: transparent !important;
  .el-menu-item {
    padding-left: 40px !important;
  }
}

:deep(.el-menu--collapse) {
  .el-sub-menu__title {
    padding-left: 20px !important;
  }
}

.el-menu-item:hover {
  background: $hover-bg !important;
  border-radius: 8px !important;
  transition: background-color 0.2s ease;
}

:deep(.el-menu--inline) {
  background-color: transparent !important;
}
</style>
