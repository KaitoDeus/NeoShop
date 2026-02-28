/**
 * Utility functions để format ngày giờ theo múi giờ Việt Nam (GMT+7)
 * Sử dụng timeZone: "Asia/Ho_Chi_Minh" trong mọi hàm format
 */

const VN_TIMEZONE = "Asia/Ho_Chi_Minh";

/**
 * Format datetime thành chuỗi ngày: "28/02/2026"
 * @param {string|Date} dateStr
 * @returns {string}
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: VN_TIMEZONE,
  });
};

/**
 * Format datetime thành chuỗi giờ: "19:13:20"
 * @param {string|Date} dateStr
 * @returns {string}
 */
export const formatTime = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: VN_TIMEZONE,
  });
};

/**
 * Format datetime thành chuỗi ngày + giờ: "28/02/2026 19:13:20"
 * @param {string|Date} dateStr
 * @returns {string}
 */
export const formatDateTime = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: VN_TIMEZONE,
  });
};

/**
 * Format datetime ngắn gọn (không giây): "28/02/2026 19:13"
 * @param {string|Date} dateStr
 * @returns {string}
 */
export const formatDateTimeShort = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: VN_TIMEZONE,
  });
};
