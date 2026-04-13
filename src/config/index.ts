/**
 * 项目配置文件
 * 统一管理项目中需要复用的常量
 */

// 项目名称配置
export const APP_CONFIG = {
  // 网页标题（显示在浏览器标签页）
  title: "数字化柑橘后台管理",
  // 侧边栏显示的名称
  sidebarTitle: "数字化柑橘后台管理",
  // 首页显示的名称
  homeTitle: "数字化柑橘后台管理",
} as const;

// 如果需要在其他地方使用单个变量，也可以单独导出
export const PROJECT_NAME = "智慧柑橘";
