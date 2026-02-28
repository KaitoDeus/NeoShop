import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  FiSearch,
  FiChevronRight,
  FiChevronDown,
  FiHelpCircle,
  FiKey,
  FiRefreshCcw,
  FiCreditCard,
  FiShield,
  FiMessageCircle,
  FiMail,
  FiPhone,
  FiClock,
  FiAlertCircle,
} from "react-icons/fi";
import "./HelpCenter.css";

const FAQ_CATEGORIES = [
  {
    id: "order",
    title: "Đơn hàng & Thanh toán",
    icon: <FiCreditCard />,
    questions: [
      {
        q: "Tôi có thể thanh toán bằng những phương thức nào?",
        a: "NeoShop hỗ trợ nhiều phương thức thanh toán phổ biến: VNPay và ví điện tử MoMo",
      },
      {
        q: "Sau khi thanh toán, tôi sẽ nhận được sản phẩm như thế nào?",
        a: "Với sản phẩm số, key hoặc thông tin tài khoản sẽ được gửi tự động qua email của bạn ngay sau khi thanh toán thành công. Thời gian trung bình là dưới 5 phút.",
      },
      {
        q: "Tôi chưa nhận được email chứa sản phẩm?",
        a: "Vui lòng kiểm tra thư mục Spam/Junk trong hộp thư của bạn. Nếu vẫn không thấy, hãy liên hệ bộ phận CSKH qua Live Chat hoặc email support@neoshop.vn với mã đơn hàng.",
      },
    ],
  },
  {
    id: "activation",
    title: "Kích hoạt sản phẩm",
    icon: <FiKey />,
    questions: [
      {
        q: "Làm thế nào để kích hoạt key game trên Steam?",
        a: 'Mở ứng dụng Steam > Vào menu Games > Chọn "Activate a Product on Steam" > Nhập key và làm theo hướng dẫn. Chi tiết xem tại trang Hướng dẫn kích hoạt.',
      },
      {
        q: "Key của tôi không hoạt động?",
        a: "Đảm bảo bạn nhập đúng key (không có khoảng trắng thừa). Nếu key vẫn không hoạt động, vui lòng liên hệ CSKH kèm ảnh chụp màn hình lỗi để được hỗ trợ ngay.",
      },
      {
        q: "Tôi có thể kích hoạt sản phẩm ở Việt Nam không?",
        a: "Phần lớn sản phẩm trên NeoShop là Global Key, có thể kích hoạt và sử dụng ở mọi quốc gia. Một số sản phẩm có gắn tag khu vực cụ thể, vui lòng kiểm tra trước khi mua.",
      },
    ],
  },
  {
    id: "refund",
    title: "Hoàn tiền & Đổi trả",
    icon: <FiRefreshCcw />,
    questions: [
      {
        q: "Chính sách hoàn tiền như thế nào?",
        a: "NeoShop cam kết hoàn tiền 100% nếu sản phẩm bị lỗi do hệ thống (key sai, key đã sử dụng...). Yêu cầu hoàn tiền cần được gửi trong vòng 24 giờ kể từ khi mua hàng.",
      },
      {
        q: "Tôi có thể đổi sản phẩm khác không?",
        a: "Hiện tại NeoShop chưa hỗ trợ đổi sản phẩm. Tuy nhiên, bạn có thể yêu cầu hoàn tiền (nếu đủ điều kiện) và thực hiện đơn hàng mới.",
      },
    ],
  },
  {
    id: "security",
    title: "Bảo mật tài khoản",
    icon: <FiShield />,
    questions: [
      {
        q: "Làm sao để bảo vệ tài khoản NeoShop của tôi?",
        a: "Sử dụng mật khẩu mạnh và duy nhất, kích hoạt xác thực 2 lớp (2FA), và không chia sẻ thông tin đăng nhập với bất kỳ ai.",
      },
      {
        q: "Tôi quên mật khẩu, phải làm sao?",
        a: 'Nhấn vào "Quên mật khẩu" ở trang đăng nhập và làm theo hướng dẫn được gửi đến email đăng ký của bạn.',
      },
    ],
  },
];

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [openCategory, setOpenCategory] = useState("order");
  const [openQuestion, setOpenQuestion] = useState(null);

  const toggleCategory = (id) => {
    setOpenCategory(openCategory === id ? null : id);
    setOpenQuestion(null);
  };

  const toggleQuestion = (idx) => {
    setOpenQuestion(openQuestion === idx ? null : idx);
  };

  const filteredFAQ = useMemo(() => {
    if (!searchQuery.trim()) return FAQ_CATEGORIES;
    const query = searchQuery.toLowerCase();
    return FAQ_CATEGORIES.map((cat) => ({
      ...cat,
      questions: cat.questions.filter(
        (q) =>
          q.q.toLowerCase().includes(query) ||
          q.a.toLowerCase().includes(query),
      ),
    })).filter((cat) => cat.questions.length > 0);
  }, [searchQuery]);

  return (
    <div className="help-center-page">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">Trang chủ</Link> <span>/</span>
          <span style={{ color: "#0f172a", fontWeight: "500" }}>
            Trung tâm trợ giúp
          </span>
        </div>

        {/* Hero Section */}
        <div className="help-hero">
          <h1>Chúng tôi có thể giúp gì cho bạn?</h1>
          <p>Tìm kiếm câu trả lời hoặc liên hệ đội ngũ hỗ trợ 24/7</p>
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Tìm kiếm câu hỏi, từ khóa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Quick Links */}
        <div className="quick-links">
          <Link to="/activation-guide" className="quick-link-card">
            <FiKey className="ql-icon" />
            <span>Hướng dẫn kích hoạt</span>
            <FiChevronRight />
          </Link>
          <Link to="/warranty" className="quick-link-card">
            <FiRefreshCcw className="ql-icon" />
            <span>Chính sách bảo hành</span>
            <FiChevronRight />
          </Link>
          <Link to="/contact" className="quick-link-card">
            <FiMessageCircle className="ql-icon" />
            <span>Liên hệ hỗ trợ</span>
            <FiChevronRight />
          </Link>
        </div>

        {/* FAQ Section */}
        <div className="faq-section">
          <h2>
            <FiHelpCircle />{" "}
            {searchQuery
              ? `Kết quả tìm kiếm cho "${searchQuery}"`
              : "Câu hỏi thường gặp"}
          </h2>

          <div className="faq-container">
            {filteredFAQ.length > 0 ? (
              filteredFAQ.map((cat) => (
                <div
                  key={cat.id}
                  className={`faq-category ${openCategory === cat.id || searchQuery ? "open" : ""}`}
                >
                  <div
                    className="faq-cat-header"
                    onClick={() => toggleCategory(cat.id)}
                  >
                    <div className="faq-cat-title">
                      {cat.icon}
                      <span>{cat.title}</span>
                    </div>
                    <FiChevronDown
                      className={`chevron ${openCategory === cat.id || searchQuery ? "rotate" : ""}`}
                    />
                  </div>

                  {(openCategory === cat.id || searchQuery) && (
                    <div className="faq-questions">
                      {cat.questions.map((item, idx) => (
                        <div key={idx} className="faq-item">
                          <div
                            className="faq-question"
                            onClick={() => toggleQuestion(`${cat.id}-${idx}`)}
                          >
                            <span>{item.q}</span>
                            <FiChevronRight
                              className={`chevron ${openQuestion === `${cat.id}-${idx}` ? "rotate" : ""}`}
                            />
                          </div>
                          {(openQuestion === `${cat.id}-${idx}` ||
                            searchQuery) && (
                            <div className="faq-answer">{item.a}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="empty-search">
                <FiAlertCircle /> Không tìm thấy câu hỏi nào phù hợp với "
                {searchQuery}"
              </div>
            )}
          </div>
        </div>

        {/* Contact Section */}
        <div className="contact-section">
          <h2>Vẫn cần hỗ trợ?</h2>
          <p>Đội ngũ CSKH của NeoShop luôn sẵn sàng giúp đỡ bạn</p>

          <div className="contact-cards">
            <div className="contact-card">
              <FiMessageCircle className="contact-icon" />
              <h4>Live Chat</h4>
              <p>Trò chuyện trực tiếp với CSKH</p>
              <span className="contact-status online">Đang hoạt động</span>
            </div>
            <div className="contact-card">
              <FiMail className="contact-icon" />
              <h4>Email</h4>
              <p>support@neoshop.vn</p>
              <span className="contact-detail">Phản hồi trong 24 giờ</span>
            </div>
            <div className="contact-card">
              <FiClock className="contact-icon" />
              <h4>Giờ làm việc</h4>
              <p>24/7 - Hỗ trợ mọi lúc</p>
              <span className="contact-detail">Kể cả ngày lễ</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
