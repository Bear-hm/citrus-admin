<template>
  <template v-for="menu in menuList" :key="menu.path">
    <!-- 无子菜单的菜单项 -->
    <template v-if="!menu.children">
      <el-menu-item :index="menu.path" v-if="!menu.meta?.hidden" class="menu-item">
        <el-icon v-if="menu.meta?.icon" class="menu-icon">
          <component :is="menu.meta.icon"></component>
        </el-icon>
        <template #title>
          <span>{{ menu.meta?.title }}</span>
        </template>
      </el-menu-item>
    </template>

    <!-- 只有一个子菜单 -->
    <template v-if="menu.children && menu.children.length === 1">
      <el-menu-item
        :index="resolveMenuIndex(menu.path, menu.children[0].path)"
        v-if="!menu.children[0].meta?.hidden"
        class="menu-item"
      >
        <el-icon v-if="menu.children[0].meta?.icon" class="menu-icon">
          <component :is="menu.children[0].meta.icon"></component>
        </el-icon>
        <template #title>
          <span>{{ menu.children[0].meta?.title }}</span>
        </template>
      </el-menu-item>
    </template>

    <!-- 多子菜单 -->
    <el-sub-menu
      v-if="menu.children && menu.children.length > 1"
      :index="menu.path"
      popper-append-to-body
    >
      <template #title>
        <el-icon v-if="menu.meta?.icon" class="menu-icon">
          <component :is="menu.meta.icon"></component>
        </el-icon>
        <span>{{ menu.meta?.title }}</span>
      </template>
      <template v-for="child in menu.children" :key="child.path">
        <el-menu-item
          :index="resolveMenuIndex(menu.path, child.path)"
          v-if="!child.meta?.hidden"
          class="menu-item menu-item--child"
        >
          <el-icon v-if="child.meta?.icon" class="menu-icon">
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
$hover-bg: rgba(255, 255, 255, 0.06);
$active-left-border: #f97316;

// 通用菜单项样式
.menu-item {
  background-color: transparent !important;
  margin: 2px 8px;
  border-radius: 8px;
  border-left: 3px solid transparent;
  padding-left: 16px !important;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background: $hover-bg !important;
    border-left-color: rgba(249, 115, 22, 0.5);
    transform: translateX(2px);
  }

  &.is-active {
    color: #ffffff !important;
    background: linear-gradient(135deg, rgba(249, 115, 22, 0.15) 0%, rgba(234, 179, 8, 0.1) 100%) !important;
    border-left: 4px solid $active-left-border;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(249, 115, 22, 0.2);
    transform: translateX(2px);
  }
}

// 子菜单项缩进
.menu-item--child {
  padding-left: 36px !important;
}

// 图标对齐
.menu-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  margin-right: 10px;
  font-size: 18px;
}

// 内联菜单背景
:deep(.el-menu--inline) {
  background-color: transparent !important;
}
</style>
