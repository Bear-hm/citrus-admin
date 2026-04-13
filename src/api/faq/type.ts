/**
 * FAQ 模块类型定义 - 对齐后端 VO/DTO
 */

/** FAQ VO */
export interface FaqVO {
  /** 主键 */
  id: number
  /** 问题 */
  question: string
  /** 答案 */
  answer: string
  /** 适用角色 */
  roleCode: string
  /** 排序 */
  sortOrder: number
  /** 状态 1-启用 0-禁用 */
  status?: number
}

/** FAQ 查询参数 */
export interface FaqPageParams {
  /** 页码 */
  pageNum?: number
  /** 每页数量 */
  pageSize?: number
  /** 适用角色 */
  roleCode?: string
  /** 状态 1-启用 0-禁用 */
  status?: number
  /** 搜索关键词（问题/答案） */
  search?: string
}

/** 分页响应 VO */
export interface PageVO<T> {
  /** 数据列表 */
  records: T[]
  /** 总记录数 */
  total: number
  /** 当前页码 */
  pageNum: number
  /** 每页数量 */
  pageSize: number
  /** 总页数 */
  totalPages: number
}
