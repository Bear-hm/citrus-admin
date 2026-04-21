import request from "@/utils/request";
import type {
  HotPriceCardVO,
  MarketPageParams,
  MarketPriceFormDTO,
  MarketPriceVO,
  PageVO,
  PriceTableRowVO,
  PriceTrendPointVO,
} from "./type";

enum API {
  LIST = "/market/price/list",
  DETAIL = "/market/price",
  HOT = "/market/price/hot",
  TREND = "/market/price/trend",
  TABLE = "/market/price/table",
  VARIETIES = "/market/price/varieties",
  REGIONS = "/market/price/regions",
}

export function reqGetMarketPriceList(params: MarketPageParams) {
  return request({
    url: API.LIST,
    method: "get",
    params,
  });
}

export function reqGetMarketPriceDetail(id: number) {
  return request({
    url: `${API.DETAIL}/${id}`,
    method: "get",
  });
}

export function reqCreateMarketPrice(data: MarketPriceFormDTO) {
  return request({
    url: API.DETAIL,
    method: "post",
    data,
  });
}

export function reqUpdateMarketPrice(id: number, data: MarketPriceFormDTO) {
  return request({
    url: `${API.DETAIL}/${id}`,
    method: "put",
    data,
  });
}

export function reqDeleteMarketPrice(id: number) {
  return request({
    url: `${API.DETAIL}/${id}`,
    method: "delete",
  });
}

export function reqGetHotPrices() {
  return request({
    url: API.HOT,
    method: "get",
  });
}

export function reqGetMarketTrend(params: {
  variety?: string;
  regionCode?: string;
  days?: number;
}) {
  return request({
    url: API.TREND,
    method: "get",
    params,
  });
}

export function reqGetMarketTable(params?: {
  variety?: string;
  region?: string;
}) {
  return request({
    url: API.TABLE,
    method: "get",
    params,
  });
}

export function reqGetMarketVarieties() {
  return request({
    url: API.VARIETIES,
    method: "get",
  });
}

export function reqGetMarketRegions() {
  return request({
    url: API.REGIONS,
    method: "get",
  });
}
