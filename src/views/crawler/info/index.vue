<template>
  <div class="container">
    <!-- <PageTitle type="pear" title="新闻"/> -->
    <div class="bottom">
      <el-form :inline="true" label-width="auto" class="option-form">
        <div class="option-left">
          <el-form-item>
            <el-select
              v-model="newsType"
              placeholder="请选择新闻类型"
              style="width: 150px"
              @change="getTableData(currentPage.value)"
            >
              <el-option
                v-for="item in newsTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="addRow">增加新闻</el-button>
          </el-form-item>
        </div>

        <div class="option-right">
          <!-- <el-form-item>
            <el-input
              placeholder="请输入新闻xx"
              v-model="queryParam"
            ></el-input>
          </el-form-item> -->
          <el-form-item>
            <!-- <el-button type="primary" size="default" @click="search">
              搜索
            </el-button> -->
            <el-button @click="getTableData(1)">刷新</el-button>
            <el-button type="success" @click="reqCrawlerGanjuw"
              >爬取数据</el-button
            >
          </el-form-item>
        </div>
      </el-form>
      <el-table :data="tableData" stripe style="width: 100%">
        <!-- 普通表格显示 -->
        <el-table-column
          v-for="(item, index) in tableLabel"
          :prop="item.prop"
          :label="item.name"
          :key="index"
          align="center"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <!-- 普通文本显示 -->
            <span v-if="item.renderType === 'text'">{{ row[item.prop] }}</span>

            <!-- 图片显示 -->
            <el-image
              v-if="item.renderType === 'image'"
              style="width: 50px; height: 50px; z-index: 2100"
              :src="row[item.prop]"
              :preview-src-list="[row[item.prop]]"
              fit="cover"
              :preview-teleported="true"
            />

            <!-- 标签显示 -->
            <el-tag
              v-if="item.renderType === 'tag'"
              :type="getTagType(row[item.prop])"
            >
              {{ getNewsTypeLabel(row[item.prop]) }}
            </el-tag>

            <!-- 详情按钮显示 -->
            <el-button
              v-if="item.renderType === 'link'"
              type="primary"
              link
              @click="showDetail(row)"
            >
              查看详情
            </el-button>
          </template>
        </el-table-column>
        <!-- 操作列 -->
        <el-table-column label="操作" align="center">
          <template #="{ row, $index }">
            <el-button type="primary" size="small" @click="update(row)">
              编辑
            </el-button>
            <el-popconfirm
              :title="`你确定要删除id为${row.id}的数据?`"
              width="260px"
              @confirm="deleteRow(row.id)"
            >
              <template #reference>
                <el-button type="primary" size="small"> 删除 </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        class="pagination"
        v-model:current-page="currentPage"
        :page-sizes="[6, 8, 10, 12]"
        v-model:page-size="pageSize"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="getTableData"
        @current-change="getTableData"
      />
    </div>
    <!-- 查看详情对话框 -->
    <el-dialog v-model="detailDialog" title="新闻内容" width="60%">
      <BaseEditor v-model="detailContent" :readonly="true" />
    </el-dialog>
    <!-- 增加/修改对话框 -->
    <el-dialog
      v-model="formVisualDialog"
      :title="title == 1 ? '新增新闻' : '修改新闻'"
      width="60%"
    >
      <el-form
        :model="formParams"
        :rules="rules"
        ref="formRef"
        label-width="100px"
      >
        <el-form-item
          v-for="item in tableLabel"
          :key="item.prop"
          :label="item.name"
          :prop="item.prop"
        >
          <!-- 图片上传 -->
          <!-- 参数详解:
            action="#", 设置为#表示不进行上传，只是预览
            list-type="picture-card", 设置为picture-card表示以卡片形式展示
            :auto-upload="false", 设置为false表示不自动上传，需要手动点击上传按钮
            :file-list="fileList", 设置为fileList表示展示预览图片
            :accept="xxx", 表示接受上传的文件类型
            :on-change="handleChange", 设置为handleChange表示文件改变时的回调函数
            :on-remove="handleRemove", 设置为handleRemove表示文件移除时的回调函数
           -->
          <el-upload
            v-if="item.prop === 'headImg'"
            class="upload-demo"
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :file-list="fileList"
            :accept="'image/*'"
            :limit="1"
            :on-exceed="handleFileExceed"
            :on-change="handleFileChange"
            :on-remove="handleRemove"
            :before-upload="beforeImageUpload"
          >
            <el-icon>
              <Plus />
            </el-icon>
            <template #file="{ file }">
              <div>
                <img
                  class="el-upload-list__item-thumbnail"
                  :src="file.url"
                  alt=""
                />
                <span class="el-upload-list__item-actions">
                  <span
                    class="el-upload-list__item-preview"
                    @click="handlePictureCardPreview(file)"
                  >
                    <el-icon>
                      <ZoomIn />
                    </el-icon>
                  </span>
                  <span
                    class="el-upload-list__item-delete"
                    @click="handleRemove(file)"
                  >
                    <el-icon>
                      <Delete />
                    </el-icon>
                  </span>
                </span>
              </div>
            </template>
          </el-upload>
          <!-- 普通输入框 -->
          <el-input
            v-if="item.isInput"
            v-model="formParams[item.prop]"
            :placeholder="`请输入${item.name}`"
          />
          <el-form-item v-if="item.prop === 'detail'">
            <BaseEditor v-model="formParams.detail" :readonly="false" />
          </el-form-item>
          <!-- 时间选择器 -->
          <el-date-picker
            v-if="item.prop === 'time'"
            v-model="formParams[item.prop]"
            type="datetime"
            placeholder="选择发布时间"
            format="YYYY年MM月DD日"
            value-format="YYYY年MM月DD日"
          />
          <!-- 新闻类型选择器 -->
          <el-select
            v-if="item.prop === 'type'"
            v-model="formParams[item.prop]"
            placeholder="请选择新闻类型"
          >
            <el-option
              v-for="option in newsTypeOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>
    <!-- 图片预览框 -->
    <el-dialog v-model="imgDialog" append-to-body>
      <template #header>
        <el-button type="primary" @click="window.open(dialogImageUrl)">
          下载
        </el-button>
      </template>
      <div class="preview-container">
        <img w-full :src="dialogImageUrl" alt="Preview Image" />
      </div>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted } from "vue";
import {
  reqGetGanjuwPage,
  reqDeleteGanjuwById,
  reqUpdateGanjuw,
  reqSaveGanjuw,
  reqCrawlerGanjuw,
} from "@/api/crawler/info";
import { reqDownloadFileById, reqUploadFile } from "@/api/file/index";
import { ElMessage } from "element-plus";
import BaseEditor from "@/components/BaseEditor.vue";
//title标题: 1新增 2修改
let title = ref(1);
// 分页器参数和方法
let pageSize = ref(10);
let currentPage = ref(1);
let total = ref(0);
let detailContent = ref("");
const newsType = ref("NEWS");
const newsTypeOptions = [
  { label: "行业资讯", value: "NEWS" },
  { label: "政策法规", value: "LAWS" },
  { label: "行情资讯", value: "MARKET" },
  { label: "种植技术", value: "TECH" },
  { label: "橘页头条", value: "HEAD" },
];
// 表单的ref
const formRef = ref();
const fileList = ref([]);
//图片显示对话框
const dialogImageUrl = ref("");
const imgDialog = ref(false);
const formVisualDialog = ref(false);
const detailDialog = ref(false);
const tableData = ref([]);
//要查询参数
let queryParam = ref();
//表格的数据
let tableLabel = reactive([
  { prop: "headImg", name: "新闻图片", isInput: false, renderType: "image" },
  { prop: "title", name: "新闻标题", isInput: true, renderType: "text" },
  { prop: "time", name: "发布时间", isInput: false, renderType: "text" },
  { prop: "author", name: "作者", isInput: true, renderType: "text" },
  { prop: "type", name: "新闻类型", isInput: false, renderType: "tag" },
  { prop: "detail", name: "新闻内容", isInput: false, renderType: "link" },
]);
const getTagType = (type) => {
  const typeMap = {
    NEWS: "primary",
    LAWS: "success",
    MARKET: "warning",
    TECH: "info",
    HEAD: "danger",
  };
  return typeMap[type] || "";
};
// 获取新闻类型的显示文本
const getNewsTypeLabel = (type) => {
  const option = newsTypeOptions.find((item) => item.value === type);
  return option ? option.label : type;
};

const rules = {
  headImg: [{ required: true, message: "请上传新闻图片", trigger: "change" }],
  title: [
    { required: true, message: "请输入新闻标题", trigger: "blur" },
    { min: 2, max: 100, message: "长度在 2 到 100 个字符", trigger: "blur" },
  ],
  time: [{ required: true, message: "请选择发布时间", trigger: "change" }],
  author: [{ required: true, message: "请输入作者", trigger: "blur" }],
  type: [{ required: true, message: "请选择新闻类型", trigger: "change" }],
  detail: [{ required: true, message: "请输入新闻内容", trigger: "blur" }],
};
let formParams = reactive({
  id: "",
  clickNums: 0,
  headImg: "",
  title: "",
  time: "",
  author: "",
  type: "",
  detail: "",
  detailUrl: "",
});
//文件上传
const getUploadFile = async (file) => {
  const res = await reqUploadFile(file);
  if (res.code == "200") {
    ElMessage({
      type: "success",
      message: "文件上传成功",
    });
    return res.data.id;
    // formParams.headImg = res.data;
  } else {
    ElMessage({
      type: "error",
      message: "文件上传失败",
    });
    return null;
  }
};
//获取列表数据
const getTableData = async (pager = 1) => {
  queryParam.value = "";
  currentPage.value = pager;
  let res = await reqGetGanjuwPage({
    pageNum: currentPage.value,
    pageSize: pageSize.value,
    type: newsType.value,
  });
  if (res.code == "200") {
    total.value = res.data.total;
    tableData.value = res.data.list;
    ElMessage({
      type: "success",
      message: "获取新闻数据成功",
    });
  } else {
    ElMessage({
      type: "error",
      message: "获取新闻数据失败",
    });
  }
};
//更新种子信息
const update = (row) => {
  // console.log("更新的数据", row);
  if (formRef.value) {
    formRef.value.resetFields();
  }
  title.value = 2;
  formVisualDialog.value = true;
  // console.log("更新的数据", row);
  if (row.headImg) {
    fileList.value = [
      {
        name: "已有图片",
        url: row.headImg,
      },
    ];
  }
  Object.assign(formParams, row);
};

//增加数据
const addRow = () => {
  title.value = 1;
  formVisualDialog.value = true;
  // 重置表单验证
  if (formRef.value) {
    formRef.value.resetFields();
  }

  fileList.value = [];
  //清空数据
  Object.assign(formParams, {
    id: "",
    clickNums: 0,
    headImg: "",
    title: "",
    time: "",
    author: "",
    type: "",
    detail: "",
    detailUrl: "",
  });
};

//dialog框确认
const submitForm = async () => {
  let res;
  try {
    if (fileList.value.length > 0) {
      if (fileList.value[0].raw) {
        const id = await getUploadFile(fileList.value[0].raw);
        if (id) {
          formParams.headImg = id;
        } else {
          ElMessage({
            type: "error",
            message: "图片上传失败",
          });
          return;
        }
      }
    } else {
      if (title.value === 1) {
        ElMessage({
          type: "error",
          message: "请上传新闻图片",
        });
        return;
      }
    }
    //新增
    if (title.value == 1) {
      // 去除id参数
      const { id, clickNums, ...saveParams } = formParams;
      res = await reqSaveGanjuw(saveParams);

      res = await reqSaveGanjuw(saveParams);
      //编辑
    } else if (title.value == 2) {
      res = await reqUpdateGanjuw(formParams);
    }
    if (res.code == "200") {
      formVisualDialog.value = false;
      ElMessage({
        type: "success",
        message: title.value == 2 ? "编辑成功" : "新增成功",
      });
      getTableData();
    } else {
      formVisualDialog.value = false;
      // console.log("res.code ！= 200");
    }
  } catch (error) {
    formVisualDialog.value = false;
    ElMessage({
      type: "error",
      message: title.value == 2 ? "编辑失败" : "新增失败",
    });
    console.error("请求失败:", error);
  }
};
//删除数据
const deleteRow = async (id) => {
  const res = await reqDeleteGanjuwById(id);
  if (res.code == "200") {
    ElMessage({
      type: "success",
      message: "删除成功",
    });
  } else {
    ElMessage({
      type: "error",
      message: "删除失败",
    });
  }
  getTableData();
};
const cancel = () => {
  formVisualDialog.value = false;
  Object.assign(formParams, {
    id: "",
    clickNums: 0,
    headImg: "",
    title: "",
    time: "",
    author: "",
    type: "",
    detail: "",
    detailUrl: "",
  });
  // 重置表单验证
  if (formRef.value) {
    formRef.value.resetFields();
  }
  fileList.value = [];
};
//图片上传
const beforeImageUpload = (file) => {
  const isImage = file.type.startsWith("image/");
  const isLt2M = file.size / 1024 / 1024 < 2;

  if (!isImage) {
    ElMessage.error("只能上传图片文件!");
    return false;
  }
  if (!isLt2M) {
    ElMessage.error("图片大小不能超过2MB!");
    return false;
  }
  return true;
};
const handleFileChange = (params) => {
  // console.log("文件上传", params);
  fileList.value = [
    {
      url: params.url,
      name: params.name,
      raw: params.raw,
    },
  ];
};
const handleFileExceed = (files) => {
  ElMessage.warning(`最多上传一个文件`);
};
const handlePictureCardPreview = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url;
  imgDialog.value = true;
};
const handleRemove = (uploadFile) => {
  formParams.headImg = "";
  fileList.value = fileList.value.filter((file) => file.uid !== uploadFile.uid);
};
const showDetail = (row) => {
  detailContent.value = row.detail;
  // console.log("detail", detailContent.value);

  detailDialog.value = true;
};

onMounted(() => {
  getTableData();
});
</script>

<style scoped>
.container {
  padding: 1% 2%;
  position: relative;
  height: 100%;
}

.pagination {
  margin-top: 2%;
  justify-content: center;
}

.option-form {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.preview-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

.preview-container img {
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
}
</style>
