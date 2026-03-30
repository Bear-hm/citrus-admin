<template>
  <div class="pie-echart">
    <div class="echart" ref="echartRef"></div>
  </div>
</template>

<script setup>
import {
  ref,
  onMounted,
  computed,
  watchEffect,
  defineProps,
  onBeforeUnmount,
} from "vue";
import * as echarts from "echarts";

const props = defineProps(["pieData"]);
let echartInstance = null;
let animationFrameId = null;
const echartRef = ref();
const angle = ref(0);
// 获取圆上点的坐标
function getCirlPoint(x0, y0, r, angle) {
  const x1 = x0 + r * Math.cos((angle * Math.PI) / 180);
  const y1 = y0 + r * Math.sin((angle * Math.PI) / 180);
  return { x: x1, y: y1 };
}
// 创建动画系列配置
function createAnimationSeries() {
  return [
    createArcSeries(0.6, 0, 90),
    createArcSeries(0.6, 180, 270),
    createArcSeries(0.65, 270, 40, true),
    createArcSeries(0.65, 90, 220, true),
    createDotSeries(0.65, 90, true),
    createDotSeries(0.65, 270, true),
  ];
}

// 创建圆弧系列
function createArcSeries(radiusRatio, start, end, reverse = false) {
  return {
    type: "custom",
    coordinateSystem: "none",
    renderItem: (params, api) => ({
      type: "arc",
      shape: {
        cx: api.getWidth() / 2,
        cy: api.getHeight() / 2,
        r: (Math.min(api.getWidth(), api.getHeight()) / 2) * radiusRatio,
        startAngle:
          ((start + (reverse ? -angle.value : angle.value)) * Math.PI) / 180,
        endAngle:
          ((end + (reverse ? -angle.value : angle.value)) * Math.PI) / 180,
      },
      style: {
        stroke: "#0CD3DB",
        fill: "transparent",
        lineWidth: 1.5,
      },
    }),
    data: [0],
  };
}

// 创建圆点系列
function createDotSeries(radiusRatio, baseAngle, reverse = false) {
  return {
    type: "custom",
    coordinateSystem: "none",
    renderItem: (params, api) => {
      const centerX = api.getWidth() / 2;
      const centerY = api.getHeight() / 2;
      const r = (Math.min(api.getWidth(), api.getHeight()) / 2) * radiusRatio;
      const point = getCirlPoint(
        centerX,
        centerY,
        r,
        baseAngle + (reverse ? -angle.value : angle.value)
      );
      return {
        type: "circle",
        shape: { cx: point.x, cy: point.y, r: 4 },
        style: { stroke: "#0CD3DB", fill: "#0CD3DB" },
      };
    },
    data: [0],
    z: 11,
  };
}
// 动画循环
function animate() {
  if (echartInstance) {
    // 添加判断
    angle.value = (angle.value + 3) % 360;
    echartInstance.setOption({
      series: [...createAnimationSeries(), ...option.value.series.slice(-2)],
    });
    animationFrameId = requestAnimationFrame(animate);
  }
}
const option = computed(() => {
  const total = props.pieData
    ? props.pieData.reduce((sum, item) => sum + item.value, 0)
    : 0;
  return {
    title: {
      text: "总访问量",
      subtext: total,
      textStyle: {
        color: "#333",
        fontSize: 16,
        fontWeight: "normal",
      },
      subtextStyle: {
        fontSize: 24,
        color: "#FF9F45",
        fontWeight: "bold",
      },
      x: "center",
      y: "center",
    },
    toolbox: {
      show: true,
      feature: {
        mark: { show: true },
        // dataView: { show: true },
        saveAsImage: { show: true },
      },
    },
    tooltip: {
      trigger: "item",
    },
    legend: {
      orient: "horizontal",
      left: "left",
    },
    series: [
      // 外围动画系列
      // ...createAnimationSeries(),
      // 主饼图
      {
        name: "访问统计",
        type: "pie",
        radius: ["40%", "70%"],
        center: ["50%", "50%"],
        data: props.pieData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
      // 内边
      {
        name: "",
        type: "pie",
        radius: ["40%", "70%"],
        center: ["50%", "50%"],
        silent: true,
        data: [
          {
            value: 1,
            itemStyle: {
              color: "rgba(255,159,69,0.2)",
            },
          },
        ],
      },
    ],
  };
});

onMounted(() => {
  if (echartRef.value) {
    // 初始化echarts实例
    echartInstance = echarts.init(echartRef.value, "light", {
      renderer: "canvas",
    });

    // 监听option变化, 重新执行setOption
    watchEffect(() => echartInstance.setOption(option.value));
    // 开始动画循环
    // animate();
  }
});
// onBeforeUnmount(() => {
//   if (animationFrameId) cancelAnimationFrame(animationFrameId);
//   if (echartInstance) echartInstance.dispose();
// });
</script>

<style lang="less" scoped>
.pie-echart {
  width: 100%;
  height: 100%;
  .echart {
    width: 100%;
    height: 100%;
    min-height: 450px;
  }
}
</style>
