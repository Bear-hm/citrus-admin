<template>
  <el-container class="container">
    <el-aside class="asside" width="auto">
      <MenuBar></MenuBar>
    </el-aside>
    <el-container class="back">
      <el-header class="header">
        <Header></Header>
      </el-header>
      <el-main class="main">
        <div class="body">
          <router-view></router-view>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>
<script setup lang="ts">
import Header from "@/layout/header/Header.vue";
import MenuBar from "@/layout/menu/MenuBar.vue";
</script>
<style lang="scss" scoped>
.back {
  background: linear-gradient(
    180deg,
    var(--background-subtle, #fff7ed) 0%,
    var(--background-page, #ffffff) 48%
  );
  background-repeat: no-repeat;
  min-width: 1000px;
  min-height: 665px;
}

.container {
  height: 100vh;
}

.asside {
  background: linear-gradient(180deg, #1c1917 0%, #292524 100%);
  min-height: 665px;
  padding: 8px;
  border-radius: 16px;
  box-shadow: 2px 0 16px rgba(0, 0, 0, 0.15);
}

.header {
  padding-top: 1vh;
  height: 7vh;
  min-height: 65px;
  display: flex;
  align-items: center;
  background-color: transparent;
  min-width: 1000px;
}

.main {
  margin: 0;
  padding: 0;
  padding-top: 1vh;
  min-width: 1000px;
  min-height: 600px;
  height: 91vh;

  .body {
    width: 94%;
    margin: 2% 3%;
    height: 92%;
    background: var(--background-page, #ffffff);
    border-radius: 12px;
    border: 1px solid rgba(249, 115, 22, 0.08);
    box-shadow: 0 1px 3px rgba(17, 24, 39, 0.06);
  }
}
</style>
