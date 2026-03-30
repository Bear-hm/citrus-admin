<template>
  <div class="content">
    <div ref="chartRef" style="width: 600px; height: 500px"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance } from "vue";
import * as echarts from "echarts";
import china from "@/assets/mapdata/china.json";

const chartRef = ref(null);
// 散点图数据
const points = ref([
  {
    name: "新疆",
    value: [87.628579, 43.793301],
    itemStyle: { color: "#FF9F45" },
  },
  {
    name: "四川",
    value: [104.076452, 30.651696],
    itemStyle: { color: "#FF9F45" },
  },
  {
    name: "甘肃",
    value: [103.826777, 36.060634],
    itemStyle: { color: "#FF9F45" },
  },
  {
    name: "云南",
    value: [102.709372, 25.046432],
    itemStyle: { color: "#FF9F45" },
  },
  {
    name: "广西",
    value: [108.327537, 22.816659],
    itemStyle: { color: "#FF9F45" },
  },
  {
    name: "湖南",
    value: [112.982951, 28.116007],
    itemStyle: { color: "#FF9F45" },
  },
  {
    name: "山东",
    value: [117.020725, 36.670201],
    itemStyle: { color: "#FF9F45" },
  },
  {
    name: "河南",
    value: [113.753094, 34.767052],
    itemStyle: { color: "#FF9F45" },
  },
  {
    name: "山西",
    value: [112.578781, 37.813948],
    itemStyle: { color: "#FF9F45" },
  },
  {
    name: "福建",
    value: [119.296194, 26.101082],
    itemStyle: { color: "#FF9F45" },
  },
  {
    name: "浙江",
    value: [120.152575, 30.266619],
    itemStyle: { color: "#FF9F45" },
  },
  {
    name: "内蒙古",
    value: [111.670911, 40.816417],
    itemStyle: { color: "#FF9F45" },
  },
  {
    name: "江苏",
    value: [118.763563, 32.061377],
    itemStyle: { color: "#FF9F45" },
  },
  {
    name: "北京",
    value: [116.407387, 39.904179],
    itemStyle: { color: "#FF9F45" },
  },
  {
    name: "陕西",
    value: [108.953939, 34.266611],
    itemStyle: { color: "#FF9F45" },
  },
  {
    name: "广东",
    value: [113.266887, 23.133306],
    itemStyle: { color: "#A6283F" },
  },
]);
const linesData = ref([
  {
    // 新疆->内蒙古
    coords: [
      [87.628579, 43.793301],
      [111.670911, 40.816417],
    ],
  },
  {
    // 北京->新疆
    coords: [
      [113.266887, 23.133306],
      [87.628579, 43.793301],
    ],
  },
  {
    // 北京->四川
    coords: [
      [113.266887, 23.133306],
      [104.076452, 30.651696],
    ],
  },
  {
    // 北京->甘肃
    coords: [
      [113.266887, 23.133306],
      [103.826777, 36.060634],
    ],
  },
  {
    // 北京->云南
    coords: [
      [113.266887, 23.133306],
      [102.709372, 25.046432],
    ],
  },
  {
    // 北京->广西
    coords: [
      [113.266887, 23.133306],
      [108.327537, 22.816659],
    ],
  },
  {
    // 北京->湖南
    coords: [
      [113.266887, 23.133306],
      [112.982951, 28.116007],
    ],
  },
  {
    // 北京->山东
    coords: [
      [113.266887, 23.133306],
      [117.020725, 36.670201],
    ],
  },
  {
    // 北京->河南
    coords: [
      [113.266887, 23.133306],
      [113.753094, 34.767052],
    ],
  },
  {
    // 北京->山西
    coords: [
      [113.266887, 23.133306],
      [112.578781, 37.813948],
    ],
  },
  {
    // 北京->福建
    coords: [
      [113.266887, 23.133306],
      [119.296194, 26.101082],
    ],
  },
  {
    // 北京->浙江
    coords: [
      [113.266887, 23.133306],
      [120.152575, 30.266619],
    ],
  },
  {
    // 北京->安徽
    coords: [
      [113.266887, 23.133306],
      [118.763563, 32.061377],
    ],
  },
  {
    // 北京->广东
    coords: [
      [113.266887, 23.133306],
      [113.266887, 23.133306],
    ],
  },
  {
    // 北京->陕西
    coords: [
      [113.266887, 23.133306],
      [108.953939, 34.266611],
    ],
  },
]);
// 飞机svg
const planePath =
  "path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z";

function initCharts(charts) {
  const option = {
    geo: {
      map: "china",
      label: {
        show: true,
        color: "#FFFFFF",
      },
      emphasis: {
        label: {
          color: "#FFE5CA",
        },
      },
      itemStyle: {
        borderColor: "#FF8B13",
        borderWidth: 1,
        areaColor: {
          type: "radial",
          x: 0.5,
          y: 0.5,
          r: 0.8,
          colorStops: [
            { offset: 0, color: "rgba(255, 243, 224, 0.2)" }, // 浅橙色背景
            { offset: 1, color: "rgba(255, 243, 224, 0.5)" }, // 浅橙色背景
          ],
        },
      },
      emphasis: {
        itemStyle: {
          areaColor: "#FF870F",
          borderWidth: 0,
        },
      },
    },
    series: [
      {
        type: "effectScatter",
        coordinateSystem: "geo",
        effectType: "ripple",
        showEffectOn: "render",
        rippleEffect: {
          period: 10,
          scale: 4,
          brushType: "fill",
        },
        zlevel: 1,
        data: points.value,
      },
      {
        type: "lines",
        zlevel: 2,
        symbol: ["none", "arrow"],
        symbolSize: 10,
        effect: {
          show: true,
          period: 6,
          trailLength: 0.5,
          symbol: planePath,
          symbolSize: 15,
        },
        lineStyle: {
          color: "#FFC107",
          width: 2.5,
          opacity: 0.6,
          curveness: 0.2,
        },
        data: linesData.value,
      },
    ],
  };

  echarts.registerMap("china", china);
  charts.setOption(option);
}
onMounted(() => {
  if (chartRef.value) {
    const chart = echarts.init(chartRef.value);
    initCharts(chart);

    // // 添加窗口大小改变时的自适应
    // window.addEventListener("resize", () => {
    //   chart.resize();
    // });
  }
});
</script>
<style scoped>
.content {
  height: 100%;
}
</style>
