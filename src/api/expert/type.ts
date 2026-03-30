/* 
 * 更新专家信息
*/
export interface updateExpertData {
  id: number;                // 必填
  products: string[];         // 必填，字符串数组
  // userId: number;             // 必填，用户ID
  name: string;               // 必填，姓名
  profile: string;            // 必填，简介
  phone: string;              // 必填，电话
  email: string;              // 必填，邮箱
  qq: string;                 // 必填，QQ号
  weChat: string;             // 必填，微信
  // other?: string;              // 必填，其他联系方式
  // applyStatus?: number;       // 可选，申请状态
  certification: string[];    // 必填，认证信息数组
  // reason: string;             // 必填，申请理由
  // remark: string;             // 必填，备注
  avatar: string;             // 必填，头像链接
  positions: string;          // 必填，职位
  field: string;              // 必填，领域
}
/* 
 * 新增专家参数
 */
export interface addExpertData {
  id?: number
  products?: string
  userId: number
  name?: string
  profile?: string
  phone?: string
  email?: string
  qq?: string
  weChat?: string
  other?: string
  applyStatus?: number
  certification?: string
  reason?: string
  remark?: string
}
/* 
 *分页参数
 */
export interface pageData {

  pageNum: number;

  pageSize: number;

  status?: number;

  keyWord?: string;

}