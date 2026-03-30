import request from "@/utils/request";
enum API {
  OBTAIN_VISIT_DATA = "/visit/getOne",
  VISIT_SEVEN_DATA = "/visit/getSeven",
}

/**
 * 获取统计访问数据
 * @returns 访问数据
 */
export function reqVisitData() {
  return request({
    url: API.OBTAIN_VISIT_DATA,
    method: "get",
  });
}

/**
 * 获取最近七天的访问数据
 * @returns 七天访问数据
 */
export function reqSevenVisitData() {
  return request({
    url: API.VISIT_SEVEN_DATA,
    method: "get",
  });
}
