import request from "@/utils/request";
import type {
  DemandPageParams,
  DemandPostDetailVO,
  DemandPostFormDTO,
  DemandPostVO,
  PageVO,
  SupplyPageParams,
  SupplyPostDetailVO,
  SupplyPostFormDTO,
  SupplyPostVO,
} from "./type";

enum API {
  SUPPLY_PAGE = "/market/supply/page",
  SUPPLY = "/market/supply",
  DEMAND_PAGE = "/market/demand/page",
  DEMAND = "/market/demand",
}

export function reqGetSupplyList(params?: SupplyPageParams) {
  return request<PageVO<SupplyPostVO>>({
    url: API.SUPPLY_PAGE,
    method: "get",
    params,
  });
}

export function reqGetSupplyDetail(id: number) {
  return request<SupplyPostDetailVO>({
    url: `${API.SUPPLY}/${id}`,
    method: "get",
  });
}

export function reqCreateSupply(data: SupplyPostFormDTO) {
  return request({
    url: API.SUPPLY,
    method: "post",
    data,
  });
}

export function reqUpdateSupply(id: number, data: SupplyPostFormDTO) {
  return request({
    url: `${API.SUPPLY}/${id}`,
    method: "put",
    data,
  });
}

export function reqDeleteSupply(id: number) {
  return request({
    url: `${API.SUPPLY}/${id}`,
    method: "delete",
  });
}

export function reqGetDemandList(params?: DemandPageParams) {
  return request<PageVO<DemandPostVO>>({
    url: API.DEMAND_PAGE,
    method: "get",
    params,
  });
}

export function reqGetDemandDetail(id: number) {
  return request<DemandPostDetailVO>({
    url: `${API.DEMAND}/${id}`,
    method: "get",
  });
}

export function reqCreateDemand(data: DemandPostFormDTO) {
  return request({
    url: API.DEMAND,
    method: "post",
    data,
  });
}

export function reqUpdateDemand(id: number, data: DemandPostFormDTO) {
  return request({
    url: `${API.DEMAND}/${id}`,
    method: "put",
    data,
  });
}

export function reqDeleteDemand(id: number) {
  return request({
    url: `${API.DEMAND}/${id}`,
    method: "delete",
  });
}
