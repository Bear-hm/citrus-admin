import request from "@/utils/request";
enum API {
  // 分页获取当期气象局的天气信息
  CRAWLER_WEATHER_PAGE = "/crawler/weather/page",
  // 根据id获取详细天气信息
  CRAWLER_WEATHER_GET_BY_ID = "/crawler/weather/{id}",
  // 新增气象局的天气信息
  CRAWLER_WEATHER_SAVE = "/crawler/weather/save",
  // 修改当期气象局的天气信息
  CRAWLER_WEATHER_UPDATE = "/crawler/weather/update",
  // 删除当期气象局的天气信息
  CRAWLER_WEATHER_DELETE_BY_ID = "/crawler/weather/delete/{id}",
  // 爬取当期气象局的天气信息
  CRAWLER_WEATHER = "/crawler/weather",
}

/**
 * 更新天气信息
 * @param data 更新的天气数据
 * @returns
 */
export function reqUpdateWeather(data: any) {
  return request({
    url: API.CRAWLER_WEATHER_UPDATE,
    method: "post",
    data,
  });
}

/**
 * 新增天气信息
 * @param data 新增的天气数据
 * @returns
 */
export function reqSaveWeather(data: any) {
  return request({
    url: API.CRAWLER_WEATHER_SAVE,
    method: "post",
    data,
  });
}

/**
 * 爬取天气信息
 * @returns
 */
export function reqCrawlerWeather() {
  return request({
    url: API.CRAWLER_WEATHER,
    method: "get",
  });
}

/**
 * 分页获取天气信息
 * @param params 分页参数，包含 pageNum、pageSize 和可选的 keyword
 * @returns
 */
export function reqGetWeatherPage(params: any) {
  const queryParams = Object.keys(params)
    .map(
      (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
    )
    .join("&");
  return request({
    url: `${API.CRAWLER_WEATHER_PAGE}?${queryParams}`,
    method: "get",
  });
}

/**
 * 根据ID获取天气信息
 * @param id 天气信息ID
 * @returns
 */
export function reqGetWeatherById(id: number) {
  return request({
    url: API.CRAWLER_WEATHER_GET_BY_ID.replace("{id}", String(id)),
    method: "get",
  });
}

/**
 * 根据ID删除天气信息
 * @param id 天气信息ID
 * @returns
 */
export function reqDeleteWeatherById(id: number) {
  return request({
    url: API.CRAWLER_WEATHER_DELETE_BY_ID.replace("{id}", String(id)),
    method: "delete",
  });
}
