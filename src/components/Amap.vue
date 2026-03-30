<!-- 高德地图显示组件 -->
<template>
  <div class="mapView">
    <div id="container"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted } from "vue";
import { shallowRef } from "vue";
import AMapLoader from "@amap/amap-jsapi-loader";
export default defineComponent({
  methods: {
    initMap() {
      AMapLoader.load({
        key: "6ea37ba00ac94f86089dd5c95ee1f028", //此处填入我们注册账号后获取的Key
        version: "2.0", //指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: ["Map.Scale"], //需要使用的的插件列表，如比例尺'AMap.Scale'等
      })
        .then((AMap: any) => {
          this.map = new AMap.Map("container", {
            //设置地图容器id
            viewMode: "3D", //是否为3D地图模式
            zoom: 15, //初始化地图级别
            center: [113.445345, 23.374135], //初始化地图中心点位置
          });
        })
        .catch((e: any) => {
          console.log(e);
        });
    },
  },
  mounted() {
    this.initMap();
  },
  setup() {
    const map = shallowRef(null);
    return {
      map,
    };
  },
});
</script>

<style scoped>
#container {
  padding: 0px;
  margin: 0px;
  width: 100%;
  height: 100%;
}

.mapView {
  height: 100%;
}
</style>
