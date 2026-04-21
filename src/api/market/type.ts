export interface MarketPageParams {
  pageNum?: number;
  pageSize?: number;
  varietyName?: string;
  regionCode?: string;
  priceType?: string;
}

export interface MarketPriceVO {
  id: number;
  varietyId?: number;
  varietyName: string;
  regionId?: number;
  regionCode?: string;
  regionName?: string;
  price: number;
  unit?: string;
  priceType?: string;
  recordedAt: string;
  recordedAtDetail?: string;
  priceChange?: number;
  priceChangeRate?: number;
  searchVolume?: number;
  viewCount?: number;
  analystTip?: string;
  sourceName?: string;
  status?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface MarketPriceFormDTO {
  varietyId?: number;
  varietyName: string;
  regionId?: number;
  regionCode?: string;
  regionName?: string;
  price: number;
  unit?: string;
  priceType?: string;
  recordedAt: string;
  priceChange?: number;
  priceChangeRate?: number;
  searchVolume?: number;
  viewCount?: number;
  analystTip?: string;
  sourceName?: string;
  status?: number;
}

export interface PageVO<T> {
  records: T[];
  total: number;
  pageNum: number;
  pageSize: number;
  totalPages: number;
}

export interface HotPriceCardVO {
  variety: string;
  region: string;
  price: number;
  change?: number;
  changePercent?: number;
  updateTime?: string;
  trendData?: number[];
}

export interface PriceTrendPointVO {
  date: string;
  avgPrice?: number;
  maxPrice?: number;
  minPrice?: number;
  recordCount?: number;
  variety?: string;
}

export interface PriceTableRowVO {
  id: number;
  variety: string;
  region: string;
  price: number;
  change?: number;
  changePercent?: number;
  unit?: string;
  recordedAt?: string;
}
