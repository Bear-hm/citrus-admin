import request from "@/utils/request";
import type { FaqVO, FaqPageParams, PageVO } from "./type";

enum API {
  FAQ_LIST = "/home/faq",
}

/**
 * 获取FAQ列表
 */
export function reqGetFaqList(params?: FaqPageParams) {
  return request<PageVO<FaqVO>>({
    url: API.FAQ_LIST,
    method: "get",
    params,
  });
}

/**
 * 新增FAQ
 */
export function reqAddFaq(data: Partial<FaqVO>) {
  return request({
    url: "/home/faq",
    method: "post",
    data,
  });
}

/**
 * 更新FAQ
 */
export function reqUpdateFaq(data: Partial<FaqVO>) {
  return request({
    url: "/home/faq",
    method: "put",
    data,
  });
}

/**
 * 删除FAQ
 */
export function reqDeleteFaq(id: number) {
  return request({
    url: `/home/faq/${id}`,
    method: "delete",
  });
}