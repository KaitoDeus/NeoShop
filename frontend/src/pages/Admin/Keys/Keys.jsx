import { useState, useEffect } from "react";
import {
  FiPlus,
  FiSearch,
  FiCalendar,
  FiUploadCloud,
  FiEye,
  FiEyeOff,
  FiCopy,
  FiX,
  FiCheck,
  FiChevronLeft,
  FiChevronRight,
  FiTrash2,
} from "react-icons/fi";
import StatsCard from "../../../components/admin/Dashboard/StatsCard";
import productService from "../../../services/productService";
import "./Keys.css";

const Keys = () => {
  // Data states
  const [keys, setKeys] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [filters, setFilters] = useState({
    query: "",
    productId: "",
    status: "",
    page: 0,
    size: 10,
  });
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [visibleKeyId, setVisibleKeyId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    productId: "",
    keyCodes: "",
    note: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchKeys();
  }, [filters]);

  const fetchProducts = async () => {
    try {
      const data = await productService.getAllProductsAdmin(0, 100);
      setProducts(data.content || []);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  const fetchKeys = async () => {
    try {
      setLoading(true);
      const data = await productService.searchKeys(filters);
      setKeys(data.content || []);
      setTotalElements(data.totalElements || 0);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      console.error("Failed to fetch keys:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value, page: 0 }));
  };

  const toggleKeyVisibility = (id) => {
    setVisibleKeyId(visibleKeyId === id ? null : id);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    // Optional: show toast
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa key này?")) return;
    try {
      await productService.deleteProductKey(id);
      fetchKeys();
    } catch (error) {
      console.error("Failed to delete key:", error);
    }
  };

  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    if (!formData.productId || !formData.keyCodes) {
      alert("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    setSubmitting(true);
    try {
      const codes = formData.keyCodes
        .split("\n")
        .filter((c) => c.trim() !== "");
      await productService.bulkAddKeys({
        productId: formData.productId,
        keyCodes: codes,
      });
      setShowAddModal(false);
      setFormData({ productId: "", keyCodes: "", note: "" });
      fetchKeys();
    } catch (error) {
      console.error("Failed to bulk add keys:", error);
      alert("Lỗi khi nhập kho. Vui lòng kiểm tra lại.");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "AVAILABLE":
        return (
          <span className="status-badge badge-available">
            <span className="status-dot"></span>Chưa bán
          </span>
        );
      case "SOLD":
        return <span className="status-badge badge-sold">Đã bán</span>;
      default:
        return <span className="status-badge status-hidden">{status}</span>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("vi-VN"),
      time: date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  return (
    <div className="keys-page">
      {/* 1. Header & Actions */}
      <div className="page-header">
        <div>
          <div
            style={{
              fontSize: "0.85rem",
              color: "#64748b",
              marginBottom: "0.5rem",
            }}
          >
            Trang chủ / Sản phẩm / Quản lý kho Key
          </div>
          <h1 className="page-title">Quản lý Kho Key</h1>
          <p className="page-subtitle">
            Quản lý danh sách mã thẻ, tài khoản số và nhập kho hàng loạt.
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            className="btn-primary"
            style={{ background: "#7c3aed" }}
            onClick={() => setShowAddModal(true)}
          >
            <FiUploadCloud /> Nhập kho hàng loạt
          </button>
        </div>
      </div>

      {/* 2. Stats (Static for now, but could be connected) */}
      <div
        className="stats-grid"
        style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
      >
        <StatsCard
          id={1}
          title="Tổng số Key"
          value={totalElements}
          icon={<FiCheck />}
          color="#2563eb"
        />
        <StatsCard
          id={2}
          title="Key Sẵn có"
          value={keys.filter((k) => k.status === "AVAILABLE").length}
          icon={<FiPlus />}
          color="#10b981"
        />
        <StatsCard
          id={3}
          title="Đã bán"
          value={
            totalElements - keys.filter((k) => k.status === "AVAILABLE").length
          }
          icon={<FiCalendar />}
          color="#f59e0b"
        />
      </div>

      {/* 3. Table Section */}
      <div className="products-table-container">
        {/* Filters */}
        <div className="filters-bar">
          <div className="search-wrapper">
            <FiSearch className="search-icon" />
            <input
              type="text"
              name="query"
              placeholder="Tìm theo mã key, tên sản phẩm..."
              className="search-input"
              value={filters.query}
              onChange={handleFilterChange}
            />
          </div>

          <div className="filter-group">
            <select
              className="filter-select"
              name="productId"
              value={filters.productId}
              onChange={handleFilterChange}
            >
              <option value="">Tất cả sản phẩm</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>

            <select
              className="filter-select"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">Tất cả trạng thái</option>
              <option value="AVAILABLE">Chưa bán</option>
              <option value="SOLD">Đã bán</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Sản phẩm</th>
              <th>Mã Key / Tài khoản</th>
              <th>Ngày nhập</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="6"
                  style={{ textAlign: "center", padding: "2rem" }}
                >
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : keys.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  style={{ textAlign: "center", padding: "2rem" }}
                >
                  Không tìm thấy key nào.
                </td>
              </tr>
            ) : (
              keys.map((item) => {
                const dateTime = formatDate(item.createdAt);
                return (
                  <tr key={item.id}>
                    <td style={{ color: "#94a3b8", fontSize: "0.75rem" }}>
                      #{item.id.substring(0, 8)}
                    </td>
                    <td>
                      <div className="font-medium text-primary">
                        {item.productTitle}
                      </div>
                    </td>
                    <td>
                      <div className="key-code-wrapper">
                        <span style={{ fontFamily: "monospace" }}>
                          {visibleKeyId === item.id
                            ? item.keyCode
                            : "••••-••••-••••-••••"}
                        </span>
                        <button
                          className="icon-btn-sm"
                          onClick={() => toggleKeyVisibility(item.id)}
                        >
                          {visibleKeyId === item.id ? <FiEyeOff /> : <FiEye />}
                        </button>
                        <button
                          className="icon-btn-sm"
                          title="Sao chép"
                          onClick={() => handleCopy(item.keyCode)}
                        >
                          <FiCopy />
                        </button>
                      </div>
                    </td>
                    <td className="text-secondary">
                      <div>{dateTime.date}</div>
                      <div style={{ fontSize: "0.75rem" }}>{dateTime.time}</div>
                    </td>
                    <td>{getStatusBadge(item.status)}</td>
                    <td>
                      <button
                        className="icon-btn text-danger"
                        onClick={() => handleDelete(item.id)}
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="table-footer">
          <div className="table-info">
            Hiển thị {keys.length} trong số {totalElements} key
          </div>
          <div className="pagination">
            <button
              className="page-btn"
              disabled={filters.page === 0}
              onClick={() =>
                setFilters((prev) => ({ ...prev, page: prev.page - 1 }))
              }
            >
              <FiChevronLeft />
            </button>
            <button className="page-btn active">{filters.page + 1}</button>
            <button
              className="page-btn"
              disabled={filters.page >= totalPages - 1}
              onClick={() =>
                setFilters((prev) => ({ ...prev, page: prev.page + 1 }))
              }
            >
              <FiChevronRight />
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Add Key Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Nhập kho hàng loạt</h3>
              <button
                className="close-btn"
                onClick={() => setShowAddModal(false)}
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={handleBulkSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">
                    Sản phẩm <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select"
                    required
                    value={formData.productId}
                    onChange={(e) =>
                      setFormData({ ...formData, productId: e.target.value })
                    }
                  >
                    <option value="">Chọn sản phẩm...</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Danh sách Mã Key / Tài khoản{" "}
                    <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className="form-textarea"
                    placeholder="Nhập mã key ở đây...&#10;Key 1&#10;Key 2&#10;Key 3"
                    style={{ minHeight: "150px" }}
                    required
                    value={formData.keyCodes}
                    onChange={(e) =>
                      setFormData({ ...formData, keyCodes: e.target.value })
                    }
                  ></textarea>
                  <p className="helper-text">
                    Mỗi dòng 1 key. Hệ thống sẽ tự động tách.
                  </p>
                </div>

                <div className="form-group">
                  <label className="form-label">Ghi chú (Nội bộ)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Ghi chú (tuỳ chọn)"
                    value={formData.note}
                    onChange={(e) =>
                      setFormData({ ...formData, note: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => setShowAddModal(false)}
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={submitting}
                >
                  {submitting ? "Đang nhập kho..." : "Nhập kho ngay"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Keys;
