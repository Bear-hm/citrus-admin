<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { ElMessageBox } from "element-plus";
import { Delete, Edit } from "@element-plus/icons-vue";
import message from "@/utils/message";
import {
  reqCreateMarketPrice,
  reqDeleteMarketPrice,
  reqGetMarketPriceDetail,
  reqGetMarketPriceList,
  reqGetMarketRegions,
  reqGetMarketVarieties,
  reqUpdateMarketPrice,
} from "@/api/market";
import type {
  MarketPriceFormDTO,
  MarketPriceVO,
  PageVO,
} from "@/api/market/type";

const loading = ref(false);
const dialogVisible = ref(false);
const isEdit = ref(false);
const formRef = ref();

const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

const queryForm = reactive({
  varietyName: "",
  regionCode: "",
  priceType: "",
});

const tableData = ref<MarketPriceVO[]>([]);
const varietyOptions = ref<string[]>([]);
const regionOptions = ref<string[]>([]);

const form = reactive<MarketPriceVO>({
  id: 0,
  varietyName: "",
  regionCode: "",
  regionName: "",
  price: 0,
  unit: "元/斤",
  priceType: "wholesale",
  recordedAt: "",
  priceChange: 0,
  priceChangeRate: 0,
  searchVolume: 0,
  viewCount: 0,
  analystTip: "",
  sourceName: "",
  status: 1,
});

const tableColumns = [
  { prop: "varietyName", label: "品种", minWidth: 120 },
  { prop: "regionName", label: "地区", minWidth: 120 },
  { prop: "price", label: "价格", width: 100 },
  { prop: "unit", label: "单位", width: 90 },
  { prop: "priceType", label: "价格类型", width: 110 },
  { prop: "priceChange", label: "涨跌额", width: 100 },
  { prop: "priceChangeRate", label: "涨跌幅", width: 100 },
  { prop: "recordedAt", label: "记录日期", width: 120 },
  { prop: "sourceName", label: "数据来源", minWidth: 160 },
  { prop: "status", label: "状态", width: 90 },
];

const formColumns = [
  { prop: "varietyName", label: "品种", type: "select-input" },
  { prop: "regionCode", label: "地区编码", type: "select-input" },
  { prop: "regionName", label: "地区名称", type: "input" },
  { prop: "priceType", label: "价格类型", type: "select" },
  { prop: "price", label: "价格", type: "number", min: 0.01, precision: 2 },
  { prop: "unit", label: "单位", type: "input" },
  { prop: "priceChange", label: "涨跌额", type: "number", precision: 2 },
  { prop: "priceChangeRate", label: "涨跌幅", type: "number", precision: 2 },
  { prop: "recordedAt", label: "记录日期", type: "date" },
  { prop: "searchVolume", label: "搜索热度", type: "number", min: 0 },
  { prop: "viewCount", label: "浏览量", type: "number", min: 0 },
  { prop: "sourceName", label: "数据来源", type: "input" },
  { prop: "status", label: "状态", type: "status" },
  { prop: "analystTip", label: "分析师解读", type: "textarea" },
];

const priceTypeOptions = [
  { label: "批发价", value: "wholesale" },
  { label: "零售价", value: "retail" },
  { label: "产地价", value: "farm" },
];

const rules = {
  varietyName: [{ required: true, message: "请输入品种", trigger: "change" }],
  price: [{ required: true, message: "请输入价格", trigger: "blur" }],
  recordedAt: [{ required: true, message: "请选择记录日期", trigger: "change" }],
};

const formatPriceType = (value?: string) => {
  return priceTypeOptions.find((item) => item.value === value)?.label || value || "-";
};

const getStatusMeta = (value?: number) => {
  if (value === 1) return { label: "启用", type: "success" };
  if (value === 0) return { label: "禁用", type: "danger" };
  return { label: "未知", type: "info" };
};

const formatSignedNumber = (value?: number, digits = 2) => {
  if (value === undefined || value === null) return "-";
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return "-";
  return `${numeric > 0 ? "+" : ""}${numeric.toFixed(digits)}`;
};

const resetForm = () => {
  Object.assign(form, {
    id: 0,
    varietyName: "",
    regionCode: "",
    regionName: "",
    price: 0,
    unit: "元/斤",
    priceType: "wholesale",
    recordedAt: "",
    priceChange: 0,
    priceChangeRate: 0,
    searchVolume: 0,
    viewCount: 0,
    analystTip: "",
    sourceName: "",
    status: 1,
  });
};

const loadOptions = async () => {
  try {
    const [varietyRes, regionRes] = await Promise.all([
      reqGetMarketVarieties(),
      reqGetMarketRegions(),
    ]);

    if (varietyRes.code === 200) {
      varietyOptions.value = (varietyRes.data || []) as string[];
    }

    if (regionRes.code === 200) {
      regionOptions.value = (regionRes.data || []) as string[];
    }
  } catch {
    message.error("加载筛选项失败");
  }
};

const getTableData = async (page = 1) => {
  currentPage.value = page;
  loading.value = true;

  try {
    const res = await reqGetMarketPriceList({
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      varietyName: queryForm.varietyName || undefined,
      regionCode: queryForm.regionCode || undefined,
      priceType: queryForm.priceType || undefined,
    });

    if (res.code === 200) {
      const pageData = res.data as PageVO<MarketPriceVO>;
      tableData.value = pageData.records || [];
      total.value = pageData.total || 0;
    } else {
      message.error(res.message || "获取价格行情列表失败");
    }
  } catch {
    message.error("获取价格行情列表失败");
  } finally {
    loading.value = false;
  }
};

const onSizeChange = (size: number) => {
  pageSize.value = size;
  getTableData(1);
};

const addRow = () => {
  isEdit.value = false;
  resetForm();
  dialogVisible.value = true;
};

const editRow = async (row: MarketPriceVO) => {
  isEdit.value = true;
  try {
    const res = await reqGetMarketPriceDetail(row.id);
    if (res.code === 200) {
      Object.assign(form, res.data as MarketPriceVO);
      dialogVisible.value = true;
    } else {
      message.error(res.message || "获取行情详情失败");
    }
  } catch {
    message.error("获取行情详情失败");
  }
};

const submit = async () => {
  await formRef.value?.validate();

  const payload: MarketPriceFormDTO = {
    varietyName: form.varietyName,
    regionCode: form.regionCode || undefined,
    regionName: form.regionName || undefined,
    price: Number(form.price),
    unit: form.unit || "元/斤",
    priceType: form.priceType || "wholesale",
    recordedAt: form.recordedAt,
    priceChange: Number(form.priceChange || 0),
    priceChangeRate: Number(form.priceChangeRate || 0),
    searchVolume: Number(form.searchVolume || 0),
    viewCount: Number(form.viewCount || 0),
    analystTip: form.analystTip || "",
    sourceName: form.sourceName || "",
    status: Number(form.status ?? 1),
  };

  try {
    const res = isEdit.value
      ? await reqUpdateMarketPrice(form.id, payload)
      : await reqCreateMarketPrice(payload);

    if (res.code === 200) {
      message.success(isEdit.value ? "更新成功" : "新增成功");
      dialogVisible.value = false;
      getTableData(currentPage.value);
      loadOptions();
    } else {
      message.error(res.message || (isEdit.value ? "更新失败" : "新增失败"));
    }
  } catch {
    message.error(isEdit.value ? "更新失败" : "新增失败");
  }
};

const deleteRow = async (row: MarketPriceVO) => {
  try {
    await ElMessageBox.confirm(
      `确定删除 ${row.varietyName} - ${row.regionName || row.regionCode || "-"} 这条价格记录吗？`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      },
    );

    const res = await reqDeleteMarketPrice(row.id);
    if (res.code === 200) {
      message.success("删除成功");
      getTableData(currentPage.value);
    } else {
      message.error(res.message || "删除失败");
    }
  } catch {
    // user cancelled
  }
};

const refresh = () => {
  queryForm.varietyName = "";
  queryForm.regionCode = "";
  queryForm.priceType = "";
  getTableData(1);
};

onMounted(async () => {
  await loadOptions();
  getTableData();
});
</script>

<template>
  <div class="container">
    <el-form :inline="true" class="option-form">
      <div>
        <el-button type="primary" @click="addRow">新增</el-button>
      </div>

      <div>
        <el-select
          v-model="queryForm.regionCode"
          placeholder="选择地区"
          clearable
          style="width: 140px; margin-right: 10px"
        >
          <el-option
            v-for="item in regionOptions"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>

        <el-select
          v-model="queryForm.priceType"
          placeholder="价格类型"
          clearable
          style="width: 140px; margin-right: 10px"
        >
          <el-option
            v-for="item in priceTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>

        <el-input
          v-model="queryForm.varietyName"
          placeholder="搜索品种"
          style="width: 200px; margin-right: 10px"
          @keyup.enter="getTableData(1)"
        />
        <el-button type="primary" @click="getTableData(1)">搜索</el-button>
        <el-button @click="refresh">刷新</el-button>
      </div>
    </el-form>

    <el-table v-loading="loading" :data="tableData" stripe style="width: 100%" height="520">
      <el-table-column
        v-for="item in tableColumns"
        :key="item.prop"
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
        :min-width="item.minWidth"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          <template v-if="item.prop === 'price'">
            ¥ {{ Number(row.price || 0).toFixed(2) }}
          </template>
          <template v-else-if="item.prop === 'priceType'">
            {{ formatPriceType(row.priceType) }}
          </template>
          <template v-else-if="item.prop === 'priceChange'">
            <span :class="Number(row.priceChange || 0) >= 0 ? 'up' : 'down'">
              {{ formatSignedNumber(row.priceChange) }}
            </span>
          </template>
          <template v-else-if="item.prop === 'priceChangeRate'">
            <span :class="Number(row.priceChangeRate || 0) >= 0 ? 'up' : 'down'">
              {{ formatSignedNumber(row.priceChangeRate) }}%
            </span>
          </template>
          <template v-else-if="item.prop === 'status'">
            <el-tag :type="getStatusMeta(row.status).type">
              {{ getStatusMeta(row.status).label }}
            </el-tag>
          </template>
          <template v-else>
            {{ row[item.prop as keyof MarketPriceVO] }}
          </template>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="160" fixed="right" align="center">
        <template #default="{ row }">
          <div class="action-buttons">
            <el-button
              type="warning"
              size="small"
              class="btn-edit"
              @click="editRow(row)"
            >
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
            <el-button
              type="danger"
              size="small"
              class="btn-delete"
              @click="deleteRow(row)"
            >
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 50]"
      :total="total"
      background
      layout="total, sizes, prev, pager, next"
      style="justify-content: center; margin-top: 20px"
      @current-change="getTableData"
      @size-change="onSizeChange"
    />

    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑价格行情' : '新增价格行情'"
      width="58%"
      :close-on-click-modal="false"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="110px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="品种" prop="varietyName">
              <el-select
                v-model="form.varietyName"
                filterable
                allow-create
                default-first-option
                placeholder="请输入或选择品种"
                style="width: 100%"
              >
                <el-option
                  v-for="item in varietyOptions"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="地区编码">
              <el-select
                v-model="form.regionCode"
                filterable
                allow-create
                default-first-option
                placeholder="请输入或选择地区编码"
                style="width: 100%"
              >
                <el-option
                  v-for="item in regionOptions"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="地区名称">
              <el-input v-model="form.regionName" placeholder="请输入地区名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="价格类型">
              <el-select
                v-model="form.priceType"
                placeholder="请选择价格类型"
                style="width: 100%"
              >
                <el-option
                  v-for="item in priceTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="价格" prop="price">
              <el-input-number
                v-model="form.price"
                :min="0.01"
                :precision="2"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位">
              <el-input v-model="form.unit" placeholder="例如：元/斤" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="涨跌额">
              <el-input-number
                v-model="form.priceChange"
                :precision="2"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="涨跌幅">
              <el-input-number
                v-model="form.priceChangeRate"
                :precision="2"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="记录日期" prop="recordedAt">
              <el-date-picker
                v-model="form.recordedAt"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择记录日期"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio :label="1">启用</el-radio>
                <el-radio :label="0">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="搜索热度">
              <el-input-number
                v-model="form.searchVolume"
                :min="0"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="浏览量">
              <el-input-number
                v-model="form.viewCount"
                :min="0"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="数据来源">
          <el-input v-model="form.sourceName" placeholder="请输入数据来源" />
        </el-form-item>

        <el-form-item label="分析师解读">
          <el-input
            v-model="form.analystTip"
            type="textarea"
            :rows="4"
            placeholder="请输入分析师解读"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.container {
  font-size: 16px;
  padding: 20px;
  margin-bottom: 70px;
  margin-top: 20px;
  box-shadow: 0px 0px 27px 0px rgba(110, 109, 109, 0.14);

  .option-form {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    :deep(.el-form-item) {
      margin-bottom: 0;
    }
  }
}

.action-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-edit {
  background: #f97316;
  border: none;
  color: #ffffff;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: #ea580c;
    box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
    transform: translateY(-1px);
  }
}

.btn-delete {
  background: #ef4444;
  border: none;
  color: #ffffff;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: #dc2626;
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
    transform: translateY(-1px);
  }
}

.up {
  color: #16a34a;
}

.down {
  color: #dc2626;
}
</style>
