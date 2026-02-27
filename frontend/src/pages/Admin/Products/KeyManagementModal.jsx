import React, { useState, useEffect } from "react";
import { FiX, FiPlus, FiTrash2, FiKey } from "react-icons/fi";
import productService from "../../../services/productService";
import "./KeyManagementModal.css";

const KeyManagementModal = ({ productId, productName, onClose }) => {
  const [keys, setKeys] = useState([]);
  const [newKey, setNewKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (productId) {
      fetchKeys();
    }
  }, [productId]);

  const fetchKeys = async () => {
    try {
      setFetching(true);
      const data = await productService.getProductKeys(productId);
      setKeys(data);
    } catch (error) {
      console.error("Failed to fetch keys:", error);
    } finally {
      setFetching(false);
    }
  };

  const handleAddKey = async (e) => {
    e.preventDefault();
    if (!newKey.trim()) return;

    setLoading(true);
    try {
      await productService.addProductKey(productId, { keyCode: newKey });
      setNewKey("");
      fetchKeys(); // Refresh list
    } catch (error) {
      console.error("Failed to add key:", error);
      alert("Lỗi khi thêm key. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteKey = async (keyId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa key này?")) return;

    try {
      await productService.deleteProductKey(keyId);
      fetchKeys(); // Refresh list
    } catch (error) {
      console.error("Failed to delete key:", error);
      alert("Lỗi khi xóa key.");
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content key-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <h2>Quản Lý Key Sản Phẩm</h2>
            <p className="modal-subtitle">{productName}</p>
          </div>
          <button className="close-btn" onClick={onClose}>
            <FiX size={24} />
          </button>
        </div>

        <div className="modal-body">
          {/* Form thêm mới */}
          <form className="add-key-form" onSubmit={handleAddKey}>
            <div className="input-with-icon">
              <FiKey className="input-icon" />
              <input
                type="text"
                placeholder="Nhập mã key mới (ví dụ: ABCD-1234-EFGH)..."
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              <FiPlus /> {loading ? "..." : "Thêm"}
            </button>
          </form>

          {/* Danh sách Key */}
          <div className="keys-list-container">
            <h3>Danh sách Key hiện có ({keys.length})</h3>
            {fetching ? (
              <div className="loading-state">Đang tải danh sách...</div>
            ) : keys.length === 0 ? (
              <div className="empty-state">Sản phẩm này chưa có key nào.</div>
            ) : (
              <table className="keys-table">
                <thead>
                  <tr>
                    <th>Mã Key</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {keys.map((k) => (
                    <tr key={k.id}>
                      <td className="font-mono">{k.keyCode}</td>
                      <td>
                        <span
                          className={`status-badge ${k.status === "AVAILABLE" ? "status-active" : "status-hidden"}`}
                        >
                          {k.status === "AVAILABLE" ? "Chưa bán" : "Đã bán"}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn-icon text-danger"
                          onClick={() => handleDeleteKey(k.id)}
                          title="Xóa Key"
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-outline" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default KeyManagementModal;
