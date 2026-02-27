import React, { useState, useEffect } from "react";
import {
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiDollarSign,
  FiX,
  FiSave,
} from "react-icons/fi";
import couponService from "../../../services/couponService";
import "./Coupons.css";
import StatsCard from "../../../components/admin/Dashboard/StatsCard";

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    code: "",
    discountType: "PERCENT",
    discountValue: "",
    minOrderAmount: "",
    maxUsage: "",
    expiryDate: "",
    active: true,
  });
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    used: 0,
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const data = await couponService.getAllCoupons();
      setCoupons(data);

      const total = data.length;
      const active = data.filter((c) => c.active).length;
      const used = data.reduce(
        (acc, curr) => acc + (curr.currentUsage || 0),
        0,
      );
      setStats({ total, active, used });
    } catch (error) {
      console.error("Failed to fetch coupons:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEdit = (coupon) => {
    setEditingId(coupon.id);
    setFormData({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderAmount: coupon.minOrderAmount || "",
      maxUsage: coupon.maxUsage || "",
      expiryDate: coupon.expiryDate ? coupon.expiryDate.split(".")[0] : "", // Format for datetime-local
      active: coupon.active,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await couponService.updateCoupon(editingId, formData);
      } else {
        await couponService.createCoupon(formData);
      }
      setShowModal(false);
      resetForm();
      fetchCoupons();
    } catch (error) {
      console.error("Failed to save coupon:", error);
      alert("Lỗi khi lưu mã giảm giá.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa mã giảm giá này?")) {
      try {
        await couponService.deleteCoupon(id);
        fetchCoupons();
      } catch (error) {
        console.error("Failed to delete coupon:", error);
      }
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      code: "",
      discountType: "PERCENT",
      discountValue: "",
      minOrderAmount: "",
      maxUsage: "",
      expiryDate: "",
      active: true,
    });
  };

  const handleCreateNew = () => {
    resetForm();
    setShowModal(true);
  };

  return (
    <div className="coupons-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Quản lý Mã Giảm Giá</h1>
          <p className="page-subtitle">
            Tạo và quản lý các chương trình khuyến mãi cho khách hàng
          </p>
        </div>
        <button className="btn-primary" onClick={handleCreateNew}>
          <FiPlus size={20} />
          Tạo mã mới
        </button>
      </div>

      <div className="stats-grid">
        <StatsCard
          title="Tổng mã"
          value={stats.total}
          icon={<FiDollarSign />}
          color="blue"
        />
        <StatsCard
          title="Đang hoạt động"
          value={stats.active}
          icon={<FiClock />}
          color="green"
        />
        <StatsCard
          title="Lượt sử dụng"
          value={stats.used}
          icon={<FiSearch />}
          color="purple"
        />
      </div>

      <div
        className="products-table-container mt-6"
        style={{ marginTop: "2rem" }}
      >
        <div className="filters-bar">
          <div className="search-wrapper">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Tìm kiếm mã code..."
              className="search-input"
            />
          </div>
          <div className="filter-group">
            <select className="filter-select">
              <option>Tất cả trạng thái</option>
              <option>Hoạt động</option>
              <option>Hết hạn</option>
            </select>
          </div>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Mã Code</th>
              <th>Giảm giá</th>
              <th>Đơn tối thiểu</th>
              <th>Lượt dùng</th>
              <th>Hết hạn</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="7"
                  style={{ textAlign: "center", padding: "2rem" }}
                >
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : coupons.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  style={{ textAlign: "center", padding: "2rem" }}
                >
                  Chưa có mã giảm giá nào.
                </td>
              </tr>
            ) : (
              coupons.map((coupon) => (
                <tr key={coupon.id}>
                  <td>
                    <span className="coupon-code">{coupon.code}</span>
                  </td>
                  <td className="font-bold">
                    {coupon.discountType === "PERCENT"
                      ? `${coupon.discountValue}%`
                      : `${parseInt(coupon.discountValue).toLocaleString()}đ`}
                  </td>
                  <td>
                    {coupon.minOrderAmount
                      ? `${parseInt(coupon.minOrderAmount).toLocaleString()}đ`
                      : "-"}
                  </td>
                  <td>
                    {coupon.currentUsage} / {coupon.maxUsage || "∞"}
                  </td>
                  <td>
                    {coupon.expiryDate
                      ? new Date(coupon.expiryDate).toLocaleDateString()
                      : "Vĩnh viễn"}
                  </td>
                  <td>
                    <span
                      className={`status-badge ${coupon.active ? "status-active" : "status-hidden"}`}
                    >
                      <span className="status-dot"></span>
                      {coupon.active ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td>
                    <div className="action-btn-group">
                      <button
                        className="btn-icon"
                        onClick={() => handleEdit(coupon)}
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        onClick={() => handleDelete(coupon.id)}
                        className="btn-icon text-danger"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "500px" }}
          >
            <div className="modal-header">
              <h2 className="modal-title">
                {editingId ? "Chỉnh Sửa Mã" : "Tạo Mã Mới"}
              </h2>
              <button onClick={() => setShowModal(false)} className="close-btn">
                <FiX size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Mã Code (VD: SALE50)</label>
                  <input
                    name="code"
                    required
                    className="form-input text-uppercase font-mono"
                    style={{ textTransform: "uppercase" }}
                    value={formData.code}
                    onChange={handleInputChange}
                  />
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1rem",
                  }}
                >
                  <div className="form-group">
                    <label className="form-label">Loại giảm</label>
                    <select
                      name="discountType"
                      className="form-select"
                      value={formData.discountType}
                      onChange={handleInputChange}
                    >
                      <option value="PERCENT">% Phần trăm</option>
                      <option value="FIXED">Số tiền cố định</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Giá trị giảm</label>
                    <input
                      name="discountValue"
                      type="number"
                      required
                      className="form-input"
                      value={formData.discountValue}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1rem",
                  }}
                >
                  <div className="form-group">
                    <label className="form-label">Đơn tối thiểu</label>
                    <input
                      name="minOrderAmount"
                      type="number"
                      className="form-input"
                      value={formData.minOrderAmount}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Lượt dùng tối đa</label>
                    <input
                      name="maxUsage"
                      type="number"
                      className="form-input"
                      value={formData.maxUsage}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Ngày hết hạn</label>
                  <input
                    name="expiryDate"
                    type="datetime-local"
                    className="form-input"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div
                  className="form-group"
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <input
                    type="checkbox"
                    name="active"
                    id="active"
                    checked={formData.active}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="active">Kích hoạt</label>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-outline"
                >
                  Hủy
                </button>
                <button type="submit" className="btn-primary">
                  <FiSave /> {editingId ? "Cập nhật" : "Tạo Mã"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Coupons;
