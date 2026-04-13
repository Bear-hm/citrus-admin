<!--
 * @Author: xiong x1253780359@outlook.com
 * @Date: 2025-10-10 08:42:07
 * @LastEditors: xiong x1253780359@outlook.com
 * @LastEditTime: 2026-04-13 13:40:57
 * @FilePath: \citrus\citrus-admin\src\views\login\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="background">
    <div class="box">
      <div class="forms">
        <div class="tips">
          <span :class="{ check: isLoginMode }" @click="switchMode(true)"
            >登录</span
          >
          <!-- <span :class="{ check: !isLoginMode }" @click="switchMode(false)"
            >注册</span
          > -->
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
