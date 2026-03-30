<script setup>
import { ElMessage } from "element-plus";
import { ref, onMounted } from "vue";
import {
  reqListProblem,
  reqSaveProblem,
  reqUpdateProblem,
  reqDeleteProblemById,
} from "@/api/fqa/index";

const problemData = ref([]);
const total = ref(0);
const pageNum = ref(1);
const pageSize = ref(10);
const showAddDialog = ref(false);
const showEditDialog = ref(false);
const currentProblem = ref({
  id: null,
  question: "",
  answer: "",
  showOrder: 0,
  active: 1,
});

// 获取问答列表
const getData = async (page = 1) => {
  pageNum.value = page;
  try {
    const res = await reqListProblem({
      pageNum: pageNum.value,
      pageSize: pageSize.value,
    });
    if (res.code === "200") {
      problemData.value = res.data.list;
      total.value = res.data.total;
    }
  } catch (error) {
    console.error("获取问答列表失败:", error);
    ElMessage.error("获取问答列表失败");
  }
};

// 添加问答
const addProblem = async () => {
  try {
    const res = await reqSaveProblem(currentProblem.value);
    if (res.code === "200") {
      ElMessage.success("添加成功");
      showAddDialog.value = false;
      getData();
    }
  } catch (error) {
    console.error("添加问答失败:", error);
    ElMessage.error("添加问答失败");
  }
};

// 编辑问答
const editProblem = async () => {
  try {
    const res = await reqUpdateProblem(currentProblem.value);
    if (res.code === "200") {
      ElMessage.success("更新成功");
      showEditDialog.value = false;
      getData();
    }
  } catch (error) {
    console.error("更新问答失败:", error);
    ElMessage.error("更新问答失败");
  }
};

// 删除问答
const deleteProblem = async (id) => {
  try {
    const res = await reqDeleteProblemById(id);
    if (res.code === "200") {
      ElMessage.success("删除成功");
      getData();
    }
  } catch (error) {
    console.error("删除问答失败:", error);
    ElMessage.error("删除问答失败");
  }
};

// 打开添加对话框
const openAddDialog = () => {
  currentProblem.value = {
    question: "",
    answer: "",
    showOrder: 0,
    active: 1,
  };
  showAddDialog.value = true;
};

// 打开编辑对话框
const openEditDialog = (row) => {
  currentProblem.value = { ...row };
  showEditDialog.value = true;
};

onMounted(() => {
  getData();
});
</script>

<template>
  <div class="content-wrapper">
    <div class="header">
      <el-button type="primary" @click="openAddDialog">添加问答</el-button>
    </div>

    <div class="tableDate">
      <div class="tableContent">
        <el-table :data="problemData" stripe style="width: 100%" height="490">
          <el-table-column prop="question" label="问题" min-width="200" />
          <el-table-column
            prop="answer"
            label="答案"
            min-width="300"
            show-overflow-tooltip
          />
          <el-table-column prop="showOrder" label="显示顺序" width="100" />
          <el-table-column prop="active" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="row.active === 1 ? 'success' : 'info'">
                {{ row.active === 1 ? "启用" : "禁用" }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" link @click="openEditDialog(row)"
                >编辑</el-button
              >
              <el-button type="danger" link @click="deleteProblem(row.id)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <div class="pagination-bar">
      <el-pagination
        v-model:current-page="pageNum"
        :page-size="pageSize"
        background
        layout="prev, pager, next, total, jumper"
        :total="total"
        @current-change="getData"
        class="mt-4"
      />
    </div>
  </div>

  <!-- 添加问答对话框 -->
  <el-dialog
    v-model="showAddDialog"
    title="添加问答"
    width="50%"
    :close-on-click-modal="false"
  >
    <el-form :model="currentProblem" label-width="100px">
      <el-form-item label="问题" required>
        <el-input v-model="currentProblem.question" placeholder="请输入问题" />
      </el-form-item>
      <el-form-item label="答案" required>
        <el-input
          v-model="currentProblem.answer"
          type="textarea"
          :rows="4"
          placeholder="请输入答案"
        />
      </el-form-item>
      <el-form-item label="显示顺序">
        <el-input-number v-model="currentProblem.showOrder" :min="0" />
      </el-form-item>
      <el-form-item label="状态">
        <el-switch
          v-model="currentProblem.active"
          :active-value="1"
          :inactive-value="0"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="showAddDialog = false">取消</el-button>
      <el-button type="primary" @click="addProblem">确定</el-button>
    </template>
  </el-dialog>

  <!-- 编辑问答对话框 -->
  <el-dialog
    v-model="showEditDialog"
    title="编辑问答"
    width="50%"
    :close-on-click-modal="false"
  >
    <el-form :model="currentProblem" label-width="100px">
      <el-form-item label="问题" required>
        <el-input v-model="currentProblem.question" placeholder="请输入问题" />
      </el-form-item>
      <el-form-item label="答案" required>
        <el-input
          v-model="currentProblem.answer"
          type="textarea"
          :rows="4"
          placeholder="请输入答案"
        />
      </el-form-item>
      <el-form-item label="显示顺序">
        <el-input-number v-model="currentProblem.showOrder" :min="0" />
      </el-form-item>
      <el-form-item label="状态">
        <el-switch
          v-model="currentProblem.active"
          :active-value="1"
          :inactive-value="0"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="showEditDialog = false">取消</el-button>
      <el-button type="primary" @click="editProblem">确定</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.content-wrapper {
  font-size: 16px;
  padding: 20px;
  margin-bottom: 70px;
  margin-top: 20px;
  box-shadow: 0px 0px 27px 0px rgba(110, 109, 109, 0.14);

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h1 {
      margin: 0;
    }
  }

  .tableDate {
    padding-bottom: 20px;
  }
}

.pagination-bar {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
