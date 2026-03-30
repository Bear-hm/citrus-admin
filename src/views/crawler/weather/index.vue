<template>
  <div class="container">
    <div class="bottom">
      <el-form :inline="true" label-width="auto" class="option-form">
        <div class="option-left">
          <el-form-item>
            <el-button type="primary" @click="addRow">新增数据</el-button>
          </el-form-item>
        </div>
        <div class="option-right">
          <el-form-item>
            <el-button @click="refresh">刷新</el-button>
            <el-button type="success" @click="reqCrawlerWeather"
              >爬取数据</el-button
            >
          </el-form-item>
        </div>
      </el-form>

      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column
          v-for="(item, index) in tableLabel"
          :key="index"
          :prop="item.prop"
          :label="item.name"
          align="center"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <span v-if="item.renderType === 'text'">{{ row[item.prop] }}</span>
            <span v-if="item.renderType === 'time'">{{
              formatDateTime(row[item.prop])
            }}</span>
            <el-button
              v-if="item.renderType === 'link'"
              type="primary"
              link
              @click="showDetail(row)"
            >
              查看详情
            </el-button>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="update(row)"
              >编辑</el-button
            >
            <el-popconfirm
              :title="`确定要删除该天气信息吗?`"
              width="260px"
              @confirm="deleteRow(row.id)"
            >
              <template #reference>
                <el-button type="primary" size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        class="pagination"
        v-model:current-page="currentPage"
        :page-sizes="[6, 8, 10, 12]"
        v-model:page-size="pageSize"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="getTableData"
        @current-change="getTableData"
      />
    </div>

    <!-- 增加/修改对话框 -->
    <el-dialog
      v-model="formVisualDialog"
      :title="title == 1 ? '新增天气' : '修改天气'"
      width="60%"
    >
      <el-form
        :model="formParams"
        :rules="rules"
        ref="formRef"
        label-width="120px"
      >
        <el-form-item label="短时预报" prop="shortReport">
          <el-input
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            v-model="formParams.shortReport"
            placeholder="请输入短时预报"
          />
        </el-form-item>
        <el-form-item label="空气质量指数" prop="aqi">
          <el-input
            v-model="formParams.aqi"
            placeholder="请输入空气质量指数(AQI)"
          />
        </el-form-item>
        <el-form-item label="空气质量等级" prop="level">
          <el-input
            v-model="formParams.level"
            placeholder="请输入空气质量等级"
          />
        </el-form-item>
        <el-form-item label="首要污染物" prop="pollutants">
          <el-input
            v-model="formParams.pollutants"
            placeholder="请输入首要污染物"
          />
        </el-form-item>
        <el-form-item label="PM2.5日均值" prop="pm">
          <el-input v-model="formParams.pm" placeholder="请输入PM2.5日均值" />
        </el-form-item>
        <el-form-item label="AI建议" prop="advice">
          <el-input
            type="textarea"
            v-model="formParams.advice"
            placeholder="请输入AI建议"
          />
        </el-form-item>
        <el-form-item label="最高温度" prop="maxTemperature">
          <el-input-number
            style="width: 200px"
            v-model="formParams.maxTemperature"
            :precision="1"
            :step="0.5"
            placeholder="请输入最高温度"
          />
        </el-form-item>
        <el-form-item label="最低温度" prop="minTemperature">
          <el-input-number
            style="width: 200px"
            v-model="formParams.minTemperature"
            :precision="1"
            :step="0.5"
            placeholder="请输入最低温度"
          />
        </el-form-item>
        <el-form-item label="最大降雨量" prop="maxRainfall">
          <el-input
            v-model="formParams.maxRainfall"
            placeholder="请输入最大降雨量"
          />
        </el-form-item>
        <el-form-item label="最小降雨量" prop="minRainfall">
          <el-input
            v-model="formParams.minRainfall"
            placeholder="请输入最小降雨量"
          />
        </el-form-item>
        <el-form-item label="最大风速" prop="maxSpeed">
          <el-input
            v-model="formParams.maxSpeed"
            placeholder="请输入最大风速"
          />
        </el-form-item>
        <el-form-item label="最小风速" prop="minSpeed">
          <el-input
            v-model="formParams.minSpeed"
            placeholder="请输入最小风速"
          />
        </el-form-item>
        <el-form-item label="当前温度" prop="temperature">
          <el-input-number
            style="width: 200px"
            v-model="formParams.temperature"
            :precision="1"
            :step="0.5"
            placeholder="请输入当前温度"
          />
        </el-form-item>
        <el-form-item label="风力等级" prop="windLevel">
          <el-input
            v-model="formParams.windLevel"
            placeholder="请输入风力等级"
          />
        </el-form-item>
        <el-form-item label="风向" prop="windDirection">
          <el-input
            v-model="formParams.windDirection"
            placeholder="请输入风向"
          />
        </el-form-item>
        <el-form-item label="湿度" prop="humidity">
          <el-input v-model="formParams.humidity" placeholder="请输入湿度" />
        </el-form-item>
        <el-form-item label="小时降雨量" prop="hourRainfall">
          <el-input
            v-model="formParams.hourRainfall"
            placeholder="请输入小时降雨量"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import {
  reqGetWeatherPage,
  reqDeleteWeatherById,
  reqUpdateWeather,
  reqSaveWeather,
  reqCrawlerWeather,
} from "@/api/crawler/weather";
import { ElMessage } from "element-plus";
import { formatDateTime } from "@/utils/formatDateTime";
// title标题: 1新增 2修改
let title = ref(1);
// 分页器参数和方法
let pageSize = ref(10);
let currentPage = ref(1);
let total = ref(0);

// 表单的ref
const formRef = ref();
const formVisualDialog = ref(false);
const tableData = ref([]);

// 表格的数据
let tableLabel = reactive([
  { prop: "temperature", name: "温度", renderType: "text" },
  { prop: "createDate", name: "创建时间", renderType: "time" },
]);

const rules = {
  temperature: [{ required: true, message: "请输入温度", trigger: "blur" }],
};

let formParams = reactive({
  id: "",
  shortReport: "",
  aqi: "",
  level: "",
  pollutants: "",
  pm: "",
  advice: "",
  maxTemperature: "",
  minTemperature: "",
  maxRainfall: "",
  minRainfall: "",
  maxSpeed: "",
  minSpeed: "",
  temperature: "",
  windLevel: "",
  windDirection: "",
  humidity: "",
  hourRainfall: "",
});

// 获取列表数据
const getTableData = async (pager = 1) => {
  currentPage.value = pager;
  let res = await reqGetWeatherPage({
    pageNum: currentPage.value,
    pageSize: pageSize.value,
  });
  if (res.code == "200") {
    total.value = res.data.total;
    tableData.value = res.data.list;
    ElMessage({
      type: "success",
      message: "获取天气数据成功",
    });
  } else {
    ElMessage({
      type: "error",
      message: "获取天气数据失败",
    });
  }
};

// 更新信息
const update = (row) => {
  title.value = 2;
  formVisualDialog.value = true;
  Object.assign(formParams, row);
};

// 增加数据
const addRow = () => {
  title.value = 1;
  formVisualDialog.value = true;
  if (formRef.value) {
    formRef.value.resetFields();
  }
  Object.assign(formParams, {
    id: "",
    shortReport: "",
    aqi: "",
    level: "",
    pollutants: "",
    pm: "",
    advice: "",
    maxTemperature: "",
    minTemperature: "",
    maxRainfall: "",
    minRainfall: "",
    maxSpeed: "",
    minSpeed: "",
    temperature: "",
    windLevel: "",
    windDirection: "",
    humidity: "",
    hourRainfall: "",
  });
};

// dialog框确认
const submitForm = async () => {
  let res;
  try {
    if (title.value == 1) {
      const { id, ...saveParams } = formParams;
      res = await reqSaveWeather(saveParams);
    } else if (title.value == 2) {
      res = await reqUpdateWeather(formParams);
    }

    if (res.code == "200") {
      formVisualDialog.value = false;
      ElMessage({
        type: "success",
        message: title.value == 2 ? "编辑成功" : "新增成功",
      });
      getTableData();
    }
  } catch (error) {
    formVisualDialog.value = false;
    ElMessage({
      type: "error",
      message: title.value == 2 ? "编辑失败" : "新增失败",
    });
    console.error("请求失败:", error);
  }
};

// 删除数据
const deleteRow = async (id) => {
  const res = await reqDeleteWeatherById(id);
  if (res.code == "200") {
    ElMessage({
      type: "success",
      message: "删除成功",
    });
    getTableData();
  } else {
    ElMessage({
      type: "error",
      message: "删除失败",
    });
  }
};

// 取消
const cancel = () => {
  formVisualDialog.value = false;
  Object.assign(formParams, {
    id: "",
    shortReport: "",
    aqi: "",
    level: "",
    pollutants: "",
    pm: "",
    advice: "",
    maxTemperature: "",
    minTemperature: "",
    maxRainfall: "",
    minRainfall: "",
    maxSpeed: "",
    minSpeed: "",
    temperature: "",
    windLevel: "",
    windDirection: "",
    humidity: "",
    hourRainfall: "",
  });
  if (formRef.value) {
    formRef.value.resetFields();
  }
};

const refresh = () => {
  getTableData(1);
};

onMounted(() => {
  getTableData();
});
</script>

<style scoped>
.container {
  padding: 1% 2%;
  position: relative;
  height: 100%;
}

.pagination {
  margin-top: 2%;
  justify-content: center;
}

.option-form {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
