/**
 * News 模块类型定义 - 对齐后端 VO/DTO
 */

/** 新闻列表项 VO */
export interface NewsListVO {
  /** 文章ID */
  id: number
  /** 分类ID */
  categoryId: number
  /** 分类名称 */
  categoryName: string
  /** 标题 */
  title: string
  /** 摘要 */
  summary: string
  /** 封面图 */
  coverUrl: string
  /** 作者 */
  authorName: string
  /** 来源 */
  sourceName: string
  /** 是否置顶 */
  isTop: number
  /** 浏览量 */
  viewCount: number
  /** 发布时间 */
  publishAt: string
}

/** 新闻详情 VO */
export interface NewsDetailVO extends NewsListVO {
  /** HTML正文内容 */
  contentHtml: string
}

/** 资讯分类 VO */
export interface NewsCategoryVO {
  /** 分类ID */
  id: number
  /** 分类名称 */
  categoryName: string
  /** 分类编码 */
  categoryCode: string
  /** 描述 */
  description: string
  /** 排序 */
  sortOrder: number
  /** 状态 1-启用 0-禁用 */
  status?: number
}

/** 新闻查询参数 */
export interface NewsPageParams {
  /** 页码 */
  pageNum?: number
  /** 每页数量 */
  pageSize?: number
  /** 分类ID */
  category?: number
  /** 搜索关键词（标题） */
  search?: string
}

/** 资讯分类查询参数 */
export interface NewsCategoryPageParams {
  /** 页码 */
  pageNum?: number
  /** 每页数量 */
  pageSize?: number
  /** 分类编码 */
  categoryCode?: string
  /** 分类名称 */
  categoryName?: string
  /** 状态 */
  status?: number
}

/** 新闻新增/修改 DTO */
export interface NewsDTO {
  /** ID（修改时必填） */
  id?: number
  /** 分类ID */
  categoryId: number
  /** 标题 */
  title: string
  /** 摘要 */
  summary?: string
  /** 封面图URL */
  coverUrl?: string
  /** 作者 */
  authorName?: string
  /** 来源 */
  sourceName?: string
  /** 发布状态 0-草稿 1-发布 2-下线 */
  publishStatus?: number
  /** 是否置顶 0-否 1-是 */
  isTop?: number
  /** HTML正文 */
  contentHtml?: string
  /** 纯文本正文 */
  contentText?: string
  /** 排序 */
  sortOrder?: number
}

/** 资讯分类新增/修改 DTO */
export interface NewsCategoryDTO {
  /** ID（修改时必填） */
  id?: number
  /** 分类名称 */
  categoryName: string
  /** 分类编码 */
  categoryCode: string
  /** 描述 */
  description?: string
  /** 排序 */
  sortOrder?: number
  /** 状态 1-启用 0-禁用 */
  status?: number
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
