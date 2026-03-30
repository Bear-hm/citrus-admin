<script setup>
// import { reqGetCnhnbPricePage, reqAddCnhnbPrice } from '@/api/market/index'
import { ElMessage } from "element-plus";
import { ref, onMounted, reactive } from "vue";
// import ChinaMap from '@/components/chart/ChinaMap.vue'
const priceData = ref([]);
const total = ref(0);
const pageNum = ref(1);
const pageSize = ref(10);
const showAddPriceDialog = ref(false);
const newPriceData = ref({
  type: "",
  address: "",
  price: "",
  time: new Date(),
});
// const getData = async (page = 1) => {
//   pageNum.value = page
//   const res = await reqGetCnhnbPricePage({
//     pageNum: pageNum.value,
//     pageSize: pageSize.value
//   })

//   priceData.value = res.data.list
//   total.value = res.data.total
// }
// 添加价格信息
// const addPriceData = async () => {
//   // 清空表单
//   newPriceData.value = {
//     type: '',
//     address: '',
//     price: '',
//     time: new Date()
//   }
//   const res = await reqAddCnhnbPrice(newPriceData.value)
//   if (res.code === '200') {
//     ElMessage({
//       message: '添加成功',
//       type: 'success'
//     })
//     getData()
//   }
//   // console.log('res', res)
//   showAddPriceDialog.value = false
// }
onMounted(() => {
  // getData()
});
</script>

<template>
  <div class="content-wrapper">
    <h1 style="text-align: center; margin: 0 auto">全国柑橘价格信息</h1>
    <div class="tableDate">
      <div class="tableContent">
        <el-table :data="priceData" stripe style="width: 100%" height="490">
          <el-table-column prop="type" label="类型" width="180" />
          <el-table-column prop="address" label="地址" width="200" />
          <el-table-column prop="price" label="价格" sortable width="180" />
          <el-table-column prop="time" label="时间" />
        </el-table>
      </div>
    </div>
    <div class="pagination-bar">
      <el-pagination
        :current-page="pageNum"
        :page-size="pageSize"
        background
        layout="prev, pager, next,total, jumper,slot"
        :total="total"
        @current-change="getData"
        class="mt-4"
        prev-text="<<"
        next-text=">>"
      />
    </div>
  </div>
  <!-- 添加价格信息弹出 -->
  <!-- <el-dialog title="添加价格信息" v-model="showAddPriceDialog" width="30%">
    <el-form ref="addForm" :model="newPriceData" label-width="100px">
      <el-form-item label="类型">
        <el-input v-model="newPriceData.type" placeholder="请输入类型"></el-input>
      </el-form-item>
      <el-form-item label="地址">
        <el-input v-model="newPriceData.address" placeholder="请输入地址"></el-input>
      </el-form-item>
      <el-form-item label="价格">
        <el-input v-model="newPriceData.price" placeholder="请输入价格"></el-input>
      </el-form-item>
      <el-form-item label="时间">
        <el-date-picker
          v-model="newPriceData.time"
          type="datetime"
          placeholder="请选择时间"
          format="YYYY-MM-DD HH:mm:ss"
        ></el-date-picker>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="showAddPriceDialog = false">取消</el-button>
      <el-button type="primary" @click="addPriceData">确定</el-button>
    </template>
  </el-dialog> -->
</template>

<style scoped lang="scss">
.content-wrapper {
  font-size: 16px;
  padding-top: 5px;
  padding-bottom: 20px;
  margin-bottom: 70px;
  margin-top: 20px;
  box-shadow: 0px 0px 27px 0px rgba(110, 109, 109, 0.14);
  .tableDate {
    padding-bottom: 20px;
  }
}
</style>
