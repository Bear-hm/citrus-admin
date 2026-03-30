import request from "@/utils/request";
enum API {
  //更新轮播图
  CAROUSEL_UPDATE = "/carousel/update",
  //新增轮播图
  CAROUSEL_SAVE = "/carousel/save",
  //根据id获取轮播图
  CAROUSEL_GET_BY_ID = "/carousel/{id}",
  //根据id删除轮播图
  CAROUSEL_DELETE_BY_ID = "/carousel/{id}",
  //分页获取轮播图
  CAROUSEL_PAGE = "/carousel/page",
}
/**
 * 更新轮播图信息
 * @param data 轮播图数据
 * @returns Promise
 */
export function reqUpdateCarousel(data: any) {
  return request({
    url: API.CAROUSEL_UPDATE,
    method: "put",
    data,
  });
}

/**
 * 新增轮播图
 * @param data 轮播图数据
 * @returns Promise
 */
export function reqSaveCarousel(data: any) {
  return request({
    url: API.CAROUSEL_SAVE,
    method: "post",
    data,
  });
}

/**
 * 根据ID获取轮播图
 * @param id 轮播图ID
 * @returns Promise
 */
export function reqGetCarouselById(id: number) {
  return request({
    url: API.CAROUSEL_GET_BY_ID.replace("{id}", id.toString()),
    method: "get",
  });
}

/**
 * 根据ID删除轮播图
 * @param id 轮播图ID
 * @returns Promise
 */
export function reqDeleteCarouselById(id: number) {
  return request({
    url: API.CAROUSEL_DELETE_BY_ID.replace("{id}", id.toString()),
    method: "delete",
  });
}

/**
 * 分页获取轮播图列表
 * @param params 分页参数
 * @returns Promise
 */
export function reqGetCarouselPage(params: any) {
  return request({
    url: API.CAROUSEL_PAGE,
    method: "get",
    params,
  });
}
