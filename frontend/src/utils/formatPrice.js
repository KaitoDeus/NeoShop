/**
 * Format giá tiền sang VNĐ
 * @param {number} price - Giá USD hoặc VNĐ
 * @param {boolean} fromUSD - Nếu true, chuyển từ USD sang VNĐ (x 25,000)
 * @returns {string} - Giá format VNĐ (ví dụ: 159.000đ)
 */
export const formatPriceVND = (price, fromUSD = true) => {
  const priceVND = fromUSD ? Math.round(price * 25000) : price;
  return priceVND.toLocaleString('vi-VN') + 'đ';
};

/**
 * Format giá tiền sang VNĐ với dấu chấm phân cách nghìn
 * @param {number} price - Giá USD
 * @returns {string} - Giá format VNĐ (ví dụ: 159.000đ)
 */
export const formatUSDtoVND = (price) => {
  if (price === null || price === undefined) return '0đ';
  // Ngưỡng 2000: Nếu giá < 2000 -> USD (x 25,000). Giá game thường < 100$
  //, nhưng phần mềm doanh nghiệp có thể cao hơn. 2000$ = 50tr VND.
  const isUSD = price < 2000;
  const priceVND = isUSD ? Math.round(price * 25000) : Math.round(price);
  return priceVND.toLocaleString('vi-VN') + 'đ';
};
