<script setup>
import { ref, onMounted } from "vue";
import { reqGetWeather } from "@/api/weather";
import message from "@/utils/message";

const weatherData = ref(null);
const loading = ref(false);

// 获取天气信息
const getWeather = async () => {
  loading.value = true;
  try {
    const res = await reqGetWeather();
    if (res.code === 200) {
      weatherData.value = res.data;
    } else {
      message.error(res.message || "获取天气信息失败");
    }
  } catch (error) {
    message.error("获取天气信息失败");
  } finally {
    loading.value = false;
  }
};

// 获取空气等级
const getAirQualityLevel = (aqi) => {
  if (aqi <= 50) return { label: "优", type: "success" };
  if (aqi <= 100) return { label: "良", type: "success" };
  if (aqi <= 150) return { label: "轻度污染", type: "warning" };
  if (aqi <= 200) return { label: "中度污染", type: "warning" };
  if (aqi <= 300) return { label: "重度污染", type: "danger" };
  return { label: "严重污染", type: "danger" };
};

// 获取天气图标
const getWeatherIcon = (condition) => {
  const conditionLower = condition?.toLowerCase() || "";
  if (conditionLower.includes("晴")) return "Sunny";
  if (conditionLower.includes("雨")) return "Rainy";
  if (conditionLower.includes("阴")) return "Cloudy";
  if (conditionLower.includes("雪")) return "Snowy";
  if (conditionLower.includes("雷")) return "Lightning";
  return "Cloudy";
};

onMounted(() => {
  getWeather();
});
</script>

<template>
  <div class="weather-container">
    <div class="header">
      <h3>天气管理</h3>
      <el-button type="primary" @click="getWeather">刷新</el-button>
    </div>

    <div v-loading="loading" class="weather-content">
      <el-empty v-if="!weatherData" description="暂无天气数据" />

      <el-card v-else class="weather-card">
        <div class="weather-main">
          <div class="weather-icon">
            <el-icon :size="80">
              <component :is="getWeatherIcon(weatherData.conditionText)" />
            </el-icon>
          </div>
          <div class="weather-info">
            <div class="temperature">
              <span class="temp-value">{{ weatherData.temperature }}</span>
              <span class="temp-unit">°C</span>
            </div>
            <div class="condition">{{ weatherData.conditionText }}</div>
            <div class="city">{{ weatherData.city }}</div>
          </div>
        </div>

        <el-divider />

        <div class="weather-details">
          <div class="detail-item">
            <span class="label">湿度</span>
            <span class="value">{{ weatherData.humidity }}%</span>
          </div>
          <div class="detail-item">
            <span class="label">风速</span>
            <span class="value">{{ weatherData.windSpeed }} m/s</span>
          </div>
          <div class="detail-item">
            <span class="label">降雨概率</span>
            <span class="value">{{ weatherData.rainChance }}%</span>
          </div>
          <div class="detail-item">
            <span class="label">空气质量</span>
            <el-tag :type="getAirQualityLevel(weatherData.airQualityIndex).type">
              {{ getAirQualityLevel(weatherData.airQualityIndex).label }} ({{ weatherData.airQualityIndex }})
            </el-tag>
          </div>
          <div class="detail-item">
            <span class="label">预报时间</span>
            <span class="value">{{ weatherData.reportTime }}</span>
          </div>
          <div class="detail-item">
            <span class="label">数据来源</span>
            <span class="value">{{ weatherData.sourceName }}</span>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<style scoped lang="scss">
.weather-container {
  padding: 20px;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h3 {
      margin: 0;
    }
  }

  .weather-content {
    min-height: 400px;
  }

  .weather-card {
    max-width: 600px;
    margin: 0 auto;
  }

  .weather-main {
    display: flex;
    align-items: center;
    gap: 30px;
    padding: 20px 0;
  }

  .weather-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 120px;
    height: 120px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 50%;
    color: white;
  }

  .weather-info {
    flex: 1;

    .temperature {
      font-size: 48px;
      font-weight: bold;
      color: #333;

      .temp-value {
        font-size: 64px;
      }

      .temp-unit {
        font-size: 24px;
        color: #666;
        margin-left: 5px;
      }
    }

    .condition {
      font-size: 20px;
      color: #666;
      margin-top: 5px;
    }

    .city {
      font-size: 16px;
      color: #999;
      margin-top: 5px;
    }
  }

  .weather-details {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    padding: 10px 0;

    .detail-item {
      display: flex;
      flex-direction: column;
      gap: 5px;

      .label {
        font-size: 14px;
        color: #999;
      }

      .value {
        font-size: 16px;
        color: #333;
        font-weight: 500;
      }
    }
  }
}

@media (max-width: 600px) {
  .weather-details {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
