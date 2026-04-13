import request from "@/utils/request";
import type { ResponseData } from "@/api/type";

// 接口枚举
enum API {
  WEATHER_INFO = "/home/weather",
}

/**
 * 获取天气信息
 */
export function reqGetWeather() {
  return request<ResponseData>({
    url: API.WEATHER_INFO,
    method: "get",
  });
}
