<template>
  <div class="header-bar">
    <div class="header-bar__crumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="(item, index) in tabs" :key="item.path">
          <span
            class="crumb-text"
            :class="{ 'is-current': index === tabs.length - 1 }"
          >
            {{ item.meta.title }}
          </span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="header-bar__meta">
      <div class="calendar">
        <el-icon class="calendar__icon"><Calendar /></el-icon>
        <SimpleCalendar />
      </div>
    </div>
    <div class="header-bar__user">
      <img class="avatar" :src="userInfo.userImage" alt="" />
      <div class="user-detail">
        <span class="user-name">{{ userInfo.username }}</span>
        <el-dropdown class="user-menu" @command="handleCommand">
          <el-icon class="user-menu__trigger"><Tools /></el-icon>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="setting">个人设置</el-dropdown-item>
              <el-dropdown-item command="quit" divided
                >退出登录</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { reqLogout } from "@/api/user/index";
import SimpleCalendar from "@/components/SimpleCalendar.vue";
import { ElMessage } from "element-plus";
import Cookies from "js-cookie";

const userInfo = {
  username: "管理员",
  userImage:
    "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
};

onMounted(() => {});

const tabs = ref([]);
const route = useRoute();
const router = useRouter();

const getBreadCom = () => {
  let mached = route.matched.filter((item) => item.meta && item.meta.title);
  tabs.value = mached;
};
getBreadCom();
watch(
  () => route.path,
  () => getBreadCom()
);

const logout = async () => {
  const res = await reqLogout();
  if (res.code === "200") {
    ElMessage({
      type: "success",
      message: "退出登录成功",
    });
    Cookies.remove("auth_token");
    router.push("/login");
  }
};

const handleCommand = (command) => {
  switch (command) {
    case "quit":
      logout();
      break;
    case "setting":
      router.push("/setting/personal");
      break;
  }
};
</script>

<style lang="scss" scoped>
.header-bar {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 4px 0 0;
}

.header-bar__crumb {
  flex: 1;
  min-width: 0;
  background: var(--background-page, #ffffff);
  min-height: 48px;
  padding: 0 18px;
  display: flex;
  align-items: center;
  border-radius: 12px;
  border: 1px solid rgba(17, 24, 39, 0.06);
  box-shadow: 0 1px 2px rgba(17, 24, 39, 0.05);
}

.header-bar__crumb :deep(.el-breadcrumb) {
  font-size: 14px;
  line-height: 1.6;
  width: 100%;
}

.header-bar__crumb :deep(.el-breadcrumb__separator) {
  color: var(--text-tertiary, #9ca3af);
  font-weight: 400;
  margin: 0 6px;
}

.crumb-text {
  color: var(--text-secondary, #6b7280);
  font-weight: 400;
}

.crumb-text.is-current {
  color: var(--text-title, #111827);
  font-weight: 600;
}

.header-bar__meta {
  flex-shrink: 0;
}

.calendar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 14px 0 12px;
  min-height: 48px;
  background: var(--background-subtle, #fff7ed);
  border-radius: 12px;
  border: 1px solid rgba(249, 115, 22, 0.12);
}

.calendar__icon {
  font-size: 20px;
  color: var(--color-primary, #f97316);
  flex-shrink: 0;
}

.header-bar__user {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--background-page, #ffffff);
  min-height: 48px;
  padding: 4px 14px 4px 6px;
  border-radius: 12px;
  border: 1px solid rgba(17, 24, 39, 0.06);
  box-shadow: 0 1px 2px rgba(17, 24, 39, 0.05);
}

.avatar {
  border-radius: 50%;
  width: 36px;
  height: 36px;
  object-fit: cover;
}

.user-detail {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.user-name {
  font-size: 14px;
  line-height: 1.6;
  font-weight: 500;
  color: var(--text-title, #111827);
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-menu {
  cursor: pointer;
  line-height: 1;
}

.user-menu__trigger {
  font-size: 20px;
  color: var(--text-secondary, #6b7280);
  transition: color 0.2s ease, transform 0.2s ease;
}

.user-menu__trigger:hover {
  color: var(--color-primary-hover, #ea580c);
  transform: rotate(45deg);
}

.header-bar__crumb :deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner) {
  color: inherit;
  font-weight: inherit;
}
</style>
