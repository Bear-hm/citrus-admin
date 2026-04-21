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
          icon: "Reading",
        },
      },
    ],
  },
  {
    path: "/market",
    component: Layout,
    children: [
      {
        path: "price",
        component: () => import("@/views/market/index.vue"),
        name: "marketPrice",
        meta: {
          title: "价格行情",
          hidden: false,
          icon: "TrendCharts",
        },
      },
    ],
  },
  {
    path: "/agri",
    component: Layout,
    redirect: "/agri/faq",
    meta: {
      title: "农业资讯",
      hidden: false,
      icon: "Grape",
    },
    children: [
      {
        path: "faq",
        component: () => import("@/views/agri/faq/index.vue"),
        name: "faq",
        meta: {
          title: "问答管理",
          hidden: false,
          icon: "ChatDotRound",
        },
      },
      {
        path: "supply-demand",
        component: () => import("@/views/agri/supply-demand/index.vue"),
        name: "supplyDemand",
        meta: {
          title: "供需管理",
          hidden: false,
          icon: "Management",
        },
      },
    ],
  },
  {
    path: "/setting",
    component: Layout,
    meta: {
      title: "系统管理",
      hidden: false,
      icon: "Setting",
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
