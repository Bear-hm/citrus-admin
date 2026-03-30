<template>
  <BaseCrud
    title-type="default"
    page-title="用户管理"
    :table-columns="tableColumns"
    add-button-text="新增用户"
    search-placeholder="请输入用户名称"
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
    <template #userType="{ row }">
      <el-tag :type="getUserTypeInfo(row.userType).type">
        {{ getUserTypeInfo(row.userType).label }}
      </el-tag>
    </template>

    <!-- 表单插槽 -->
    <template #form="{ formData, isEdit }">
      <el-form :model="formData" label-width="100px">
        <el-form-item
          v-if="tableColumns.find((item) => item.prop === 'avatar')"
          label="头像"
        >
          <el-upload
            class="avatar-uploader"
            action="/api/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
          >
            <img v-if="formData.avatar" :src="formData.avatar" class="avatar" />
            <el-icon v-else><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item
          v-for="item in inputFormItems"
          :key="item.prop"
          :label="item.label"
        >
          <el-input
            v-model="formData[item.prop]"
            :disabled="isEdit && ['account', 'createDate'].includes(item.prop)"
          />
        </el-form-item>
        <!-- <el-form-item
          v-if="tableColumns.find((item) => item.prop === 'userType')"
          label="用户类型"
        >
          <el-tag :type="getUserTypeInfo(formData.userType).type">
            {{ getUserTypeInfo(formData.userType).label }}
          </el-tag>
        </el-form-item> -->
      </el-form>
    </template>
  </BaseCrud>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import BaseCrud from "@/components/BaseCurdCard.vue";
import { reqGetUserPage, reqUpdateUser, reqDeleteUserById } from "@/api/user";
import { ElMessage } from "element-plus";

const crudRef = ref();
const currentPage = ref(1);
const pageSize = ref(10);

// 表格列定义
const tableColumns = [
  { prop: "avatar", label: "头像", formType: "upload", columnType: "image" },
  { prop: "userName", label: "用户名", formType: "input" },
  { prop: "account", label: "账号", formType: "input" },
  { prop: "email", label: "邮箱", formType: "input" },
  { prop: "mobile", label: "手机号", formType: "input" },
  { prop: "createDate", label: "创建时间", formType: "none" },
  {
    prop: "userType",
    label: "用户类型",
    formType: "tag",
    columnType: "tag",
    typeMap: {
      1: { label: "普通用户", type: "info" },
      2: { label: "专家", type: "warning" },
      3: { label: "管理员", type: "success" },
      4: { label: "超级管理员", type: "danger" },
    },
  },
];

const inputFormItems = computed(() => {
  return tableColumns.filter((item) => item.formType === "input");
});
// 处理方法
const handleAdd = () => {};

const handleEdit = (row) => {
  // 编辑用户时的操作
};

const handleDelete = async (row) => {
  try {
    const res = await reqDeleteUserById(row.id);
    if (res.code === "200") {
      ElMessage.success("删除成功");
      handleRefresh();
    } else {
      ElMessage.error(res.message || "删除失败");
    }
  } catch (error) {
    ElMessage.error("删除失败");
  }
};

const handleSearch = async (value) => {
  // 实现搜索功能
  await getUserList();
};

const handleRefresh = () => {
  getUserList();
};

const handleConfirm = async ({ isEdit, formData }) => {
  try {
    const res = await reqUpdateUser(formData);
    if (res.code === 200) {
      ElMessage.success(isEdit ? "更新成功" : "添加成功");
      handleRefresh();
    } else {
      ElMessage.error(res.message || (isEdit ? "更新失败" : "添加失败"));
    }
  } catch (error) {
    ElMessage.error(isEdit ? "更新失败" : "添加失败");
  }
};

const handleSizeChange = (size) => {
  pageSize.value = size;
  getUserList();
};

const handleCurrentChange = (page) => {
  currentPage.value = page;
  getUserList();
};
// 获取用户列表数据
const getUserList = async () => {
  try {
    const res = await reqGetUserPage({
      pageNum: currentPage.value,
      pageSize: pageSize.value,
    });
    if (res.code === "200") {
      crudRef.value.setTableData(res.data.list);
      crudRef.value.setTotal(res.data.total);
    } else {
      ElMessage.error(res.message || "获取用户列表失败");
    }
  } catch (error) {
    ElMessage.error("获取用户列表失败");
  }
};
// 页面加载时获取数据
onMounted(() => {
  getUserList();
});
</script>

<style scoped lang="scss">
.article {
  padding: 20px;
}
</style>
