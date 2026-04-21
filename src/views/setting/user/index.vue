<template>
  <BaseCrud
    ref="crudRef"
    page-title="用户管理"
    :table-columns="tableColumns"
    :show-edit="false"
    add-button-text="新增用户"
    search-placeholder="请输入用户名"
    :current-page="currentPage"
    :page-size="pageSize"
    @add="handleAdd"
    @delete="handleDelete"
    @search="handleSearch"
    @refresh="handleRefresh"
    @confirm="handleConfirm"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  >
    <template #form="{ formData, isEdit }">
      <el-form :model="formData" label-width="100px">
        <el-form-item label="头像">
          <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            :http-request="(option) => handleAvatarUpload(option, formData)"
            :before-upload="beforeAvatarUpload"
            accept="image/*"
          >
            <img v-if="formData.avatar" :src="formData.avatar" class="avatar" />
            <el-icon v-else><Plus /></el-icon>
          </el-upload>
        </el-form-item>

        <el-form-item label="账号">
          <el-input v-model="formData.username" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="formData.phone" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="formData.email" />
        </el-form-item>
        <el-form-item v-if="!isEdit" label="密码">
          <el-input v-model="formData.password" type="password" show-password />
        </el-form-item>
        <el-form-item label="用户类型">
          <el-select v-model="formData.userType" style="width: 100%">
            <el-option label="农户" value="farmer" />
            <el-option label="批发商" value="wholesaler" />
            <el-option label="管理员" value="admin" />
          </el-select>
        </el-form-item>
      </el-form>
    </template>
  </BaseCrud>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { Plus } from "@element-plus/icons-vue";
import BaseCrud from "@/components/BaseCurdCard.vue";
import { reqAddUser, reqDeleteUserById, reqGetUserPage, reqUpdateUser } from "@/api/user";
import { reqUploadFile } from "@/api/file";
import message from "@/utils/message";

const crudRef = ref();
const currentPage = ref(1);
const pageSize = ref(10);
const searchKeyword = ref("");

const tableColumns = [
  { prop: "avatar", label: "头像", formType: "upload", columnType: "image" },
  { prop: "username", label: "账号", formType: "input" },
  { prop: "name", label: "姓名", formType: "input" },
  { prop: "phone", label: "手机号", formType: "input" },
  { prop: "email", label: "邮箱", formType: "input" },
  { prop: "createdAt", label: "创建时间", formType: "none" },
  {
    prop: "userType",
    label: "用户类型",
    formType: "select",
    columnType: "tag",
    typeMap: {
      farmer: { label: "农户", type: "info" },
      wholesaler: { label: "批发商", type: "warning" },
      admin: { label: "管理员", type: "success" },
    },
  },
];

const beforeAvatarUpload = (file) => {
  const isImage = file.type.startsWith("image/");
  if (!isImage) {
    message.error("只能上传图片文件");
    return false;
  }

  const isLt5M = file.size / 1024 / 1024 < 5;
  if (!isLt5M) {
    message.error("图片大小不能超过 5MB");
    return false;
  }

  return true;
};

const handleAvatarUpload = async (option, formData) => {
  try {
    const res = await reqUploadFile(option.file, { bizType: "avatar" });
    const avatarUrl = res.rawData?.fileUrl || res.data;
    if (res.code === 200 && avatarUrl) {
      formData.avatar = avatarUrl;
      message.success("头像上传成功");
      option.onSuccess?.(res);
    } else {
      message.error(res.message || "头像上传失败");
      option.onError?.(new Error(res.message || "upload failed"));
    }
  } catch (error) {
    message.error("头像上传失败");
    option.onError?.(error);
  }
};

const getUserList = async () => {
  try {
    const res = await reqGetUserPage({
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      username: searchKeyword.value || undefined,
    });
    if (res.code === 200) {
      crudRef.value.setTableData(res.data.records || []);
      crudRef.value.setTotal(res.data.total || 0);
    } else {
      message.error(res.message || "获取用户列表失败");
    }
  } catch {
    message.error("获取用户列表失败");
  }
};

const handleAdd = () => {};

const handleDelete = async (row) => {
  try {
    const res = await reqDeleteUserById(row.id);
    if (res.code === 200) {
      message.success("删除成功");
      getUserList();
    } else {
      message.error(res.message || "删除失败");
    }
  } catch {
    message.error("删除失败");
  }
};

const handleSearch = async (value) => {
  searchKeyword.value = value;
  currentPage.value = 1;
  await getUserList();
};

const handleRefresh = () => {
  searchKeyword.value = "";
  getUserList();
};

const handleConfirm = async ({ isEdit, formData }) => {
  try {
    const res = isEdit
      ? await reqUpdateUser({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          avatar: formData.avatar,
        })
      : await reqAddUser({
          username: formData.username,
          password: formData.password,
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          userType: formData.userType,
          avatar: formData.avatar,
        });

    if (res.code === 200) {
      message.success(isEdit ? "更新成功" : "新增成功");
      getUserList();
    } else {
      message.error(res.message || (isEdit ? "更新失败" : "新增失败"));
    }
  } catch {
    message.error(isEdit ? "更新失败" : "新增失败");
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

onMounted(() => {
  getUserList();
});
</script>

<style scoped lang="scss">
.avatar-uploader {
  display: inline-flex;
}

.avatar {
  width: 88px;
  height: 88px;
  object-fit: cover;
  border-radius: 16px;
  border: 1px solid rgba(249, 115, 22, 0.12);
}

.avatar-uploader :deep(.el-upload) {
  width: 88px;
  height: 88px;
  border: 1px dashed #d1d5db;
  border-radius: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
}

.avatar-uploader :deep(.el-upload:hover) {
  border-color: #f97316;
  color: #f97316;
}
</style>
