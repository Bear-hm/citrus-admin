<template>
  <div class="container">
    <div class="bottom">
      <el-form :inline="true" label-width="auto" class="option-form">
        <div class="option-left">
          <el-form-item>
            <el-button type="primary" @click="addRow">新增采购</el-button>
          </el-form-item>
        </div>
        <div class="option-right">
          <el-form-item>
            <el-form-item>
              <el-input
                v-model="queryParam"
                placeholder="请输入关键字搜索"
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
            <el-button type="success" @click="reqCrawlerProcurement"
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
            <el-button
              v-if="item.renderType === 'link'"
              type="primary"
              link
              @click="openUrl(row[item.prop])"
            >
              访问链接
            </el-button>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="update(row)">
              编辑
            </el-button>
            <el-popconfirm
              :title="`确定要删除该采购信息吗?`"
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
      :title="title == 1 ? '新增采购' : '修改采购'"
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
          <!-- 地区选择器 -->
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
          <!-- 普通输入框 -->
          <el-input
            v-else
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

<script setup>
import { ref, reactive, onMounted } from "vue";
import {
  reqGetProcurementPage,
  reqDeleteProcurementById,
  reqUpdateProcurement,
  reqSaveProcurement,
  reqCrawlerProcurement,
} from "@/api/crawler/procure";
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
// 表单的ref
const formRef = ref();
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

// 表格的数据
const tableLabel = reactive([
  { prop: "name", name: "名称", isInput: true, renderType: "text" },
  { prop: "amount", name: "采购数量", isInput: true, renderType: "text" },
  { prop: "purchaser", name: "采购商", isInput: true, renderType: "text" },
  { prop: "address", name: "采购地区", isInput: true, renderType: "text" },
  { prop: "updateTime", name: "更新时间", isInput: true, renderType: "text" },
  { prop: "detailUrl", name: "详细地址", isInput: true, renderType: "link" },
]);

const rules = {
  name: [{ required: true, message: "请输入名称", trigger: "blur" }],
  amount: [{ required: true, message: "请输入采购数量", trigger: "blur" }],
  purchaser: [{ required: true, message: "请输入采购商", trigger: "blur" }],
  // address: [{ required: true, message: "请选择采购地区", trigger: "change" }],
  level: [{ required: true, message: "请输入级别", trigger: "blur" }],
};

let formParams = reactive({
  id: "",
  name: "",
  amount: "",
  address: "",
  purchaser: "",
  updateTime: "",
  level: "",
  detailUrl: "",
});

// 获取列表数据
const getTableData = async (pager = 1) => {
  currentPage.value = pager;
  try {
    const res = await reqGetProcurementPage({
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      keyword: queryParam.value,
    });
    if (res.code === "200") {
      total.value = res.data.total;
      tableData.value = res.data.list;
      ElMessage({
        type: "success",
        message: "获取采购数据成功",
      });
    }
  } catch (error) {
    ElMessage({
      type: "error",
      message: "获取采购数据失败",
    });
  }
};

// 更新信息
const update = (row) => {
  title.value = 2;
  formVisualDialog.value = true;
  Object.assign(formParams, row);
  addressArray.value = row.area ? row.area.split("") : [];
};

// 增加数据
const addRow = () => {
  title.value = 1;
  formVisualDialog.value = true;
  addressArray.value = [];
  if (formRef.value) {
    formRef.value.resetFields();
  }
  Object.assign(formParams, {
    id: "",
    name: "",
    amount: "",
    address: "",
    purchaser: "",
    updateTime: "",
    level: "",
    detailUrl: "",
  });
};

// dialog框确认
const submitForm = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        let res;
        if (title.value === 1) {
          const { id, ...saveParams } = formParams;
          res = await reqSaveProcurement(saveParams);
        } else {
          res = await reqUpdateProcurement(formParams);
        }

        if (res.code === "200") {
          formVisualDialog.value = false;
          ElMessage({
            type: "success",
            message: title.value === 2 ? "编辑成功" : "新增成功",
          });
          getTableData();
        }
      } catch (error) {
        ElMessage({
          type: "error",
          message: title.value === 2 ? "编辑失败" : "新增失败",
        });
      }
    }
  });
};

// 删除数据
const deleteRow = async (id) => {
  try {
    const res = await reqDeleteProcurementById(id);
    if (res.code === "200") {
      ElMessage({
        type: "success",
        message: "删除成功",
      });
      getTableData();
    }
  } catch (error) {
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
  Object.assign(formParams, {
    id: "",
    name: "",
    amount: "",
    address: "",
    purchaser: "",
    updateTime: "",
    level: "",
    detailUrl: "",
  });
  if (formRef.value) {
    formRef.value.resetFields();
  }
};

const handleAreaChange = (value) => {
  formParams.area = value.join("");
};

const refresh = () => {
  queryParam.value = "";
  getTableData(1);
};
const openUrl = (url) => {
  if (url) {
    window.open(url, "_blank");
  }
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
