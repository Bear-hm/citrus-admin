import request from "@/utils/request";
import type { GanjuwPageResponse, GanjuInfoParams } from "./type";
enum API {
  // 修改柑橘网的柑橘新闻内容
  CRAWLER_GANJUW_UPDATE = "/crawler/ganjuw/update",
  // 新增柑橘网的柑橘新闻内容
  CRAWLER_GANJUW_SAVE = "/crawler/ganjuw/save",
  // 爬取柑橘网的柑橘新闻内容
  CRAWLER_GANJUW = "/crawler/ganjuw",
  // 分页获取柑橘网的柑橘新闻内容，根据type来获取不同分类的
  CRAWLER_GANJUW_PAGE = "/crawler/ganjuwPage",
  // 根据id获取柑橘网的柑橘新闻内容
  CRAWLER_GANJUW_GET_BY_ID = "/crawler/ganjuw/{id}",
  // 删除柑橘网的柑橘新闻内容
  CRAWLER_GANJUW_DELETE_BY_ID = "/crawler/ganjuw/delete/{id}",
}
/**
 * 更新柑橘网新闻
 * @param data 更新的新闻数据
 * @returns
 */
export function reqUpdateGanjuw(data: any) {
  return request({
    url: API.CRAWLER_GANJUW_UPDATE,
    method: "post",
    data,
  });
}

/**
 * 新增柑橘网新闻
 * @param data 新增的新闻数据
 * @returns
 */
export function reqSaveGanjuw(data: any) {
  return request({
    url: API.CRAWLER_GANJUW_SAVE,
    method: "post",
    data,
  });
}

/**
 * 爬取柑橘网新闻
 * @returns
 */
export function reqCrawlerGanjuw() {
  return request({
    url: API.CRAWLER_GANJUW,
    method: "get",
  });
}

/**
 * 分页获取柑橘网新闻
 * @param params 分页参数，包含 pageNum、pageSize 和 type
 * @returns
 * type 可选值：
 * - NEWS: 行业资讯
 * - LAWS: 政策法规
 * - MARKET: 行情资讯
 * - TECH: 种植技术
 * - HEAD: 橘页头条
 */
export function reqGetGanjuwPage(
  params: GanjuInfoParams
): Promise<GanjuwPageResponse> {
  const queryParams = Object.keys(params)
    .map(
      (key) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(
          params[key as keyof GanjuInfoParams]
        )}`
    )
    .join("&");
  return request({
    url: `${API.CRAWLER_GANJUW_PAGE}?${queryParams}`,
    method: "get",
  });
}

/**
 * 根据ID获取柑橘网新闻
 * @param id 新闻ID
 * @returns
 */
export function reqGetGanjuwById(id: number) {
  return request({
    url: API.CRAWLER_GANJUW_GET_BY_ID.replace("{id}", String(id)),
    method: "get",
  });
}

/**
 * 根据ID删除柑橘网新闻
 * @param id 新闻ID
 * @returns
 */
export function reqDeleteGanjuwById(id: number) {
  return request({
    url: API.CRAWLER_GANJUW_DELETE_BY_ID.replace("{id}", String(id)),
    method: "delete",
  });
}
