import request from "@/utils/request";
import type { FaqVO, FaqPageParams, PageVO } from "./type";

enum API {
  FAQ_PAGE = "/faq/page",
  FAQ_DETAIL = "/faq",
  FAQ_BATCH_DELETE = "/faq/batch",
}

/**
 * 分页查询FAQ列表
 */
export function reqGetFaqList(params?: FaqPageParams) {
  return request<PageVO<FaqVO>>({
    url: API.FAQ_PAGE,
    method: "get",
    params,
  });
}

/**
 * 新增FAQ
 */
export function reqAddFaq(data: Partial<FaqVO>) {
  return request({
    url: API.FAQ_DETAIL,
    method: "post",
    data,
  });
}

/**
 * 更新FAQ
 */
export function reqUpdateFaq(data: Partial<FaqVO>) {
  return request({
    url: API.FAQ_DETAIL,
    method: "put",
    data,
  });
}

/**
 * 删除FAQ
 */
export function reqDeleteFaq(id: number) {
  return request({
    url: `${API.FAQ_DETAIL}/${id}`,
    method: "delete",
  });
}

/**
 * 批量删除FAQ
 */
export function reqBatchDeleteFaq(ids: number[]) {
  return request({
    url: API.FAQ_BATCH_DELETE,
    method: "delete",
    data: ids,
  });
}