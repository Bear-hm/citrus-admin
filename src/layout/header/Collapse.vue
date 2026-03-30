<template>
  <div class="change">
    <el-icon class="icons" @click="changeIcon">
      <component :is="status ? 'Expand' : 'Fold'"></component>
    </el-icon>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { useStore } from "@/store/index";
const store = useStore();
const status = ref(false);
const changeIcon = () => {
  status.value = !status.value;
  store.commit("setCollapse", status.value);
};
</script>
<style scoped lang="scss">
.change {
  width: 44px;
  height: 44px;
  margin-right: 12px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  border-radius: 12px;
  border: 1px solid rgba(17, 24, 39, 0.06);
  box-shadow: 0 1px 2px rgba(17, 24, 39, 0.05);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.change:hover {
  border-color: rgba(249, 115, 22, 0.25);
  box-shadow: 0 2px 8px rgba(249, 115, 22, 0.12);
}

.icons {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  color: var(--text-secondary, #6b7280);
  cursor: pointer;
  transition: color 0.2s ease;
}

.icons:hover {
  color: var(--color-primary, #f97316);
}
</style>
