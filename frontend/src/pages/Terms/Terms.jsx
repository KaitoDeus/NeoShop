import React from 'react';
import { Link } from 'react-router-dom';
import { FiFileText, FiCheckCircle, FiAlertTriangle, FiMail } from 'react-icons/fi';
import './Terms.css';

const Terms = () => {
  return (
    <div className="terms-page">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">Trang chủ</Link> <span>/</span>
          <span style={{ color: '#0f172a', fontWeight: '500' }}>Điều khoản dịch vụ</span>
        </div>

        {/* Header */}
        <div className="policy-header">
          <FiFileText className="header-icon" />
          <h1>Điều khoản dịch vụ</h1>
          <p>Cập nhật lần cuối: 01/01/2026</p>
        </div>

        {/* Important Notice */}
        <div className="notice-box">
          <FiAlertTriangle className="notice-icon" />
          <p>
            Bằng việc sử dụng dịch vụ của NeoShop, bạn đồng ý tuân thủ các điều khoản dưới đây. 
            Vui lòng đọc kỹ trước khi sử dụng dịch vụ.
          </p>
        </div>

        {/* Content */}
        <div className="policy-content">
          <section className="policy-section">
            <h2>1. Giới thiệu về NeoShop</h2>
            <p>
              NeoShop là nền tảng thương mại điện tử chuyên cung cấp các sản phẩm số bao gồm 
              game key, phần mềm bản quyền, tài khoản subscription và thẻ quà tặng. 
              Chúng tôi cam kết cung cấp sản phẩm chính hãng với giá cạnh tranh nhất thị trường.
            </p>
          </section>

          <section className="policy-section">
            <h2>2. Điều kiện sử dụng</h2>
            <p>Khi sử dụng dịch vụ của NeoShop, bạn xác nhận rằng:</p>
            <ul>
              <li>Bạn đã đủ 18 tuổi hoặc có sự đồng ý của phụ huynh/người giám hộ</li>
              <li>Thông tin bạn cung cấp là chính xác và đầy đủ</li>
              <li>Bạn chịu trách nhiệm bảo mật thông tin tài khoản của mình</li>
              <li>Bạn sẽ không sử dụng dịch vụ cho mục đích bất hợp pháp</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>3. Sản phẩm và dịch vụ</h2>
            
            <h4>3.1. Bản chất sản phẩm số</h4>
            <p>
              Tất cả sản phẩm trên NeoShop là sản phẩm số (digital products). 
              Sản phẩm được giao ngay lập tức qua email sau khi thanh toán thành công.
            </p>

            <h4>3.2. Tính khả dụng</h4>
            <p>
              Một số sản phẩm có thể có giới hạn khu vực (region lock). 
              Vui lòng kiểm tra kỹ thông tin sản phẩm trước khi mua.
            </p>

            <h4>3.3. Giá cả</h4>
            <p>
              Giá sản phẩm được niêm yết bằng Việt Nam Đồng (VNĐ) và đã bao gồm thuế VAT. 
              NeoShop có quyền thay đổi giá mà không cần thông báo trước, 
              nhưng các đơn hàng đã hoàn tất sẽ không bị ảnh hưởng.
            </p>
          </section>

          <section className="policy-section">
            <h2>4. Thanh toán</h2>
            <ul>
              <li>NeoShop chấp nhận nhiều phương thức thanh toán: Thẻ VISA/MasterCard, PayPal, chuyển khoản ngân hàng, và tiền điện tử</li>
              <li>Thanh toán được xử lý qua các đối tác thanh toán uy tín, đảm bảo an toàn</li>
              <li>Đơn hàng sẽ được xử lý ngay sau khi thanh toán được xác nhận</li>
              <li>Trong một số trường hợp, đơn hàng có thể cần xác minh thêm để đảm bảo an toàn</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>5. Giao hàng</h2>
            <p>
              Sản phẩm số được giao tự động qua email đăng ký trong vòng vài phút sau khi thanh toán thành công. 
              Nếu không nhận được email trong vòng 30 phút, vui lòng:
            </p>
            <ul>
              <li>Kiểm tra thư mục Spam/Junk</li>
              <li>Liên hệ bộ phận CSKH qua Live Chat hoặc email</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>6. Hoàn tiền và hủy đơn</h2>
            
            <div className="info-box">
              <h4><FiCheckCircle /> Được hoàn tiền</h4>
              <ul>
                <li>Key không hoạt động do lỗi từ NeoShop</li>
                <li>Key đã được sử dụng trước khi giao</li>
                <li>Sản phẩm không đúng như mô tả</li>
              </ul>
            </div>

            <div className="info-box warning">
              <h4><FiAlertTriangle /> Không được hoàn tiền</h4>
              <ul>
                <li>Key đã được kích hoạt thành công</li>
                <li>Thay đổi ý định sau khi mua</li>
                <li>Tài khoản bị khóa do vi phạm điều khoản của nền tảng</li>
              </ul>
            </div>
          </section>

          <section className="policy-section">
            <h2>7. Hành vi bị cấm</h2>
            <p>Người dùng không được phép:</p>
            <ul>
              <li>Mua bán lại key hoặc tài khoản từ NeoShop với mục đích thương mại mà không có sự đồng ý</li>
              <li>Sử dụng thông tin thanh toán giả mạo hoặc bất hợp pháp</li>
              <li>Cố tình khai thác lỗ hổng hệ thống</li>
              <li>Spam hoặc lạm dụng hệ thống hỗ trợ</li>
              <li>Vi phạm quyền sở hữu trí tuệ</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>8. Giới hạn trách nhiệm</h2>
            <p>
              NeoShop không chịu trách nhiệm cho các thiệt hại gián tiếp phát sinh từ việc sử dụng dịch vụ, 
              bao gồm nhưng không giới hạn: mất dữ liệu, mất lợi nhuận, hoặc gián đoạn kinh doanh.
            </p>
            <p>
              Trách nhiệm tối đa của NeoShop được giới hạn ở giá trị đơn hàng liên quan.
            </p>
          </section>

          <section className="policy-section">
            <h2>9. Thay đổi điều khoản</h2>
            <p>
              NeoShop có quyền cập nhật các điều khoản này bất cứ lúc nào. 
              Các thay đổi sẽ có hiệu lực ngay khi được đăng trên website. 
              Việc tiếp tục sử dụng dịch vụ sau khi có thay đổi đồng nghĩa với việc bạn chấp nhận các điều khoản mới.
            </p>
          </section>

          <section className="policy-section">
            <h2>10. Liên hệ</h2>
            <p>Nếu có câu hỏi về điều khoản dịch vụ, vui lòng liên hệ:</p>
            <div className="contact-box">
              <p><FiMail /> Email: legal@neoshop.vn</p>
              <p>Địa chỉ: NeoShop LLC, TP. Hồ Chí Minh, Việt Nam</p>
            </div>
          </section>
        </div>

        {/* Accept Note */}
        <div className="accept-note">
          <FiCheckCircle className="accept-icon" />
          <p>
            Bằng việc sử dụng dịch vụ của NeoShop, bạn xác nhận đã đọc, hiểu và đồng ý với tất cả các điều khoản trên.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Terms;
