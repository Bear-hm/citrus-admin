<template>
  <div ref="chartRef" :style="{ width: width, height: height }"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import * as echarts from "echarts";

const props = defineProps({
  // 图表宽度
  width: {
    type: String,
    default: "100%",
  },
  // 图表高度
  height: {
    type: String,
    default: "400px",
  },
  // 标题
  title: {
    type: String,
    default: "七日接口访问量变化",
  },
  // X轴数据
  xAxisData: {
    type: Array,
    default: () => [],
  },
  // 系列数据
  seriesData: {
    type: Array,
    default: () => [],
  },
});

const chartRef = ref(null);
let chart = null;

// 初始化图表配置
const initChartOption = () => {
  return {
    title: {
      text: props.title,
    },
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: props.seriesData.map((item) => item.name),
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: props.xAxisData,
    },
    yAxis: {
      type: "value",
    },
    series: props.seriesData.map((item) => ({
      name: item.name,
      type: "line",
      data: item.data,
      smooth: true,
    })),
  };
};

// 初始化图表
const initChart = () => {
  if (chart) {
    chart.dispose();
  }
  chart = echarts.init(chartRef.value);
  chart.setOption(initChartOption());
};

// 监听属性变化
watch(
  () => [props.xAxisData, props.seriesData, props.title],
  () => {
    initChart();
  },
  { deep: true }
);

// 监听窗口大小变化
const handleResize = () => {
  chart && chart.resize();
};

onMounted(() => {
  initChart();
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  if (chart) {
    chart.dispose();
    chart = null;
  }
  window.removeEventListener("resize", handleResize);
});
</script>

<style scoped></style>
