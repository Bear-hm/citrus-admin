import request from "@/utils/request";
enum API {
  // 分页获取惠农网的采购信息
  CRAWLER_CNHNB_PROCUREMENT_PAGE = "/crawler/cnhnbProcurementPage",
  // 根据id获取详细的采购信息
  CRAWLER_CNHNB_PROCUREMENT_GET_BY_ID = "/crawler/cnhnbProcurement/{id}",
  //新增采购信息
  CRAWLER_CNHNB_SAVE = "/crawler/cnhnb/save",
  //更新采购信息
  CRAWLER_CNHNB_UPDATE = "/crawler/cnhnb/update",
  //根据id删除采购信息
  CRAWLER_CNHNB_PROCUREMENT_DELETE_BY_ID = "/crawler/cnhnb/delete/{id}",
  // 爬取惠农网的采购信息
  CRAWLER_CNHNB_PROCUREMENT = "/crawler/cnhnbProcurement",
}
/**
 * 更新采购信息
 * @param data 更新的采购数据
 * @returns
 */
export function reqUpdateProcurement(data: any) {
  return request({
    url: API.CRAWLER_CNHNB_UPDATE,
    method: "post",
    data,
  });
}

/**
 * 新增采购信息
 * @param data 新增的采购数据
 * @returns
 */
export function reqSaveProcurement(data: any) {
  return request({
    url: API.CRAWLER_CNHNB_SAVE,
    method: "post",
    data:data,
  });
}

/**
 * 爬取采购信息
 * @returns
 */
export function reqCrawlerProcurement() {
  return request({
    url: API.CRAWLER_CNHNB_PROCUREMENT,
    method: "get",
  });
}

/**
 * 分页获取采购信息
 * @param params 分页参数，包含 pageNum、pageSize 和可选的 keyword
 * @returns
 */
export function reqGetProcurementPage(params: any) {
  const queryParams = Object.keys(params)
    .map(
      (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
    )
    .join("&");
  return request({
    url: `${API.CRAWLER_CNHNB_PROCUREMENT_PAGE}?${queryParams}`,
    method: "get",
  });
}

/**
 * 根据ID获取采购信息
 * @param id 采购信息ID
 * @returns
 */
export function reqGetProcurementById(id: number) {
  return request({
    url: API.CRAWLER_CNHNB_PROCUREMENT_GET_BY_ID.replace("{id}", String(id)),
    method: "get",
  });
}

/**
 * 根据ID删除采购信息
 * @param id 采购信息ID
 * @returns
 */
export function reqDeleteProcurementById(id: number) {
  return request({
    url: API.CRAWLER_CNHNB_PROCUREMENT_DELETE_BY_ID.replace("{id}", String(id)),
    method: "delete",
  });
}
