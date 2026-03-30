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
      <el-button type="primary" @click="submitForm(ruleFormRef)" class="btn"
        >登录</el-button
      >
    </el-form>
  </div>
</template>

<script setup>
import { ElMessage } from "element-plus";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import Vcode from "vue3-puzzle-vcode";
import { reqLogin } from "@/api/user/index";
import Cookies from "js-cookie"; // 添加这行
const router = useRouter();

const ruleFormRef = ref();

const ruleForm = reactive({
  username: "root",
  password: "123456",
});

let flag = 0;

const rules = reactive({
  username: [
    { required: true, message: "用户名不得为空", trigger: "blur" },
    { trigger: "blur", message: "请输入正确的用户名" },
  ],
  // password: [
  //   { required: true, message: "密码不得为空", trigger: "blur" },
  //   { trigger: "blur", message: "请输入正确的密码" },
  // ],
});

const isShow = ref(false);

const onShow = () => {
  isShow.value = true;
};

const onClose = () => {
  isShow.value = false;
};

const onSuccess = () => {
  onClose();
  flag = 1;
};

const submitForm = async (formEl) => {
  if (!formEl) return;
  if (flag == 1) {
    try {
      const valid = await formEl.validate();
      if (valid) {
        const res = await reqLogin(ruleForm); // 使用 ruleForm 替代 loginForm.value
        if (res.data) {
          Cookies.set("auth_token", "authToken");
          Cookies.set("user", JSON.stringify(res.data));
          ElMessage.success("登录成功，欢迎...");
          await router.push("/");
          // await router.push("/navigation");
        } else {
          ElMessage.error("登录失败，请检查用户名和密码");
        }
      }
    } catch (error) {
      console.error(error);
      ElMessage.error("登录过程中发生错误");
    }
  } else {
    ElMessage.error("请先完成滑块验证");
  }
};
</script>

<style lang="scss" scoped>
@charset "UTF-8";
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

.background {
  width: 100vw;
  height: 100vh;
  // background-color: rgb(22, 30, 49);
  background-color: rgb(218, 223, 235);
}

.box {
  width: 80vw;
  height: 80vh;
  background: url(https://img.zcool.cn/community/01a83f5c31a389a8012029acb9541e.jpg@3000w_1l_0o_100sh.jpg);
  background-attachment: fixed;
  background-size: cover;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 30px;
  overflow: hidden;
}
.box .forms {
  width: 50%;
  height: 100%;
  background-color: #fff;
  border-radius: 30px 0 0 30px;
  color: rgb(45, 50, 80);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}
.box .forms .tips {
  width: 70%;
  height: 10%;
  font-size: 25px;
  margin: 4vh;
}
.box .forms .tips span {
  margin: 0 10px 0 0;
  cursor: pointer;
  padding-bottom: 5px;
  transition: 0.1s;
  color: rgb(100, 108, 154);
}
.box .forms .tips span:hover {
  border-bottom: 4px solid rgb(249, 177, 122);
  color: rgb(45, 50, 80);
}
.box .forms .tips .check {
  border-bottom: 4px solid rgb(249, 177, 122);
  color: rgb(45, 50, 80);
}

.box .forms .login,
.box .forms .register {
  width: 70%;
  top: 15%;
}
.box .forms .login .form-title h1,
.box .forms .register .form-title h1 {
  margin-bottom: 10px;
}
.box .forms .login .form,
.box .forms .register .form {
  margin-top: 3vw;
}
.box .forms .login .form .input-item::before,
.box .forms .register .form .input-item::before {
  display: block;
  position: absolute;
  color: rgb(100, 108, 154);
  padding: 10px 5px 1px 20px;
  font-size: 14px;
}

:deep(.el-input__wrapper) {
  width: 100%;
  height: 100%;
  // background-color: rgb(66, 71, 105);
  outline: none;
  border: 0;
  color: #fff;
  font-size: 20px;
  :focus {
    // border-left: 3px solid rgb(255, 187, 124);
  }
}

:deep(.el-form-item__error) {
  top: 80%;
}

.userName,
.password,
.checkPassword {
  height: 7.5vh;
  border-color: rgb(66, 71, 105);
  margin-bottom: 5%;
}

.box .forms .login .form .other-select .rem-pwd .rem-pwd-tips,
.box .forms .register .form .other-select .rem-pwd .rem-pwd-tips {
  cursor: pointer;
}
.box .forms .login .form .other-select .fogot-pwd-btn,
.box .forms .register .form .other-select .fogot-pwd-btn {
  cursor: pointer;
  color: rgb(249, 177, 122);
}

.box .forms .login .form .btn,
.box .forms .register .form .btn {
  width: 40%;
  height: 50px;
  cursor: pointer;
  border: 0;
  background-color: rgb(249, 177, 122);
  color: rgb(45, 50, 80);
  margin: 10px 0;
  border-radius: 5px;
  font-size: 20px;
  box-shadow: 0px 0px 20px rgb(249, 177, 122);
  transition: 0.3s;
  margin-top: 3vw;
}

.box .forms .login .form .btn:hover,
.box .forms .register .form .btn:hover,
.box .forms .fogot-pwd .form .btn:hover {
  box-shadow: 0px 0px 30px rgb(249, 177, 122);
}

.box .forms .login,
.box .forms .register {
  position: absolute;
  opacity: 1;
  z-index: 10;
  animation: into 1s ease;
}

@media (max-width: 1024px) {
  .box {
    width: 100vw;
    height: 100vh;
    border-radius: 0;
  }
  .box .forms {
    width: 100%;
    border-radius: 0;
  }
  .box .forms .other-select {
    justify-content: flex-end !important;
  }
  .box .forms .other-select .rem-pwd {
    display: none;
  }
  .box .forms .other-login {
    flex-direction: column;
    position: relative;
    justify-content: center;
  }
  .box .forms .other-login .login-img {
    position: absolute;
    right: 0;
    top: 5vh;
  }
}
@keyframes into {
  0% {
    transform: translateY(5vh);
    opacity: 0;
  }
  100% {
    transform: translateY(0px);
    opacity: 1;
  }
}
</style>
