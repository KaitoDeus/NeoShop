export const MOCK_PRODUCTS = [
  // === TRÒ CHƠI ===
  {
    id: 1,
    title: "Cyberpunk 2077: Phantom Liberty",
    desc: "Trở lại những con phố rực rỡ ánh đèn neon của Night City trong bản mở rộng gián điệp gay cấn này.",
    price: 14.99,
    oldPrice: 29.99,
    discount: "-50%",
    imageColor: "linear-gradient(135deg, #1e1b4b, #312e81)",
    tag: "Global Key",
    platform: "steam",
    category: "games",
    features: ["instant"],
    date: "2023-09-26",
    sales: 1250
  },
  {
    id: 2,
    title: "Elden Ring: Shadow of the Erdtree",
    desc: "Game nhập vai hành động đặt trong bối cảnh giả tưởng đen tối do Hidetaka Miyazaki tạo ra.",
    price: 44.99,
    oldPrice: 59.99,
    discount: "-25%",
    imageColor: "linear-gradient(135deg, #451a03, #78350f)",
    tag: "Giao ngay",
    platform: "steam",
    category: "games",
    features: ["instant"],
    date: "2024-06-21",
    sales: 2100
  },
  {
    id: 3,
    title: "Baldur's Gate 3: Deluxe Edition",
    desc: "Tập hợp nhóm của bạn và quay trở lại Forgotten Realms trong RPG hoành tráng.",
    price: 59.99,
    oldPrice: null,
    imageColor: "linear-gradient(135deg, #4c0519, #881337)",
    tag: "Mới nhất",
    platform: "steam",
    category: "games",
    features: ["instant"],
    date: "2023-08-03",
    sales: 1800
  },
  {
    id: 4,
    title: "God of War Ragnarök",
    desc: "Bắt đầu chuyến hành trình hoành tráng và đầy cảm xúc khi Kratos và Atreus đấu tranh.",
    price: 49.99,
    oldPrice: 69.99,
    discount: "-29%",
    imageColor: "linear-gradient(135deg, #0c4a6e, #0369a1)",
    tag: "Giao ngay",
    platform: "steam",
    category: "games",
    features: ["instant"],
    date: "2022-11-09",
    sales: 1650
  },
  {
    id: 5,
    title: "Red Dead Redemption 2",
    desc: "Câu chuyện sử thi về cuộc sống ở miền Tây nước Mỹ trong thời kỳ cuối của thời đại ngoài vòng pháp luật.",
    price: 29.99,
    oldPrice: 59.99,
    discount: "-50%",
    imageColor: "linear-gradient(135deg, #7c2d12, #c2410c)",
    tag: "Best Seller",
    platform: "steam",
    category: "games",
    features: ["instant"],
    date: "2019-12-05",
    sales: 3200
  },
  {
    id: 6,
    title: "Hogwarts Legacy",
    desc: "Trải nghiệm thế giới phép thuật Harry Potter với vai trò là một học sinh Hogwarts.",
    price: 39.99,
    oldPrice: 59.99,
    discount: "-33%",
    imageColor: "linear-gradient(135deg, #1e3a5f, #3b82f6)",
    tag: "Hot",
    platform: "steam",
    category: "games",
    features: ["instant"],
    date: "2023-02-10",
    sales: 2800
  },

  // === GÓI ĐĂNG KÝ ===
  {
    id: 7,
    title: "Xbox Game Pass Ultimate - 3 Tháng",
    desc: "Chơi hàng trăm trò chơi chất lượng cao trên console, PC và đám mây.",
    price: 24.99,
    oldPrice: null,
    imageColor: "linear-gradient(135deg, #064e3b, #065f46)",
    tag: "Gói đăng ký",
    platform: "xbox",
    category: "subscription",
    features: ["subscription", "instant"],
    date: "2024-01-01",
    sales: 950
  },
  {
    id: 8,
    title: "PlayStation Plus 12 Tháng",
    desc: "Nâng cao trải nghiệm PlayStation với chế độ nhiều người chơi trực tuyến.",
    price: 59.99,
    oldPrice: null,
    imageColor: "linear-gradient(135deg, #003087, #0070d1)",
    tag: "Gói đăng ký",
    platform: "psn",
    category: "subscription",
    features: ["subscription"],
    date: "2024-03-01",
    sales: 780
  },
  {
    id: 9,
    title: "Netflix Premium 6 Tháng",
    desc: "Xem phim và series không giới hạn với chất lượng 4K HDR trên mọi thiết bị.",
    price: 45.00,
    oldPrice: 89.99,
    discount: "-50%",
    imageColor: "linear-gradient(135deg, #7f1d1d, #dc2626)",
    tag: "Hot Deal",
    platform: "other",
    category: "entertainment",
    features: ["subscription", "instant"],
    date: "2024-01-15",
    sales: 1450
  },
  {
    id: 10,
    title: "Spotify Premium 1 Năm",
    desc: "Nghe nhạc không quảng cáo, tải offline và chất lượng cao nhất.",
    price: 35.00,
    oldPrice: 59.99,
    discount: "-42%",
    imageColor: "linear-gradient(135deg, #15803d, #22c55e)",
    tag: "Best Seller",
    platform: "other",
    category: "entertainment",
    features: ["subscription", "instant"],
    date: "2024-02-01",
    sales: 2200
  },

  // === PHẦN MỀM - AI ===
  {
    id: 11,
    title: "ChatGPT Plus 1 Tháng",
    desc: "Truy cập GPT-4, Plugins và tính năng cao cấp của OpenAI ChatGPT.",
    price: 20.00,
    oldPrice: null,
    imageColor: "linear-gradient(135deg, #059669, #10b981)",
    tag: "AI Hot",
    platform: "other",
    category: "ai",
    features: ["subscription", "instant"],
    date: "2024-01-10",
    sales: 3500
  },
  {
    id: 12,
    title: "Midjourney Standard 1 Tháng",
    desc: "Tạo hình ảnh AI chất lượng cao với Midjourney - công cụ AI art hàng đầu.",
    price: 30.00,
    oldPrice: null,
    imageColor: "linear-gradient(135deg, #7c3aed, #a78bfa)",
    tag: "AI",
    platform: "other",
    category: "ai",
    features: ["subscription", "instant"],
    date: "2024-01-20",
    sales: 1800
  },
  {
    id: 13,
    title: "GitHub Copilot 1 Năm",
    desc: "AI pair programmer giúp bạn code nhanh hơn với gợi ý thông minh.",
    price: 100.00,
    oldPrice: 119.99,
    discount: "-17%",
    imageColor: "linear-gradient(135deg, #1f2937, #374151)",
    tag: "Dev Tool",
    platform: "other",
    category: "ai",
    features: ["subscription", "instant"],
    date: "2024-02-15",
    sales: 1200
  },

  // === PHẦN MỀM - VĂN PHÒNG ===
  {
    id: 14,
    title: "Microsoft Office 365 1 Năm",
    desc: "Bộ ứng dụng văn phòng hoàn chỉnh: Word, Excel, PowerPoint, Outlook và OneDrive 1TB.",
    price: 69.99,
    oldPrice: 99.99,
    discount: "-30%",
    imageColor: "linear-gradient(135deg, #ea580c, #f97316)",
    tag: "Office",
    platform: "other",
    category: "office",
    features: ["subscription", "instant"],
    date: "2024-01-05",
    sales: 4200
  },
  {
    id: 15,
    title: "Adobe Creative Cloud 1 Năm",
    desc: "Sở hữu trọn bộ hơn 20 ứng dụng sáng tạo: Photoshop, Illustrator, Premiere Pro...",
    price: 349.00,
    oldPrice: 599.99,
    discount: "-42%",
    imageColor: "linear-gradient(135deg, #701a75, #a21caf)",
    tag: "US Region",
    platform: "other",
    category: "office",
    features: ["subscription"],
    date: "2024-02-15",
    sales: 890
  },
  {
    id: 16,
    title: "Canva Pro 1 Năm",
    desc: "Thiết kế đồ họa chuyên nghiệp dễ dàng với hàng triệu template và tài nguyên.",
    price: 55.00,
    oldPrice: 119.99,
    discount: "-54%",
    imageColor: "linear-gradient(135deg, #0891b2, #22d3ee)",
    tag: "Design",
    platform: "other",
    category: "office",
    features: ["subscription", "instant"],
    date: "2024-03-01",
    sales: 1650
  },

  // === PHẦN MỀM - HỆ ĐIỀU HÀNH ===
  {
    id: 17,
    title: "Windows 11 Pro Key",
    desc: "Hệ điều hành Windows 11 Pro chính hãng với đầy đủ tính năng bảo mật.",
    price: 25.00,
    oldPrice: 199.99,
    discount: "-87%",
    imageColor: "linear-gradient(135deg, #0284c7, #38bdf8)",
    tag: "Best Seller",
    platform: "other",
    category: "os",
    features: ["instant"],
    date: "2024-01-01",
    sales: 5600
  },
  {
    id: 18,
    title: "Windows 10 Pro Key",
    desc: "Key kích hoạt Windows 10 Pro vĩnh viễn, hỗ trợ cài đặt miễn phí.",
    price: 15.00,
    oldPrice: 139.99,
    discount: "-89%",
    imageColor: "linear-gradient(135deg, #1d4ed8, #3b82f6)",
    tag: "Hot",
    platform: "other",
    category: "os",
    features: ["instant"],
    date: "2024-01-01",
    sales: 4800
  },

  // === HỌC TẬP ===
  {
    id: 19,
    title: "Coursera Plus 1 Năm",
    desc: "Truy cập không giới hạn hơn 7000+ khóa học từ các trường đại học hàng đầu.",
    price: 199.00,
    oldPrice: 399.99,
    discount: "-50%",
    imageColor: "linear-gradient(135deg, #0369a1, #0ea5e9)",
    tag: "Learning",
    platform: "other",
    category: "learning",
    features: ["subscription", "instant"],
    date: "2024-02-20",
    sales: 720
  },
  {
    id: 20,
    title: "Duolingo Plus 1 Năm",
    desc: "Học ngoại ngữ hiệu quả với Duolingo Plus - không quảng cáo, học offline.",
    price: 45.00,
    oldPrice: 83.99,
    discount: "-46%",
    imageColor: "linear-gradient(135deg, #65a30d, #84cc16)",
    tag: "Learning",
    platform: "other",
    category: "learning",
    features: ["subscription", "instant"],
    date: "2024-03-10",
    sales: 980
  }
];

// Từ khóa xu hướng cho trang chủ
export const TRENDING_KEYWORDS = [
  { id: 1, keyword: "ChatGPT", icon: "🤖", count: 2450 },
  { id: 2, keyword: "Windows 11", icon: "🪟", count: 1820 },
  { id: 3, keyword: "Steam Game", icon: "🎮", count: 1650 },
  { id: 4, keyword: "Netflix", icon: "📺", count: 1420 },
  { id: 5, keyword: "Office 365", icon: "📊", count: 1380 },
  { id: 6, keyword: "Spotify", icon: "🎵", count: 1250 },
  { id: 7, keyword: "Adobe", icon: "🎨", count: 980 },
  { id: 8, keyword: "Midjourney", icon: "🖼️", count: 890 },
  { id: 9, keyword: "Game Pass", icon: "🎯", count: 750 },
  { id: 10, keyword: "Canva Pro", icon: "✨", count: 680 }
];

// Định nghĩa danh mục
export const CATEGORIES = {
  games: { name: "Games", icon: "🎮" },
  ai: { name: "Sản phẩm AI", icon: "🤖" },
  office: { name: "Làm việc", icon: "💼" },
  entertainment: { name: "Giải trí", icon: "🎬" },
  learning: { name: "Học tập", icon: "📚" },
  os: { name: "Hệ điều hành", icon: "🖥️" },
  subscription: { name: "Gói đăng ký", icon: "🔄" }
};

// Lấy sản phẩm theo danh mục
export const getProductsByCategory = (category) => {
  return MOCK_PRODUCTS.filter(p => p.category === category);
};

// Lấy sản phẩm bán chạy nhất
export const getBestSellers = (limit = 6) => {
  return [...MOCK_PRODUCTS].sort((a, b) => b.sales - a.sales).slice(0, limit);
};

// Lấy sản phẩm mới nhất
export const getNewestProducts = (limit = 6) => {
  return [...MOCK_PRODUCTS].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, limit);
};

// Lấy game Steam
export const getSteamGames = (limit = 6) => {
  return MOCK_PRODUCTS.filter(p => p.platform === 'steam').slice(0, limit);
};

// Lấy sản phẩm AI
export const getAIProducts = (limit = 6) => {
  return MOCK_PRODUCTS.filter(p => p.category === 'ai').slice(0, limit);
};
