import { ResponseData } from "../../type";
enum NewsType {
  NEWS = "NEWS", // 行业快讯
  LAWS = "LAWS", // 政策法规
  MARKET = "MARKET", // 行情咨询
  TECH = "TECH", // 种植技术
  HEAD = "HEAD", // 橘业头条
}
interface NewsItem {
  id: number;
  headImg?: string;
  type?: NewsType;
  detailUrl?: string;
  title?: string;
  time?: string;
  author?: string;
  detail?: string;
  clickNums?: number;
}
export interface GanjuInfoParams {
  pageNum: number;
  pageSize: number;
  type: NewsType;
}

interface GanjuInfoData {
  list: NewsItem[];
  total: number;
  pageNum: number;
  pageSize: number;
  pages: number;
}

export interface GanjuwPageResponse extends ResponseData {
  data: GanjuInfoData;
}
