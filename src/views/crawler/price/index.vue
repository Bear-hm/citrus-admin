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
            <el-form-item>
              <el-input
                v-model="queryParam"
                placeholder="请输入产地名或产品搜索"
                style="width: 200px"
                @keyup.enter="getTableData(1)"
              />
            </el-form-item>
            <el-button
              type="primary"
              @click="getTableData(1)"
              :disabled="queryParam ? false : true"
              >搜索</el-button
            >
            <el-button @click="refresh">刷新</el-button>
            <el-button type="success" @click="reqCrawlerPrice"
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
            <el-button type="primary" size="small" @click="update(row)">
              编辑
            </el-button>
            <el-popconfirm
              :title="`确定要删除该价格信息吗?`"
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
      :title="title == 1 ? '新增价格' : '修改价格'"
      width="60%"
    >
      <el-form
        :model="formParams"
        :rules="rules"
        ref="formRef"
        label-width="100px"
      >
        <el-form-item
          v-for="item in tableLabel"
          :key="item.prop"
          :label="item.name"
          :prop="item.prop"
        >
          <!-- 数字选择器 -->
          <el-input-number
            v-if="item.prop === 'price'"
            v-model="priceValue"
            :min="0"
            :precision="2"
            :step="0.1"
            placeholder="请输入价格"
          >
            <span class="unit-text">元/斤</span>
          </el-input-number>
          <!-- 地区选择 -->
          <el-cascader
            v-if="item.prop === 'address'"
            v-model="addressArray"
            :options="areaOptions"
            :props="{
              expandTrigger: 'hover',
            }"
            placeholder="请选择地区"
            style="width: 100%"
            @change="handleAreaChange"
          />

          <el-select
            v-if="item.prop === 'type'"
            v-model="formParams[item.prop]"
            placeholder="请选择产品类型"
            style="width: 100%"
          >
            <el-option
              v-for="option in typeOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
          <!-- 时间选择器 -->
          <el-date-picker
            v-if="item.prop === 'time'"
            v-model="formParams[item.prop]"
            type="datetime"
            placeholder="选择发布时间"
          />
          <el-input
            v-if="item.isInput"
            v-model="formParams[item.prop]"
            :placeholder="`请输入${item.name}`"
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
  reqGetPricePage,
  reqDeletePriceById,
  reqUpdatePrice,
  reqSavePrice,
  reqCrawlerPrice,
} from "@/api/crawler/price";
import { formatDateTime } from "@/utils/formatDateTime";
import { reqDownloadFileById, reqUploadFile } from "@/api/file/index";
import { ElMessage } from "element-plus";
import pcData from "@/assets/pc.json";

// title标题: 1新增 2修改
let title = ref(1);
// 分页器参数和方法
let pageSize = ref(10);
let currentPage = ref(1);
let total = ref(0);
let queryParam = ref("");
// 用于存储级联选择器的值
const addressArray = ref([]);
//存储价格数据
const priceValue = ref(0);
// 表单的ref
const formRef = ref();
// 图片显示对话框
const dialogImageUrl = ref("");
const formVisualDialog = ref(false);
const tableData = ref([]);
const areaOptions = reactive(
  Object.keys(pcData).map((province) => ({
    value: province,
    label: province,
    children: pcData[province].map((city) => ({
      value: city,
      label: city,
    })),
  }))
);
const typeOptions = reactive([
  {
    value: "柑桔",
    label: "柑桔",
  },
]);
// 表格的数据
let tableLabel = reactive([
  { prop: "time", name: "发布时间", isInput: false, renderType: "time" },
  { prop: "price", name: "价格", isInput: false, renderType: "text" },
  { prop: "address", name: "地区", isInput: false, renderType: "text" },
  { prop: "type", name: "产品", isInput: false, renderType: "text" },
  // { prop: "detail", name: "详情", isInput: false, renderType: "link" },
]);

const rules = {
  time: [{ required: true, message: "请选择发布时间", trigger: "change" }],
  price: [{ required: true, message: "请输入价格", trigger: "blur" }],
  adress: [{ required: true, message: "请输入地区", trigger: "blur" }],
  detail: [{ required: true, message: "请输入详情", trigger: "blur" }],
};

let formParams = reactive({
  id: "",
  time: "",
  price: "",
  address: "",
  type: "",
  createDate: "",
  updateDate: "",
  startDate: "",
  endDate: "",
});

// 获取列表数据
const getTableData = async (pager = 1) => {
  currentPage.value = pager;
  let res = await reqGetPricePage({
    pageNum: currentPage.value,
    pageSize: pageSize.value,
    keyword: queryParam.value,
  });
  if (res.code == "200") {
    total.value = res.data.total;
    tableData.value = res.data.list;
    ElMessage({
      type: "success",
      message: "获取价格数据成功",
    });
  } else {
    ElMessage({
      type: "error",
      message: "获取价格数据失败",
    });
  }
};

// 更新信息
const update = (row) => {
  title.value = 2;
  formVisualDialog.value = true;
  Object.assign(formParams, row);
  if (row.price) {
    priceValue.value = parseFloat(row.price);
  }
};

const handlePriceChange = (value) => {
  formParams.price = value + "元/斤";
};
// 增加数据
const addRow = () => {
  title.value = 1;
  formVisualDialog.value = true;
  addressArray.value = [];
  priceValue.value = 0;
  if (formRef.value) {
    formRef.value.resetFields();
  }
  Object.assign(formParams, {
    id: "",
    time: "",
    price: "",
    address: "",
    type: "",
    createDate: "",
    updateDate: "",
    startDate: "",
    endDate: "",
  });
};

// dialog框确认
const submitForm = async () => {
  let res;
  try {
    //统一处理价格
    handlePriceChange(priceValue.value);
    if (title.value == 1) {
      const { id, ...saveParams } = formParams;
      res = await reqSavePrice(saveParams);
    } else if (title.value == 2) {
      res = await reqUpdatePrice(formParams);
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
  const res = await reqDeletePriceById(id);
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
  addressArray.value = [];
  priceValue.value = 0;
  Object.assign(formParams, {
    id: "",
    time: "",
    price: "",
    address: "",
    type: "",
    createDate: "",
    updateDate: "",
    startDate: "",
    endDate: "",
  });
  if (formRef.value) {
    formRef.value.resetFields();
  }
};
const handleAreaChange = (value) => {
  formParams.address = value.join("");
};
const refresh = () => {
  queryParam.value = "";
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

.preview-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

.preview-container img {
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
}
.unit-text {
  white-space: nowrap;
  color: #606266;
}
</style>
