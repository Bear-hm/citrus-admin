/*
 * @Author: xiong x1253780359@outlook.com
 * @Date: 2025-10-10 08:42:07
 * @LastEditors: xiong x1253780359@outlook.com
 * @LastEditTime: 2026-04-12 17:27:54
 * @FilePath: \citrus\citrus-admin\src\utils\request.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import axios from "axios";
import message from "@/utils/message";
import { useUserStore } from "@/store/user";
import router from "@/router/index";

const request = axios.create({
  baseURL: "/api",
  timeout: 60000, // 请求超时时间
});

// 退出登录并跳转登录页
const logoutAndRedirect = () => {
  const userStore = useUserStore();
  userStore.clearAll();
  sessionStorage.removeItem("token");
  localStorage.removeItem("citrus_admin_token");
  localStorage.removeItem("citrus_admin_userinfo");
  router.push("/login");
};

const normalizeResponseData = (data: any) => {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return data;
  }

  if (typeof data.code === "number") {
    if (data.code === 0) {
      return {
        ...data,
        code: 200,
        rawCode: 0,
      };
    }
    return data;
  }

  if (typeof data.success === "boolean") {
    return {
      ...data,
      code: data.success ? 200 : 500,
    };
  }

  return data;
};

// 异常拦截处理器
const errorHandler = (error: any) => {
  // 网络错误（请求未发出或无响应）
  if (!error.response) {
    message.error("网络连接失败，请检查网络后重试");
    return Promise.reject(error);
  }

  const { status, data } = error.response;

  switch (status) {
    case 401:
      // Token 过期、无效或未提供
      if (data?.message?.includes("expired") || data?.message?.includes("过期")) {
        message.warning("登录已过期，请重新登录");
      } else if (data?.message?.includes("invalid") || data?.message?.includes("无效")) {
        message.warning("登录信息无效，请重新登录");
      } else {
        message.warning("请先登录后再访问");
      }
      logoutAndRedirect();
      break;

    case 403:
      // 403 可能是 token 失效（后端未配置 AuthenticationEntryPoint 时返回 403）
      // 也可能是真正的权限不足，需要区分处理
      if (data?.message?.includes("expired") || data?.message?.includes("过期")
        || data?.message?.includes("invalid") || data?.message?.includes("无效")
        || data?.message?.includes("token") || data?.message?.includes("Token")
        || data?.message?.includes("认证") || data?.message?.includes("登录")) {
        message.warning("登录信息已失效，请重新登录");
        logoutAndRedirect();
      } else {
        message.error("权限不足，无法访问该资源");
      }
      break;

    case 404:
      // 资源不存在
      message.warning("请求的资源不存在");
      break;

    case 500:
      // 服务器内部错误
      message.error(data?.message || "服务器繁忙，请稍后重试");
      break;

    case 502:
      // 网关错误
      message.error("服务器网关错误，请稍后重试");
      break;

    case 503:
      // 服务不可用
      message.error("服务暂时不可用，请稍后重试");
      break;

    case 504:
      // 网关超时
      message.error("请求超时，请稍后重试");
      break;

    default:
      // 其他错误，显示后端返回的消息或默认提示
      if (data?.message) {
        message.error(data.message);
      } else {
        message.error(`请求失败 (${status})`);
      }
      break;
  }
  return Promise.reject(error);
};

// 前置拦截器（发起请求之前的拦截）
request.interceptors.request.use((config) => {
  /**
   * 如果token 存在，则给请求头加token
   * 使用标准的 Authorization Bearer 格式
   */
  const token = sessionStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, errorHandler);

// 后置拦截器（获取到响应时的拦截）
request.interceptors.response.use((response) => {
  /**
   * 根据你的项目实际情况来对 response 和 error 做处理
   * 这里对 response 和 error 不做任何处理，直接返回
   */
  return normalizeResponseData(response.data);
}, errorHandler);

export default request;
