import request from "@/utils/request";
enum API {
  // 修改惠农网的柑橘价格新闻内容
  CRAWLER_PRICE_UPDATE = "/crawler/price/update",
  // 新增惠农网的柑橘价格内容
  CRAWLER_PRICE_SAVE = "/crawler/price/save",
  // 通过ID获取惠农网柑橘价格全部内容，
  CRAWLER_PRICE_GET_BY_ID = "/crawler/price/{id}",
  // 爬虫获取信息
  CRAWLER_CNHNB_PRICE = "/crawler/cnhnbPrice",
  // 分页获取中国惠农网价格,可选参数keyword模糊查询，请求地址类似：/crawler/cnhnbPricePage?pageNum=1&pageSize=1&keyword=%E6%88%98%E5%90%8E%E9%AB%98%E4%B8%89
  CRAWLER_CNHNB_PRICE_PAGE = "/crawler/cnhnbPricePage",
  //通过ID删除惠农网柑橘价格新闻内容
  CRAWLER_PRICE_DELETE_BY_ID = "/crawler/price/delete/{id}",
}
/**
 * 更新惠农网价格信息
 * @param data 更新的价格数据
 * @returns
 */
export function reqUpdatePrice(data: any) {
  return request({
    url: API.CRAWLER_PRICE_UPDATE,
    method: "post",
    data,
  });
}

/**
 * 新增惠农网价格信息
 * @param data 新增的价格数据
 * @returns
 */
export function reqSavePrice(data: any) {
  return request({
    url: API.CRAWLER_PRICE_SAVE,
    method: "post",
    data,
  });
}

/**
 * 爬取惠农网价格信息
 * @returns
 */
export function reqCrawlerPrice() {
  return request({
    url: API.CRAWLER_CNHNB_PRICE,
    method: "get",
  });
}

/**
 * 分页获取惠农网价格信息
 * @param params 分页参数，包含 pageNum、pageSize 和可选的 keyword
 * @returns
 */
export function reqGetPricePage(params: any) {
  const queryParams = Object.keys(params)
    .map(
      (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
    )
    .join("&");
  return request({
    url: `${API.CRAWLER_CNHNB_PRICE_PAGE}?${queryParams}`,
    method: "get",
  });
}

/**
 * 根据ID获取惠农网价格信息
 * @param id 价格信息ID
 * @returns
 */
export function reqGetPriceById(id: number) {
  return request({
    url: API.CRAWLER_PRICE_GET_BY_ID.replace("{id}", String(id)),
    method: "get",
  });
}

/**
 * 根据ID删除惠农网价格信息
 * @param id 价格信息ID
 * @returns
 */
export function reqDeletePriceById(id: number) {
  return request({
    url: API.CRAWLER_PRICE_DELETE_BY_ID.replace("{id}", String(id)),
    method: "delete",
  });
}
