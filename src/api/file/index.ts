// 上传/下载文件
import request from "@/utils/request";
enum API {
  DOWNLOAD_URL = "/download/",
  DOWNLOAD_BYID_URL = "/download/byId",
  UPLOAD_URL = "/upload",
  GET_URL = '/attachment'
}

/**
 * 文件上传
 * @param file
 * @returns
 */
export function reqUploadFile(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return request({
    url: API.UPLOAD_URL,
    method: "post",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

/**
 * 下载文件
 * @param eId
 * @returns
 */
export function reqDownloadFile(eId: number) {
  return request({
    url: `${API.DOWNLOAD_URL}/${eId}`,
    method: "get",
    responseType: "blob",
  });
}

/**
 * 根据id下载文件
 * @param id
 * @returns
 */
export function reqDownloadFileById(id: number) {
  return request({
    url: `${API.DOWNLOAD_BYID_URL}/${id}`,
    method: "get",
    responseType: "blob",
  });
}
/**
* 根据id获取文件相关信息
* @param id 
* @returns 
*/
export function reqGetFileInfo(id: number) {
  return request({
    url: `${API.GET_URL}/${id}`,
    method: 'get',
  })
}
