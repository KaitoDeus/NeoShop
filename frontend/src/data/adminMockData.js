export const statsData = [
  {
    id: 1,
    title: "Doanh thu hôm nay",
    value: "5.200.000 đ",
    percent: 12,
    isIncrease: true,
    compareText: "so với hôm qua",
    iconType: "money"
  },
  {
    id: 2,
    title: "Đơn hàng mới",
    value: "15",
    percent: 5,
    isIncrease: true,
    compareText: "so với hôm qua",
    iconType: "bag"
  },
  {
    id: 3,
    title: "Key còn lại",
    value: "432",
    percent: 2.4,
    isIncrease: false,
    compareText: "so với tuần trước",
    iconType: "key"
  },
  {
    id: 4,
    title: "Người dùng mới",
    value: "8",
    percent: 2,
    isIncrease: true,
    compareText: "so với hôm qua",
    iconType: "user"
  }
];

export const revenueData = [
  { name: 'Thứ 2', value: 4000000 },
  { name: 'Thứ 3', value: 3000000 },
  { name: 'Thứ 4', value: 2000000 },
  { name: 'Thứ 5', value: 2780000 },
  { name: 'Thứ 6', value: 1890000 },
  { name: 'Thứ 7', value: 2390000 },
  { name: 'CN', value: 3490000 },
];

export const recentOrders = [
  {
    id: "#1024",
    customer: {
      name: "Nguyễn Văn A",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d"
    },
    product: "Netflix Premium (1 Tháng)",
    date: "20/10/2023",
    status: "success",
    total: "90.000 đ"
  },
  {
    id: "#1023",
    customer: {
      name: "Trần Minh",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d"
    },
    product: "Spotify Premium (1 Năm)",
    date: "20/10/2023",
    status: "processing",
    total: "350.000 đ"
  },
  {
    id: "#1022",
    customer: {
      name: "Lê Thị B",
      avatar: "https://i.pravatar.cc/150?u=a04258114e29026302d"
    },
    product: "Windows 11 Pro Key",
    date: "19/10/2023",
    status: "failed",
    total: "150.000 đ"
  },
  {
    id: "#1021",
    customer: {
      name: "Phạm Văn C",
      avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d"
    },
    product: "Adobe Creative Cloud",
    date: "19/10/2023",
    status: "success",
    total: "1.200.000 đ"
  },
  {
    id: "#1020",
    customer: {
      name: "Hoàng T",
      avatar: "https://i.pravatar.cc/150?u=a04258114e29026708c"
    },
    product: "Youtube Premium",
    date: "18/10/2023",
    status: "success",
    total: "45.000 đ"
  }
];

export const productStats = [
  {
    id: 1,
    title: "Tổng sản phẩm",
    value: "1,240",
    percent: 12,
    isIncrease: true,
    compareText: "so với tháng trước",
    iconType: "box"
  },
  {
    id: 2,
    title: "Đang bán",
    value: "980",
    percent: 5,
    isIncrease: true,
    compareText: "",
    iconType: "check"
  },
  {
    id: 3,
    title: "Hết kho key",
    value: "24",
    percent: -2,
    isIncrease: false,
    compareText: "sản phẩm",
    iconType: "alert"
  },
  {
    id: 4,
    title: "Doanh thu tháng",
    value: "450tr",
    percent: 15,
    isIncrease: true,
    compareText: "",
    iconType: "trend"
  }
];

export const productsData = [
  {
    id: 1,
    name: "Tài khoản Netflix Premium",
    sku: "NF-PRE-01",
    category: "Tài khoản",
    price: "69.000 đ",
    stock: 15,
    status: "active",
    image: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg"
  },
  {
    id: 2,
    name: "Elden Ring Steam Key Global",
    sku: "ER-STEAM-GL",
    category: "Game",
    price: "890.000 đ",
    stock: 2,
    status: "active",
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1245620/header.jpg"
  },
  {
    id: 3,
    name: "Windows 11 Pro Retail Key",
    sku: "WIN11-PRO-01",
    category: "Phần mềm",
    price: "150.000 đ",
    stock: 0,
    status: "hidden",
    image: "https://upload.wikimedia.org/wikipedia/commons/e/e6/Windows_11_logo.svg"
  },
  {
    id: 4,
    name: "Spotify Premium 1 Năm",
    sku: "SPOT-1Y-UPG",
    category: "Tài khoản",
    price: "290.000 đ",
    stock: 45,
    status: "active",
    image: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg"
  },
  {
    id: 5,
    name: "Office 365 Family Key",
    sku: "OFF-365-FAM",
    category: "Phần mềm",
    price: "990.000 đ",
    stock: 12,
    status: "active",
    image: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Microsoft_Office_logo_%282019%E2%80%93present%29.svg"
  }
];

export const orderStats = [
  {
    id: 1,
    title: "Tổng đơn hàng",
    value: "1,240",
    percent: 12,
    isIncrease: true,
    compareText: "so với tháng trước",
    iconType: "file-text"
  },
  {
    id: 2,
    title: "Doanh thu tháng",
    value: "350.000.000 đ",
    percent: 5,
    isIncrease: true,
    compareText: "so với tháng trước",
    iconType: "money"
  },
  {
    id: 3,
    title: "Chờ xử lý (Key lỗi)",
    value: "12",
    percent: -2,
    isIncrease: false,
    compareText: "so với tháng trước",
    iconType: "alert"
  }
];

export const ordersData = [
  {
    id: "#NEO-8823",
    product: "Windows 11 Pro Key",
    customer: "Trần Văn Bảo",
    total: "290.000 đ",
    payment: "Momo",
    status: "success",
    date: "24/10/2023",
    time: "10:30 AM"
  },
  {
    id: "#NEO-8822",
    product: "Netflix Premium (1 Năm)",
    customer: "Nguyễn Thị Lan",
    total: "850.000 đ",
    payment: "Bank",
    status: "pending",
    date: "24/10/2023",
    time: "09:15 AM"
  },
  {
    id: "#NEO-8821",
    product: "Adobe Creative Cloud",
    customer: "Lê Minh Khôi",
    total: "1.500.000 đ",
    payment: "Momo",
    status: "failed",
    date: "23/10/2023",
    time: "18:45 PM"
  },
  {
    id: "#NEO-8820",
    product: "Spotify Premium (3 Tháng)",
    customer: "Phạm Hoàng Anh",
    total: "180.000 đ",
    payment: "Visa",
    status: "success",
    date: "23/10/2023",
    time: "14:20 PM"
  },
  {
    id: "#NEO-8819",
    product: "Office 365 Personal",
    customer: "Vũ Thị Mai",
    total: "990.000 đ",
    payment: "Bank",
    status: "success",
    date: "22/10/2023",
    time: "08:10 AM"
  }
];

export const reportStats = [
  {
    id: 1,
    title: "Tổng Doanh Thu",
    value: "2.450.000.000 đ",
    percent: 12.5,
    isIncrease: true,
    compareText: "",
    iconType: "money"
  },
  {
    id: 2,
    title: "Đơn Hàng Mới",
    value: "1,250",
    percent: 5.2,
    isIncrease: true,
    compareText: "",
    iconType: "bag"
  },
  {
    id: 3,
    title: "Khách Hàng Mới",
    value: "340",
    percent: -2.1,
    isIncrease: false,
    compareText: "",
    iconType: "user-add"
  },
  {
    id: 4,
    title: "Sản Phẩm Đã Bán",
    value: "5,600",
    percent: 8.4,
    isIncrease: true,
    compareText: "",
    iconType: "box"
  }
];

export const categoryRevenue = [
  { name: 'Khóa học Online', value: 40, color: '#312e81' }, // indigo-900
  { name: 'E-books', value: 25, color: '#4f46e5' }, // indigo-600
  { name: 'Templates', value: 20, color: '#818cf8' }, // indigo-400
  { name: 'Software', value: 15, color: '#c7d2fe' }, // indigo-200
];

export const topProducts = [
  { name: 'NeoShop Bundle 2023', sold: 1200, percent: 100 },
  { name: 'React Course Pro', sold: 980, percent: 80 },
  { name: 'UI Kit Premium', sold: 750, percent: 60 },
  { name: 'Icon Set Ultimate', sold: 540, percent: 45 },
  { name: 'Figma Masterclass', sold: 320, percent: 25 },
];

export const financialData = [
  { month: 'Tháng 1', revenue: '500tr', expense: '200tr', profit: '300tr', orders: 450, status: 'completed' },
  { month: 'Tháng 2', revenue: '450tr', expense: '180tr', profit: '270tr', orders: 420, status: 'completed' },
  { month: 'Tháng 3', revenue: '600tr', expense: '250tr', profit: '350tr', orders: 550, status: 'completed' },
  { month: 'Tháng 4', revenue: '550tr', expense: '220tr', profit: '330tr', orders: 500, status: 'pending' },
];

export const keyStats = [
  {
    id: 1,
    title: "Tổng số Key",
    value: "12,450",
    percent: 12,
    isIncrease: true,
    compareText: "so với tháng trước",
    iconType: "grid"
  },
  {
    id: 2,
    title: "Tồn kho (Chưa bán)",
    value: "4,200",
    percent: 0,
    isIncrease: true,
    compareText: "Sẵn sàng để bán ngay",
    iconType: "check-square"
  },
  {
    id: 3,
    title: "Đã bán",
    value: "8,250",
    percent: 18,
    isIncrease: true,
    compareText: "doanh thu",
    iconType: "shopping-bag"
  }
];

export const keysData = [
  {
    id: "#1024",
    product: "Spotify Premium 1 Năm",
    type: "Gói cá nhân",
    key: "xxxx-xxxx-xxxx-A1B2",
    date: "24/10/2023",
    time: "10:30",
    status: "available",
    image: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg"
  },
  {
    id: "#1023",
    product: "Netflix Premium 4K",
    type: "Slot dùng chung",
    key: "nf_user_882...",
    date: "23/10/2023",
    time: "14:15",
    status: "sold",
    image: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg"
  },
  {
    id: "#1022",
    product: "Windows 11 Pro Retail",
    type: "Key kích hoạt vĩnh viễn",
    key: "VK7JG-NPHTM-C97JM...",
    date: "22/10/2023",
    time: "09:00",
    status: "available",
    image: "https://upload.wikimedia.org/wikipedia/commons/e/e6/Windows_11_logo.svg"
  },
  {
    id: "#1021",
    product: "Adobe Creative Cloud",
    type: "Full App 1 Năm",
    key: "adobe_vipvip@gmai...",
    date: "21/10/2023",
    time: "16:45",
    status: "sold",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Adobe_Creative_Cloud_2020_icon.svg/1200px-Adobe_Creative_Cloud_2020_icon.svg.png"
  },
  {
    id: "#1020",
    product: "Kaspersky Internet Security",
    type: "1 PC - 1 Năm",
    key: "JHJ88-KK29S-LL0...",
    date: "20/10/2023",
    time: "11:20",
    status: "available",
    image: "https://upload.wikimedia.org/wikipedia/commons/1/1c/Kaspersky_logo_2019.svg"
  }
];

export const userStats = [
  { id: 1, title: "Tổng khách hàng", value: "1,250", percent: 12, isIncrease: true, compareText: "so với tháng trước", iconType: "user" },
  { id: 2, title: "Khách mới (Tháng)", value: "340", percent: 5, isIncrease: true, compareText: "so với tháng trước", iconType: "user-add" },
  { id: 3, title: "Đang hoạt động", value: "1,180", percent: 2, isIncrease: true, compareText: "người dùng", iconType: "check" },
  { id: 4, title: "Bị khóa", value: "70", percent: -1, isIncrease: false, compareText: "tài khoản", iconType: "alert" }
];
