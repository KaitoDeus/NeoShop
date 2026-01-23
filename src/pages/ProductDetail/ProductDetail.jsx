import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  FiCheckCircle, FiGlobe, FiStar, FiZap, FiShield, 
  FiMonitor, FiFileText, FiKey, FiShoppingCart, FiArrowRight, FiClock, FiCheck 
} from 'react-icons/fi';
import { MOCK_PRODUCTS } from '../../data/mockProducts';
import { useCart } from '../../context/CartContext';
import './ProductDetail.css';

const RELATED_PRODUCTS = MOCK_PRODUCTS.slice(0, 4).map(p => ({
  id: p.id,
  name: p.title,
  price: (p.price * 25000).toLocaleString('vi-VN') + 'đ'
}));

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();
  const [product, setProduct] = useState(null);
  const [rawProduct, setRawProduct] = useState(null);
  const [duration, setDuration] = useState(12);

  useEffect(() => {
    window.scrollTo(0, 0);

    const found = MOCK_PRODUCTS.find(p => p.id.toString() === id);
    if (found) {
        setRawProduct(found);
        setProduct({
            id: found.id,
            name: found.title,
            price: found.price * 25000, 
            originalPrice: found.oldPrice ? found.oldPrice * 25000 : (found.price * 25000 * 1.3),
            description: found.desc,
            rating: 4.8,
            reviews: Math.floor(Math.random() * 500) + 50,
            banner: null, 
            imageColor: found.imageColor,
            features: [
                 { icon: <FiZap />, title: "Giao ngay", desc: "Nhận key kích hoạt tự động qua email 24/7." },
                 { icon: <FiGlobe />, title: "Global Key", desc: "Kích hoạt và sử dụng tại mọi quốc gia." },
                 { icon: <FiShield />, title: "Bảo hành uy tín", desc: "Hỗ trợ kỹ thuật và bảo hành suốt đời." },
                 { icon: <FiCheckCircle />, title: "Chính hãng", desc: "Sản phẩm bản quyền 100% từ nhà phát hành." }
            ]
        });
    } else {
        setProduct(null);
    }
  }, [id]);

  if (!product) {
      return (
          <div className="product-detail-page" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh'}}>
              <div style={{textAlign: 'center'}}>
                  <h2>Sản phẩm không tồn tại</h2>
                  <Link to="/category" style={{color: '#2563eb', fontWeight: '600', marginTop: '1rem', display: 'inline-block'}}>
                      Quay lại danh mục
                  </Link>
              </div>
          </div>
      );
  }

  const discountPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <div className="product-detail-page">
      <div className="pd-container">
        
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">Trang chủ</Link> <span>/</span> 
          <Link to="/category">Sản phẩm</Link> <span>/</span> 
          <span style={{ color: '#0f172a', fontWeight: '500' }}>{product.name}</span>
        </div>

        <div className="pd-layout">
          {/* LEFT COLUMN: Main Content */}
          <div className="pd-main-content">
            
            {/* 1. Header & Banner */}
            <div className="product-banner" style={{ background: product.banner ? `url(${product.banner}) center/cover` : product.imageColor }}>
               <div className="banner-overlay">
                  <div className="badge-delivery">
                    <FiZap /> Giao hàng tức thì
                  </div>
                  <h1 className="pd-title">{product.name}</h1>
                  <p className="pd-subtitle">{product.description}</p>
               </div>
            </div>

            {/* 2. Meta Info (Ratings) */}
            <div className="pd-meta-bar">
               <div className="rating-box">
                  <div className="stars">
                    <FiStar fill="#facc15" /> <FiStar fill="#facc15" /> <FiStar fill="#facc15" /> <FiStar fill="#facc15" /> <FiStar fill="#facc15" />
                  </div>
                  <span>{product.rating} ({product.reviews} đánh giá)</span>
               </div>
               <div className="verified-badge">
                  <FiCheckCircle /> Người bán uy tín
               </div>
               <div className="global-badge">
                  <FiGlobe /> Kích hoạt toàn cầu
               </div>
            </div>

            {/* 3. Features Grid */}
            <div className="features-grid">
               {product.features.map((f, idx) => (
                   <FeatureCard key={idx} icon={f.icon} title={f.title} desc={f.desc} />
               ))}
            </div>

            {/* 4. Detailed Description */}
            <div className="pd-section">
               <h3 className="section-title"><FiFileText /> Mô tả chi tiết</h3>
               <div className="desc-content">
                  <p>Sở hữu <strong>{product.name}</strong> bản quyền với mức giá ưu đãi nhất thị trường. Bạn sẽ nhận được:</p>
                  <ul>
                     <li><strong>Tiết kiệm chi phí:</strong> So với giá gốc mua trực tiếp từ nhà phát hành.</li>
                     <li><strong>An toàn tuyệt đối:</strong> Key/Tài khoản sạch, nguồn gốc rõ ràng, nói không với hàng lậu.</li>
                     <li><strong>Hỗ trợ tận tình:</strong> Đội ngũ NeoShop luôn sẵn sàng hỗ trợ cài đặt và kích hoạt.</li>
                     <li><strong>Bảo hành trọn đời:</strong> Yên tâm sử dụng với chính sách bảo hành 1 đổi 1.</li>
                  </ul>
                  <p>Sản phẩm phù hợp cho game thủ, người làm việc chuyên nghiệp muốn sở hữu bản quyền chính hãng giá tốt.</p>
               </div>
            </div>

            {/* 5. Activation Steps */}
            <div className="pd-section">
               <h3 className="section-title"><FiKey /> Hướng dẫn kích hoạt</h3>
               <div className="steps-list">
                  <div className="step-item">
                     <div className="step-number">1</div>
                     <div className="step-content">
                        <h4>Kiểm tra Email</h4>
                        <p>Ngay sau khi thanh toán, hệ thống sẽ gửi mã kích hoạt/chi tiết tài khoản qua email của bạn.</p>
                     </div>
                  </div>
                  <div className="step-item">
                     <div className="step-number">2</div>
                     <div className="step-content">
                        <h4>Kích hoạt sản phẩm</h4>
                        <p>Sử dụng mã key để kích hoạt trên nền tảng tương ứng (Steam, Epic, Adobe, Microsoft...).</p>
                     </div>
                  </div>
                  <div className="step-item">
                     <div className="step-number">3</div>
                     <div className="step-content">
                        <h4>Hoàn tất</h4>
                        <p>Sau khi kích hoạt thành công, sản phẩm sẽ được lưu vĩnh viễn trong tài khoản của bạn.</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Buy Box */}
          <div className="buy-box">
             <div className="flash-sale-timer">
                <FiClock /> Flash Sale kết thúc sau: 04:12:35
             </div>

             <div className="price-section">
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'}}>
                   <div className="current-price">{product.price.toLocaleString('vi-VN')}₫</div>
                   <div className="discount-tag">-{discountPercent}%</div>
                </div>
                <div className="original-price">{product.originalPrice.toLocaleString('vi-VN')}₫</div>
                <div style={{fontSize: '0.85rem', color: '#64748b', marginTop: '0.5rem'}}>Đã bao gồm thuế VAT</div>
             </div>

             {/* Options */}
             <div className="options-group">
                <label className="option-label">Khu vực</label>
                <select className="option-selector">
                   <option>Việt Nam</option>
                   <option>Global (Toàn cầu)</option>
                </select>
             </div>

             <div className="options-group">
                <label className="option-label">Phiên bản</label>
                <div className="duration-options">
                   <button 
                     className={`duration-btn ${duration === 12 ? 'active' : ''}`}
                     onClick={() => setDuration(12)}
                   >
                     Tiêu chuẩn
                   </button>
                   <button 
                     className={`duration-btn ${duration === 6 ? 'active' : ''}`}
                     onClick={() => setDuration(6)}
                   >
                     Cao cấp
                   </button>
                </div>
             </div>

             {/* Nút hành động */}
             <div className="action-buttons">
                <button 
                  className="btn-buy-now"
                  onClick={() => {
                    if (rawProduct) addToCart(rawProduct);
                    navigate('/checkout');
                  }}
                >
                   Mua ngay <FiArrowRight />
                </button>
                <button 
                  className={`btn-add-cart ${rawProduct && isInCart(rawProduct.id) ? 'added' : ''}`}
                  onClick={() => rawProduct && addToCart(rawProduct)}
                >
                   {rawProduct && isInCart(rawProduct.id) 
                     ? <><FiCheck /> Đã thêm vào giỏ</>
                     : <><FiShoppingCart /> Thêm vào giỏ</>}
                </button>
             </div>

             <div className="digital-delivery-note">
                <FiZap size={24} style={{flexShrink: 0}} />
                <div>
                   <strong>Giao hàng kỹ thuật số tức thì.</strong>
                   <br/>Thông tin tài khoản sẽ được gửi tự động qua email ngay sau khi thanh toán thành công.
                </div>
             </div>
             
             <div style={{marginTop: '1.5rem', textAlign: 'center'}}>
                <div style={{display: 'flex', justifyContent: 'space-around', fontSize: '0.75rem', color: '#64748b'}}>
                   <span style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px'}}>
                      <FiShield size={18}/> Bảo đảm hoàn tiền
                   </span>
                   <span style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px'}}>
                      <FiMonitor size={18}/> Hỗ trợ 24/7
                   </span>
                </div>
             </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="related-section">
           <h3 className="section-title">Có thể bạn quan tâm</h3>
           <div className="related-grid">
              {RELATED_PRODUCTS.map(p => (
                 <div key={p.id} className="feature-card" style={{flexDirection: 'column', padding: '1rem', gap: '0.5rem', alignItems: 'center', textAlign: 'center'}}>
                    <div style={{width: '60px', height: '60px', borderRadius: '12px', background: '#333', marginBottom: '0.5rem'}}></div>
                    <h4 style={{fontSize: '0.9rem', margin: 0}}>{p.name}</h4>
                    <div style={{fontWeight: 'bold', color: '#2563eb'}}>{p.price}</div>
                    <button style={{width: '100%', marginTop: '0.5rem', padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '4px', background: 'white', fontSize: '0.8rem', cursor: 'pointer'}}>
                       Thêm vào giỏ
                    </button>
                 </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

// Component con hiển thị tính năng
const FeatureCard = ({ icon, title, desc }) => (
  <div className="feature-card">
     <div className="feature-icon-box">{icon}</div>
     <div className="feature-text">
        <h4>{title}</h4>
        <p>{desc}</p>
     </div>
  </div>
);

export default ProductDetail;
