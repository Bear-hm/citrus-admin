import request from "@/utils/request";
import type { ResponseData } from "@/api/type";

// 接口枚举
enum API {
  /** 天气信息及种植建议 */
  WEATHER = "/home/weather",
}

/**
 * 获取天气信息及种植建议
 */
export function reqGetAgriAdvice() {
  return request<ResponseData>({
    url: API.WEATHER,
    method: "get",
  });
}
