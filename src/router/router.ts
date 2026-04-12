import Layout from "@/layout/index.vue";
export const constantRoute = [
  {
    path: "/navigation",
    component: () => import("@/views/navigation/index.vue"),
    meta: {
      title: "路由导航",
      hidden: true,
    },
  },
  {
    path: "/",
    component: Layout,
    children: [
      {
        path: "",
        component: () => import("@/views/home/index.vue"),
        meta: {
          title: "工作台",
          hidden: false,
          icon: "HomeFilled",
        },
      },
    ],
  },
  // 资讯管理模块
  {
    path: "/content",
    component: Layout,
    redirect: "/content/news",
    meta: {
      title: "资讯管理",
      hidden: false,
      icon: "Document",
    },
    children: [
      {
        path: "news",
        component: () => import("@/views/content/news/index.vue"),
        name: "news",
        meta: {
          title: "资讯信息",
          hidden: false,
        },
      },
    ],
  },
  // 首页模块
  {
    path: "/agri",
    component: Layout,
    redirect: "/agri/weather",
    meta: {
      title: "农业资讯",
      hidden: false,
      icon: "Sunny",
    },
    children: [
      {
        path: "weather",
        component: () => import("@/views/agri/weather/index.vue"),
        name: "weather",
        meta: {
          title: "天气管理",
          hidden: false,
        },
      },
      {
        path: "faq",
        component: () => import("@/views/agri/faq/index.vue"),
        name: "faq",
        meta: {
          title: "问答管理",
          hidden: false,
        },
      },
    ],
  },
  // 设置
  {
    path: "/setting",
    component: Layout,
    meta: {
      title: "系统管理",
      hidden: false,
      icon: "Sunny",
    },
    children: [
      {
        path: "personal",
        component: () => import("@/views/setting/personal/index.vue"),
        name: "personal",
        meta: {
          title: "个人信息",
          hidden: false,
          icon: "User",
        },
      },
      {
        path: "user",
        component: () => import("@/views/setting/user/index.vue"),
        name: "user",
        meta: {
          title: "用户管理",
          hidden: false,
          icon: "DataLine",
        },
      },
    ],
  },
  {
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      title: "登录/注册",
      hidden: true,
    },
  },
];
