<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import BaseEditor from "@/components/BaseEditor.vue";
import {
  reqGetNewsPage,
  reqGetNewsDetail,
  reqSaveNews,
  reqUpdateNews,
  reqDeleteNews,
  reqGetNewsCategories,
  reqGetNewsCategoryPage,
  reqSaveNewsCategory,
  reqUpdateNewsCategory,
  reqDeleteNewsCategory,
} from "@/api/news";
import { reqUploadFile } from "@/api/file";
import type {
  NewsListVO,
  NewsCategoryVO,
  NewsDTO,
  NewsCategoryDTO,
  PageVO,
} from "@/api/news/type";
import { ElMessage, ElMessageBox } from "element-plus";
import { Edit, Delete, Plus } from "@element-plus/icons-vue";

// ==================== 新闻列表部分 ====================

const activeTab = ref("news");
const loading = ref(false);
const tableData = ref<NewsListVO[]>([]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);

// 搜索参数
const searchKeyword = ref("");
const selectedCategory = ref<number>();

// 弹窗
const dialogVisible = ref(false);
const isEdit = ref(false);
const formRef = ref();

// 表单数据
const form = reactive<NewsDTO>({
  id: undefined,
  categoryId: 0,
  title: "",
  summary: "",
  coverUrl: "",
  authorName: "",
  sourceName: "",
  publishStatus: 1,
  isTop: 0,
  contentHtml: "",
  contentText: "",
  sortOrder: 0,
});

// 表格列定义
const tableColumns = [
  { prop: "coverUrl", label: "封面图", width: 100 },
  { prop: "title", label: "标题", minWidth: 200 },
  { prop: "categoryName", label: "分类", width: 100 },
  { prop: "authorName", label: "作者", width: 100 },
  { prop: "sourceName", label: "来源", width: 100 },
  {
    prop: "publishStatus",
    label: "发布状态",
    width: 100,
    formatter: (row: NewsListVO) => {
      const map: Record<number, { label: string; type: string }> = {
        0: { label: "草稿", type: "info" },
        1: { label: "已发布", type: "success" },
        2: { label: "已下线", type: "warning" },
      };
      return map[row.publishStatus as number]?.label || "未知";
    },
  },
  {
    prop: "isTop",
    label: "是否置顶",
    width: 100,
    formatter: (row: NewsListVO) => {
      return (row.isTop as number) === 1 ? "是" : "否";
    },
  },
  { prop: "viewCount", label: "浏览量", width: 80 },
  { prop: "publishAt", label: "发布时间", width: 180 },
];

// 分类选项
const categoryOptions = ref<{ label: string; value: number }[]>([]);

// 获取新闻列表
const getNewsList = async (page = 1) => {
  currentPage.value = page;
  loading.value = true;

  try {
    const res = await reqGetNewsPage({
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      category: selectedCategory.value,
      search: searchKeyword.value || undefined,
    });

    if (res.code === 200) {
      tableData.value = (res.data as PageVO<NewsListVO>).records || [];
      total.value = (res.data as PageVO<NewsListVO>).total || 0;
    } else {
      ElMessage.error(res.message || "获取新闻列表失败");
    }
  } catch {
    ElMessage.error("获取新闻列表失败");
  } finally {
    loading.value = false;
  }
};

// 获取分类列表
const getCategories = async () => {
  try {
    const res = await reqGetNewsCategories();
    if (res.code === 200) {
      categoryOptions.value = (res.data as NewsCategoryVO[]).map((item) => ({
        label: item.categoryName,
        value: item.id,
      }));
    }
  } catch (error) {
    console.error("获取分类列表失败:", error);
  }
};

// 搜索
const handleSearch = () => {
  currentPage.value = 1;
  getNewsList();
};

// 刷新
const handleRefresh = () => {
  searchKeyword.value = "";
  selectedCategory.value = undefined;
  currentPage.value = 1;
  getNewsList();
};

// 新增
const handleAdd = () => {
  isEdit.value = false;
  Object.assign(form, {
    id: undefined,
    categoryId: 0,
    title: "",
    summary: "",
    coverUrl: "",
    authorName: "",
    sourceName: "",
    publishStatus: 1,
    isTop: 0,
    contentHtml: "",
    contentText: "",
    sortOrder: 0,
  });
  dialogVisible.value = true;
};

// 编辑
const handleEdit = async (row: NewsListVO) => {
  isEdit.value = true;
  loading.value = true;

  try {
    const res = await reqGetNewsDetail(row.id);
    if (res.code === 200) {
      const detail = res.data as NewsDTO;
      Object.assign(form, detail);
      dialogVisible.value = true;
    } else {
      ElMessage.error(res.message || "获取新闻详情失败");
    }
  } catch {
    ElMessage.error("获取新闻详情失败");
  } finally {
    loading.value = false;
  }
};

// 删除
const handleDelete = async (row: NewsListVO) => {
  try {
    await ElMessageBox.confirm("确定删除该新闻吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    const res = await reqDeleteNews(row.id);
    if (res.code === 200) {
      ElMessage.success("删除成功");
      getNewsList();
    } else {
      ElMessage.error(res.message || "删除失败");
    }
  } catch {
    // 用户取消
  }
};

// 提交
const submit = async () => {
  await formRef.value.validate();

  // 生成纯文本摘要
  if (form.contentHtml) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = form.contentHtml;
    form.contentText = tempDiv.textContent || tempDiv.innerText || "";
  }

  try {
    if (isEdit.value) {
      const res = await reqUpdateNews(form);
      if (res.code === 200) {
        ElMessage.success("更新成功");
        dialogVisible.value = false;
        getNewsList();
      } else {
        ElMessage.error(res.message || "更新失败");
      }
    } else {
      const res = await reqSaveNews(form);
      if (res.code === 200) {
        ElMessage.success("新增成功");
        dialogVisible.value = false;
        getNewsList();
      } else {
        ElMessage.error(res.message || "新增失败");
      }
    }
  } catch {
    ElMessage.error("操作失败");
  }
};

// 分页
const onSizeChange = (size: number) => {
  pageSize.value = size;
  getNewsList(1);
};

// 上传封面图
const coverUrlList = ref<string[]>([]);
const handleCoverUpload = async (file: File) => {
  try {
    const res: any = await reqUploadFile(file);
    if (res.code === 200) {
      form.coverUrl = res.data;
      coverUrlList.value = [res.data];
      ElMessage.success("封面上传成功");
    } else {
      ElMessage.error(res.message || "封面上传失败");
    }
  } catch {
    ElMessage.error("封面上传失败");
  }
  return false;
};

const handleCoverRemove = () => {
  form.coverUrl = "";
  coverUrlList.value = [];
};

// ==================== 分类管理部分 ====================

const categoryLoading = ref(false);
const categoryTableData = ref<NewsCategoryVO[]>([]);
const categoryTotal = ref(0);
const categoryCurrentPage = ref(1);
const categoryPageSize = ref(10);
const categoryDialogVisible = ref(false);
const categoryIsEdit = ref(false);
const categoryFormRef = ref();

const categoryForm = reactive<NewsCategoryDTO>({
  id: undefined,
  categoryName: "",
  categoryCode: "",
  description: "",
  sortOrder: 0,
  status: 1,
});

const categoryTableColumns = [
  { prop: "categoryName", label: "分类名称", minWidth: 150 },
  { prop: "categoryCode", label: "分类编码", width: 150 },
  { prop: "description", label: "描述", minWidth: 200 },
  { prop: "sortOrder", label: "排序", width: 80 },
];

// 获取分类分页列表
const getCategoryList = async (page = 1) => {
  categoryCurrentPage.value = page;
  categoryLoading.value = true;

  try {
    const res = await reqGetNewsCategoryPage({
      pageNum: categoryCurrentPage.value,
      pageSize: categoryPageSize.value,
    });

    if (res.code === 200) {
      categoryTableData.value =
        (res.data as PageVO<NewsCategoryVO>).records || [];
      categoryTotal.value = (res.data as PageVO<NewsCategoryVO>).total || 0;
    } else {
      ElMessage.error(res.message || "获取分类列表失败");
    }
  } catch {
    ElMessage.error("获取分类列表失败");
  } finally {
    categoryLoading.value = false;
  }
};

// 新增分类
const handleAddCategory = () => {
  categoryIsEdit.value = false;
  Object.assign(categoryForm, {
    id: undefined,
    categoryName: "",
    categoryCode: "",
    description: "",
    sortOrder: 0,
    status: 1,
  });
  categoryDialogVisible.value = true;
};

// 编辑分类
const handleEditCategory = (row: NewsCategoryVO) => {
  categoryIsEdit.value = true;
  Object.assign(categoryForm, row);
  categoryDialogVisible.value = true;
};

// 删除分类
const handleDeleteCategory = async (row: NewsCategoryVO) => {
  try {
    await ElMessageBox.confirm("确定删除该分类吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    const res = await reqDeleteNewsCategory(row.id);
    if (res.code === 200) {
      ElMessage.success("删除成功");
      getCategoryList();
    } else {
      ElMessage.error(res.message || "删除失败");
    }
  } catch {
    // 用户取消
  }
};

// 提交分类
const submitCategory = async () => {
  await categoryFormRef.value.validate();

  try {
    if (categoryIsEdit.value) {
      const res = await reqUpdateNewsCategory(categoryForm);
      if (res.code === 200) {
        ElMessage.success("更新成功");
        categoryDialogVisible.value = false;
        getCategoryList();
        getCategories(); // 刷新新闻页面的分类选项
      } else {
        ElMessage.error(res.message || "更新失败");
      }
    } else {
      const res = await reqSaveNewsCategory(categoryForm);
      if (res.code === 200) {
        ElMessage.success("新增成功");
        categoryDialogVisible.value = false;
        getCategoryList();
        getCategories(); // 刷新新闻页面的分类选项
      } else {
        ElMessage.error(res.message || "新增失败");
      }
    }
  } catch {
    ElMessage.error("操作失败");
  }
};

// 分类分页
const onCategorySizeChange = (size: number) => {
  categoryPageSize.value = size;
  getCategoryList(1);
};

// 页面加载
onMounted(() => {
  getNewsList();
  getCategories();
  getCategoryList();
});
</script>

<template>
  <div class="container">
    <!-- Tabs 切换 -->
    <el-tabs v-model="activeTab" class="news-tabs">
      <!-- 新闻列表 -->
      <el-tab-pane label="新闻列表" name="news">
        <!-- 操作区 -->
        <el-form :inline="true" class="option-form">
          <div>
            <el-button type="primary" @click="handleAdd">
              <el-icon><Plus /></el-icon>
              新增新闻
            </el-button>
          </div>

          <div>
            <el-select
              v-model="selectedCategory"
              placeholder="选择分类"
              clearable
              style="width: 140px; margin-right: 10px"
            >
              <el-option
                v-for="item in categoryOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>

            <el-input
              v-model="searchKeyword"
              placeholder="搜索标题"
              style="width: 200px; margin-right: 10px"
              @keyup.enter="handleSearch"
            />
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="handleRefresh">刷新</el-button>
          </div>
        </el-form>

        <!-- 表格 -->
        <el-table
          v-loading="loading"
          :data="tableData"
          stripe
          style="width: 100%"
          height="450"
        >
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
              <!-- 封面图 -->
              <template v-if="item.prop === 'coverUrl'">
                <el-image
                  v-if="row.coverUrl"
                  :src="row.coverUrl"
                  :preview-src-list="[row.coverUrl]"
                  fit="cover"
                  style="width: 60px; height: 60px; border-radius: 4px"
                />
                <span v-else style="color: #999">无封面</span>
              </template>

              <!-- 发布状态 -->
              <template v-else-if="item.prop === 'publishStatus'">
                <el-tag
                  :type="
                    row.publishStatus === 1
                      ? 'success'
                      : row.publishStatus === 2
                        ? 'warning'
                        : 'info'
                  "
                >
                  {{
                    row.publishStatus === 0
                      ? "草稿"
                      : row.publishStatus === 1
                        ? "已发布"
                        : "已下线"
                  }}
                </el-tag>
              </template>

              <!-- 是否置顶 -->
              <template v-else-if="item.prop === 'isTop'">
                <el-tag :type="row.isTop === 1 ? 'warning' : 'info'">
                  {{ row.isTop === 1 ? "是" : "否" }}
                </el-tag>
              </template>

              <!-- 其他列 -->
              <template v-else>
                {{ row[item.prop as keyof NewsListVO] }}
              </template>
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
                  @click="handleEdit(row)"
                >
                  <el-icon><Edit /></el-icon>
                  编辑
                </el-button>
                <el-button
                  type="danger"
                  size="small"
                  class="btn-delete"
                  @click="handleDelete(row)"
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
          @current-change="getNewsList"
          @size-change="onSizeChange"
        />
      </el-tab-pane>

      <!-- 分类管理 -->
      <el-tab-pane label="分类管理" name="category">
        <!-- 操作区 -->
        <el-form :inline="true" class="option-form">
          <div>
            <el-button type="primary" @click="handleAddCategory">
              <el-icon><Plus /></el-icon>
              新增分类
            </el-button>
          </div>
          <div>
            <el-button @click="getCategoryList()">刷新</el-button>
          </div>
        </el-form>

        <!-- 分类表格 -->
        <el-table
          v-loading="categoryLoading"
          :data="categoryTableData"
          stripe
          style="width: 100%"
          height="450"
        >
          <el-table-column
            v-for="item in categoryTableColumns"
            :key="item.prop"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            :min-width="item.minWidth"
            show-overflow-tooltip
          />

          <!-- 操作列 -->
          <el-table-column
            label="操作"
            width="160"
            fixed="right"
            align="center"
          >
            <template #default="{ row }">
              <div class="action-buttons">
                <el-button
                  type="warning"
                  size="small"
                  class="btn-edit"
                  @click="handleEditCategory(row)"
                >
                  <el-icon><Edit /></el-icon>
                  编辑
                </el-button>
                <el-button
                  type="danger"
                  size="small"
                  class="btn-delete"
                  @click="handleDeleteCategory(row)"
                >
                  <el-icon><Delete /></el-icon>
                  删除
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分类分页 -->
        <el-pagination
          v-model:current-page="categoryCurrentPage"
          v-model:page-size="categoryPageSize"
          :page-sizes="[10, 20, 50]"
          :total="categoryTotal"
          background
          layout="total, sizes, prev, pager, next"
          style="justify-content: center; margin-top: 20px"
          @current-change="getCategoryList"
          @size-change="onCategorySizeChange"
        />
      </el-tab-pane>
    </el-tabs>

    <!-- 新闻编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑新闻' : '新增新闻'"
      width="70%"
      :close-on-click-modal="false"
      class="news-dialog"
    >
      <el-form :model="form" :rules="{}" label-width="100px" ref="formRef">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="标题" prop="title">
              <el-input
                v-model="form.title"
                placeholder="请输入标题"
                maxlength="200"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分类" prop="categoryId">
              <el-select
                v-model="form.categoryId"
                placeholder="请选择分类"
                style="width: 100%"
              >
                <el-option
                  v-for="item in categoryOptions"
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
            <el-form-item label="作者">
              <el-input v-model="form.authorName" placeholder="请输入作者" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="来源">
              <el-input v-model="form.sourceName" placeholder="请输入来源" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="发布状态">
              <el-radio-group v-model="form.publishStatus">
                <el-radio :value="0">草稿</el-radio>
                <el-radio :value="1">发布</el-radio>
                <el-radio :value="2">下线</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否置顶">
              <el-radio-group v-model="form.isTop">
                <el-radio :value="0">否</el-radio>
                <el-radio :value="1">是</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="摘要">
              <el-input
                v-model="form.summary"
                type="textarea"
                :rows="2"
                placeholder="请输入摘要"
                maxlength="500"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="封面图">
              <div class="cover-upload">
                <el-upload
                  :auto-upload="false"
                  :show-file-list="false"
                  accept="image/*"
                  :on-change="handleCoverUpload"
                >
                  <div v-if="coverUrlList.length || form.coverUrl" class="cover-preview">
                    <el-image
                      :src="form.coverUrl || coverUrlList[0]"
                      fit="cover"
                      style="width: 120px; height: 120px"
                    />
                    <div class="cover-actions">
                      <el-button
                        type="primary"
                        size="small"
                        @click.stop="() => {}"
                      >
                        重新上传
                      </el-button>
                      <el-button
                        type="danger"
                        size="small"
                        @click.stop="handleCoverRemove"
                      >
                        删除
                      </el-button>
                    </div>
                  </div>
                  <div v-else class="cover-placeholder">
                    <el-icon><Plus /></el-icon>
                    <span>上传封面图</span>
                  </div>
                </el-upload>
              </div>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="正文内容">
              <BaseEditor v-model="form.contentHtml" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="排序">
              <el-input-number
                v-model="form.sortOrder"
                :min="0"
                :max="9999"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 分类编辑弹窗 -->
    <el-dialog
      v-model="categoryDialogVisible"
      :title="categoryIsEdit ? '编辑分类' : '新增分类'"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form
        :model="categoryForm"
        :rules="{
          categoryName: [
            { required: true, message: '请输入分类名称', trigger: 'blur' },
          ],
          categoryCode: [
            { required: true, message: '请输入分类编码', trigger: 'blur' },
          ],
        }"
        label-width="100px"
        ref="categoryFormRef"
      >
        <el-form-item label="分类名称" prop="categoryName">
          <el-input
            v-model="categoryForm.categoryName"
            placeholder="请输入分类名称"
          />
        </el-form-item>

        <el-form-item label="分类编码" prop="categoryCode">
          <el-input
            v-model="categoryForm.categoryCode"
            placeholder="请输入分类编码（英文）"
          />
        </el-form-item>

        <el-form-item label="描述">
          <el-input
            v-model="categoryForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入描述"
          />
        </el-form-item>

        <el-form-item label="排序">
          <el-input-number
            v-model="categoryForm.sortOrder"
            :min="0"
            :max="9999"
          />
        </el-form-item>

        <el-form-item label="状态">
          <el-radio-group v-model="categoryForm.status">
            <el-radio :value="1">启用</el-radio>
            <el-radio :value="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="categoryDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitCategory">确定</el-button>
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
}

.news-tabs {
  :deep(.el-tabs__header) {
    margin-bottom: 20px;
  }
}

.option-form {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  :deep(.el-form-item) {
    margin-bottom: 0;
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

.news-dialog {
  :deep(.el-dialog__body) {
    max-height: 70vh;
    overflow-y: auto;
  }
}

.cover-upload {
  .cover-placeholder {
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

  .cover-preview {
    position: relative;
    width: 120px;
    height: 120px;
    border-radius: 8px;
    overflow: hidden;

    .el-image {
      width: 100%;
      height: 100%;
    }

    .cover-actions {
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
    }

    &:hover .cover-actions {
      opacity: 1;
    }
  }
}
</style>
