<template>
  <div class="header-inner">
    <Collapse></Collapse>
    <BredCum></BredCum>
  </div>
</template>
<script setup lang="ts">
import Collapse from "./Collapse.vue";
import BredCum from "./BredCum.vue";
</script>
<style lang="scss" scoped>
.header-inner {
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 0;
}
</style>
