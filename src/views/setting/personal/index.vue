<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { reqGetUserById, reqUpdateUser } from "@/api/user";
import { reqUploadFile } from "@/api/file";
import message from "@/utils/message";
import { useUserStore } from "@/store/user";

const userStore = useUserStore();
const saving = ref(false);
const uploading = ref(false);
const avatarUpload = ref();
const userInfo = ref<any>({
  username: "",
  name: "",
  phone: "",
  email: "",
  avatar: "",
  createdAt: "",
  updatedAt: "",
});

const userTypeLabel = computed(() => {
  const typeMap: Record<string, string> = {
    farmer: "农户",
    wholesaler: "批发商",
    admin: "管理员",
  };

  return typeMap[userInfo.value.userType] || userInfo.value.userType || "未知";
});

const formatDate = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const h = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  const s = String(date.getSeconds()).padStart(2, "0");
  return `${y}.${m}.${d} ${h}:${min}:${s}`;
};

const beforeAvatarUpload = (file: File) => {
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

const uploadAvatar = async (param: {
  file: File;
  onSuccess?: (response?: unknown) => void;
  onError?: (error: Error) => void;
}) => {
  uploading.value = true;
  const previousAvatar = userInfo.value.avatar;
  try {
    const res = await reqUploadFile(param.file, { bizType: "avatar" });
    const avatarUrl = res.rawData?.fileUrl || res.data;
    if (res.code === 200 && avatarUrl) {
      userInfo.value.avatar = avatarUrl;
      const updateRes = await reqUpdateUser({
        avatar: avatarUrl,
      });
      if (updateRes.code === 200) {
        userStore.updateUserInfo({ avatar: avatarUrl });
        param.onSuccess?.(res);
        await loadUserInfo();
      } else {
        userInfo.value.avatar = previousAvatar;
        message.error(updateRes.message || "头像保存失败");
        param.onError?.(new Error(updateRes.message || "save avatar failed"));
        return;
      }
      message.success("头像上传成功");
    } else {
      message.error(res.message || "头像上传失败");
      param.onError?.(new Error(res.message || "upload avatar failed"));
    }
  } catch {
    userInfo.value.avatar = previousAvatar;
    param.onError?.(new Error("upload avatar failed"));
    message.error("头像上传失败");
  } finally {
    uploading.value = false;
  }
};

const removeAvatar = () => {
  userInfo.value.avatar = "";
  avatarUpload.value?.clearFiles?.();
};

const saveUserInfo = async () => {
  saving.value = true;
  try {
    const res = await reqUpdateUser({
      name: userInfo.value.name,
      phone: userInfo.value.phone,
      email: userInfo.value.email,
      avatar: userInfo.value.avatar,
    });

    if (res.code === 200) {
      userStore.updateUserInfo({
        name: userInfo.value.name,
        mobile: userInfo.value.phone,
        email: userInfo.value.email,
        avatar: userInfo.value.avatar,
      });
      message.success("保存成功");
    } else {
      message.error(res.message || "保存失败");
    }
  } catch {
    message.error("保存失败");
  } finally {
    saving.value = false;
  }
};

const loadUserInfo = async () => {
  try {
    const res = await reqGetUserById();
    if (res.code === 200 && res.data) {
      const raw = res.data as any;
      userInfo.value = {
        ...raw,
        phone: raw.phone || raw.mobile || "",
        avatar: raw.avatar || "",
        createdAt: formatDate(raw.createdAt || raw.createDate),
        updatedAt: formatDate(raw.updatedAt || raw.updateDate),
      };
      userStore.updateUserInfo(raw);
    } else {
      message.error(res.message || "获取用户信息失败");
    }
  } catch {
    message.error("获取用户信息失败");
  }
};

onMounted(() => {
  loadUserInfo();
});
</script>

<template>
  <div class="user-setting-wrap">
    <el-row :gutter="24">
      <el-col :span="7" class="avatar-col">
        <div class="avatar-panel">
          <el-avatar :size="180" :src="userInfo.avatar || undefined" class="avatar-preview">
            {{ (userInfo.name || userInfo.username || "U").slice(0, 1) }}
          </el-avatar>

          <div class="avatar-actions">
            <el-upload
              ref="avatarUpload"
              class="avatar-uploader"
              :show-file-list="false"
              :http-request="uploadAvatar"
              :before-upload="beforeAvatarUpload"
              :limit="1"
              accept="image/*"
            >
              <template #trigger>
                <el-button type="primary" :loading="uploading">修改头像</el-button>
              </template>
            </el-upload>
            <el-button plain @click="removeAvatar">清空头像</el-button>
          </div>
        </div>
      </el-col>

      <el-col :span="17">
        <el-form label-width="110px" class="user-form">
          <el-form-item label="账号">
            <el-input v-model="userInfo.username" disabled />
          </el-form-item>
          <el-form-item label="真实姓名">
            <el-input v-model="userInfo.name" placeholder="请输入真实姓名" />
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="userInfo.phone" placeholder="请输入手机号" />
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="userInfo.email" placeholder="请输入邮箱" />
          </el-form-item>
          <el-form-item label="用户类型">
            <el-tag>{{ userTypeLabel }}</el-tag>
          </el-form-item>
          <el-form-item label="创建时间">
            <el-input v-model="userInfo.createdAt" disabled />
          </el-form-item>
          <el-form-item label="更新时间">
            <el-input v-model="userInfo.updatedAt" disabled />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="saving" @click="saveUserInfo">保存</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">
.user-setting-wrap {
  padding: 24px;
}

.avatar-col {
  display: flex;
  justify-content: center;
}

.avatar-panel {
  width: 100%;
  padding: 28px 20px;
  border-radius: 20px;
  background: linear-gradient(180deg, #fff7ed 0%, #ffffff 100%);
  border: 1px solid rgba(249, 115, 22, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
}

.avatar-preview {
  border: 4px solid rgba(249, 115, 22, 0.14);
  box-shadow: 0 10px 30px rgba(249, 115, 22, 0.12);
}

.avatar-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
}

.user-form {
  padding: 24px;
  border-radius: 20px;
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.06);
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.04);
}
</style>
