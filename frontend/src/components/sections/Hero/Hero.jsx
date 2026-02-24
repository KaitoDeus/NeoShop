import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiMonitor, FiBriefcase, FiBookOpen, FiGlobe, 
  FiVideo, FiLayout, FiHardDrive, FiCpu, FiShield, FiGift,
  FiArrowRight, FiChevronLeft, FiChevronRight
} from 'react-icons/fi';
import './Hero.css';

// Import Hero Images
import esimImg from '../../../assets/hero/esim.webp';
import aiImg from '../../../assets/hero/chatgpt_midjourney.jpg';
import steamImg from '../../../assets/hero/steam.webp';
import officeImg from '../../../assets/hero/windows-and-office.jpg';
import netflixImg from '../../../assets/hero/netflix.jpg';

const SLIDES = [
  {
    id: 1,
    badge: "🔥 Hot Deal",
    title: "eSIM Du Lịch Quốc Tế",
    subtitle: "Kết nối internet tốc độ cao tại hơn 200 quốc gia. Không cần tháo lắp SIM.",
    gradient: "linear-gradient(135deg, #2563eb, #1d4ed8)",
    icon: "🌏",
    image: esimImg,
    link: "/category?type=esim"
  },
  {
    id: 2,
    badge: "🤖 AI Hot",
    title: "ChatGPT Plus & Midjourney",
    subtitle: "Truy cập GPT-4, tạo hình ảnh AI chất lượng cao. Kích hoạt tức thì.",
    gradient: "linear-gradient(135deg, #059669, #10b981)",
    icon: "🧠",
    image: aiImg,
    link: "/category?category=ai"
  },
  {
    id: 3,
    badge: "🎮 Best Seller",
    title: "Steam Game Keys",
    subtitle: "Hàng ngàn game bản quyền với giá ưu đãi. Giao key tự động 24/7.",
    gradient: "linear-gradient(135deg, #1e3a8a, #3b82f6)",
    icon: "🎯",
    image: steamImg,
    link: "/category?platform=steam"
  },
  {
    id: 4,
    badge: "💼 Office",
    title: "Microsoft 365 & Windows",
    subtitle: "Key bản quyền vĩnh viễn. Hỗ trợ cài đặt và bảo hành trọn đời.",
    gradient: "linear-gradient(135deg, #ea580c, #f97316)",
    icon: "📊",
    image: officeImg,
    link: "/category?category=office"
  },
  {
    id: 5,
    badge: "🎬 Streaming",
    title: "Netflix, Spotify, YouTube",
    subtitle: "Tài khoản Premium giá rẻ. Xem phim, nghe nhạc không giới hạn.",
    gradient: "linear-gradient(135deg, #dc2626, #ef4444)",
    icon: "📺",
    image: netflixImg,
    link: "/category?category=entertainment"
  }
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const categories = [
    { icon: <FiMonitor />, label: "Giải trí", link: "/category?category=entertainment" },
    { icon: <FiBriefcase />, label: "Làm việc", link: "/category?category=office" },
    { icon: <FiBookOpen />, label: "Học tập", link: "/category?category=learning" },
    { icon: <FiGlobe />, label: "eSIM du lịch", link: "/category?type=esim" },
    { icon: <FiVideo />, label: "Edit Ảnh - Video", link: "/category?type=design" },
    { icon: <FiLayout />, label: "Windows, Office", link: "/category?category=os" },
    { icon: <FiHardDrive />, label: "Google Drive", link: "/category?type=storage" },
    { icon: <FiCpu />, label: "Thế giới AI", link: "/category?category=ai" },
    { icon: <FiShield />, label: "VPN, bảo mật", link: "/category?type=security" },
    { icon: <FiGift />, label: "Gift Card", link: "/category?type=giftcard" },
  ];

  // Tự động chuyển slide
  useEffect(() => {
    if (!isAutoPlay) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isAutoPlay]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    setIsAutoPlay(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
    setIsAutoPlay(false);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlay(false);
  };

  const currentSlideData = SLIDES[currentSlide];

  return (
    <section className="hero-section">
      <div className="container">
        {/* Top Grid: Sidebar + Main Banner */}
        <div className="hero-grid">
          
          {/* Left Sidebar */}
          <div className="category-sidebar">
            <h3 className="sidebar-header">
              <FiLayout /> Danh mục sản phẩm
            </h3>
            <div className="sidebar-menu">
              {categories.map((cat, idx) => (
                <Link to={cat.link} key={idx} className="cat-menu-item">
                  <span className="cat-icon">{cat.icon}</span>
                  <span>{cat.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Center Main Banner - Carousel */}
          <div className="main-banner-wrapper">
            <Link 
              to={currentSlideData.link}
              className="main-banner" 
              style={{ 
                backgroundImage: `url(${currentSlideData.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {/* Navigation Arrows */}
              <button className="slide-arrow slide-prev" onClick={(e) => { e.preventDefault(); prevSlide(); }}>
                <FiChevronLeft />
              </button>
              <button className="slide-arrow slide-next" onClick={(e) => { e.preventDefault(); nextSlide(); }}>
                <FiChevronRight />
              </button>
            </Link>
          </div>

        </div>

        {/* Bottom Promos (4 Columns) */}
        <div className="promo-grid">
          <Link to="/category?platform=steam" className="promo-box" style={{ background: '#0f172a' }}>
            <div>
              <h4 className="promo-title">STEAM</h4>
              <span className="promo-sub">Wallet Code</span>
              <span className="promo-badge hot">Hot Trend</span>
            </div>
            <div className="promo-icon">🎮</div>
          </Link>

          <Link to="/category?type=design" className="promo-box" style={{ background: '#991b1b' }}>
            <div>
              <h4 className="promo-title">THIẾT KẾ</h4>
              <span className="promo-sub" style={{ color: '#fecaca' }}>Adobe / Canva</span>
              <span className="promo-badge upgrade">Nâng cấp</span>
            </div>
            <div className="promo-icon">🎨</div>
          </Link>

          <Link to="/category?category=entertainment" className="promo-box" style={{ background: '#075985' }}>
            <div>
              <h4 className="promo-title">GIẢI TRÍ</h4>
              <span className="promo-sub">Netflix / Spotify</span>
              <span className="promo-badge cheap">Giá rẻ</span>
            </div>
            <div className="promo-icon">🎬</div>
          </Link>

          <Link to="/category?category=office" className="promo-box" style={{ background: '#9a3412' }}>
            <div>
              <h4 className="promo-title">OFFICE</h4>
              <span className="promo-sub" style={{ color: '#fed7aa' }}>Key Bản quyền</span>
              <span className="promo-badge forever">Vĩnh viễn</span>
            </div>
            <div className="promo-icon">📂</div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
