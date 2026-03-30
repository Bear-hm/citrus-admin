<template>
  <!-- 专家管理 -->
  <div class="container">
    <div class="article__header">
      <el-form :inline="true" label-width="auto" class="option-form">
        <div class="option-left">
          <el-form-item>
            <el-select
              v-model="status"
              placeholder="审核状态"
              style="width: 150px"
              @change="getExpertList()"
            >
              <el-option
                v-for="item in tabTypes"
                :key="item.name"
                :label="item.label"
                :value="item.name"
              />
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="handleAddExpert"
              >增加专家</el-button
            >
          </el-form-item>
        </div>
        <div class="option-right">
          <el-form-item>
            <el-button @click="getExpertList()">刷新</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="article__table">
      <el-table :data="expertList" stripe style="width: 100%">
        <el-table-column
          v-for="(item, index) in tableLabel.filter((item) => item.showInTable)"
          :key="index"
          :prop="item.prop"
          :label="item.name"
          align="center"
          :width="item.width"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <!-- 普通文本显示 -->
            <span v-if="item.renderType === 'text'">{{
              row[item.prop] || "-"
            }}</span>

            <!-- 头像显示 -->
            <el-image
              v-if="item.renderType === 'avatar'"
              style="width: 40px; height: 40px; border-radius: 50%"
              :src="row.avatarUrl || defaultAvatar"
              fit="cover"
            />

            <!-- 文件数量显示 -->
            <el-tag
              v-if="item.renderType === 'files'"
              type="success"
              size="small"
              v-show="row[item.prop] && row[item.prop].length > 0"
            >
              {{ row[item.prop].length }}个文件
            </el-tag>
            <span v-else-if="item.renderType === 'files'">-</span>

            <!-- 状态标签 -->
            <el-tag
              v-if="item.renderType === 'status'"
              :type="statusTagType(row[item.prop])"
            >
              {{ formatApplyStatus(row[item.prop]) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column fixed="right" label="操作" width="280" align="center">
          <template #default="{ row }">
            <el-button size="small" type="primary" @click="viewDetails(row)"
              >详情</el-button
            >
            <el-button
              size="small"
              @click="editEpertList(row)"
              :disabled="row.applyStatus === 3"
              >编辑</el-button
            >
            <el-button
              size="small"
              :type="row.applyStatus === 0 ? 'success' : 'warning'"
              @click="handleAudit(row)"
              v-if="row.applyStatus === 0 || row.applyStatus === 1"
            >
              {{ row.applyStatus === 0 ? "审核" : "作废" }}
            </el-button>
            <el-popconfirm
              title="确定要删除该专家？"
              @confirm="deleteexpert(row.id)"
            >
              <template #reference>
                <el-button size="small" type="danger">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        class="pagination"
        v-model:current-page="params.pageNum"
        v-model:page-size="params.pageSize"
        :page-sizes="[5, 7, 10]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="getExpertList"
        @current-change="getExpertList"
      />
    </div>
    <!-- 在表格列中添加查看详情插槽 -->
    <el-dialog
      v-model="detailDialogVisible"
      width="50%"
      custom-class="expert-detail-dialog"
    >
      <div v-if="selectedExpert" class="expert-detail-container">
        <el-row :gutter="20">
          <el-col :span="8" class="expert-detail-avatar-col">
            <div class="expert-detail__avatar">
              <img
                :src="selectedExpert.avatarUrl || defaultAvatar"
                alt="专家头像"
                class="expert-detail__avatar-img"
              />
              <div class="expert-detail__name">{{ selectedExpert.name }}</div>
            </div>
          </el-col>
          <el-col :span="16" class="expert-detail-info-col">
            <el-descriptions
              title="专家信息"
              :column="1"
              border
              class="expert-detail-descriptions"
            >
              <el-descriptions-item label="简介" class="description-item">
                {{ selectedExpert.profile || "暂无简介信息" }}
              </el-descriptions-item>

              <el-descriptions-item label="著作" class="description-item">
                <div
                  v-if="
                    selectedExpert.products &&
                    selectedExpert.products.length > 0
                  "
                >
                  <div
                    v-for="(product, index) in selectedExpert.products"
                    :key="index"
                    class="product-item"
                  >
                    <span class="product-name">{{ product.name }}</span>
                    <el-button
                      type="primary"
                      size="small"
                      link
                      style="margin-left: 10px"
                      @click="downloadFile(product)"
                      >下载</el-button
                    >
                  </div>
                </div>
                <div v-else>暂无著作信息</div>
              </el-descriptions-item>

              <el-descriptions-item label="职位" class="description-item">
                {{ selectedExpert.positions || "暂无职位信息" }}
              </el-descriptions-item>
              <el-descriptions-item label="擅长领域" class="description-item">
                {{ selectedExpert.field || "暂无领域信息" }}
              </el-descriptions-item>
              <el-descriptions-item label="电话" class="description-item">
                {{ selectedExpert.phone || "暂无电话信息" }}
              </el-descriptions-item>
              <el-descriptions-item label="邮箱" class="description-item">
                {{ selectedExpert.email || "暂无邮箱信息" }}
              </el-descriptions-item>
              <el-descriptions-item label="QQ" class="description-item">
                {{ selectedExpert.qq || "暂无QQ信息" }}
              </el-descriptions-item>
              <el-descriptions-item label="微信" class="description-item">
                {{ selectedExpert.weChat || "暂无微信信息" }}
              </el-descriptions-item>
              <el-descriptions-item label="认证信息" class="description-item">
                <div
                  v-if="
                    selectedExpert.certification &&
                    selectedExpert.certification.length > 0
                  "
                >
                  <div
                    v-for="(
                      certification, index
                    ) in selectedExpert.certification"
                    :key="index"
                    class="certification-item"
                  >
                    <span class="certification-name">{{
                      certification.name
                    }}</span>
                    <el-button
                      size="small"
                      type="text"
                      @click="downloadFile(certification)"
                      >下载</el-button
                    >
                  </div>
                </div>
                <div v-else>暂无认证信息</div>
              </el-descriptions-item>
            </el-descriptions>
          </el-col>
        </el-row>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            @click="detailDialogVisible = false"
            class="detail-close-button"
            >关闭</el-button
          >
        </div>
      </template>
    </el-dialog>

    <!--新增/编辑弹框 -->

    <el-dialog
      v-model="editDialogVisible"
      :title="isEditMode ? '编辑专家信息' : '新增专家'"
      width="50%"
      :before-close="() => (editDialogVisible = false)"
      class="custom-dialog"
    >
      <el-form
        :model="recommendForm"
        :rules="formRules"
        ref="formRef"
        label-width="100px"
        class="custom-form"
      >
        <!-- 使用tableLabel遍历生成表单项 -->
        <template v-for="(item, index) in tableLabel" :key="index">
          <el-form-item
            v-if="item.prop !== 'applyStatus'"
            :label="item.name"
            :prop="item.prop"
          >
            <!-- 头像上传 -->
            <template v-if="item.renderType === 'avatar'">
              <el-upload
                ref="avatarUpload"
                class="avatar-uploader"
                :show-file-list="false"
                :http-request="uploadAvatar"
                :before-upload="beforeAvatarUpload"
                :limit="1"
                accept="image/*"
              >
                <el-image
                  v-if="recommendForm.avatar"
                  style="width: 100px; height: 100px"
                  :src="avatarUrl"
                  fit="cover"
                >
                </el-image>
                <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
              </el-upload>
            </template>

            <!-- 文件上传（著作和认证信息） -->
            <template v-else-if="item.renderType === 'files'">
              <template v-if="isEditMode">
                <div class="file-list">
                  <div
                    v-for="file in recommendForm[item.prop]"
                    :key="file.id"
                    class="file-item"
                  >
                    <div class="file-info">
                      <el-icon class="file-type">
                        <Document v-if="item.prop === 'products'" />
                        <Picture v-else-if="isImage(file.name)" />
                        <Document v-else />
                      </el-icon>
                      <span class="file-name">{{ file.name }}</span>
                    </div>
                    <div class="file-actions">
                      <el-button
                        type="primary"
                        style="margin-left: 15px"
                        link
                        @click="downloadFile(file)"
                        >下载</el-button
                      >
                      <el-button
                        link
                        @click="
                          item.prop === 'products'
                            ? removeProduct(file)
                            : handleCerRemove(file)
                        "
                      >
                        删除
                      </el-button>
                    </div>
                  </div>
                </div>
                <el-upload
                  :show-file-list="false"
                  :http-request="
                    item.prop === 'products'
                      ? getProUploadFile
                      : getCerUploadFile
                  "
                  :accept="
                    item.prop === 'products'
                      ? '.pdf,.doc,.docx'
                      : '.pdf,.jpg,.png,.jpeg'
                  "
                >
                  <el-button type="primary" plain>添加新文件</el-button>
                </el-upload>
              </template>
              <template v-else>
                <el-upload
                  :ref="
                    item.prop === 'products'
                      ? 'productsUploadRef'
                      : 'cerUploadRef'
                  "
                  multiple
                  :limit="item.prop === 'products' ? 5 : 3"
                  :on-exceed="handleExceed"
                  :on-remove="
                    item.prop === 'products' ? handleProRemove : handleCerRemove
                  "
                  :http-request="
                    item.prop === 'products'
                      ? getProUploadFile
                      : getCerUploadFile
                  "
                  list-type="text"
                  :file-list="
                    recommendForm[item.prop].map((file) => ({
                      uid: file.id,
                      name: file.name,
                      status: file.status,
                    }))
                  "
                  :accept="
                    item.prop === 'products'
                      ? '.pdf,.doc,.docx'
                      : '.pdf,.jpg,.png,.jpeg'
                  "
                >
                  <el-button size="small" type="primary" class="custom-button">
                    点击上传
                  </el-button>
                  <template #tip>
                    <div class="el-upload__tip">
                      {{
                        item.prop === "products"
                          ? "支持上传 PDF、Word 文件，最多 5 个文件"
                          : "支持上传 PDF、图片文件，最多 3 个文件"
                      }}
                    </div>
                  </template>
                </el-upload>
              </template>
            </template>

            <!-- 普通文本输入 -->
            <template v-else>
              <el-input
                v-model="recommendForm[item.prop]"
                :placeholder="`请输入${item.name}`"
                :type="item.prop === 'profile' ? 'textarea' : 'text'"
              ></el-input>
            </template>
          </el-form-item>
        </template>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false" class="custom-button"
          >取消</el-button
        >
        <el-button type="primary" @click="editEpert" class="custom-button"
          >保存</el-button
        >
      </template>
    </el-dialog>

    <!-- 审核对话框 -->
    <el-dialog
      v-model="auditDialogVisible"
      :title="currentExpert?.applyStatus === 0 ? '审核专家' : '专家作废'"
      width="30%"
    >
      <el-form
        ref="auditFormRef"
        :model="auditForm"
        :rules="auditRules"
        label-width="100px"
      >
        <el-form-item
          label="审核结果"
          prop="status"
          v-if="currentExpert?.applyStatus === 0"
        >
          <el-radio-group v-model="auditForm.status">
            <el-radio :value="1">通过</el-radio>
            <el-radio :value="2">不通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          :label="currentExpert?.applyStatus === 0 ? '审核意见' : '作废原因'"
          prop="reason"
        >
          <el-input
            v-model="auditForm.reason"
            type="textarea"
            :rows="3"
            :placeholder="
              currentExpert?.applyStatus === 0
                ? '请输入审核意见'
                : '请输入作废原因'
            "
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="auditDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAudit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import {
  reqGetExpertPage,
  reqAddExpert,
  reqUpdateExpert,
  reqGetExpertById,
  reqDeleteExpertById,
} from "@/api/expert";
import { reqDownloadFileById, reqUploadFile, reqGetFileInfo } from "@/api/file";
import { ElMessage } from "element-plus";

const detailDialogVisible = ref(false); // 控制详情弹窗显示
const selectedExpert = ref(null); // 当前选中的专家
const tableLabel = [
  {
    prop: "avatar",
    name: "头像",
    width: "100",
    renderType: "avatar",
    showInTable: true,
  },
  {
    prop: "name",
    name: "姓名",
    width: "120",
    renderType: "text",
    showInTable: true,
  },
  {
    prop: "products",
    name: "著作",
    width: "120",
    renderType: "files",
    showInTable: true,
  },
  {
    prop: "email",
    name: "邮箱",
    width: "170",
    renderType: "text",
    showInTable: true,
  },
  {
    prop: "positions",
    name: "履历",
    width: "200",
    renderType: "text",
    showInTable: true,
  },
  {
    prop: "field",
    name: "领域",
    width: "120",
    renderType: "text",
    showInTable: true,
  },
  {
    prop: "certification",
    name: "认证信息",
    width: "140",
    renderType: "files",
    showInTable: true,
  },
  {
    prop: "applyStatus",
    name: "状态",
    width: "120",
    renderType: "status",
    showInTable: true,
  },
  { prop: "profile", name: "简介", renderType: "textarea", showInTable: false },
  { prop: "phone", name: "手机号", renderType: "text", showInTable: false },
  { prop: "qq", name: "QQ", renderType: "text", showInTable: false },
  { prop: "weChat", name: "微信", renderType: "text", showInTable: false },
];
// 查看详情对话框
const viewDetails = async (expert) => {
  selectedExpert.value = expert;
  debugger;
  // 获取相关文件信息
  try {
    // 获取 products 文件信息
    const productsWithFileInfo = await Promise.all(
      expert.products.map(async (productId) => {
        if (productId && productId !== "null") {
          const fileInfo = await reqGetFileInfo(productId);
          if (fileInfo) {
            return {
              id: fileInfo.data.id,
              name: fileInfo.data.fileName,
              status: fileInfo.data.status,
            };
          } else {
            return null;
          }
        } else {
          return null;
        }
      })
    );

    // 获取 certification 文件信息
    const certificationWithFileInfo = await Promise.all(
      expert.certification.map(async (certificationId) => {
        if (certificationId && certificationId !== "null") {
          const fileInfo = await reqGetFileInfo(certificationId);
          if (fileInfo) {
            return {
              id: fileInfo.data.id,
              name: fileInfo.data.fileName,
              status: fileInfo.data.status,
            };
          } else {
            return null;
          }
        } else {
          return null;
        }
      })
    );

    // 过滤掉无效的 certification 文件信息
    const validCertificationFiles = certificationWithFileInfo.filter(
      (file) => file !== null
    );

    // 过滤掉无效的 products 文件信息
    const validProductsFiles = productsWithFileInfo.filter(
      (file) => file !== null
    );

    // 更新
    selectedExpert.value.certification = validCertificationFiles;
    selectedExpert.value.products = validProductsFiles;
  } catch (error) {
    ElMessage.error("获取文件信息失败: " + error.message);
  }
  detailDialogVisible.value = true;
};
const auditDialogVisible = ref(false);
const currentExpert = ref(null);
const auditFormRef = ref();
const auditForm = ref({
  reason: "",
});
// 分页参数
const params = ref({
  pageNum: 1,
  pageSize: 7,
});

// 添加响应式变量
// const profileDialogVisible = ref(false)
const currentProfile = ref("");
const defaultAvatar =
  "https://ts2.tc.mm.bing.net/th?id=OIP-C.4uvuajAOVfVs7fzbr_agNQAAAA&w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=2.5&pid=3.1&rm=2";
// 显示详情方法
const auditRules = {
  reason: [
    { required: true, message: "请输入原因", trigger: "blur" },
    { min: 2, max: 200, message: "长度在 2 到 200 个字符", trigger: "blur" },
  ],
};
// 弹窗状态
const isEditMode = ref(false);
// 打开新增弹窗
const handleAddExpert = () => {
  isEditMode.value = false;
  resetForm();
  editDialogVisible.value = true;
};
const handleAudit = (expert) => {
  currentExpert.value = expert;
  auditForm.value.reason = "";
  auditDialogVisible.value = true;
};
// 状态选项
const tabTypes = [
  { name: "all", label: "全部用户" },
  { name: "deliver", label: "待审核" },
  { name: "complete", label: "审核成功" },
  { name: "fail", label: "审核失败" },
  { name: "cancel", label: "审核作废" },
];
//头像上传
const avatarUrl = ref(null);
const expertList = ref([]);
const total = ref(0);
const status = ref("all");

// 重置表单函数
const resetForm = () => {
  recommendForm.value = {
    id: "",
    name: "",
    products: [],
    profile: "",
    phone: "",
    email: "",
    qq: "",
    weChat: "",
    avatar: "",
    field: "",
    positions: "",
    certification: [],
  };
  avatarUrl.value = "";
};
const recommendForm = ref({
  id: "",
  name: "",
  products: [],
  profile: "",
  phone: "",
  email: "",
  qq: "",
  weChat: "",
  avatar: "",
  field: "",
  positions: "",
  certification: [],
});

const formRules = {
  name: [{ required: true, message: "请输入专家姓名", trigger: "blur" }],
  products: [{ required: true, message: "请上传专家著作", trigger: "blur" }],
  profile: [{ required: true, message: "请输入专家简介", trigger: "blur" }],
  phone: [
    { required: true, message: "请输入专家电话", trigger: "blur" },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: "请输入有效的手机号码",
      trigger: "blur",
    },
  ],
  email: [
    { required: true, message: "请输入专家邮箱", trigger: "blur" },
    { type: "email", message: "请输入有效的邮箱地址", trigger: "blur" },
  ],
  certification: [
    { required: true, message: "请输入专家著作", trigger: "blur" },
  ],
};
// 统一文件处理方法
const isImage = (fileName) => /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);
// 文件删除
const removeFile = (file, type) => {
  if (type === "product") {
    recommendForm.value.products = recommendForm.value.products.filter(
      (item) => item.uid !== file.uid
    );
  } else {
    recommendForm.value.certification =
      recommendForm.value.certification.filter((item) => item.uid !== file.uid);
  }
};

const removeProduct = (file) => removeFile(file, "product");

// 获取专家列表
const getExpertList = async () => {
  try {
    const { data } = await reqGetExpertPage({
      pageNum: params.value.pageNum,
      pageSize: params.value.pageSize,
    });

    // 状态映射表
    const statusMap = {
      deliver: 0,
      complete: 1,
      fail: 2,
      cancel: 3,
    };

    let filteredList = data.list;

    // 状态过滤
    if (status.value !== "all") {
      if (statusMap.hasOwnProperty(status.value)) {
        filteredList = data.list.filter(
          (item) => item.applyStatus === statusMap[status.value]
        );
      } else {
        console.error("无效的状态值:", status.value);
        filteredList = data.list; // 无效状态时回退到原始列表
      }
    }

    // 异步处理头像URL
    expertList.value = await Promise.all(
      filteredList.map(async (expert) => {
        return {
          ...expert,
          avatarUrl: expert.avatar ? await getAvatarUrl(expert.avatar) : null,
        };
      })
    );

    // 设置总数（注意：这里保留原逻辑，total是后端返回的总数，非过滤后的数量）
    total.value = data.total;
    // console.log("-------------------");
    // console.log(expertList.value);
    // console.log("-------------------");
    // 只在 status=all 时显示成功提示
    if (status.value === "all") {
      ElMessage.success("获取专家列表成功");
    }
  } catch (error) {
    ElMessage.error("获取专家列表失败");
    console.error(error);
  }
};

// 状态标签类型
const statusTagType = (status) => {
  const typeMap = {
    0: "warning", // 待审核
    1: "success", // 审核成功
    2: "danger", // 审核失败
    3: "info", // 已作废
  };
  return typeMap[status] || "";
};
// 状态格式化
const formatApplyStatus = (status) => {
  const statusMap = {
    0: "待审核",
    1: "审核成功",
    2: "审核失败",
    3: "已作废",
  };
  return statusMap[status] || "未知状态";
};

// 获取头像 URL
const getAvatarUrl = async (fileId) => {
  if (!fileId) return null;
  try {
    const blob = await reqDownloadFileById(fileId);

    return URL.createObjectURL(blob);
  } catch (error) {
    return null;
  }
};

const downloadFile = async (file) => {
  try {
    console.log(file);
    const blob = await reqDownloadFileById(file.id);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name; // 设置下载的文件名
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url); // 释放对象URL
  } catch (error) {
    ElMessage.error("下载文件失败");
  }
};

const removeAvatar = () => {
  recommendForm.value.avatar = null;
  avatarUrl.value = null; // 重置头像 URL
  // 清除上传组件的文件列表
  avatarUpload.value.clearFiles();
  ElMessage.success("已移除头像");
};

// 上传前验证
const beforeAvatarUpload = (file) => {
  const isImage = file.type.startsWith("image/");
  if (!isImage) {
    ElMessage.error("只能上传图片文件");
    return false;
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    ElMessage.error("图片大小不能超过 2MB");
    return false;
  }
  return true;
};

const avatarUpload = ref(null);
const uploadAvatar = async (param) => {
  const file = param.file;
  const res = await reqUploadFile(file);
  if (res.code === "200") {
    recommendForm.value.avatar = res.data.id;

    avatarUrl.value = await getAvatarUrl(res.data.id);

    ElMessage.success("头像上传成功");
  } else {
    ElMessage.error("头像上传失败");
  }
};

// 删除专家
const deleteexpert = async (id) => {
  try {
    console.log(id);
    await reqDeleteExpertById(id);
    ElMessage.success("删除成功");
    getExpertList();
  } catch (error) {
    ElMessage.error("删除失败");
    console.error(error);
  }
};

const editDialogVisible = ref(false);
// 编辑专家
const editEpertList = async (expert) => {
  isEditMode.value = true;
  resetForm();
  if (expert) {
    // 将选中的专家信息赋值到 recommendForm
    recommendForm.value = {
      id: expert.id,
      name: expert.name,
      products: [],
      profile: expert.profile,
      phone: expert.phone,
      email: expert.email,
      qq: expert.qq || "",
      weChat: expert.weChat || "",
      avatar: expert.avatar || "",
      field: expert.field || "",
      positions: expert.positions || "",
      certification: expert.certification || [],
    };

    // 获取相关文件信息
    try {
      // 获取 products 文件信息
      const productsWithFileInfo = await Promise.all(
        expert.products.map(async (productId) => {
          if (productId && productId !== "null") {
            const fileInfo = await reqGetFileInfo(productId);
            if (fileInfo) {
              return {
                id: fileInfo.data.id,
                name: fileInfo.data.fileName,
                status: fileInfo.data.status,
              };
            } else {
              return null;
            }
          } else {
            return null;
          }
        })
      );

      // 获取 certification 文件信息
      const certificationWithFileInfo = await Promise.all(
        expert.certification.map(async (certificationId) => {
          if (certificationId && certificationId !== "null") {
            const fileInfo = await reqGetFileInfo(certificationId);
            if (fileInfo) {
              return {
                id: fileInfo.data.id,
                name: fileInfo.data.fileName,
                status: fileInfo.data.status,
              };
            } else {
              return null;
            }
          } else {
            return null;
          }
        })
      );

      // 过滤掉无效的 certification 文件信息
      const validCertificationFiles = certificationWithFileInfo.filter(
        (file) => file !== null
      );

      // 过滤掉无效的 products 文件信息
      const validProductsFiles = productsWithFileInfo.filter(
        (file) => file !== null
      );
      // 更新
      recommendForm.value.certification = validCertificationFiles;
      recommendForm.value.products = validProductsFiles;

      // 获取头像
      avatarUrl.value = await getAvatarUrl(expert.avatar);
    } catch (error) {
      ElMessage.error("获取文件信息失败: " + error.message);
    }
  } else {
    // 如果没有传入专家信息，重置表单
    recommendForm.value = {
      id: "",
      name: "",
      products: [],
      profile: "",
      phone: "",
      email: "",
      qq: "",
      weChat: "",
      avatar: "",
      field: "",
      positions: "",
      certification: [],
    };
  }
  editDialogVisible.value = true;
};
//新增\修改专家信息逻辑
const editEpert = async () => {
  try {
    // 提取文件ID列表
    const productsIds = recommendForm.value.products.map((item) => item.id);
    const certificationIds = recommendForm.value.certification.map(
      (item) => item.id
    );

    // 构造请求数据
    const payload = {
      ...recommendForm.value,
      products: productsIds,
      certification: certificationIds,
    };

    // 根据模式选择API
    const apiHandler = isEditMode.value ? reqUpdateExpert : reqAddExpert;
    const successMessage = isEditMode.value ? "更新成功" : "添加成功";

    // 调用接口
    const response = await apiHandler(payload);

    if (response.code === "200") {
      ElMessage.success(successMessage);
      editDialogVisible.value = false;
      // 刷新列表并重置表单
      getExpertList();
      resetForm();
    } else {
      ElMessage.error(
        `${isEditMode.value ? "更新" : "添加"}失败: ${response.message}`
      );
    }
  } catch (error) {
    ElMessage.error(
      `${isEditMode.value ? "更新" : "添加"}失败: ${error.message}`
    );
    console.error("操作失败:", error);
  }
};

//著作上传文件
const productsUploadRef = ref();

const handleExceed = (files) => {
  ElMessage({
    type: "error",
    message: "超出最大限制",
  });
};

//著作的文件上传
const getProUploadFile = async (param) => {
  const file = param.file;

  const res = await reqUploadFile(file);
  if (res.code == "200") {
    recommendForm.value.products.push({
      id: res.data.id,
      name: file.name,
    });
    param.onSuccess({
      uid: res.data.id,
      name: file.name,
      status: 1,
    });
    ElMessage({
      type: "success",
      message: "上传著作文件成功",
    });
  }
};
const handleProRemove = (file) => {
  const fileId = file.uid;

  const index = recommendForm.value.products.findIndex(
    (item) => item.id === fileId
  );

  if (index !== -1) {
    recommendForm.value.products.splice(index, 1);
    ElMessage.success("文件移除成功");
  }
};
//资质文件处理
const handleCerUploadSuccess = () => {};
const getCerUploadFile = async (param) => {
  const file = param.file;
  const res = await reqUploadFile(file);
  if (res.code == "200") {
    recommendForm.value.certification.push({
      id: res.data.id,
      uid: file.uid,
      name: file.name,
    });
    param.onSuccess({
      uid: file.uid,
      id: res.data.id,
      name: file.name,
      status: 1,
    });
    ElMessage({
      type: "success",
      message: "上传资质文件成功",
    });
  }
};

const handleCerRemove = (file) => {
  const fileId = file.id;
  const index = recommendForm.value.certification.findIndex(
    (item) => item.id === fileId
  );
  if (index !== -1) {
    recommendForm.value.certification.splice(index, 1);
    ElMessage.success("资质文件移除成功");
  }
};
// 修改提交审核的方法
const submitAudit = async () => {
  if (!auditFormRef.value) return;

  try {
    await auditFormRef.value.validate();

    // 构造请求参数，根据操作类型使用不同字段
    const params = {
      ...currentExpert.value,
      applyStatus:
        currentExpert.value.applyStatus === 0 ? auditForm.value.status : 3,
      ...(currentExpert.value.applyStatus === 0
        ? { reason: auditForm.value.reason }
        : { remark: auditForm.value.reason }),
    };

    const res = await reqUpdateExpert(params);

    if (res.code === "200") {
      ElMessage.success(
        currentExpert.value.applyStatus === 0
          ? auditForm.value.status === 1
            ? "审核通过成功"
            : "审核拒绝成功"
          : "作废成功"
      );
      auditDialogVisible.value = false;
      getExpertList();
    } else {
      ElMessage.error("操作失败");
    }
  } catch (error) {
    console.error("操作失败:", error);
    ElMessage.error("操作失败");
  }
};

onMounted(() => {
  getExpertList();
});
</script>

<style scoped lang="scss">
.container {
  padding: 1% 2%;
}
.pagination {
  margin-top: 20px;
  justify-content: center;
}

.option-form {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

// 头像相关样式
.avatar-container {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;

  .remove-avatar-button {
    position: absolute;
    top: 5px;
    right: 5px;
    background-color: rgba(0, 0, 0, 0.5);
    color: #fff;
  }
}

.avatar-placeholder__addAvatar {
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #dcdfe6;
}

// 文件列表样式
.file-list {
  margin-bottom: 16px;

  .file-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px;

    &:hover {
      background: #f5f7fa;
    }

    .file-name {
      max-width: 300px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}

// 详情弹窗样式
.expert-detail-container {
  padding: 20px;
}

.expert-detail__avatar-img {
  width: 180px;
  height: 220px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #dcdfe6;
}

.expert-detail__name {
  font-size: 20px;
  font-weight: 600;
  margin-top: 15px;
}
</style>
