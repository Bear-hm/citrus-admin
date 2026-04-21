import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { reqLogin, reqGetUserById, reqLogout } from "@/api/user/index";

const TOKEN_KEY = "citrus_admin_token";
const USER_INFO_KEY = "citrus_admin_userinfo";

export interface UserInfoVO {
  id?: number;
  username?: string;
  account?: string;
  name?: string;
  avatar?: string;
  userType?: string;
  mobile?: string;
  email?: string;
  createDate?: string;
  updateDate?: string;
  roles?: string[];
}

export const useUserStore = defineStore("user", () => {
  const token = ref<string>("");
  const userInfo = ref<UserInfoVO>({});
  const loading = ref(false);

  const isLoggedIn = computed(() => !!token.value);
  const userName = computed(() => userInfo.value.username || userInfo.value.name || "");
  const userAvatar = computed(() => {
    if (userInfo.value.avatar) {
      return userInfo.value.avatar;
    }
    return "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png";
  });
  const userId = computed(() => userInfo.value.id);
  const userType = computed(() => userInfo.value.userType);

  const userTypeLabel = computed(() => {
    const map = {
      farmer: "农户",
      wholesaler: "采购商",
      admin: "管理员",
    };
    return map[userInfo.value.userType || ""] || userInfo.value.userType || "未知";
  });

  function _persistToken(newToken: string) {
    localStorage.setItem(TOKEN_KEY, newToken);
    token.value = newToken;
  }

  function _persistUserInfo(info: UserInfoVO) {
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(info));
    userInfo.value = info;
  }

  function _clearAll() {
    token.value = "";
    userInfo.value = {};
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_INFO_KEY);
    sessionStorage.removeItem("token");
  }

  // 公开的清除所有方法，供外部调用（如 request 拦截器）
  function clearAll() {
    _clearAll();
  }

  function initFromStorage() {
    const savedToken = localStorage.getItem(TOKEN_KEY);
    const savedUserInfo = localStorage.getItem(USER_INFO_KEY);
    if (savedToken) {
      token.value = savedToken;
      sessionStorage.setItem("token", savedToken);
    }
    if (savedUserInfo) {
      try {
        userInfo.value = JSON.parse(savedUserInfo);
      } catch {
        userInfo.value = {};
      }
    }
  }

  async function login(username: string, password: string) {
    const res = await reqLogin({ username, password });
    if (res.code === 200 && res.data) {
      _persistToken(res.data.token);
      setLoginInfo(res.data.userVO, res.data.token);
      return res;
    }
    throw new Error(res.message || "登录失败");
  }

  function setLoginInfo(userVO: UserInfoVO, newToken: string) {
    _persistToken(newToken);
    _persistUserInfo(userVO);
  }

  async function fetchUserInfo(): Promise<void> {
    if (!token.value) {
      throw new Error("无token，无法获取用户信息");
    }
    loading.value = true;
    try {
      const res = await reqGetUserById();
      if (res.code === 200 && res.data) {
        _persistUserInfo(res.data);
      } else {
        throw new Error(res.message || "获取用户信息失败");
      }
    } finally {
      loading.value = false;
    }
  }

  async function logout(): Promise<void> {
    try {
      await reqLogout();
    } catch {
      // 忽略后端错误，确保本地清理
    }
    _clearAll();
  }

  function updateUserInfo(info: Partial<UserInfoVO>) {
    const updated = { ...userInfo.value, ...info };
    _persistUserInfo(updated);
  }

  return {
    token,
    userInfo,
    loading,
    isLoggedIn,
    userName,
    userAvatar,
    userId,
    userType,
    userTypeLabel,
    initFromStorage,
    login,
    setLoginInfo,
    fetchUserInfo,
    logout,
    clearAll,
    updateUserInfo,
  };
});
