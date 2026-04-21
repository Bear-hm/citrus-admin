export interface PageVO<T> {
  records: T[];
  total: number;
  pageNum: number;
  pageSize: number;
  totalPages: number;
}

export interface SupplyPageParams {
  pageNum?: number;
  pageSize?: number;
  varietyName?: string;
  originPlace?: string;
  gradeCode?: string;
  priceMin?: number;
  priceMax?: number;
  status?: number;
}

export interface DemandPageParams {
  pageNum?: number;
  pageSize?: number;
  varietyName?: string;
  preferredOriginPlace?: string;
  priceMin?: number;
  priceMax?: number;
  isUrgent?: number;
  status?: number;
  sortBy?: string;
}

export interface SupplyPostVO {
  id: number;
  postNo?: string;
  userId?: number;
  userName?: string;
  userAvatar?: string;
  varietyName: string;
  gradeCode?: string;
  originPlace?: string;
  unitPrice?: number;
  quantityValue?: number;
  quantityUnit?: string;
  publishDate?: string;
  deliveryMethod?: string;
  spec?: string;
  status?: number;
  coverImageUrl?: string;
  createdAt?: string;
}

export interface SupplyPostDetailVO extends SupplyPostVO {
  userPhone?: string;
  publishAt?: string;
  description?: string;
  auditStatus?: number;
  images?: string[];
  farmImages?: string[];
  reportUrl?: string;
  contactName?: string;
  contactPhone?: string;
  sortOrder?: number;
}

export interface SupplyPostFormDTO {
  id?: number;
  varietyName: string;
  gradeCode: string;
  originPlace: string;
  unitPrice: number | undefined;
  quantityValue: number | undefined;
  quantityUnit: string;
  publishDate?: string;
  deliveryMethod?: string;
  description?: string;
  contactName: string;
  contactPhone: string;
  spec?: string;
  status?: number;
  sortOrder?: number;
  images?: string[];
  farmImages?: string[];
}

export interface DemandPostVO {
  id: number;
  postNo?: string;
  userId?: number;
  userName?: string;
  varietyName: string;
  preferredOriginPlace?: string;
  priceMin?: number;
  priceMax?: number;
  displayPrice?: number;
  quantityValue?: number;
  quantityUnit?: string;
  deliveryDeadline?: string;
  isUrgent?: number;
  contactCount?: number;
  contactName?: string;
  contactPhone?: string;
  remark?: string;
  status?: number;
  createdAt?: string;
}

export interface DemandPostDetailVO extends DemandPostVO {
  levelRequirement?: string[];
  quoteCount?: number;
  sortOrder?: number;
}

export interface DemandPostFormDTO {
  id?: number;
  varietyName: string;
  preferredOriginPlace?: string;
  priceMin?: number;
  priceMax?: number;
  displayPrice?: number;
  quantityValue: number | undefined;
  quantityUnit?: string;
  deliveryDeadline?: string;
  isUrgent?: number;
  levelRequirement?: string[];
  contactName: string;
  contactPhone: string;
  remark?: string;
  status?: number;
  sortOrder?: number;
}
