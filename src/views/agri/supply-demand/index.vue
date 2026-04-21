<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import { ElMessageBox } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";
import { Delete, Edit, Plus } from "@element-plus/icons-vue";
import message from "@/utils/message";
import {
  reqCreateDemand,
  reqCreateSupply,
  reqDeleteDemand,
  reqDeleteSupply,
  reqGetDemandDetail,
  reqGetDemandList,
  reqGetSupplyDetail,
  reqGetSupplyList,
  reqUpdateDemand,
  reqUpdateSupply,
} from "@/api/supplyDemand";
import { reqUploadFile } from "@/api/file";
import type {
  DemandPageParams,
  DemandPostDetailVO,
  DemandPostFormDTO,
  DemandPostVO,
  PageVO,
  SupplyPageParams,
  SupplyPostDetailVO,
  SupplyPostFormDTO,
  SupplyPostVO,
} from "@/api/supplyDemand/type";

type TabKey = "supply" | "demand";

interface SupplyFormState extends SupplyPostFormDTO {
  image: string;
  farmImageList: string[];
}

interface DemandFormState extends DemandPostFormDTO {
  levelRequirementText: string;
}

const activeTab = ref<TabKey>("supply");
const loading = ref(false);

const supplyTableData = ref<SupplyPostVO[]>([]);
const demandTableData = ref<DemandPostVO[]>([]);

const supplyPage = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0,
});

const demandPage = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0,
});

const supplyQuery = reactive<SupplyPageParams>({
  varietyName: "",
  originPlace: "",
  gradeCode: "",
  status: undefined,
});

const demandQuery = reactive<DemandPageParams>({
  varietyName: "",
  preferredOriginPlace: "",
  isUrgent: undefined,
  status: undefined,
  sortBy: "",
});

const dialogVisible = ref(false);
const isEdit = ref(false);
const formRef = ref<FormInstance>();

const supplyForm = reactive<SupplyFormState>({
  id: undefined,
  varietyName: "",
  gradeCode: "",
  originPlace: "",
  unitPrice: undefined,
  quantityValue: undefined,
  quantityUnit: "斤",
  publishDate: "",
  deliveryMethod: "",
  description: "",
  contactName: "",
  contactPhone: "",
  spec: "",
  status: 1,
  sortOrder: 0,
  images: [],
  farmImages: [],
  imagesText: "",
  farmImagesText: "",
});

const demandForm = reactive<DemandFormState>({
  id: undefined,
  varietyName: "",
  preferredOriginPlace: "",
  priceMin: undefined,
  priceMax: undefined,
  displayPrice: undefined,
  quantityValue: undefined,
  quantityUnit: "斤",
  deliveryDeadline: "",
  isUrgent: 0,
  levelRequirement: [],
  contactName: "",
  contactPhone: "",
  remark: "",
  status: 1,
  sortOrder: 0,
  levelRequirementText: "",
});

const statusOptions = [
  { label: "上架", value: 1 },
  { label: "下架", value: 0 },
];

const urgentOptions = [
  { label: "全部", value: undefined },
  { label: "普通", value: 0 },
  { label: "加急", value: 1 },
];

const demandSortOptions = [
  { label: "默认排序", value: "" },
  { label: "时间优先", value: "time" },
  { label: "价格从高到低", value: "priceHigh" },
  { label: "价格从低到高", value: "priceLow" },
  { label: "数量优先", value: "quantity" },
];

const currentPageState = computed(() => activeTab.value === "supply" ? supplyPage : demandPage);
const currentTabLabel = computed(() => activeTab.value === "supply" ? "供给" : "需求");

const supplyRules: FormRules = {
  varietyName: [{ required: true, message: "请输入品种名称", trigger: "blur" }],
  gradeCode: [{ required: true, message: "请输入等级编码", trigger: "blur" }],
  originPlace: [{ required: true, message: "请输入产地", trigger: "blur" }],
  unitPrice: [{ required: true, message: "请输入单价", trigger: "change" }],
  quantityValue: [{ required: true, message: "请输入数量", trigger: "change" }],
  contactName: [{ required: true, message: "请输入联系人", trigger: "blur" }],
  contactPhone: [
    { required: true, message: "请输入联系电话", trigger: "blur" },
    { pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号", trigger: "blur" },
  ],
};

const demandRules: FormRules = {
  varietyName: [{ required: true, message: "请输入品种名称", trigger: "blur" }],
  quantityValue: [{ required: true, message: "请输入需求数量", trigger: "change" }],
  contactName: [{ required: true, message: "请输入联系人", trigger: "blur" }],
  contactPhone: [
    { required: true, message: "请输入联系电话", trigger: "blur" },
    { pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号", trigger: "blur" },
  ],
};

const getStatusMeta = (status?: number) => {
  return status === 1
    ? { label: "上架", type: "success" as const }
    : { label: "下架", type: "danger" as const };
};

const getUrgentMeta = (isUrgent?: number) => {
  return isUrgent === 1
    ? { label: "加急", type: "danger" as const }
    : { label: "普通", type: "info" as const };
};

const formatListText = (value?: string[]) => (value || []).join("\n");
const parseListText = (value: string) => value.split("\n").map((item) => item.trim()).filter(Boolean);

const resetSupplyForm = () => {
  Object.assign(supplyForm, {
    id: undefined,
    varietyName: "",
    gradeCode: "",
    originPlace: "",
    unitPrice: undefined,
    quantityValue: undefined,
    quantityUnit: "斤",
    publishDate: "",
    deliveryMethod: "",
    description: "",
    contactName: "",
    contactPhone: "",
    spec: "",
    status: 1,
    sortOrder: 0,
    images: [],
    farmImages: [],
    image: "",
    farmImageList: [],
  });
};

const resetDemandForm = () => {
  Object.assign(demandForm, {
    id: undefined,
    varietyName: "",
    preferredOriginPlace: "",
    priceMin: undefined,
    priceMax: undefined,
    displayPrice: undefined,
    quantityValue: undefined,
    quantityUnit: "斤",
    deliveryDeadline: "",
    isUrgent: 0,
    levelRequirement: [],
    contactName: "",
    contactPhone: "",
    remark: "",
    status: 1,
    sortOrder: 0,
    levelRequirementText: "",
  });
};

const fetchSupplyList = async (page = supplyPage.currentPage) => {
  supplyPage.currentPage = page;
  loading.value = true;

  try {
    const res: any = await reqGetSupplyList({
      ...supplyQuery,
      varietyName: supplyQuery.varietyName || undefined,
      originPlace: supplyQuery.originPlace || undefined,
      gradeCode: supplyQuery.gradeCode || undefined,
      pageNum: supplyPage.currentPage,
      pageSize: supplyPage.pageSize,
    });

    if (res.code === 200) {
      const data = res.data as PageVO<SupplyPostVO>;
      supplyTableData.value = data?.records || [];
      supplyPage.total = data?.total || 0;
    } else {
      message.error(res.message || "获取供给列表失败");
    }
  } catch {
    message.error("获取供给列表失败");
  } finally {
    loading.value = false;
  }
};

const fetchDemandList = async (page = demandPage.currentPage) => {
  demandPage.currentPage = page;
  loading.value = true;

  try {
    const res: any = await reqGetDemandList({
      ...demandQuery,
      varietyName: demandQuery.varietyName || undefined,
      preferredOriginPlace: demandQuery.preferredOriginPlace || undefined,
      sortBy: demandQuery.sortBy || undefined,
      pageNum: demandPage.currentPage,
      pageSize: demandPage.pageSize,
    });

    if (res.code === 200) {
      const data = res.data as PageVO<DemandPostVO>;
      demandTableData.value = data?.records || [];
      demandPage.total = data?.total || 0;
    } else {
      message.error(res.message || "获取需求列表失败");
    }
  } catch {
    message.error("获取需求列表失败");
  } finally {
    loading.value = false;
  }
};

const fetchCurrentList = (page = 1) => {
  if (activeTab.value === "supply") {
    fetchSupplyList(page);
    return;
  }
  fetchDemandList(page);
};

const handleSearch = () => {
  fetchCurrentList(1);
};

const handleRefresh = () => {
  if (activeTab.value === "supply") {
    Object.assign(supplyQuery, {
      varietyName: "",
      originPlace: "",
      gradeCode: "",
      status: undefined,
    });
  } else {
    Object.assign(demandQuery, {
      varietyName: "",
      preferredOriginPlace: "",
      isUrgent: undefined,
      status: undefined,
      sortBy: "",
    });
  }
  fetchCurrentList(1);
};

const handleAdd = () => {
  isEdit.value = false;
  if (activeTab.value === "supply") {
    resetSupplyForm();
  } else {
    resetDemandForm();
  }
  dialogVisible.value = true;
};

const handleEditSupply = async (row: SupplyPostVO) => {
  isEdit.value = true;
  loading.value = true;

  try {
    const res: any = await reqGetSupplyDetail(row.id);
    if (res.code === 200) {
      const detail = res.data as SupplyPostDetailVO;
      Object.assign(supplyForm, {
        ...detail,
        image: detail.images?.[0] || "",
        farmImageList: detail.farmImages || [],
        images: detail.images || [],
        farmImages: detail.farmImages || [],
      });
      dialogVisible.value = true;
    } else {
      message.error(res.message || "获取供给详情失败");
    }
  } catch {
    message.error("获取供给详情失败");
  } finally {
    loading.value = false;
  }
};

const handleEditDemand = async (row: DemandPostVO) => {
  isEdit.value = true;
  loading.value = true;

  try {
    const res: any = await reqGetDemandDetail(row.id);
    if (res.code === 200) {
      const detail = res.data as DemandPostDetailVO;
      Object.assign(demandForm, {
        ...detail,
        levelRequirement: detail.levelRequirement || [],
        levelRequirementText: formatListText(detail.levelRequirement),
      });
      dialogVisible.value = true;
    } else {
      message.error(res.message || "获取需求详情失败");
    }
  } catch {
    message.error("获取需求详情失败");
  } finally {
    loading.value = false;
  }
};

const handleDeleteSupply = async (row: SupplyPostVO) => {
  try {
    await ElMessageBox.confirm(`确定删除供给【${row.varietyName}】吗？`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    const res: any = await reqDeleteSupply(row.id);
    if (res.code === 200) {
      message.success("删除成功");
      fetchSupplyList(supplyTableData.value.length === 1 && supplyPage.currentPage > 1 ? supplyPage.currentPage - 1 : supplyPage.currentPage);
    } else {
      message.error(res.message || "删除失败");
    }
  } catch {
    // cancel
  }
};

const handleDeleteDemand = async (row: DemandPostVO) => {
  try {
    await ElMessageBox.confirm(`确定删除需求【${row.varietyName}】吗？`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    const res: any = await reqDeleteDemand(row.id);
    if (res.code === 200) {
      message.success("删除成功");
      fetchDemandList(demandTableData.value.length === 1 && demandPage.currentPage > 1 ? demandPage.currentPage - 1 : demandPage.currentPage);
    } else {
      message.error(res.message || "删除失败");
    }
  } catch {
    // cancel
  }
};

const submitSupply = async () => {
  supplyForm.images = supplyForm.image ? [supplyForm.image] : [];
  supplyForm.farmImages = supplyForm.farmImageList;

  const payload: SupplyPostFormDTO = {
    id: supplyForm.id,
    varietyName: supplyForm.varietyName,
    gradeCode: supplyForm.gradeCode,
    originPlace: supplyForm.originPlace,
    unitPrice: supplyForm.unitPrice,
    quantityValue: supplyForm.quantityValue,
    quantityUnit: supplyForm.quantityUnit,
    publishDate: supplyForm.publishDate || undefined,
    deliveryMethod: supplyForm.deliveryMethod || undefined,
    description: supplyForm.description || undefined,
    contactName: supplyForm.contactName,
    contactPhone: supplyForm.contactPhone,
    spec: supplyForm.spec || undefined,
    status: supplyForm.status,
    sortOrder: supplyForm.sortOrder,
    images: supplyForm.images,
    farmImages: supplyForm.farmImages,
  };

  const res: any = isEdit.value && supplyForm.id
    ? await reqUpdateSupply(supplyForm.id, payload)
    : await reqCreateSupply(payload);

  if (res.code === 200) {
    message.success(isEdit.value ? "更新成功" : "新增成功");
    dialogVisible.value = false;
    fetchSupplyList();
  } else {
    message.error(res.message || (isEdit.value ? "更新失败" : "新增失败"));
  }
};

const submitDemand = async () => {
  demandForm.levelRequirement = parseListText(demandForm.levelRequirementText);

  if (
    demandForm.priceMin !== undefined &&
    demandForm.priceMax !== undefined &&
    demandForm.priceMin > demandForm.priceMax
  ) {
    message.warning("最低价格不能大于最高价格");
    return;
  }

  const payload: DemandPostFormDTO = {
    id: demandForm.id,
    varietyName: demandForm.varietyName,
    preferredOriginPlace: demandForm.preferredOriginPlace || undefined,
    priceMin: demandForm.priceMin,
    priceMax: demandForm.priceMax,
    displayPrice: demandForm.displayPrice,
    quantityValue: demandForm.quantityValue,
    quantityUnit: demandForm.quantityUnit || undefined,
    deliveryDeadline: demandForm.deliveryDeadline || undefined,
    isUrgent: demandForm.isUrgent,
    levelRequirement: demandForm.levelRequirement,
    contactName: demandForm.contactName,
    contactPhone: demandForm.contactPhone,
    remark: demandForm.remark || undefined,
    status: demandForm.status,
    sortOrder: demandForm.sortOrder,
  };

  const res: any = isEdit.value && demandForm.id
    ? await reqUpdateDemand(demandForm.id, payload)
    : await reqCreateDemand(payload);

  if (res.code === 200) {
    message.success(isEdit.value ? "更新成功" : "新增成功");
    dialogVisible.value = false;
    fetchDemandList();
  } else {
    message.error(res.message || (isEdit.value ? "更新失败" : "新增失败"));
  }
};

const handleSubmit = async () => {
  await formRef.value?.validate();
  if (activeTab.value === "supply") {
    await submitSupply();
    return;
  }
  await submitDemand();
};

const handleSizeChange = (size: number) => {
  currentPageState.value.pageSize = size;
  fetchCurrentList(1);
};

watch(activeTab, () => {
  dialogVisible.value = false;
  fetchCurrentList(1);
});

const handleImageUpload = async (file: File) => {
  try {
    const res: any = await reqUploadFile(file, { bizType: "supply" });
    if (res.code === 200) {
      supplyForm.image = res.data;
      message.success("展示图上传成功");
    } else {
      message.error(res.message || "上传失败");
    }
  } catch {
    message.error("上传失败");
  }
  return false;
};

const removeImage = () => {
  supplyForm.image = "";
};

const handleFarmImagesUpload = async (file: File) => {
  if ((supplyForm.farmImageList?.length || 0) >= 5) {
    message.warning("果园图片最多上传 5 张");
    return false;
  }
  try {
    const res: any = await reqUploadFile(file, { bizType: "farm" });
    if (res.code === 200) {
      if (!supplyForm.farmImageList) supplyForm.farmImageList = [];
      supplyForm.farmImageList.push(res.data);
      message.success("果园图片上传成功");
    } else {
      message.error(res.message || "上传失败");
    }
  } catch {
    message.error("上传失败");
  }
  return false;
};

const removeFarmImage = (index: number) => {
  supplyForm.farmImageList?.splice(index, 1);
};

onMounted(() => {
  fetchSupplyList();
});
</script>

<template>
  <div class="container">
    <el-tabs v-model="activeTab" class="tabs-card">
      <el-tab-pane label="供给管理" name="supply" />
      <el-tab-pane label="需求管理" name="demand" />
    </el-tabs>

    <el-form v-if="activeTab === 'supply'" :inline="true" class="option-form">
      <div>
        <el-button type="primary" @click="handleAdd">新增供给</el-button>
      </div>

      <div class="query-row">
        <el-input
          v-model="supplyQuery.varietyName"
          placeholder="品种名称"
          clearable
          style="width: 150px"
          @keyup.enter="handleSearch"
        />
        <el-input
          v-model="supplyQuery.originPlace"
          placeholder="产地"
          clearable
          style="width: 150px"
          @keyup.enter="handleSearch"
        />
        <el-input
          v-model="supplyQuery.gradeCode"
          placeholder="等级编码"
          clearable
          style="width: 150px"
          @keyup.enter="handleSearch"
        />
        <el-select v-model="supplyQuery.status" placeholder="状态" clearable style="width: 120px">
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="handleRefresh">重置</el-button>
      </div>
    </el-form>

    <el-form v-else :inline="true" class="option-form">
      <div>
        <el-button type="primary" @click="handleAdd">新增需求</el-button>
      </div>

      <div class="query-row">
        <el-input
          v-model="demandQuery.varietyName"
          placeholder="品种名称"
          clearable
          style="width: 150px"
          @keyup.enter="handleSearch"
        />
        <el-input
          v-model="demandQuery.preferredOriginPlace"
          placeholder="意向产地"
          clearable
          style="width: 160px"
          @keyup.enter="handleSearch"
        />
        <el-select v-model="demandQuery.isUrgent" placeholder="紧急程度" clearable style="width: 120px">
          <el-option v-for="item in urgentOptions" :key="String(item.value)" :label="item.label" :value="item.value" />
        </el-select>
        <el-select v-model="demandQuery.status" placeholder="状态" clearable style="width: 120px">
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-select v-model="demandQuery.sortBy" placeholder="排序方式" clearable style="width: 150px">
          <el-option v-for="item in demandSortOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="handleRefresh">重置</el-button>
      </div>
    </el-form>

    <el-table
      v-if="activeTab === 'supply'"
      v-loading="loading"
      :data="supplyTableData"
      stripe
      style="width: 100%"
      height="520"
    >
      <el-table-column prop="postNo" label="编号" min-width="150" show-overflow-tooltip />
      <el-table-column prop="varietyName" label="品种" min-width="120" />
      <el-table-column prop="gradeCode" label="等级" min-width="100" />
      <el-table-column prop="originPlace" label="产地" min-width="120" show-overflow-tooltip />
      <el-table-column prop="unitPrice" label="单价" min-width="100" />
      <el-table-column label="数量" min-width="120">
        <template #default="{ row }">
          {{ row.quantityValue }} {{ row.quantityUnit }}
        </template>
      </el-table-column>
      <el-table-column prop="publishDate" label="发布日期" min-width="120" />
      <el-table-column prop="deliveryMethod" label="交付方式" min-width="120" show-overflow-tooltip />
      <el-table-column prop="createdAt" label="创建时间" min-width="180" show-overflow-tooltip />
      <el-table-column label="状态" width="90" align="center">
        <template #default="{ row }">
          <el-tag :type="getStatusMeta(row.status).type">{{ getStatusMeta(row.status).label }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="170" fixed="right" align="center">
        <template #default="{ row }">
          <div class="action-buttons">
            <el-button type="warning" size="small" class="btn-edit" @click="handleEditSupply(row)">
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
            <el-button type="danger" size="small" class="btn-delete" @click="handleDeleteSupply(row)">
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-table
      v-else
      v-loading="loading"
      :data="demandTableData"
      stripe
      style="width: 100%"
      height="520"
    >
      <el-table-column prop="postNo" label="编号" min-width="150" show-overflow-tooltip />
      <el-table-column prop="varietyName" label="品种" min-width="120" />
      <el-table-column prop="preferredOriginPlace" label="意向产地" min-width="140" show-overflow-tooltip />
      <el-table-column label="价格区间" min-width="150">
        <template #default="{ row }">
          {{ row.priceMin ?? "-" }} ~ {{ row.priceMax ?? "-" }}
        </template>
      </el-table-column>
      <el-table-column prop="displayPrice" label="展示价" min-width="100" />
      <el-table-column label="数量" min-width="120">
        <template #default="{ row }">
          {{ row.quantityValue }} {{ row.quantityUnit }}
        </template>
      </el-table-column>
      <el-table-column prop="deliveryDeadline" label="交付截止" min-width="120" />
      <el-table-column label="紧急程度" width="90" align="center">
        <template #default="{ row }">
          <el-tag :type="getUrgentMeta(row.isUrgent).type">{{ getUrgentMeta(row.isUrgent).label }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="90" align="center">
        <template #default="{ row }">
          <el-tag :type="getStatusMeta(row.status).type">{{ getStatusMeta(row.status).label }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间" min-width="180" show-overflow-tooltip />
      <el-table-column label="操作" width="170" fixed="right" align="center">
        <template #default="{ row }">
          <div class="action-buttons">
            <el-button type="warning" size="small" class="btn-edit" @click="handleEditDemand(row)">
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
            <el-button type="danger" size="small" class="btn-delete" @click="handleDeleteDemand(row)">
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-model:current-page="currentPageState.currentPage"
      v-model:page-size="currentPageState.pageSize"
      :page-sizes="[10, 20, 50]"
      :total="currentPageState.total"
      background
      layout="total, sizes, prev, pager, next"
      style="justify-content: center; margin-top: 20px"
      @current-change="fetchCurrentList"
      @size-change="handleSizeChange"
    />

    <el-dialog
      v-model="dialogVisible"
      :title="`${isEdit ? '编辑' : '新增'}${currentTabLabel}`"
      width="760px"
      :close-on-click-modal="false"
    >
      <el-form
        v-if="activeTab === 'supply'"
        ref="formRef"
        :model="supplyForm"
        :rules="supplyRules"
        label-width="110px"
      >
        <div class="form-grid">
          <el-form-item label="品种名称" prop="varietyName">
            <el-input v-model="supplyForm.varietyName" placeholder="请输入品种名称" />
          </el-form-item>
          <el-form-item label="等级编码" prop="gradeCode">
            <el-input v-model="supplyForm.gradeCode" placeholder="请输入等级编码" />
          </el-form-item>
          <el-form-item label="产地" prop="originPlace">
            <el-input v-model="supplyForm.originPlace" placeholder="请输入产地" />
          </el-form-item>
          <el-form-item label="交付方式">
            <el-input v-model="supplyForm.deliveryMethod" placeholder="例如：自提、物流" />
          </el-form-item>
          <el-form-item label="单价" prop="unitPrice">
            <el-input-number v-model="supplyForm.unitPrice" :min="0" :precision="2" style="width: 100%" />
          </el-form-item>
          <el-form-item label="数量" prop="quantityValue">
            <el-input-number v-model="supplyForm.quantityValue" :min="0" :precision="2" style="width: 100%" />
          </el-form-item>
          <el-form-item label="数量单位">
            <el-input v-model="supplyForm.quantityUnit" placeholder="例如：斤、箱" />
          </el-form-item>
          <el-form-item label="发布日期">
            <el-date-picker v-model="supplyForm.publishDate" type="date" value-format="YYYY-MM-DD" style="width: 100%" />
          </el-form-item>
          <el-form-item label="联系人" prop="contactName">
            <el-input v-model="supplyForm.contactName" placeholder="请输入联系人" />
          </el-form-item>
          <el-form-item label="联系电话" prop="contactPhone">
            <el-input v-model="supplyForm.contactPhone" placeholder="请输入联系电话" />
          </el-form-item>
          <el-form-item label="规格说明">
            <el-input v-model="supplyForm.spec" placeholder="请输入规格说明" />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="supplyForm.status" style="width: 100%">
              <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="排序值">
            <el-input-number v-model="supplyForm.sortOrder" :min="0" style="width: 100%" />
          </el-form-item>
        </div>
        <el-form-item label="供给描述">
          <el-input v-model="supplyForm.description" type="textarea" :rows="4" placeholder="请输入供给描述" />
        </el-form-item>
        <el-form-item label="展示图片">
          <div class="single-image-upload">
            <el-upload
              :auto-upload="false"
              :show-file-list="false"
              accept="image/*"
              :on-change="handleImageUpload"
            >
              <div v-if="supplyForm.image" class="image-preview">
                <el-image
                  :src="supplyForm.image"
                  fit="cover"
                  style="width: 120px; height: 120px; border-radius: 8px;"
                />
                <div class="image-actions">
                  <el-button type="primary" size="small" @click.stop="() => {}">重新上传</el-button>
                  <el-button type="danger" size="small" @click.stop="removeImage">删除</el-button>
                </div>
              </div>
              <div v-else class="image-placeholder">
                <el-icon><Plus /></el-icon>
                <span>上传展示图</span>
              </div>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item label="果园图片">
          <div class="multi-image-upload">
            <div class="farm-images-list">
              <div v-for="(img, idx) in supplyForm.farmImageList" :key="idx" class="farm-image-item">
                <el-image :src="img" fit="cover" style="width: 100%; height: 100%; border-radius: 8px;" />
                <div class="farm-image-actions">
                  <el-button type="danger" size="small" @click="removeFarmImage(idx)">删除</el-button>
                </div>
              </div>
            </div>
            <el-upload
              v-if="(supplyForm.farmImageList?.length || 0) < 5"
              :auto-upload="false"
              :show-file-list="false"
              accept="image/*"
              :on-change="handleFarmImagesUpload"
            >
              <div class="image-placeholder small">
                <el-icon><Plus /></el-icon>
                <span>上传图片</span>
              </div>
            </el-upload>
          </div>
        </el-form-item>
      </el-form>

      <el-form
        v-else
        ref="formRef"
        :model="demandForm"
        :rules="demandRules"
        label-width="110px"
      >
        <div class="form-grid">
          <el-form-item label="品种名称" prop="varietyName">
            <el-input v-model="demandForm.varietyName" placeholder="请输入品种名称" />
          </el-form-item>
          <el-form-item label="意向产地">
            <el-input v-model="demandForm.preferredOriginPlace" placeholder="请输入意向产地" />
          </el-form-item>
          <el-form-item label="最低价格">
            <el-input-number v-model="demandForm.priceMin" :min="0" :precision="2" style="width: 100%" />
          </el-form-item>
          <el-form-item label="最高价格">
            <el-input-number v-model="demandForm.priceMax" :min="0" :precision="2" style="width: 100%" />
          </el-form-item>
          <el-form-item label="展示价格">
            <el-input-number v-model="demandForm.displayPrice" :min="0" :precision="2" style="width: 100%" />
          </el-form-item>
          <el-form-item label="需求数量" prop="quantityValue">
            <el-input-number v-model="demandForm.quantityValue" :min="0" :precision="2" style="width: 100%" />
          </el-form-item>
          <el-form-item label="数量单位">
            <el-input v-model="demandForm.quantityUnit" placeholder="例如：斤、箱" />
          </el-form-item>
          <el-form-item label="交付截止">
            <el-date-picker v-model="demandForm.deliveryDeadline" type="date" value-format="YYYY-MM-DD" style="width: 100%" />
          </el-form-item>
          <el-form-item label="联系人" prop="contactName">
            <el-input v-model="demandForm.contactName" placeholder="请输入联系人" />
          </el-form-item>
          <el-form-item label="联系电话" prop="contactPhone">
            <el-input v-model="demandForm.contactPhone" placeholder="请输入联系电话" />
          </el-form-item>
          <el-form-item label="紧急程度">
            <el-select v-model="demandForm.isUrgent" style="width: 100%">
              <el-option label="普通" :value="0" />
              <el-option label="加急" :value="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="demandForm.status" style="width: 100%">
              <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="排序值">
            <el-input-number v-model="demandForm.sortOrder" :min="0" style="width: 100%" />
          </el-form-item>
        </div>
        <el-form-item label="等级要求">
          <el-input
            v-model="demandForm.levelRequirementText"
            type="textarea"
            :rows="4"
            placeholder="每行填写一个等级要求"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="demandForm.remark" type="textarea" :rows="4" placeholder="请输入备注" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.container {
  font-size: 16px;
  padding: 20px;
  margin: 20px 0 70px;
  box-shadow: 0 0 27px 0 rgba(110, 109, 109, 0.14);
}

.tabs-card {
  margin-bottom: 12px;
}

.option-form {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 20px;
}

.query-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 10px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 16px;
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
  color: #fff;

  &:hover {
    background: #ea580c;
  }
}

.btn-delete {
  background: #ef4444;
  border: none;
  color: #fff;

  &:hover {
    background: #dc2626;
  }
}

@media (max-width: 900px) {
  .option-form {
    flex-direction: column;
    align-items: stretch;
  }

  .query-row {
    justify-content: flex-start;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }
}

.single-image-upload {
  .image-placeholder {
    width: 120px;
    height: 120px;
    border: 1px dashed #d9d9d9;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #8c939d;
    transition: all 0.3s;

    &:hover {
      border-color: #f97316;
      color: #f97316;
    }

    .el-icon {
      font-size: 28px;
      margin-bottom: 8px;
    }

    span {
      font-size: 12px;
    }
  }

  .image-preview {
    position: relative;
    width: 120px;
    height: 120px;
    border-radius: 8px;
    overflow: hidden;

    .el-image {
      width: 100%;
      height: 100%;
    }

    .image-actions {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      justify-content: center;
      gap: 4px;
      padding: 4px;
      opacity: 0;
      transition: opacity 0.3s;

      .el-button {
        padding: 2px 6px;
        font-size: 10px;
      }

      &:hover {
        opacity: 1;
      }
    }
  }
}

.multi-image-upload {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: flex-start;

  .farm-images-list {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  .farm-image-item {
    position: relative;
    width: 100px;
    height: 100px;
    border-radius: 8px;
    overflow: hidden;

    &:hover .farm-image-actions {
      opacity: 1;
    }

    .farm-image-actions {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s;
    }
  }

  .image-placeholder.small {
    width: 100px;
    height: 100px;

    .el-icon {
      font-size: 24px;
    }

    span {
      font-size: 12px;
    }
  }
}
</style>
