<template>
  <div class="logo" @click="goHome">
    <img :src="logo" alt="logo" />
    <span v-if="!isCollapse" class="title">智慧柑橘管理平台</span>
  </div>
</template>
<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "@/store/index";
import logo from "@/assets/logo.png";
const store = useStore();
const router = useRouter();
const isCollapse = computed(() => {
  return store.getters["getCollapse"];
});

const goHome = () => {
  router.push("/");
};
</script>
<style lang="scss" scoped>
.logo {
  background: rgba(0, 0, 0, 0.15);
  height: 55px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  padding-left: 15px;
  color: #fff;
  cursor: pointer;

  img {
    width: 40px;
    height: 40px;
    margin-right: 8px;
    border-radius: 50%;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  .title {
    font-weight: 600;
    font-size: 15px;
    line-height: 1.6;
    letter-spacing: 0.02em;
    color: rgba(255, 255, 255, 0.95);
  }
}
</style>
