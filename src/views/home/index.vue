<template>
  <Title />
  <div class="home-main">
    <el-row :gutter="20">
      <el-col :span="10">
        <el-card class="chart-card">
          <PieChart :pieData="pieChartData" />
        </el-card>
      </el-col>
      <el-col :span="14">
        <el-card class="chart-card">
          <AirLineMap />
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="24">
        <el-card class="chart-card">
          <LineTrend
            :xAxisData="xAxisData"
            :seriesData="seriesData"
            height="400px"
          />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import AirLineMap from "@/components/statistics/AirLineMap.vue";
import PieChart from "@/components/statistics/PieChart.vue";
import LineTrend from "@/components/statistics/LineTrend.vue";
import Title from "./MainTitile.vue";
import { reqVisitData, reqSevenVisitData } from "@/api/home/index";
const xAxisData = ref([]);
const seriesData = ref([]);
// 名称map
const nameMap = {
  attachment: "附件访问量",
  carousel: "轮播图访问量",
  crawler: "爬虫访问量",
  download: "下载量",
  expert: "专家访问量",
  smart: "智能问答访问量",
  upload: "上传量",
  visit: "访问量",
  user: "用户访问量",
  problem: "问题访问量",
};
// 颜色map
const colorsMap = {
  attachment: "#FBC02D", // 淡黄色
  carousel: "#9C27B0", // 紫色
  crawler: "#FE5656", // 红色
  download: "#00796B", // 深绿色
  expert: "#303F9F", // 深蓝色
  smart: "#FF9800", // 橙色
  upload: "#FFEB3B", // 明黄色
  visit: "#E91E63", // 粉红色
  user: "#2196F3", // 天蓝色
  problem: "#9C27B0", // 紫色
};
function convertTOPieData(inputData) {
  // 只保留需要的字段并过滤掉值为0的项
  const filteredEntries = Object.entries(inputData).filter(
    ([key, value]) =>
      key !== "createDate" && value !== 0 && Object.keys(nameMap).includes(key)
  );

  // 转换为目标格式
  return filteredEntries.map(([key, value]) => ({
    value: value,
    name: nameMap[key],
    itemStyle: {
      color: colorsMap[key] || "#CCCCCC",
    },
  }));
}
const pieChartData = ref();
const getVisitData = async () => {
  let res = await reqVisitData();
  if (res.code === "200") {
    pieChartData.value = convertTOPieData(res.data);
    // console.log("home", convertTOPieData(res.data));
  }
};
const getSevenVisitData = async () => {
  let res = await reqSevenVisitData();
  if (res.code === "200") {
    xAxisData.value = res.data.xaxisData;
    seriesData.value = res.data.seriesData.map((item) => ({
      name: item.name,
      data: item.data,
      itemStyle: {
        color: colorsMap[item.name.toLowerCase()] || "#CCCCCC",
      },
    }));
  }
};
onMounted(() => {
  getVisitData();
  getSevenVisitData();
});
</script>
<style lang="scss" scoped>
.home-main {
  margin-top: 20px;
}
</style>
