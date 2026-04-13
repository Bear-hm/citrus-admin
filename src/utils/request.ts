/*
 * @Author: xiong x1253780359@outlook.com
 * @Date: 2025-10-10 08:42:07
 * @LastEditors: xiong x1253780359@outlook.com
 * @LastEditTime: 2026-04-12 17:27:54
 * @FilePath: \citrus\citrus-admin\src\utils\request.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import axios from "axios";
const request = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 60000, // 请求超时时间
});

// 异常拦截处理器
const errorHandler = (error: any) => {
  if (error.response) {
    switch (error.response.status) {
      case 401:
        break;
      case 500:
        break;
      default:
        break;
    }
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
  return response.data;
}, errorHandler);

export default request;
