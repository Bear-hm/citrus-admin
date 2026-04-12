import request from "@/utils/request";
import type { ResponseData } from "@/api/type";

// 接口枚举
enum API {
  AGRI_ADVICE = "/api/home/advice",
}

/**
 * 获取农事建议
 */
export function reqGetAgriAdvice() {
  return request<ResponseData>({
    url: API.AGRI_ADVICE,
    method: "get",
  });
}
