<template>
  <div class="container">
    <div class="bottom">
      <!-- 搜索栏 -->
      <el-form
        :inline="true"
        style="display: flex; align-items: center; justify-content: flex-end"
      >
        <el-form-item v-if="showAdd">
          <el-button type="primary" @click="handleAdd">{{
            addButtonText
          }}</el-button>
        </el-form-item>
        <el-form-item v-if="showSearch">
          <el-input
            :placeholder="searchPlaceholder"
            v-model="searchValue"
          ></el-input>
        </el-form-item>
        <el-form-item v-if="showSearch">
          <el-button type="primary" size="default" @click="handleSearch">
            搜索
          </el-button>
          <el-button @click="handleRefresh">刷新</el-button>
        </el-form-item>
      </el-form>

      <!-- 表格 -->
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column
          v-for="(item, index) in tableColumns"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          align="center"
          show-overflow-tooltip
        >
          <template #default="scope">
            <template v-if="item.columnType === 'tag' && item.typeMap">
              <el-tag :type="item.typeMap[scope.row[item.prop]]?.type || ''">
                {{ item.typeMap[scope.row[item.prop]]?.label || "未知" }}
              </el-tag>
            </template>
            <template v-else-if="item.columnType === 'image'">
              <el-image
                :src="getImageUrl(scope.row[item.prop])"
                alt="Image"
                :fit="item.fit || 'cover'"
                :width="item.width || '100'"
                :height="item.height || '100'"
                :preview-src-list="
                  scope.row[item.prop]
                    ? [getImageUrl(scope.row[item.prop])]
                    : []
                "
                @click="handleImagePreview(scope.row[item.prop])"
              ></el-image>
            </template>
            <template v-else>
              {{ scope.row[item.prop] }}
            </template>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" v-if="showOperations">
          <template #default="{ row }">
            <el-button
              v-if="showEdit"
              type="primary"
              size="small"
              @click="handleEdit(row)"
            >
              编辑
            </el-button>
            <el-popconfirm
              v-if="showDelete"
              :title="deleteConfirmText(row)"
              width="260px"
              @confirm="handleDelete(row)"
            >
              <template #reference>
                <el-button type="primary" size="small"> 删除 </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页器 -->
      <el-pagination
        v-if="showPagination"
        class="pagination"
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="pageSizes"
        :background="true"
        :layout="'total, sizes, prev, pager, next, jumper'"
        :total="total"
        @update:current-page="handleCurrentChange"
        @update:page-size="handleSizeChange"
      />
    </div>

    <!-- 弹窗表单 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      :width="dialogWidth"
    >
      <slot name="form" :form-data="formData" :is-edit="isEdit"> </slot>
      <template #footer>
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </template>
    </el-dialog>
    <!-- 图片预览弹窗 -->
    <el-dialog v-model="dialogImgVisible" append-to-body>
      <template #header>
        <el-button type="primary" @click="downloadImg"> 下载 </el-button>
      </template>
      <div class="preview-container">
        <img w-full :src="dialogImageUrl" alt="Preview Image" />
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from "vue";
import { ElMessage } from "element-plus";
import { reqDownloadFileById } from "@/api/file/index";
import { reqUploadFile } from "@/api/file/index";
const props = defineProps({
  // 表格配置
  tableColumns: {
    type: Array,
    required: true,
  },
  // 按钮显示控制
  showAdd: {
    type: Boolean,
    default: true,
  },
  showEdit: {
    type: Boolean,
    default: true,
  },
  showDelete: {
    type: Boolean,
    default: true,
  },
  showSearch: {
    type: Boolean,
    default: true,
  },
  showPagination: {
    type: Boolean,
    default: true,
  },
  // 按钮文本配置
  addButtonText: {
    type: String,
    default: "新增",
  },
  searchPlaceholder: {
    type: String,
    default: "请输入搜索内容",
  },
  // 弹窗配置
  dialogWidth: {
    type: String,
    default: "50%",
  },
  // 分页配置
  pageSizes: {
    type: Array,
    default: () => [10, 20, 30, 40],
  },
});

const emit = defineEmits([
  "add",
  "edit",
  "delete",
  "search",
  "refresh",
  "confirm",
  "size-change",
  "current-change",
]);

// 数据
const tableData = ref([]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);
const searchValue = ref("");
const dialogVisible = ref(false);
const isEdit = ref(false);
const formData = ref({});
//图片数据
const dialogImageUrl = ref("");
const dialogImgVisible = ref(false);
const currentPreviewId = ref(null);
const imageCache = reactive({});
// 根据ID获取图片URL
const getImageUrl = (id) => {
  if (!id) return "";
  if (imageCache[id]) return imageCache[id];
  // 如果图片URL不在缓存中，异步加载并返回占位符
  loadImageUrl(id);
  return "";
};
// 异步加载图片URL
const loadImageUrl = async (id) => {
  try {
    const blob = await reqDownloadFileById(id);
    const url = URL.createObjectURL(blob);
    imageCache[id] = url;
    tableData.value = [...tableData.value];
  } catch (error) {
    console.error("加载图片失败:", error);
  }
};
// 处理图片预览
const handleImagePreview = (id) => {
  if (!id) return;
  currentPreviewId.value = id;

  if (imageCache[id]) {
    dialogImageUrl.value = imageCache[id];
    dialogImgVisible.value = true;
  } else {
    loadImageForPreview(id);
  }
};
const loadImageForPreview = async (id) => {
  try {
    const blob = await reqDownloadFileById(id);
    dialogImageUrl.value = URL.createObjectURL(blob);
    imageCache[id] = dialogImageUrl.value;
    dialogImgVisible.value = true;
  } catch (error) {
    ElMessage.error("加载图片预览失败");
  }
};
const downloadImg = async () => {
  try {
    if (!currentPreviewId.value) {
      ElMessage.warning("无法获取图片信息");
      return;
    }
    const blob = await reqDownloadFileById(currentPreviewId.value);
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `${currentPreviewId.value}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(downloadUrl);

    ElMessage.success("下载成功");
  } catch (error) {
    ElMessage.error("下载失败");
  }
};
// 计算属性
const showOperations = computed(() => props.showEdit || props.showDelete);
const dialogTitle = computed(() => (isEdit.value ? "编辑" : "新增"));
const deleteConfirmText = (row) => `确定要删除该记录吗？`;

// 方法
const handleAdd = () => {
  isEdit.value = false;
  formData.value = {};
  dialogVisible.value = true;
  emit("add");
};

const handleEdit = (row) => {
  isEdit.value = true;
  formData.value = { ...row };
  console.log("表单数据", formData.value);
  dialogVisible.value = true;
  emit("edit", row);
};

const handleDelete = (row) => {
  emit("delete", row);
};

const handleSearch = () => {
  emit("search", searchValue.value);
};

const handleRefresh = () => {
  searchValue.value = "";
  emit("refresh");
};

const handleSizeChange = (val) => {
  emit("size-change", val);
};

const handleCurrentChange = (val) => {
  emit("current-change", val);
};

const handleConfirm = () => {
  emit("confirm", { isEdit: isEdit.value, formData: formData.value });
  dialogVisible.value = false;
};

const handleCancel = () => {
  dialogVisible.value = false;
};

// 暴露方法给父组件
defineExpose({
  setTableData: (data) => {
    tableData.value = data;
  },
  setTotal: (value) => {
    total.value = value;
  },
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
.avatar {
  width: 100px;
  height: 100px;
  display: block;
  object-fit: cover;
}

.avatar-uploader .el-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100%;
  height: 100%;
  text-align: center;
  line-height: 100px;
}
</style>
