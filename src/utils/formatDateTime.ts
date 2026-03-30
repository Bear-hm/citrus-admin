export function formatDateTime(dateTimeStr: any) {
  if (!dateTimeStr) return "";

  try {
    const date = new Date(dateTimeStr);

    // 检查日期是否有效
    if (isNaN(date.getTime())) {
      return dateTimeStr;
    }

    // 格式化为 YYYY-MM-DD HH:MM:SS
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  } catch (error) {
    console.error("日期格式化错误:", error);
    return dateTimeStr;
  }
}
