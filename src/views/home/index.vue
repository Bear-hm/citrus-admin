<template>
  <div class="min-h-full w-full space-y-6">
    <section
      class="overflow-hidden rounded-3xl border border-orange-100 bg-gradient-to-br from-orange-50 via-white to-amber-50 p-6 shadow-sm lg:p-8"
    >
      <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div class="max-w-2xl space-y-3">
          <p
            class="text-xs font-semibold uppercase tracking-[0.28em] text-orange-500"
          >
            Dashboard
          </p>
          <h1 class="text-2xl font-bold text-slate-900 lg:text-4xl">
            工作台
          </h1>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <el-select v-model="selectedTimeRange" size="small" class="w-32">
            <el-option
              v-for="option in timeRangeOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
          <el-button type="primary" size="small" @click="handleRefresh">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
      </div>
    </section>

    <section class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <el-card
        v-for="kpi in kpiData"
        :key="kpi.title"
        class="rounded-2xl border-0 shadow-sm transition-shadow duration-300 hover:shadow-md"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="space-y-2">
            <div class="text-sm text-slate-500">{{ kpi.title }}</div>
            <div class="text-2xl font-bold text-slate-900">
              {{ kpi.value }}
            </div>
            <div class="flex items-center gap-1 text-sm">
              <el-icon
                :class="kpi.trend === 'up' ? 'text-emerald-500' : 'text-rose-500'"
              >
                <ArrowUp v-if="kpi.trend === 'up'" />
                <ArrowDown v-else />
              </el-icon>
              <span
                :class="kpi.trend === 'up' ? 'text-emerald-500' : 'text-rose-500'"
              >
                {{ kpi.change }}%
              </span>
              <span class="text-xs text-slate-400">vs 上期</span>
            </div>
          </div>

          <div
            :class="kpi.iconBg"
            class="flex h-12 w-12 items-center justify-center rounded-xl"
          >
            <el-icon size="24" :class="kpi.iconColor">
              <component :is="kpi.icon" />
            </el-icon>
          </div>
        </div>
      </el-card>
    </section>

    <section class="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <el-card class="rounded-2xl border-0 shadow-sm">
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <el-icon class="text-blue-500"><TrendCharts /></el-icon>
              <span class="font-semibold text-slate-900">价格走势</span>
            </div>
            <el-button type="primary" link size="small">查看详情</el-button>
          </div>
        </template>

        <div
          class="flex h-64 items-center justify-center rounded-2xl bg-slate-50/80"
        >
          <div class="text-center text-slate-500">
            <el-icon size="48" class="mb-2 text-blue-500">
              <TrendCharts />
            </el-icon>
            <div class="font-medium text-slate-700">价格趋势图表</div>
            <div class="mt-1 text-sm">
              当前区域的近 30 天价格变化可在这里接入图表组件。
            </div>
          </div>
        </div>
      </el-card>

      <el-card class="rounded-2xl border-0 shadow-sm">
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <el-icon class="text-emerald-500"><PieChart /></el-icon>
              <span class="font-semibold text-slate-900">产量分布</span>
            </div>
            <el-button type="primary" link size="small">查看详情</el-button>
          </div>
        </template>

        <div
          class="flex h-64 items-center justify-center rounded-2xl bg-slate-50/80"
        >
          <div class="text-center text-slate-500">
            <el-icon size="48" class="mb-2 text-emerald-500">
              <PieChart />
            </el-icon>
            <div class="font-medium text-slate-700">产量分布图表</div>
            <div class="mt-1 text-sm">各地区柑橘产量占比可在这里展示。</div>
          </div>
        </div>
      </el-card>
    </section>

    <section class="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <el-card class="rounded-2xl border-0 shadow-sm">
        <template #header>
          <div class="flex items-center gap-2">
            <el-icon class="text-orange-500"><Location /></el-icon>
            <span class="font-semibold text-slate-900">主产区排行</span>
          </div>
        </template>

        <div class="space-y-3">
          <div
            v-for="(region, index) in topRegions"
            :key="region.name"
            class="flex items-center justify-between rounded-xl bg-slate-50 p-3"
          >
            <div class="flex items-center gap-3">
              <div
                :class="getRankBadgeClass(index + 1)"
                class="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold"
              >
                {{ index + 1 }}
              </div>
              <div>
                <div class="font-medium text-slate-900">{{ region.name }}</div>
                <div class="text-sm text-slate-500">{{ region.variety }}</div>
              </div>
            </div>
            <div class="text-right">
              <div class="font-semibold text-slate-900">
                {{ region.production }} 万吨
              </div>
              <div class="text-sm text-slate-500">{{ region.area }} 万亩</div>
            </div>
          </div>
        </div>
      </el-card>

      <el-card class="rounded-2xl border-0 shadow-sm">
        <template #header>
          <div class="flex items-center gap-2">
            <el-icon class="text-violet-500"><DataAnalysis /></el-icon>
            <span class="font-semibold text-slate-900">市场活跃度</span>
          </div>
        </template>

        <div class="space-y-4">
          <div
            v-for="activity in marketActivity"
            :key="activity.metric"
            class="space-y-2"
          >
            <div class="flex items-center justify-between text-sm">
              <span class="text-slate-600">{{ activity.metric }}</span>
              <span class="font-medium text-slate-900">
                {{ activity.value }}{{ activity.unit }}
              </span>
            </div>
            <el-progress
              :percentage="activity.percentage"
              :color="activity.color"
              :stroke-width="6"
              :show-text="false"
            />
          </div>
        </div>
      </el-card>
    </section>

    <el-card class="rounded-2xl border-0 shadow-sm">
      <template #header>
        <div class="flex items-center gap-2">
          <el-icon class="text-indigo-500"><Clock /></el-icon>
          <span class="font-semibold text-slate-900">最近动态</span>
        </div>
      </template>

      <div class="space-y-4">
        <div
          v-for="activity in recentActivities"
          :key="activity.id"
          class="flex items-start gap-4 rounded-xl bg-slate-50 p-4 transition-colors hover:bg-slate-100"
        >
          <div
            :class="activity.iconBg"
            class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
          >
            <el-icon :class="activity.iconColor">
              <component :is="activity.icon" />
            </el-icon>
          </div>

          <div class="min-w-0 flex-1">
            <div class="font-medium text-slate-900">{{ activity.title }}</div>
            <div class="mt-1 text-sm text-slate-600">
              {{ activity.description }}
            </div>
            <div class="mt-2 text-xs text-slate-400">
              {{ formatTime(activity.timestamp) }}
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  ArrowDown,
  ArrowUp,
  Clock,
  DataAnalysis,
  Document,
  Location,
  PieChart,
  Refresh,
  ShoppingCart,
  TrendCharts,
  User,
  Bell,
} from "@element-plus/icons-vue";

type TimeRange = "today" | "week" | "month" | "year";

const selectedTimeRange = ref<TimeRange>("month");

const timeRangeOptions: Array<{ label: string; value: TimeRange }> = [
  { label: "今日", value: "today" },
  { label: "本周", value: "week" },
  { label: "本月", value: "month" },
  { label: "本年", value: "year" },
];

const kpiData = [
  {
    title: "总产量",
    value: "1,234 万吨",
    change: 12.5,
    trend: "up",
    icon: TrendCharts,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    title: "平均价格",
    value: "¥4.2/斤",
    change: 3.2,
    trend: "up",
    icon: ShoppingCart,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    title: "活跃用户",
    value: "8,456",
    change: 8.1,
    trend: "up",
    icon: User,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-600",
  },
  {
    title: "交易量",
    value: "2,345 笔",
    change: 2.3,
    trend: "down",
    icon: Document,
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
  },
] as const;

const topRegions = [
  { name: "江西赣州", variety: "脐橙", production: 156, area: 45 },
  { name: "湖南永州", variety: "蜜橘", production: 128, area: 38 },
  { name: "广西桂林", variety: "沙田柚", production: 98, area: 32 },
  { name: "四川眉山", variety: "春见", production: 87, area: 28 },
  { name: "重庆奉节", variety: "脐橙", production: 76, area: 25 },
] as const;

const marketActivity = [
  { metric: "供应信息发布", value: 156, unit: "条", percentage: 78, color: "#f97316" },
  { metric: "需求信息发布", value: 89, unit: "条", percentage: 45, color: "#22c55e" },
  { metric: "智能识别使用", value: 234, unit: "次", percentage: 92, color: "#eab308" },
  { metric: "资讯浏览量", value: 1234, unit: "次", percentage: 65, color: "#8b5cf6" },
] as const;

const recentActivities = [
  {
    id: 1,
    title: "新用户注册",
    description: "张三注册成为平台用户。",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    icon: User,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    id: 2,
    title: "供应信息发布",
    description: "赣南果业发布脐橙供应信息。",
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    icon: ShoppingCart,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    id: 3,
    title: "智能识别",
    description: "用户使用 AI 识别柑橘品种。",
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    icon: Bell,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-600",
  },
] as const;

const handleRefresh = () => {
  selectedTimeRange.value = selectedTimeRange.value;
};

const getRankBadgeClass = (rank: number) => {
  switch (rank) {
    case 1:
      return "bg-yellow-400 text-white";
    case 2:
      return "bg-slate-400 text-white";
    case 3:
      return "bg-orange-400 text-white";
    default:
      return "bg-slate-200 text-slate-600";
  }
};

const formatTime = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));

  if (minutes < 1) return "刚刚";
  if (minutes < 60) return `${minutes} 分钟前`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} 小时前`;

  const days = Math.floor(hours / 24);
  return `${days} 天前`;
};
</script>

<style scoped>
:deep(.el-progress) {
  margin-bottom: 0;
}
</style>
