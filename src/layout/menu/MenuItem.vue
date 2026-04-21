<template>
  <template v-for="menu in menuList" :key="menu.path">
    <el-menu-item
      v-if="shouldRenderSingleItem(menu)"
      :index="getSingleItemIndex(menu)"
      class="menu-item"
    >
      <el-icon v-if="getSingleItemIcon(menu)" class="menu-icon">
        <component :is="getSingleItemIcon(menu)"></component>
      </el-icon>
      <template #title>
        <span>{{ getSingleItemTitle(menu) }}</span>
      </template>
    </el-menu-item>

    <el-sub-menu v-else-if="shouldRenderSubMenu(menu)" :index="menu.path">
      <template #title>
        <el-icon v-if="menu.meta?.icon" class="menu-icon">
          <component :is="menu.meta.icon"></component>
        </el-icon>
        <span>{{ menu.meta?.title }}</span>
      </template>
      <template v-for="child in menu.children" :key="child.path">
        <el-menu-item
          v-if="!child.meta?.hidden"
          :index="resolveMenuIndex(menu.path, child.path)"
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
interface MenuItem {
  path: string;
  meta?: {
    title?: string;
    icon?: string | object;
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

const shouldRenderSingleItem = (menu: MenuItem) => {
  if (!menu.children || menu.children.length === 0) {
    return !menu.meta?.hidden;
  }

  if (menu.children.length === 1) {
    return !menu.children[0].meta?.hidden;
  }

  return false;
};

const shouldRenderSubMenu = (menu: MenuItem) => {
  return !!menu.children && menu.children.length > 1;
};

const getSingleItem = (menu: MenuItem) => {
  if (menu.children && menu.children.length === 1) {
    return menu.children[0];
  }

  return menu;
};

const getSingleItemIndex = (menu: MenuItem) => {
  const item = getSingleItem(menu);

  if (item === menu) {
    return menu.path;
  }

  return resolveMenuIndex(menu.path, item.path);
};

const getSingleItemTitle = (menu: MenuItem) => {
  return getSingleItem(menu).meta?.title;
};

const getSingleItemIcon = (menu: MenuItem) => {
  return getSingleItem(menu).meta?.icon;
};
</script>

<style lang="scss" scoped>
.menu-item {
  background-color: transparent !important;
  padding-left: 16px !important;
}

.menu-item--child {
  padding-left: 44px !important;
}

.menu-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  margin-right: 10px;
  font-size: 18px;
}
</style>
