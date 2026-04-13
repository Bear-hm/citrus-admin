<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { reqGetFaqList, reqAddFaq, reqUpdateFaq, reqDeleteFaq } from "@/api/faq";
import type { FaqVO, FaqPageParams } from "@/api/faq/type";
import { ElMessage, ElMessageBox } from "element-plus";
import { Edit, Delete } from "@element-plus/icons-vue";

const roleMap: Record<string, { label: string; type: string }> = {
  farmer: { label: "农户", type: "success" },
  wholesaler: { label: "批发商", type: "warning" },
};

const getRoleLabel = (roleCode: string) => {
  return roleMap[roleCode] || { label: "通用", type: "info" };
};

const statusMap: Record<number, { label: string; type: string }> = {
  1: { label: "启用", type: "success" },
  0: { label: "禁用", type: "danger" },
};

const getStatusLabel = (status: number) => {
  return statusMap[status] || { label: "未知", type: "info" };
};

// 分页
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const queryParam = ref("");
const roleCodeSelected = ref("");

// 表格数据
const tableData = ref<FaqVO[]>([]);
const loading = ref(false);

// 弹窗
const dialogVisible = ref(false);
const isEdit = ref(false);
const formRef = ref();

// 表单数据
const form = reactive<Partial<FaqVO>>({
  id: undefined,
  question: "",
  answer: "",
  roleCode: "",
  sortOrder: 0,
});

// 表格字段
const tableColumns = [
  { prop: "question", label: "问题", minWidth: 200 },
  { prop: "answer", label: "答案", minWidth: 280, showOverflowTooltip: true },
  {
    prop: "roleCode",
    label: "适用角色",
    width: 100,
    formatter: (row: FaqVO) => getRoleLabel(row.roleCode).label,
  },
  {
    prop: "status",
    label: "状态",
    width: 80,
    formatter: (row: FaqVO) => getStatusLabel(row.status ?? 1).label,
  },
  { prop: "sortOrder", label: "排序", width: 80 },
];

// 表单字段（用于 el-form-item 自动渲染）
const formColumns = [
  { prop: "question", label: "问题", type: "textarea" },
  { prop: "answer", label: "答案", type: "textarea" },
  {
    prop: "roleCode",
    label: "适用角色",
    type: "select",
    options: [
      { label: "通用", value: "" },
      { label: "农户", value: "farmer" },
      { label: "批发商", value: "wholesaler" },
    ],
  },
  {
    prop: "status",
    label: "状态",
    type: "select",
    options: [
      { label: "启用", value: 1 },
      { label: "禁用", value: 0 },
    ],
  },
  { prop: "sortOrder", label: "排序", type: "number", min: 0 },
];

// 校验规则
const rules = {
  question: [{ required: true, message: "请输入问题", trigger: "blur" }],
  answer: [{ required: true, message: "请输入答案", trigger: "blur" }],
};

// 获取数据
const getTableData = async (page = 1) => {
  currentPage.value = page;
  loading.value = true;

  const params: FaqPageParams = {
    pageNum: currentPage.value,
    pageSize: pageSize.value,
    search: queryParam.value || undefined,
    roleCode: roleCodeSelected.value || undefined,
  };

  try {
    const res = await reqGetFaqList(params);
    if (res.code === 200) {
      // 兼容处理：后端可能返回分页对象 { records, total } 或直接返回数组
      const records = (res.data as any)?.records ?? (Array.isArray(res.data) ? res.data : []);
      if (Array.isArray(records)) {
        tableData.value = records;
        total.value = (res.data as any)?.total ?? records.length;
      } else {
        tableData.value = [];
        total.value = 0;
      }
    } else {
      ElMessage.error(res.message || "获取FAQ列表失败");
    }
  } catch {
    ElMessage.error("获取FAQ列表失败");
  } finally {
    loading.value = false;
  }
};

// 分页 size 变化时重置到第一页
const onSizeChange = (size: number) => {
  pageSize.value = size;
  getTableData(1);
};

// 新增
const addRow = () => {
  isEdit.value = false;
  Object.assign(form, { id: undefined, question: "", answer: "", roleCode: "", sortOrder: 0 });
  dialogVisible.value = true;
};

// 编辑
const editRow = (row: FaqVO) => {
  isEdit.value = true;
  Object.assign(form, row);
  dialogVisible.value = true;
};

// 提交
const submit = async () => {
  await formRef.value.validate();

  if (isEdit.value) {
    const res = await reqUpdateFaq(form as Partial<FaqVO>);
    if (res.code === 200) {
      ElMessage.success("更新成功");
      dialogVisible.value = false;
      getTableData();
    } else {
      ElMessage.error(res.message || "更新失败");
    }
  } else {
    const { id, ...params } = form;
    const res = await reqAddFaq(params as Partial<FaqVO>);
    if (res.code === 200) {
      ElMessage.success("新增成功");
      dialogVisible.value = false;
      getTableData();
    } else {
      ElMessage.error(res.message || "新增失败");
    }
  }
};

// 删除
const deleteRow = async (id: number) => {
  try {
    await ElMessageBox.confirm("确定删除该FAQ吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });
    const res = await reqDeleteFaq(id);
    if (res.code === 200) {
      ElMessage.success("删除成功");
      getTableData();
    } else {
      ElMessage.error(res.message || "删除失败");
    }
  } catch {
    // 用户取消
  }
};

// 刷新
const refresh = () => {
  queryParam.value = "";
  roleCodeSelected.value = "";
  getTableData(1);
};

onMounted(() => {
  getTableData();
});
</script>

<template>
  <div class="container">
    <!-- 操作区 -->
    <el-form :inline="true" class="option-form">
      <div>
        <el-button type="primary" @click="addRow">新增</el-button>
      </div>

      <div>
        <el-select
          v-model="roleCodeSelected"
          placeholder="选择角色"
          clearable
          style="width: 120px; margin-right: 10px"
        >
          <el-option label="农户" value="farmer" />
          <el-option label="批发商" value="wholesaler" />
        </el-select>

        <el-input
          v-model="queryParam"
          placeholder="搜索问题/答案"
          style="width: 200px; margin-right: 10px"
          @keyup.enter="getTableData(1)"
        />
        <el-button type="primary" @click="getTableData(1)">搜索</el-button>
        <el-button @click="refresh">刷新</el-button>
      </div>
    </el-form>

    <!-- 表格 -->
    <el-table v-loading="loading" :data="tableData" stripe style="width: 100%" height="490">
      <el-table-column
        v-for="item in tableColumns"
        :key="item.prop"
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
        :min-width="item.minWidth"
        show-overflow-tooltip
      >
        <template v-if="item.prop === 'roleCode'" #default="{ row }">
          <el-tag :type="getRoleLabel(row.roleCode).type">
            {{ getRoleLabel(row.roleCode).label }}
          </el-tag>
        </template>
        <template v-else-if="item.prop === 'status'" #default="{ row }">
          <el-tag :type="getStatusLabel(row.status ?? 1).type">
            {{ getStatusLabel(row.status ?? 1).label }}
          </el-tag>
        </template>
      </el-table-column>

      <!-- 操作列 -->
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
              @click="deleteRow(row.id)"
            >
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
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

    <!-- 弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑FAQ' : '新增FAQ'"
      width="50%"
      :close-on-click-modal="false"
    >
      <el-form :model="form" :rules="rules" label-width="100px" ref="formRef">
        <el-form-item v-for="item in formColumns" :key="item.prop" :label="item.label" :prop="item.prop">
          <!-- textarea -->
          <el-input
            v-if="item.type === 'textarea'"
            v-model="form[item.prop as keyof typeof form] as string"
            type="textarea"
            :rows="item.prop === 'answer' ? 4 : 2"
            :placeholder="`请输入${item.label}`"
          />

          <!-- select -->
          <el-select
            v-else-if="item.type === 'select'"
            v-model="form[item.prop as keyof typeof form] as string"
            placeholder="请选择"
            style="width: 100%"
          >
            <el-option
              v-for="opt in item.options"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>

          <!-- number -->
          <el-input-number
            v-else-if="item.type === 'number'"
            v-model="form[item.prop as keyof typeof form] as number"
            :min="item.min ?? 0"
          />

          <!-- 默认 input -->
          <el-input
            v-else
            v-model="form[item.prop as keyof typeof form] as string"
            :placeholder="`请输入${item.label}`"
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
</style>
