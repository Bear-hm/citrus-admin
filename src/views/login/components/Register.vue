<template>
  <div class="register">
    <div class="form-title">
      <h1>注册</h1>
      <h4>欢迎注册柑橘后台</h4>
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
      <el-form-item prop="checkPassword">
        <el-input
          v-model="ruleForm.checkPassword"
          type="password"
          autocomplete="off"
          show-password
          placeholder="请再次输入密码"
          class="checkPassword"
        >
          <template #prefix>
            <el-icon class="el-input__icon">
              <Lock />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="location">
        <el-input
          v-model="ruleForm.phoneNumber"
          autocomplete="off"
          placeholder="请输入手机号"
          class="phone"
        >
          <template #prefix>
            <el-icon class="el-input__icon">
              <PhoneFilled />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="location">
        <el-input
          v-model="ruleForm.identityCard"
          autocomplete="off"
          placeholder="请输入身份证"
          class="idCard"
        >
          <template #prefix>
            <el-icon class="el-input__icon">
              <Postcard />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="location">
        <el-input
          v-model="ruleForm.location"
          autocomplete="off"
          placeholder="请输入所在地"
          class="location"
        >
          <template #prefix>
            <el-icon class="el-input__icon">
              <LocationFilled />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="gender">
        <el-radio-group v-model="gender" class="gender">
          <el-radio :value="1" size="large" class="radio">男</el-radio>
          <el-radio :value="2" size="large">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <div class="other-select">
        <span class="fogot-pwd-btn" @click="onShow">点击验证</span>
        <Vcode :show="isShow" @success="onSuccess" @close="onClose" />
      </div>
      <el-button type="primary" @click="submitForm(ruleFormRef)" class="btn"
        >注册</el-button
      >
    </el-form>
  </div>
</template>

<script setup>
import { ElMessage } from "element-plus";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import Vcode from "vue3-puzzle-vcode";
import { useUser } from "../../../store/user";
const registerStore = useUser();

const radio1 = ref("1");
const radio2 = ref("1");

const router = useRouter();

const ruleFormRef = ref();

const validatePass = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请输入密码"));
  } else {
    if (ruleForm.checkPassword !== "") {
      if (!ruleFormRef.value) return;
      ruleFormRef.value.validateField("checkPass", () => null);
    }
    callback();
  }
};
const validatePass2 = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请再次输入密码"));
  } else if (value !== ruleForm.password) {
    callback(new Error("两次输入的密码不一致！"));
  } else {
    callback();
  }
};

const ruleForm = reactive({
  username: "",
  password: "",
  checkPassword: "",
  gender: "",
  identityCard: "",
  location: "",
  phoneNumber: "",
  role: "",
  userImage: "",
});

let flag = 0;

const rules = reactive({
  username: [
    { required: true, message: "用户名不得为空", trigger: "blur" },
    { min: 3, trigger: "blur", message: "请确保输入的用户名长度大于三" },
  ],
  password: [{ validator: validatePass, trigger: "blur" }],
  checkPassword: [{ validator: validatePass2, trigger: "blur" }],
});

const isShow = ref(false);

const onShow = () => {
  isShow.value = true;
};

const onClose = () => {
  isShow.value = false;
};

const onSuccess = () => {
  onClose(); // 验证成功，需要手动关闭模态框
  flag = 1;
};

const submitForm = (formEl) => {
  //更改值
  if (radio1.value === "1") {
    ruleForm.gender = "男";
  } else {
    ruleForm.gender = "女";
  }
  if (radio2.value === "1") {
    ruleForm.role = "common-user";
  } else {
    ruleForm.role = "provider-user";
  }
  ruleForm.userImage =
    "https://img.zcool.cn/community/01a83f5c31a389a8012029acb9541e.jpg@3000w_1l_0o_100sh.jpg";

  if (!formEl) return;
  if (flag == 1) {
    registerStore.signUp(ruleForm);
    formEl.validate((valid) => {
      if (valid) {
        ElMessage.success("注册成功");
        router.push({
          path: "/login",
        });
      } else {
        ElMessage.error("请确保用户名或密码是否正确");
        return false;
      }
    });
  } else {
    ElMessage.error("请先完成滑块验证");
  }
};
</script>

<style lang="scss" scoped>
@use "../Login.scss";
.userName,
.password,
.checkPassword,
.location,
.phone,
.idCard {
  height: 4.7vh;
  border-color: rgb(66, 71, 105);
  margin-bottom: 3%;
}
.location {
  margin-bottom: 1%;
}
.box .forms .login .form,
.box .forms .register .form {
  margin-top: 1.5vw;
}
.gender,
.role {
  width: 100%;
  .radio {
    margin-right: 10%;
  }
}
:deep(.el-input__wrapper) {
  font-size: 16px;
}
.box .forms .register .form .btn {
  margin-top: 1vw;
}
:deep(.el-radio__input.is-checked + .el-radio__label) {
  color: rgb(249, 177, 122);
}
:deep(.el-radio__input.is-checked .el-radio__inner) {
  background: rgb(249, 177, 122);
  border-color: rgb(249, 177, 122);
}
</style>
