import axios from "axios";
import { ElMessage } from "element-plus";
const request = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 60000, // 请求超时时间
});

// 异常拦截处理器
const errorHandler = (error: any) => {
  if (error.response) {
    switch (error.response.status) {
      case 401:
        // 登录过期错误处理
        break;
      case 500:
        // 服务器错误处理
        break;
      default:
        ElMessage.error(`${error}`);
    }
  }
  return Promise.reject(error);
};

// 前置拦截器（发起请求之前的拦截）
request.interceptors.request.use((config) => {
  /**
   * 如果token 存在，则给请求头加token
   */
  // eslint-disable-next-line no-undef
  const token = sessionStorage.getItem("token");
  if (token) {
    config.headers.token = `${token}`;
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
