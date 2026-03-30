<template>
  <div class="home-title">
    <el-icon><Watermelon /></el-icon>
    <el-icon><Pear /></el-icon>
    <el-icon><Orange /></el-icon>
    <div class="title-text">智慧柑橘后台</div>
    <el-icon><Pear /></el-icon>
    <el-icon><Orange /></el-icon>
    <el-icon><Watermelon /></el-icon>
  </div>
</template>
<script setup lang="ts"></script>
<style lang="scss">
.home-title {
  color: $mainColor;
  border-bottom: 1px solid $mainColor;
  padding: 2px 5%;
  display: flex;
  justify-content: center;
  margin: 0 auto;
  width: 40%;
  .title-text {
    font-weight: bold;
    padding: 0px 10px;
    font-size: 20px;
  }
}
</style>
