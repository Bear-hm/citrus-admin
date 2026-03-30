<template>
  <div class="background">
    <div class="box">
      <div class="forms">
        <div class="tips">
          <span :class="{ check: isLoginMode }" @click="switchMode(true)"
            >登录</span
          >
          <span :class="{ check: !isLoginMode }" @click="switchMode(false)"
            >注册</span
          >
        </div>
        <login-form v-if="isLoginMode"></login-form>
        <register-form v-else></register-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import LoginForm from "./components/Login.vue";
import RegisterForm from "./components/Register.vue";

const isLoginMode = ref(true);

const switchMode = (isLogin: boolean) => {
  isLoginMode.value = isLogin;
};
</script>

<style lang="scss" scoped>
@use "./Login.scss";
</style>
