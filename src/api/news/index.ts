import request from "@/utils/request";
import type {
  NewsListVO,
  NewsDetailVO,
  NewsCategoryVO,
  NewsPageParams,
  NewsCategoryPageParams,
  NewsDTO,
  NewsCategoryDTO,
  PageVO,
} from "./type";
import type { ResponseData } from "@/api/type";

// ==================== 新闻接口 ====================

const NEWS_BASE = "/news";

/**
 * 分页查询新闻列表
 */
export function reqGetNewsPage(params: NewsPageParams) {
  return request<ResponseData & { data: PageVO<NewsListVO> }>({
    url: `${NEWS_BASE}/list`,
    method: "get",
    params,
  });
}

/**
 * 获取新闻详情
 */
export function reqGetNewsDetail(id: number) {
  return request<ResponseData & { data: NewsDetailVO }>({
    url: `${NEWS_BASE}/detail`,
    method: "get",
    params: { id },
  });
}

/**
 * 新增新闻
 */
export function reqSaveNews(data: NewsDTO) {
  return request<ResponseData>({
    url: NEWS_BASE,
    method: "post",
    data,
  });
}

/**
 * 修改新闻
 */
export function reqUpdateNews(data: NewsDTO) {
  return request<ResponseData>({
    url: NEWS_BASE,
    method: "put",
    data,
  });
}

/**
 * 删除新闻
 */
export function reqDeleteNews(id: number) {
  return request<ResponseData>({
    url: `${NEWS_BASE}/${id}`,
    method: "delete",
  });
}

/**
 * 批量删除新闻
 */
export function reqBatchDeleteNews(ids: number[]) {
  return request<ResponseData>({
    url: `${NEWS_BASE}/batch`,
    method: "delete",
    data: ids,
  });
}

// ==================== 分类接口 ====================

const CATEGORY_BASE = "/news/categories";

/**
 * 获取资讯分类列表
 */
export function reqGetNewsCategories() {
  return request<ResponseData & { data: NewsCategoryVO[] }>({
    url: CATEGORY_BASE,
    method: "get",
  });
}

/**
 * 分页查询资讯分类列表
 */
export function reqGetNewsCategoryPage(params: NewsCategoryPageParams) {
  return request<ResponseData & { data: PageVO<NewsCategoryVO> }>({
    url: `${CATEGORY_BASE}/page`,
    method: "get",
    params,
  });
}

/**
 * 获取分类详情
 */
export function reqGetNewsCategoryDetail(id: number) {
  return request<ResponseData & { data: NewsCategoryVO }>({
    url: `${CATEGORY_BASE}/${id}`,
    method: "get",
    params: { id },
  });
}

/**
 * 新增资讯分类
 */
export function reqSaveNewsCategory(data: NewsCategoryDTO) {
  return request<ResponseData>({
    url: CATEGORY_BASE,
    method: "post",
    data,
  });
}

/**
 * 修改资讯分类
 */
export function reqUpdateNewsCategory(data: NewsCategoryDTO) {
  return request<ResponseData>({
    url: CATEGORY_BASE,
    method: "put",
    data,
  });
}

/**
 * 删除资讯分类
 */
export function reqDeleteNewsCategory(id: number) {
  return request<ResponseData>({
    url: `${CATEGORY_BASE}/${id}`,
    method: "delete",
  });
}

/**
 * 批量删除资讯分类
 */
export function reqBatchDeleteNewsCategory(ids: number[]) {
  return request<ResponseData>({
    url: `${CATEGORY_BASE}/batch`,
    method: "delete",
    data: ids,
  });
}
