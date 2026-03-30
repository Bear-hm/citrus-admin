// 用户相关类型定义
export interface loginFormData {
  username: string
  password: string
}

export interface registerFormData {
  username: string
  password: string
  email?: string
  phone?: string
}

export interface logoutResponse {
  code: number
  message: string
}

export interface updateUserData {
  username?: string
  password?: string
  email?: string
  phone?: string
}
