import React, { useState, useEffect } from "react";
import { FiX, FiSave, FiUser, FiMail, FiLock } from "react-icons/fi";
import "./UserModal.css";

const UserModal = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
    phoneNumber: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        password: "", // Don't show password for existing user
        fullName: user.fullName || "",
        phoneNumber: user.phoneNumber || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // If editing, only send fields that are allowed to change (fullName, phone, address)
      // password might be optional for updates if we want to support it
      await onSave(formData);
      onClose();
    } catch (err) {
      console.error("Failed to save user:", err);
      setError(
        err.response?.data?.message ||
          "Có lỗi xảy ra khi lưu thông tin người dùng.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content user-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "450px" }}
      >
        <div className="modal-header">
          <h2>{user ? "Chỉnh sửa khách hàng" : "Thêm khách hàng mới"}</h2>
          <button className="close-btn" onClick={onClose}>
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div
                className="error-message"
                style={{
                  color: "red",
                  marginBottom: "1rem",
                  background: "#fee2e2",
                  padding: "0.5rem",
                  borderRadius: "4px",
                }}
              >
                {error}
              </div>
            )}

            <div className="form-group">
              <label>
                <FiUser style={{ marginBottom: -2, marginRight: 4 }} /> Tên đăng
                nhập *
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                disabled={!!user} // Cannot change username
                placeholder="Nhập tên đăng nhập..."
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>
                <FiMail style={{ marginBottom: -2, marginRight: 4 }} /> Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={!!user} // Cannot change email in this simplified UI
                placeholder="customer@neoshop.vn"
                className="form-input"
              />
            </div>

            {!user && (
              <div className="form-group">
                <label>
                  <FiLock style={{ marginBottom: -2, marginRight: 4 }} /> Mật
                  khẩu *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required={!user}
                  placeholder="Nhập mật khẩu..."
                  className="form-input"
                />
              </div>
            )}

            <div className="form-group">
              <label>Họ và tên</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Nhập họ và tên..."
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Số điện thoại</label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Nhập số điện thoại..."
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Địa chỉ</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Nhập địa chỉ..."
                className="form-input"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-outline" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              <FiSave />{" "}
              {loading ? "Đang lưu..." : user ? "Cập nhật" : "Lưu khách hàng"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
