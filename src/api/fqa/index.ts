import request from "@/utils/request";

enum API {
  PROBLEM_UPDATE = "/problem/update",
  PROBLEM_SAVE = "/problem/save",
  PROBLEM_DELETE_BY_ID = "/problem/{id}",
  PROBLEM_PAGE = "/problem/page",
  PROBLEM_LIST = "/problem/list",
}

export interface ProblemData {
  id: number;
  question: string;
  answer: string;
  showOrder: number;
  active: number;
}

/**
 * 更新问答
 * @param data 问答数据
 */
export function reqUpdateProblem(data: ProblemData) {
  return request({
    url: API.PROBLEM_UPDATE,
    method: "put",
    data,
  });
}

/**
 * 新增问答
 * @param data 问答数据
 */
export function reqSaveProblem(data: Omit<ProblemData, "id">) {
  return request({
    url: API.PROBLEM_SAVE,
    method: "post",
    data,
  });
}


/**
 * 根据ID删除问答
 * @param id 问答ID
 */
export function reqDeleteProblemById(id: number) {
  return request({
    url: API.PROBLEM_DELETE_BY_ID.replace("{id}", id.toString()),
    method: "delete",
  });
}

/**
 * 分页查询问答
 * @param params 查询参数，例如页码、页大小、关键字等
 */
export function reqPageProblem(params?: Record<string, any>) {
  return request({
    url: API.PROBLEM_PAGE,
    method: "get",
    params,
  });
}

/**
 * 查询问答列表
 * @param params 查询参数
 */
export function reqListProblem(params?: Record<string, any>) {
  return request({
    url: API.PROBLEM_LIST,
    method: "get",
    params,
  });
}