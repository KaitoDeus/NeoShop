import { useState, useEffect } from "react";
import {
  FiSettings,
  FiCreditCard,
  FiShield,
  FiGlobe,
  FiMail,
  FiDatabase,
  FiSave,
  FiRefreshCw,
  FiUpload,
  FiLock,
  FiShoppingBag,
  FiInfo,
  FiServer,
  FiAlertCircle,
  FiX,
  FiDownload,
} from "react-icons/fi";
import settingsService from "../../../services/settingsService";
import { formatDateTime } from "../../../utils/formatDate";
import "./Settings.css";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({});
  const [originalSettings, setOriginalSettings] = useState({});

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const data = await settingsService.getSettings();
      setSettings(data);
      setOriginalSettings(data);
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? (checked ? "true" : "false") : value;

    setSettings((prev) => ({
      ...prev,
      [name]: val,
    }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      await settingsService.updateSettings(settings);
      setOriginalSettings(settings);
      setIsDirty(false);
      alert("Đã lưu cấu hình hệ thống thành công!");
    } catch (error) {
      console.error("Failed to save settings:", error);
      alert("Có lỗi xảy ra khi lưu cấu hình.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setSettings(originalSettings);
    setIsDirty(false);
  };

  // --- TAB CONTENT RENDERERS ---

  const renderGeneral = () => (
    <div className="settings-section animate-fade-in">
      <div className="section-header">
        <h3 className="section-title">
          <FiInfo /> Thông tin cửa hàng
        </h3>
      </div>
      <div className="section-body">
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Tên cửa hàng</label>
            <input
              name="shopName"
              type="text"
              className="form-control"
              value={settings.shopName || "NeoShop Digital Store"}
              onChange={handleChange}
            />
            <p className="helper-text">Tên hiển thị trên hóa đơn và email.</p>
          </div>
          <div className="form-group">
            <label className="form-label">Email liên hệ</label>
            <input
              name="contactEmail"
              type="email"
              className="form-control"
              value={settings.contactEmail || "support@neoshop.vn"}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Số điện thoại</label>
            <input
              name="contactPhone"
              type="text"
              className="form-control"
              value={settings.contactPhone || "1900 8888"}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Múi giờ (Timezone)</label>
            <select
              name="timezone"
              className="form-control"
              value={settings.timezone || "GMT+7"}
              onChange={handleChange}
            >
              <option value="GMT+7">GMT+07:00 Bangkok, Hanoi, Jakarta</option>
              <option value="GMT+8">GMT+08:00 Singapore</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPayment = () => (
    <div className="settings-section animate-fade-in">
      <div className="section-header">
        <h3 className="section-title">
          <FiCreditCard /> Cấu hình thanh toán
        </h3>
      </div>
      <div className="section-body">
        {/* Bank Transfer */}
        <div className="setting-row">
          <div className="setting-info">
            <h4>Chuyển khoản ngân hàng (VietQR)</h4>
            <p>Hiển thị mã QR động để khách hàng quét thanh toán.</p>
          </div>
          <label className="switch">
            <input
              name="bankEnabled"
              type="checkbox"
              checked={settings.bankEnabled === "true"}
              onChange={handleChange}
            />
            <span className="slider"></span>
          </label>
        </div>
        <div
          className="form-grid"
          style={{
            background: "#f8fafc",
            padding: "1.5rem",
            borderRadius: "8px",
            marginBottom: "1.5rem",
          }}
        >
          <div className="form-group">
            <label className="form-label">Ngân hàng</label>
            <select
              name="bankName"
              className="form-control"
              value={settings.bankName || "Vietcombank"}
              onChange={handleChange}
            >
              <option>Vietcombank</option>
              <option>MBBank</option>
              <option>Techcombank</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Số tài khoản</label>
            <input
              name="bankAccountNumber"
              type="text"
              className="form-control"
              value={settings.bankAccountNumber || ""}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Chủ tài khoản</label>
            <input
              name="bankAccountName"
              type="text"
              className="form-control"
              value={settings.bankAccountName || ""}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* E-Wallets */}
        <div className="setting-row">
          <div className="setting-info">
            <h4>Ví MoMo</h4>
            <p>Tích hợp cổng thanh toán tự động qua API MoMo.</p>
          </div>
          <label className="switch">
            <input
              name="momoEnabled"
              type="checkbox"
              checked={settings.momoEnabled === "true"}
              onChange={handleChange}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderSales = () => (
    <div className="settings-section animate-fade-in">
      <div className="section-header">
        <h3 className="section-title">
          <FiShoppingBag /> Cấu hình bán hàng
        </h3>
      </div>
      <div className="section-body">
        <div className="setting-row">
          <div className="setting-info">
            <h4>Tự động giao Key</h4>
            <p>
              Hệ thống tự động gửi key qua email ngay khi đơn hàng chuyển trạng
              thái "Thành công".
            </p>
          </div>
          <label className="switch">
            <input
              name="autoDeliverKey"
              type="checkbox"
              checked={settings.autoDeliverKey === "true"}
              onChange={handleChange}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="setting-row">
          <div className="setting-info">
            <h4>Ẩn sản phẩm hết hàng</h4>
            <p>
              Tự động chuyển trạng thái sản phẩm sang "Ẩn" khi kho key bằng 0.
            </p>
          </div>
          <label className="switch">
            <input
              name="hideOutOfStock"
              type="checkbox"
              checked={settings.hideOutOfStock === "true"}
              onChange={handleChange}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div
          className="form-grid margin-top-lg"
          style={{ marginTop: "1.5rem" }}
        >
          <div className="form-group">
            <label className="form-label">Thời gian giữ đơn hàng (phút)</label>
            <input
              name="holdOrderMinutes"
              type="number"
              className="form-control"
              value={settings.holdOrderMinutes || "15"}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: "general", label: "Thông tin chung", icon: <FiInfo /> },
    { id: "payment", label: "Thanh toán", icon: <FiCreditCard /> },
    { id: "sales", label: "Bán hàng", icon: <FiShoppingBag /> },
    { id: "security", label: "Bảo mật", icon: <FiShield /> },
    { id: "seo", label: "SEO & Meta", icon: <FiGlobe /> },
    { id: "backup", label: "Dữ liệu & Backup", icon: <FiDatabase /> },
  ];

  const renderSecurity = () => (
    <div className="settings-section animate-fade-in">
      <div className="section-header">
        <h3 className="section-title">
          <FiShield /> Bảo mật hệ thống
        </h3>
      </div>
      <div className="section-body">
        <div className="setting-row">
          <div className="setting-info">
            <h4>Xác thực 2 lớp (2FA)</h4>
            <p>Yêu cầu mã OTP cho tất cả tài khoản quản trị viên.</p>
          </div>
          <label className="switch">
            <input
              name="security2FA"
              type="checkbox"
              checked={settings.security2FA === "true"}
              onChange={handleChange}
            />
            <span className="slider"></span>
          </label>
        </div>
        <div className="setting-row">
          <div className="setting-info">
            <h4>Chặn đăng nhập sai</h4>
            <p>Tạm khóa tài khoản sau 5 lần nhập sai mật khẩu.</p>
          </div>
          <label className="switch">
            <input
              name="lockoutEnabled"
              type="checkbox"
              checked={settings.lockoutEnabled === "true"}
              onChange={handleChange}
            />
            <span className="slider"></span>
          </label>
        </div>
        <div className="form-grid margin-top-lg">
          <div className="form-group">
            <label className="form-label">Thời gian hết hạn phiên (phút)</label>
            <input
              name="sessionTimeout"
              type="number"
              className="form-control"
              value={settings.sessionTimeout || "120"}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Độ dài mật khẩu tối thiểu</label>
            <input
              name="minPasswordLength"
              type="number"
              className="form-control"
              value={settings.minPasswordLength || "8"}
              onChange={handleChange}
            />
          </div>
        </div>
        <div
          className="form-group margin-top-lg"
          style={{ marginTop: "1.5rem" }}
        >
          <label className="form-label">Danh sách IP bị chặn</label>
          <textarea
            name="ipBlacklist"
            className="form-control"
            rows="3"
            placeholder="Nhập danh sách IP, mỗi IP một dòng..."
            value={settings.ipBlacklist || ""}
            onChange={handleChange}
          ></textarea>
        </div>
      </div>
    </div>
  );

  const renderSEO = () => (
    <div className="settings-section animate-fade-in">
      <div className="section-header">
        <h3 className="section-title">
          <FiGlobe /> Cấu hình SEO & Marketing
        </h3>
      </div>
      <div className="section-body">
        <div className="form-group">
          <label className="form-label">Tiêu đề trang chủ (Meta Title)</label>
          <input
            name="seoTitle"
            type="text"
            className="form-control"
            value={settings.seoTitle || ""}
            onChange={handleChange}
          />
        </div>
        <div className="form-group margin-top-md" style={{ marginTop: "1rem" }}>
          <label className="form-label">
            Mô tả trang chủ (Meta Description)
          </label>
          <textarea
            name="seoDescription"
            className="form-control"
            rows="3"
            value={settings.seoDescription || ""}
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="form-group margin-top-md" style={{ marginTop: "1rem" }}>
          <label className="form-label">Từ khóa SEO (Keywords)</label>
          <input
            name="seoKeywords"
            type="text"
            className="form-control"
            placeholder="game, digital key, neoshop..."
            value={settings.seoKeywords || ""}
            onChange={handleChange}
          />
        </div>
        <div
          className="form-grid margin-top-lg"
          style={{ marginTop: "1.5rem" }}
        >
          <div className="form-group">
            <label className="form-label">Google Analytics ID</label>
            <input
              name="gaId"
              type="text"
              className="form-control"
              placeholder="UA-XXXXXXXXX-X"
              value={settings.gaId || ""}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Facebook Pixel ID</label>
            <input
              name="fbPixelId"
              type="text"
              className="form-control"
              placeholder="1234567890"
              value={settings.fbPixelId || ""}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderBackup = () => (
    <div className="settings-section animate-fade-in">
      <div className="section-header">
        <h3 className="section-title">
          <FiDatabase /> Sao lưu & Phục hồi
        </h3>
      </div>
      <div className="section-body">
        <div className="setting-row">
          <div className="setting-info">
            <h4>Tự động sao lưu hàng ngày</h4>
            <p>
              Sao lưu toàn bộ cơ sở dữ liệu và file cấu hình vào lúc 2:00 sáng.
            </p>
          </div>
          <label className="switch">
            <input
              name="autoBackup"
              type="checkbox"
              checked={settings.autoBackup === "true"}
              onChange={handleChange}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div
          className="backup-actions margin-top-lg"
          style={{
            marginTop: "2rem",
            padding: "1.5rem",
            background: "#f8fafc",
            borderRadius: "12px",
            textAlign: "center",
          }}
        >
          <FiServer
            size={32}
            color="#64748b"
            style={{ marginBottom: "1rem" }}
          />
          <h4>Sao lưu tức thời</h4>
          <p className="text-secondary" style={{ marginBottom: "1.5rem" }}>
            Tạo bản sao lưu dữ liệu hiện tại ngay bây giờ.
          </p>
          <button className="btn btn-outline" style={{ margin: "0 auto" }}>
            <FiDownload /> Tải bản sao lưu (.sql)
          </button>
        </div>

        <div className="margin-top-lg" style={{ marginTop: "2rem" }}>
          <h4 style={{ marginBottom: "1rem" }}>Lịch sử sao lưu gần đây</h4>
          <table className="admin-table" style={{ fontSize: "0.9rem" }}>
            <thead>
              <tr>
                <th>Ngày tạo</th>
                <th>Kích thước</th>
                <th>Loại</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  {formatDateTime(new Date())}
                </td>
                <td>4.2 MB</td>
                <td>Automatic</td>
                <td>
                  <button className="btn-icon text-primary">
                    <FiRefreshCw />
                  </button>
                </td>
              </tr>
              <tr>
                <td>22/02/2026 02:00:05</td>
                <td>4.1 MB</td>
                <td>Automatic</td>
                <td>
                  <button className="btn-icon text-primary">
                    <FiRefreshCw />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1 className="settings-title">Cài Đặt Hệ Thống</h1>
        <p className="settings-subtitle">
          Quản lý toàn bộ cấu hình vận hành, bán hàng và bảo mật của NeoShop.
        </p>
      </div>

      <div className="settings-tabs-nav">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`tab-item ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon} {tab.label}
          </div>
        ))}
      </div>

      <div className="settings-content">
        {activeTab === "general" && renderGeneral()}
        {activeTab === "payment" && renderPayment()}
        {activeTab === "sales" && renderSales()}
        {activeTab === "security" && renderSecurity()}
        {activeTab === "seo" && renderSEO()}
        {activeTab === "backup" && renderBackup()}
      </div>

      <div className="sticky-footer">
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {isDirty && (
            <span
              style={{ color: "#eab308", fontSize: "0.9rem", fontWeight: 500 }}
            >
              <FiAlertCircle style={{ marginBottom: "-2px" }} /> Có thay đổi
              chưa lưu
            </span>
          )}
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button className="btn btn-secondary" onClick={handleCancel}>
            Hủy bỏ
          </button>
          <button
            className="btn btn-primary"
            disabled={!isDirty || isLoading}
            onClick={handleSave}
          >
            {isLoading ? <FiRefreshCw className="spin" /> : <FiSave />}
            {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
