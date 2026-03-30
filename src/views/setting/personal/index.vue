<script setup>
// import avatarImg from '@/assets/images/user/avatar.jpg'
import Cookies from "js-cookie";
import { reqUpdateUser, reqGetUserById } from "@/api/user/index";
import { reqUploadFile, reqDownloadFileById } from "@/api/file/index";

import { ref, onMounted, computed } from "vue";
import { ElMessage } from "element-plus";
const uploadRef = ref();
let userInfo = ref({});

const userTypeLabel = computed(() => {
  const typeMap = {
    1: "普通用户",
    2: "专家",
    3: "管理员",
    4: "超级管理员",
  };
  return typeMap[userInfo.value.userType] || "未知类型";
});
const saveUserInfo = async () => {
  // console.log(userInfo.value);
  const formData = {
    id: userInfo.value.id,
    userName: userInfo.value.userName,
    name: userInfo.value.name,
    mobile: userInfo.value.mobile,
    email: userInfo.value.email,
    avatar: userInfo.value.avatar,
  };
  const res = await reqUpdateUser(formData);
  if (res.code === "200") {
    ElMessage.success("保存成功");
    // 更新cookie
    Cookies.set("user", encodeURIComponent(JSON.stringify(userInfo.value)), {
      expires: 7,
    });
  } else {
    ElMessage.error("更新失败");
  }
};

// 时间格式化
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const h = date.getHours().toString().padStart(2, "0");
  const min = date.getMinutes().toString().padStart(2, "0");
  const s = date.getSeconds().toString().padStart(2, "0");
  return `${y}.${m}.${d} ${h}:${min}:${s}`;
};


//头像上传
const avatarUrl = ref(null);
const avatarUpload = ref(null);
// 获取头像 URL
const getAvatarUrl = async (fileId) => {
  if (!fileId) return null;
  try {
    const blob = await reqDownloadFileById(fileId);

    return URL.createObjectURL(blob);
  } catch (error) {
    return null;
  }
};

const removeAvatar = () => {
  userInfo.value.avatar = null;
  avatarUrl.value = null; // 重置头像 URL
  // 清除上传组件的文件列表
  avatarUpload.value.clearFiles();
};
// 上传前验证
const beforeAvatarUpload = (file) => {
  const isImage = file.type.startsWith("image/");
  if (!isImage) {
    ElMessage.error("只能上传图片文件");
    return false;
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    ElMessage.error("图片大小不能超过 2MB");
    return false;
  }
  return true;
};
// 上传头像
const uploadAvatar = async (param) => {
  const file = param.file;
  const res = await reqUploadFile(file);
  if (res.code === "200") {
    removeAvatar();
    avatarUrl.value = await getAvatarUrl(res.data.id);

    userInfo.value.avatar = res.data.id;

    ElMessage.success("头像修改成功");
  } else {
    ElMessage.error("头像上传失败");
  }
};

const loadUserInfo = async () => {
  const userCookie = Cookies.get("user");
  if (userCookie) {
    const cookieUser = JSON.parse(decodeURIComponent(userCookie));
    const res = await reqGetUserById(cookieUser.id);
    if (res.code === "200") {
      const raw = res.data;
      userInfo.value = {
        ...raw,
        createDate: formatDate(raw.createDate),
        updateDate: formatDate(raw.updateDate),
      };
      avatarUrl.value = await getAvatarUrl(raw.avatar);
    } else {
      ElMessage.error("获取用户信息失败");
    }
  } else {
    ElMessage.error("请登录获取用户信息");
  }
};
onMounted(() => {
  loadUserInfo();
});
</script>

<template>
  <div class="user-setting-wrap">
    <el-row>
      <el-col :span="6" class="avatar-col">
        <div class="avatar-wrap">
          <img
            :src="avatarUrl"
            style="
              width: 180px;
              height: 180px;
              border-radius: 40px;
              overflow: hidden;
            "
            class="avatar"
          />

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
              <el-button type="primary">修改头像</el-button>
            </template>
          </el-upload>
        </div>
      </el-col>
      <el-col :span="18">
        <el-form label-width="120px" class="user-form">
          <el-form-item label="账号">
            <el-input
              v-model="userInfo.account"
              placeholder="请输入账户"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="用户名">
            <el-input
              v-model="userInfo.userName"
              placeholder="请输入用户名"
            ></el-input>
          </el-form-item>
          <el-form-item label="真实姓名">
            <el-input
              v-model="userInfo.name"
              placeholder="请输入姓名"
            ></el-input>
          </el-form-item>
          <!-- <el-form-item label="密码">
            <el-input
              v-model="userInfo.password"
              placeholder="请输入密码"
            ></el-input>
          </el-form-item> -->
          <el-form-item label="手机号">
            <el-input
              v-model="userInfo.mobile"
              placeholder="请输入手机号"
            ></el-input>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input
              v-model="userInfo.email"
              placeholder="请输入邮箱"
            ></el-input>
          </el-form-item>
          <el-form-item label="用户类型">
            <el-tag :closable="false">{{ userTypeLabel }}</el-tag>
          </el-form-item>
          <el-form-item label="创建时间">
            <el-input v-model="userInfo.createDate" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="最新更新时间">
            <el-input v-model="userInfo.updateDate" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="saveUserInfo">保存</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">
.user-setting-wrap {
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  margin: 0 auto;
  max-width: 1200px;

  .avatar-col {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-right: 20px;

    .avatar-wrap {
      text-align: center;
    }

    .avatar-preview {
      position: relative;
      width: 180px;
      height: 180px;
      border-radius: 50%;
      overflow: hidden;
      margin-bottom: 15px;
      border: 1px solid #e0e0e0;

      .avatar {
        width: 100%;
        height: 100%;
        object-fit: cover;
        margin-bottom: 15px;
      }

      .avatar-actions {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        color: white;
        padding: 5px 0;
        display: flex;
        justify-content: center;
        align-items: center;
        opacity: 0;
        transition: opacity 0.3s;
      }

      &:hover .avatar-actions {
        opacity: 1;
      }
    }
  }

  .user-form {
    padding: 20px;
    border-radius: 8px;
    background-color: #f9f9f9;

    .hint {
      font-size: 12px;
      color: #999;
      margin-top: 5px;
    }
  }
}
</style>
