import request from "@/utils/request";
import type { ResponseData } from "@/api/type";

// 接口枚举
enum API {
  NEWS_LIST = "/api/news/list",
  NEWS_DETAIL = "/api/news/detail",
  NEWS_CATEGORIES = "/api/news/categories",
}

/**
 * 分页查询新闻列表
 * @param data 分页参数
 */
export function reqGetNewsPage(data: {
  pageNum: number;
  pageSize: number;
  category?: number;
  search?: string;
}) {
  return request<ResponseData>({
    url: API.NEWS_LIST,
    method: "get",
    params: data,
  });
}

/**
 * 获取新闻详情
 * @param id 新闻ID
 */
export function reqGetNewsDetail(id: number) {
  return request<ResponseData>({
    url: API.NEWS_DETAIL,
    method: "get",
    params: { id },
  });
}

/**
 * 获取资讯分类列表
 */
export function reqGetNewsCategories() {
  return request<ResponseData>({
    url: API.NEWS_CATEGORIES,
    method: "get",
  });
}
