import request from "@/utils/request";
import type {
  loginFormData,
  registerFormData,
  logoutResponse,
  updateUserData,
} from "./type";

enum API {
  LOGIN_URL = "/login",
  LOGOUT_URL = "/user/logout",
  UPDATE_URL = "/user/update",
  USER_ADD = "/user/save",
  USER_GET_BY_ID = "/user/{id}",
  //keyword:模糊查询用户名和账号
  USER_PAGE = "/user/page",
  USER_DELETE_BY_ID = "/user/delete/{id}",
}

/**
 * 用户登录
 * @param data 登录表单数据
 * @returns
 */
export function reqLogin(data: loginFormData) {
  return request({
    url: API.LOGIN_URL,
    // url: `${API.LOGIN_URL}?username=${data.username}&password=${data.password}`,
    method: "post",
    params: {
      username: data.username,
      password: data.password,
    },
    headers: {
      userType: 4,
    },
  });
}

/**
 * 用户注销
 * @returns
 */
export function reqLogout(): Promise<logoutResponse> {
  return request({
    url: API.LOGOUT_URL,
    method: "get",
  });
}
/**
 * 增加用户信息
 * @returns
 */
export function reqAddUser(data: registerFormData) {
  return request({
    url: API.USER_ADD,
    method: "post",
    data,
  });
}
/**
 * 更新用户信息
 * @param data 更新数据
 * @returns
 */
export function reqUpdateUser(data: updateUserData) {
  return request({
    url: API.UPDATE_URL,
    method: "put",
    data,
  });
}

/**
 * 根据ID获取用户信息
 * @param id 用户ID
 * @returns
 */
export function reqGetUserById(id: number) {
  return request({
    url: API.USER_GET_BY_ID.replace("{id}", String(id)),
    method: "get",
  });
}

/**
 * 根据ID删除用户
 * @param id 用户ID
 * @returns
 */
export function reqDeleteUserById(id: number) {
  // 类型定义为null
  return request({
    url: API.USER_DELETE_BY_ID.replace("{id}", String(id)),
    method: "delete",
  });
}

/**
 * 分页获取用户列表
 * @param id 用户ID
 * @returns
 */
export function reqGetUserPage(data: any) {
  return request({
    url: API.USER_PAGE,
    method: "get",
    params: data,
  });
}
