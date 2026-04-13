import request from "@/utils/request";
import type { ResponseData } from "@/api/type";

enum API {
  LOGIN_URL = "user/login",
  LOGOUT_URL = "/user/logout",
  UPDATE_URL = "/user",
  USER_ADD = "/user/register",
  USER_GET_BY_ID = "/user/info",
  USER_PAGE = "/user/page",
  USER_DELETE_BY_ID = "/user/{id}",
  USER_REGISTER = "/user/register",
}

/**
 * 用户登录
 */
export function reqLogin(data: { username: string; password: string }) {
  return request<ResponseData>({
    url: API.LOGIN_URL,
    method: "post",
    data: {
      username: data.username,
      password: data.password,
    },
  });
}

/**
 * 用户注销
 */
export function reqLogout() {
  return request<ResponseData>({
    url: API.LOGOUT_URL,
    method: "get",
  });
}

/**
 * 新增用户
 */
export function reqAddUser(data: {
  username: string;
  password?: string;
  name?: string;
  phone?: string;
  email?: string;
  userType?: string;
}) {
  return request<ResponseData>({
    url: API.USER_REGISTER,
    method: "post",
    data,
  });
}

/**
 * 更新用户信息
 */
export function reqUpdateUser(data: {
  id?: number;
  name?: string;
  phone?: string;
  email?: string;
  avatar?: string;
  userType?: string;
  status?: number;
}) {
  return request<ResponseData>({
    url: API.UPDATE_URL,
    method: "put",
    data,
  });
}

/**
 * 获取当前用户信息
 */
export function reqGetUserById() {
  return request<ResponseData>({
    url: API.USER_GET_BY_ID,
    method: "get",
  });
}

/**
 * 根据ID删除用户
 */
export function reqDeleteUserById(id: number) {
  return request<ResponseData>({
    url: API.USER_DELETE_BY_ID.replace("{id}", String(id)),
    method: "delete",
  });
}

/**
 * 分页获取用户列表 - 对齐后端 UserPageDTO
 */
export function reqGetUserPage(data: {
  pageNum: number;
  pageSize: number;
  username?: string;
  name?: string;
  phone?: string;
  userType?: string;
  status?: number;
}) {
  return request<ResponseData>({
    url: API.USER_PAGE,
    method: "get",
    params: data,
  });
}
