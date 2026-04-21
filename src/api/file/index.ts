import request from "@/utils/request";

export interface ImageUploadResultVO {
  id: number;
  fileUrl: string;
  fileName?: string;
  fileSize?: number;
}

export interface ImageVO {
  id: number;
  fileName?: string;
  fileUrl: string;
  fileSize?: number;
  mimeType?: string;
  fileSuffix?: string;
  bizType?: string;
  bizId?: number;
  createdAt?: string;
}

enum API {
  DOWNLOAD_URL = "/image/download/",
  DOWNLOAD_BYID_URL = "/image/download/byId",
  UPLOAD_URL = "/image/upload",
  GET_URL = "/image",
}

export function reqUploadFile(
  file: File,
  options?: {
    bizType?: string;
    bizId?: number;
  },
) {
  const formData = new FormData();
  formData.append("file", file);

  return request({
    url: API.UPLOAD_URL,
    method: "post",
    data: formData,
    params: options,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }).then((res: any) => ({
    ...res,
    data: res?.data?.fileUrl || res?.data,
    rawData: res?.data,
  }));
}

export function reqDownloadFile(id: number) {
  return request({
    url: `${API.DOWNLOAD_URL}${id}`,
    method: "get",
    responseType: "blob",
  });
}

export function reqDownloadFileById(id: number) {
  return request({
    url: `${API.DOWNLOAD_BYID_URL}/${id}`,
    method: "get",
    responseType: "blob",
  });
}

export function reqGetFileInfo(id: number) {
  return request({
    url: `${API.GET_URL}/${id}`,
    method: "get",
  });
}
