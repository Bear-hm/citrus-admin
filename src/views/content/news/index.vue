<script setup>
import { ref, onMounted, computed } from "vue";
import BaseCrud from "@/components/BaseCurdCard.vue";
import { reqGetNewsPage, reqGetNewsCategories } from "@/api/news";
import { ElMessage } from "element-plus";

const crudRef = ref();
const currentPage = ref(1);
const pageSize = ref(10);
const categoryOptions = ref([]);
const searchKeyword = ref("");
const selectedCategory = ref();

// 表格列定义
const tableColumns = [
  { prop: "coverUrl", label: "封面图", columnType: "image", width: "100" },
  { prop: "title", label: "标题", minWidth: "200" },
  { prop: "categoryName", label: "分类", width: "100" },
  { prop: "authorName", label: "作者", width: "100" },
  { prop: "sourceName", label: "来源", width: "100" },
  { prop: "isTop", label: "是否置顶", columnType: "tag", width: "100",
    typeMap: {
      1: { label: "是", type: "warning" },
      0: { label: "否", type: "info" }
    }
  },
  { prop: "viewCount", label: "浏览量", width: "100" },
  { prop: "publishAt", label: "发布时间", width: "180" },
];

const inputFormItems = computed(() => {
  return tableColumns.filter((item) => item.formType === "input");
});

// 获取新闻列表
const getNewsList = async () => {
  try {
    const res = await reqGetNewsPage({
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      category: selectedCategory.value,
      search: searchKeyword.value || undefined,
    });
    if (res.code === "200") {
      crudRef.value.setTableData(res.data.records);
      crudRef.value.setTotal(res.data.total);
    } else {
      ElMessage.error(res.message || "获取新闻列表失败");
    }
  } catch (error) {
    ElMessage.error("获取新闻列表失败");
  }
};

// 获取分类列表
const getCategories = async () => {
  try {
    const res = await reqGetNewsCategories();
    if (res.code === "200") {
      categoryOptions.value = res.data;
    }
  } catch (error) {
    console.error("获取分类列表失败:", error);
  }
};

// 处理新增
const handleAdd = () => {
  ElMessage.info("新增功能需后端支持");
};

// 处理编辑
const handleEdit = (row) => {
  ElMessage.info("编辑功能需后端支持");
};

// 处理删除
const handleDelete = async (row) => {
  ElMessage.info("删除功能需后端支持");
};

// 处理搜索
const handleSearch = (value) => {
  searchKeyword.value = value;
  currentPage.value = 1;
  getNewsList();
};

// 处理刷新
const handleRefresh = () => {
  searchKeyword.value = "";
  selectedCategory.value = undefined;
  currentPage.value = 1;
  getNewsList();
};

// 处理确认
const handleConfirm = async ({ isEdit, formData }) => {
  ElMessage.info("确认功能需后端支持");
};

// 分页大小变化
const handleSizeChange = (size) => {
  pageSize.value = size;
  getNewsList();
};

// 当前页变化
const handleCurrentChange = (page) => {
  currentPage.value = page;
  getNewsList();
};

// 页面加载
onMounted(() => {
  getCategories();
  getNewsList();
});
</script>

<template>
  <BaseCrud
    title-type="default"
    page-title="新闻管理"
    :table-columns="tableColumns"
    add-button-text="新增新闻"
    search-placeholder="请输入标题搜索"
    @add="handleAdd"
    @edit="handleEdit"
    @delete="handleDelete"
    @search="handleSearch"
    @refresh="handleRefresh"
    @confirm="handleConfirm"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    ref="crudRef"
  >
    <template #form="{ formData, isEdit }">
      <el-form :model="formData" label-width="100px">
        <el-form-item label="标题">
          <el-input v-model="formData.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="作者">
          <el-input v-model="formData.authorName" placeholder="请输入作者" />
        </el-form-item>
        <el-form-item label="来源">
          <el-input v-model="formData.sourceName" placeholder="请输入来源" />
        </el-form-item>
      </el-form>
    </template>
  </BaseCrud>
</template>

<style scoped lang="scss">
.article {
  padding: 20px;
}
</style>
