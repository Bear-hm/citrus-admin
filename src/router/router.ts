import Layout from "@/layout/index.vue";
import path from "path";
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
    // redirect: "crawler/crawler-info",
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
    path: "/crawler",
    component: Layout,
    meta: {
      title: "爬虫管理",
      hidden: false,
      icon: "Aim",
    },
    children: [
      {
        path: "crawler-info",
        component: () => import("@/views/crawler/info/index.vue"),
        name: "crawler-info",
        meta: {
          title: "新闻管理",
          hidden: false,
          icon: "ChatLineSquare",
        },
      },
      // {
      //   path: "crawler-weather",
      //   component: () => import("@/views/crawler/weather/index.vue"),
      //   name: "天气管理",
      //   meta: {
      //     title: "天气管理",
      //     hidden: false,
      //     icon: "Sunny",
      //   },
      // },
      // {
      //   path: "crawler-price",
      //   component: () => import("@/views/crawler/price/index.vue"),
      //   name: "价格管理",
      //   meta: {
      //     title: "价格管理",
      //     hidden: false,
      //     icon: "Money",
      //   },
      // },
      // {
      //   path: "crawler-procure",
      //   component: () => import("@/views/crawler/procure/index.vue"),
      //   name: "采购管理",
      //   meta: {
      //     title: "采购管理",
      //     hidden: false,
      //     icon: "ShoppingCart",
      //   },
      // },
    ],
  },
  {
    path: "/carousel",
    component: Layout,
    children: [
      {
        path: "",
        component: () => import("@/views/carousel/index.vue"),
        meta: {
          title: "轮播图管理",
          hidden: false,
          icon: "Picture",
        },
      },
    ],
  },
  {
    path: "/user",
    component: Layout,
    children: [
      {
        path: "",
        component: () => import("@/views/user/index.vue"),
        meta: {
          title: "用户管理",
          hidden: false,
          icon: "DataLine",
        },
      },
    ],
  },
  {
    path: "/expert",
    component: Layout,
    children: [
      {
        path: "",
        component: () => import("@/views/expert/index.vue"),
        meta: {
          title: "专家管理",
          hidden: false,
          icon: "Odometer",
        },
      },
    ],
  },
  // {
  //   path: "/problem",
  //   component: Layout,
  //   children: [
  //     {
  //       path: "problem",
  //       component: () => import("@/views/fqa/index.vue"),
  //       name: "problem",
  //       meta: {
  //         title: "问答管理",
  //         hidden: false,
  //         icon: "User",
  //       },
  //     },
  //   ],

  // },
  // {
  //   path: "/forum",
  //   component: Layout,
  //   children: [
  //     {
  //       path: "",
  //       component: () => import("@/views/forum/index.vue"),
  //       meta: {
  //         title: "论坛管理",
  //         hidden: true,
  //         icon: "User",
  //       },
  //     },
  //   ],
  // },
  // {
  //   path: "/setting",
  //   component: Layout,
  //   children: [
  //     {
  //       path: "personal",
  //       component: () => import("@/views/setting/personal/index.vue"),
  //       name: "personal",
  //       meta: {
  //         title: "个人信息",
  //         hidden: false,
  //         icon: "User",
  //       },
  //     },
  //   ],
  // },
  {
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      title: "登录/注册",
      hidden: true,
    },
    // children: [
    //   {
    //     path: "",
    //     component: () => import("@/views/login/Login/Login.vue"),
    //     name: "login",
    //   },
    //   {
    //     path: "/register",
    //     component: () => import("@/views/login/Register/Register.vue"),
    //     name: "register",
    //   },
    // ],
  },
];
