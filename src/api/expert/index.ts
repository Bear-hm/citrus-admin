import request from "@/utils/request";
import type {
  updateExpertData,
  addExpertData,
  pageData
} from "./type";

enum API {
  // 更新专家
  EXPERT_UPDATE = "/expert/approval",
  // 新增专家
  EXPERT_SAVE = "/expert/save",
  // 根据id获取专家
  EXPERT_GET_BY_ID = "/expert/{id}",
  // 根据id删除专家
  EXPERT_DELETE_BY_ID = "/expert/{id}",
  // 专家分页查询，keyword模糊查询：名字、微信、qq、手机
  EXPERT_PAGE = "/expert/page",
}

/**
 * 增加专家信息
 * @returns
 */
export function reqAddExpert(data: addExpertData) {
  return request({
    url: API.EXPERT_SAVE,
    method: "post",
    data,
  });
}
/**
 * 更新专家信息
 * @param data 更新数据
 * @returns
 */
export function reqUpdateExpert(data: updateExpertData) {
  return request({
    url: API.EXPERT_UPDATE,
    method: "put",
    data,
  });
}

/**
 * 根据id获取专家信息
 * @param id 专家ID
 * @returns
 */
export function reqGetExpertById(id: number) {
  return request({
    url: API.EXPERT_GET_BY_ID.replace("{id}", String(id)),
    method: "get",
  });
}

/**
 * 根据ID删除专家信息
 * @param id 专家id
 * @returns
 */
export function reqDeleteExpertById(id: number) {
  // 类型定义为null
  return request({
    url: API.EXPERT_DELETE_BY_ID.replace("{id}", String(id)),
    method: "delete",
  });
}

/**
 * 分页获取专家列表
 * @param id 专家ID
 * @returns
 */
export function reqGetExpertPage(data: pageData) {
  return request({
    url: API.EXPERT_PAGE,
    method: "get",
    params: data,
  });
}


