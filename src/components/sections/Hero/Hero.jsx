import React from 'react';
import { 
  FiMonitor, FiBriefcase, FiBookOpen, FiGlobe, 
  FiVideo, FiLayout, FiHardDrive, FiCpu, FiShield, FiGift,
  FiArrowRight 
} from 'react-icons/fi';
import './Hero.css';

const Hero = () => {
  const categories = [
    { icon: <FiMonitor />, label: "Giải trí" },
    { icon: <FiBriefcase />, label: "Làm việc" },
    { icon: <FiBookOpen />, label: "Học tập" },
    { icon: <FiGlobe />, label: "eSIM du lịch" },
    { icon: <FiVideo />, label: "Edit Ảnh - Video" },
    { icon: <FiLayout />, label: "Windows, Office" },
    { icon: <FiHardDrive />, label: "Google Drive" },
    { icon: <FiCpu />, label: "Thế giới AI" },
    { icon: <FiShield />, label: "VPN, bảo mật" },
    { icon: <FiGift />, label: "Gift Card" },
  ];

  return (
    <section className="hero-section">
      <div className="container">
        {/* Top Grid: Sidebar + Main Banner (2 Columns) */}
        <div className="hero-grid">
          
          {/* Left Sidebar */}
          <div className="category-sidebar">
            <h3 style={{ padding: '12px 16px', margin: 0, fontSize: '0.95rem', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc' }}>
              <FiLayout /> Danh mục sản phẩm
            </h3>
            <div style={{ padding: '0.5rem 0' }}>
              {categories.map((cat, idx) => (
                <div key={idx} className="cat-menu-item">
                  <span style={{ color: '#64748b' }}>{cat.icon}</span>
                  <span>{cat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Center Main Banner */}
          <div className="main-banner" style={{background: 'linear-gradient(135deg, #2563eb, #1d4ed8)'}}>
             <div style={{ position: 'absolute', inset: 0, opacity: 0.15, backgroundImage: 'radial-gradient(circle at 50% 50%, white 2px, transparent 2.5px)', backgroundSize: '32px 32px' }}></div>
             
             <div className="banner-content">
               <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', marginBottom: '1rem', display: 'inline-block', backdropFilter: 'blur(4px)' }}>
                 🔥 Hot Deal
               </span>
               <h2 className="banner-title">eSIM Du Lịch Quốc Tế</h2>
               <p className="banner-sub">Kết nối internet tốc độ cao tại hơn 200 quốc gia. Không cần tháo lắp SIM.</p>
               <button className="banner-btn">Mua ngay <FiArrowRight /></button>
             </div>
             {/* Visual Element */}
             <div style={{ position: 'absolute', right: '5%', top: '50%', transform: 'translateY(-50%)', width: '40%', height: '80%', background: 'rgba(255,255,255,0.1)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}>
                <span style={{ fontSize: '8rem' }}>🌏</span>
             </div>
          </div>

        </div>

        {/* Bottom Promos (4 Columns) */}
        <div className="promo-grid">
           <div className="promo-box" style={{ background: '#0f172a' }}>
              <div>
                <h4 style={{ color: 'white', fontWeight: 'bold', marginBottom: '0.25rem' }}>STEAM</h4>
                <span style={{ color: '#bae6fd', fontSize: '0.85rem' }}>Wallet Code</span>
                <span className="badge" style={{ display: 'block', width: 'fit-content', marginTop: '0.5rem', background: '#ef4444', color: 'white', border: 'none', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem' }}>Hot Trend</span>
              </div>
              <div style={{ fontSize: '2rem' }}>🎮</div>
           </div>

           <div className="promo-box" style={{ background: '#991b1b' }}>
              <div>
                <h4 style={{ color: 'white', fontWeight: 'bold', marginBottom: '0.25rem' }}>THIẾT KẾ</h4>
                <span style={{ color: '#fecaca', fontSize: '0.85rem' }}>Adobe / Canva</span>
                <span className="badge" style={{ display: 'block', width: 'fit-content', marginTop: '0.5rem', background: 'white', color: '#991b1b', border: 'none', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem' }}>Nâng cấp</span>
              </div>
              <div style={{ fontSize: '2rem' }}>🎨</div>
           </div>

           <div className="promo-box" style={{ background: '#075985' }}>
              <div>
                <h4 style={{ color: 'white', fontWeight: 'bold', marginBottom: '0.25rem' }}>GIẢI TRÍ</h4>
                <span style={{ color: '#bae6fd', fontSize: '0.85rem' }}>Netflix / Spotify</span>
                <span className="badge" style={{ display: 'block', width: 'fit-content', marginTop: '0.5rem', background: '#eab308', color: 'black', border: 'none', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem' }}>Giá rẻ</span>
              </div>
              <div style={{ fontSize: '2rem' }}>🎬</div>
           </div>

           <div className="promo-box" style={{ background: '#9a3412' }}>
               <div>
                <h4 style={{ color: 'white', fontWeight: 'bold', marginBottom: '0.25rem' }}>OFFICE</h4>
                <span style={{ color: '#fed7aa', fontSize: '0.85rem' }}>Key Bản quyền</span>
                <span className="badge" style={{ display: 'block', width: 'fit-content', marginTop: '0.5rem', background: 'white', color: '#9a3412', border: 'none', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem' }}>Vĩnh viễn</span>
              </div>
              <div style={{ fontSize: '2rem' }}>📂</div>
           </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
