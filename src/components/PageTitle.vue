<template>
  <div :class="paddingStyle ? 'titlePadding up' : 'up'">
    <div class="title">
      <el-icon :size="size" :color="color">
        <component :is="currentIcon"></component>
      </el-icon>
      <span>{{ props.title }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import * as Icons from "@element-plus/icons-vue";
const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  size: {
    // 图标尺寸
    type: [Number, String],
    default: 18,
    //验证,确保传入的值不是NAN
    validator(value) {
      return !isNaN(value);
    },
  },
  color: {
    // 图标颜色
    type: String,
    default: " #FFA500",
  },
  type: {
    // 图标类型
    type: String,
    default: "",
  },
  paddingStyle: {
    type: Boolean,
    default: false,
  },
});

const size = computed(() => {
  if (isNaN(props.size)) {
    return 20;
  }
  //确保是数字
  return Number(props.size);
});

// 动态获取图标
const currentIcon = computed(() => {
  let iconType = props.type;
  let icon = null;

  if (iconType !== "") {
    // 首字母大写
    icon = iconType.replace(iconType[0], iconType[0].toUpperCase());
  }

  return Icons[icon];
});
</script>

<style lang="scss" scoped>
.up {
  color: $mainColor;
  font-weight: bold;
  height: 5%;
  display: flex;
  align-items: center;
  font-size: 14px;
}

.title {
  display: flex;
  align-items: center;
  padding: 0 10px 2px 5px;
  border-bottom: 1px solid $mainColor;
}
.titlePadding {
  padding: 1% 2%;
}
</style>
