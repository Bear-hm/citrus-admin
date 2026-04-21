<template>
  <div class="login">
    <div class="form-title">
      <h1>登录</h1>
      <h4>欢迎使用柑橘后台</h4>
    </div>
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      status-icon
      :rules="rules"
      class="form"
    >
      <el-form-item prop="username">
        <el-input
          v-model="ruleForm.username"
          autocomplete="off"
          placeholder="请输入用户名"
          class="userName"
        >
          <template #prefix>
            <el-icon class="el-input__icon">
              <UserFilled />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="ruleForm.password"
          type="password"
          autocomplete="off"
          show-password
          placeholder="请输入密码"
          class="password"
        >
          <template #prefix>
            <el-icon class="el-input__icon">
              <Lock />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>
      <div class="other-select">
        <span class="fogot-pwd-btn" @click="onShow">点击验证</span>
        <Vcode :show="isShow" @success="onSuccess" @close="onClose" />
      </div>
      <el-button type="primary" :loading="loading" @click="submitForm(ruleFormRef)" class="btn"
        >{{ loading ? "登录中..." : "登录" }}</el-button
      >
    </el-form>
  </div>
</template>

<script setup>
import message from "@/utils/message";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import Vcode from "vue3-puzzle-vcode";
import { reqLogin } from "@/api/user/index";
import { useUserStore } from "@/store/user";
const router = useRouter();
const userStore = useUserStore();

const ruleFormRef = ref();

const ruleForm = reactive({
  username: "adms",
  password: "123456",
});

const loading = ref(false);
const isVerified = ref(false);
const isShow = ref(false);

const onShow = () => {
  isShow.value = true;
};

const onClose = () => {
  isShow.value = false;
};

const onSuccess = () => {
  isVerified.value = true;
  isShow.value = false;
  message.success("验证成功");
};

const rules = reactive({
  username: [
    { required: true, message: "用户名不得为空", trigger: "blur" },
    { trigger: "blur", message: "请输入正确的用户名" },
  ],
});

const submitForm = async (formEl) => {
  if (!formEl) return;
  if (!isVerified.value) {
    message.error("请先完成滑块验证");
    return;
  }
  try {
    const valid = await formEl.validate();
    if (valid) {
      loading.value = true;
      const res = await reqLogin(ruleForm);
      if (res.code === 200) {
        userStore.setLoginInfo(res.data.userVO, res.data.token);
        message.success("登录成功，欢迎...");
        await router.push("/");
      } else {
        message.error(res.message || "登录失败，请检查用户名和密码");
      }
    }
  } catch (error) {
    console.error(error);
    message.error("登录失败，请稍后重试");
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped>
.login {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form-title {
  text-align: center;
  margin-bottom: 30px;

  h1 {
    font-size: 28px;
    color: rgb(45, 50, 80);
    margin-bottom: 8px;
  }

  h4 {
    font-size: 14px;
    color: rgb(100, 108, 154);
    font-weight: normal;
  }
}

.form {
  width: 100%;
  max-width: 350px;
}

.other-select {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}


.btn {
  width: 100%;
  height: 45px;
  background-color: rgb(249, 177, 122);
  border: none;
  color: rgb(45, 50, 80);
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 15px rgba(249, 177, 122, 0.5);
    transform: translateY(-2px);
  }
}
</style>
