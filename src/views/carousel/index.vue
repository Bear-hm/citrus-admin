<template>
  <div class="container">
    <el-upload
      class="upload-demo"
      action="#"
      list-type="picture-card"
      :auto-upload="true"
      :file-list="fileList"
      :accept="'image/*'"
      :on-change="handleFileChange"
      :http-request="uploadFile"
      :on-remove="handleRemove"
      :before-upload="beforeImageUpload"
      :on-preview="handlePictureCardPreview"
    >
      <el-icon><Plus /></el-icon>
      <template #file="{ file }">
        <div>
          <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
          <span class="el-upload-list__item-actions">
            <span
              class="el-upload-list__item-preview"
              @click="handlePictureCardPreview(file)"
            >
              <el-icon><ZoomIn /></el-icon>
            </span>
            <span
              class="el-upload-list__item-delete"
              @click="handleRemove(file)"
            >
              <el-icon><Delete /></el-icon>
            </span>
          </span>
        </div>
      </template>
    </el-upload>

    <!-- 图片预览对话框 -->
    <el-dialog v-model="dialogVisible" append-to-body>
      <template #header>
        <el-button type="primary" @click="downloadImg"> 下载 </el-button>
      </template>
      <div class="preview-container">
        <img w-full :src="dialogImageUrl" alt="Preview Image" />
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
// TODO:简化变量，没必要这么多变量
import { ref, onMounted } from "vue";
import { Plus, ZoomIn, Delete } from "@element-plus/icons-vue";
import { reqDownloadFileById, reqUploadFile } from "@/api/file/index";
import {
  reqGetCarouselPage,
  reqSaveCarousel,
  reqDeleteCarouselById,
} from "@/api/carousel/index";
import { ElMessage } from "element-plus";

const imgIdList = ref([]);
const fileList = ref([]);
const dialogImageUrl = ref("");
const dialogVisible = ref(false);
//当前预览图片的id信息
const currentPreviewId = ref(null);

//在本地根据id获取图片信息
const getImageInLocal = async (id) => {
  if (!id) return;
  try {
    const blob = await reqDownloadFileById(id);
    return URL.createObjectURL(blob);
  } catch (error) {
    ElMessage.error(`下载图片失败${error}`);
    return;
  }
};
// 获取轮播图列表
const getData = async () => {
  const res = await reqGetCarouselPage({
    pageNum: 1,
    pageSize: 10,
  });

  if (res.code == "200") {
    imgIdList.value = res.data.list;
    // console.log("轮播图列表", res.data.list);

    const imagePromises = res.data.list.map(async (item) => {
      const imageUrl = await getImageInLocal(item.images);
      return {
        name: "轮播图",
        url: imageUrl,
        id: item.id,
        images: item.images,
      };
    });
    const images = await Promise.all(imagePromises);
    // console.log("图片列表", images);
    fileList.value = images.filter((item) => item.url !== null);
  }
};

// 文件上传前验证
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

// 文件改变时的处理
const handleFileChange = (uploadFile) => {
  // fileList.value = [
  //   {
  //     url: uploadFile.url,
  //     name: uploadFile.name,
  //     raw: uploadFile.raw,
  //   },
  // ];
};

// 移除文件
const handleRemove = async (uploadFile) => {
  try {
    const res = await reqDeleteCarouselById(uploadFile.id);
    if (res.code === "200") {
      ElMessage.success("移除轮播图成功");
      fileList.value = fileList.value.filter(
        (file) => file.id !== uploadFile.id
      );
    } else {
      ElMessage.error("移除轮播图失败");
    }
  } catch (error) {
    ElMessage.error(`移除轮播图成功: ${error}`);
  }
};

// 预览图片
const handlePictureCardPreview = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url;
  dialogVisible.value = true;
  // console.log("预览图数据", uploadFile);
  currentPreviewId.value = uploadFile.images;
};

// 上传文件到服务器
const uploadFile = async (file) => {
  // console.log("上传文件到服务器", file);
  try {
    const res = await reqUploadFile(file.file);
    if (res.code === "200") {
      ElMessage.success("文件上传成功");
      await saveCarousel(res.data.id);
      return;
    } else {
      ElMessage.error("文件上传失败");
      return;
    }
  } catch (error) {
    ElMessage.error("文件上传失败");
    return;
  }
};
// 保存轮播图
const saveCarousel = async (fileId) => {
  if (!fileId) {
    ElMessage.warning("文件ID不能为空");
    return;
  }
  try {
    const carouselData = {
      images: fileId,
      sort: fileList.value.length + 1,
      status: 1,
    };

    const res = await reqSaveCarousel(carouselData);
    if (res.code === "200") {
      ElMessage.success("轮播图保存成功");
      // 重新获取轮播图列表
      await getData();
    } else {
      ElMessage.error("轮播图保存失败");
    }
  } catch (error) {
    ElMessage.error(`轮播图保存失败: ${error}`);
  }
};
// TODO:轮播图名字
const downloadImg = async () => {
  //下载图片
  try {
    if (!currentPreviewId.value) {
      ElMessage.warning("无法获取图片信息");
      return;
    }
    const blob = await reqDownloadFileById(currentPreviewId.value);
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `${currentPreviewId.value}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(downloadUrl);

    ElMessage.success("下载成功");
  } catch (error) {
    ElMessage.error("下载失败");
  }
};
onMounted(() => {
  getData();
});
</script>

<style scoped>
.container {
  padding: 20px;
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
