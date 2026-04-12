/*
 * @Author: xiong x1253780359@outlook.com
 * @Date: 2025-10-10 08:42:06
 * @LastEditors: xiong x1253780359@outlook.com
 * @LastEditTime: 2026-04-12 16:26:52
 * @FilePath: \citrus\citrus-admin\src\api\file\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
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
