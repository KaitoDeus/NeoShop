/**
 * Format giá tiền sang VNĐ
 * @param {number} price - Giá VNĐ
 * @param {boolean} fromUSD - Backwards compatibility
 * @returns {string} - Giá format VNĐ (ví dụ: 159.000đ)
 */
export const formatPriceVND = (price, fromUSD = false) => {
  if (price === null || price === undefined) return '0đ';
  const priceVND = Math.round(price);
  return priceVND.toLocaleString('vi-VN') + 'đ';
};

/**
 * Format giá tiền sang VNĐ với dấu chấm phân cách nghìn
 * @param {number} price - Giá VNĐ
 * @returns {string} - Giá format VNĐ (ví dụ: 159.000đ)
 */
export const formatUSDtoVND = (price) => {
  if (price === null || price === undefined) return '0đ';
  const priceVND = Math.round(price);
  return priceVND.toLocaleString('vi-VN') + 'đ';
};
