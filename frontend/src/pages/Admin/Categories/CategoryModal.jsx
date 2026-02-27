import { useState, useEffect } from "react";
import { FiX, FiSave, FiTag, FiLink, FiImage, FiLayers } from "react-icons/fi";

const CategoryModal = ({ category, categories, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    iconUrl: "",
    parentId: null,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || "",
        slug: category.slug || "",
        iconUrl: category.iconUrl || "",
        parentId: category.parentId || null,
      });
    } else {
      setFormData({
        name: "",
        slug: "",
        iconUrl: "",
        parentId: null,
      });
    }
  }, [category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const finalValue = name === "parentId" && value === "" ? null : value;

    setFormData((prev) => {
      const newData = { ...prev, [name]: finalValue };

      // Auto-generate slug from name if creating or if slug is empty
      if (name === "name" && (!category || !prev.slug)) {
        newData.slug = value
          .toLowerCase()
          .replace(/ /g, "-")
          .replace(
            /[vnàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/gi,
            (c) => {
              const map = {
                à: "a",
                á: "a",
                ạ: "a",
                ả: "a",
                ã: "a",
                â: "a",
                ầ: "a",
                ấ: "a",
                ậ: "a",
                ẩ: "a",
                ẫ: "a",
                ă: "a",
                ằ: "a",
                ắ: "a",
                ặ: "a",
                ẳ: "a",
                ẵ: "a",
                è: "e",
                é: "e",
                ẹ: "e",
                ẻ: "e",
                ẽ: "e",
                ê: "e",
                ề: "e",
                ế: "e",
                ệ: "e",
                ể: "e",
                ễ: "e",
                ì: "i",
                í: "i",
                ị: "i",
                ỉ: "i",
                ĩ: "i",
                ò: "o",
                ó: "o",
                ọ: "o",
                ỏ: "o",
                õ: "o",
                ô: "o",
                ồ: "o",
                ố: "o",
                ộ: "o",
                ổ: "o",
                ỗ: "o",
                ơ: "o",
                ờ: "o",
                ớ: "o",
                ợ: "o",
                ở: "o",
                ỡ: "o",
                ù: "u",
                ú: "u",
                ụ: "u",
                ủ: "u",
                ũ: "u",
                ư: "u",
                ừ: "u",
                ứ: "u",
                ự: "u",
                ử: "u",
                ữ: "u",
                ỳ: "y",
                ý: "y",
                ỵ: "y",
                ỷ: "y",
                ỹ: "y",
                đ: "d",
              };
              return map[c.toLowerCase()] || c.toLowerCase();
            },
          )
          .replace(/[^\w-]+/g, "");
      }
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.slug) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    setLoading(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error(error);
      const errorMsg =
        error.response?.data?.message ||
        "Lỗi khi lưu danh mục. Vui lòng kiểm tra lại slug (phải là duy nhất).";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {category ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
          </h2>
          <button className="close-btn" onClick={onClose}>
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">
                <FiTag style={{ marginBottom: -2, marginRight: 6 }} />
                Tên danh mục <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="name"
                className="form-input"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Ví dụ: Window Licenses"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <FiLink style={{ marginBottom: -2, marginRight: 6 }} />
                Slug (Đường dẫn) <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="slug"
                className="form-input"
                required
                value={formData.slug}
                onChange={handleChange}
                placeholder="vi-du-window-licenses"
              />
              <p className="helper-text">
                Hệ thống tự động tạo slug từ tên nếu để trống.
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">
                <FiLayers style={{ marginBottom: -2, marginRight: 6 }} />
                Danh mục cha
              </label>
              <select
                name="parentId"
                className="form-input"
                value={formData.parentId || ""}
                onChange={handleChange}
              >
                <option value="">Không có (Danh mục gốc)</option>
                {categories &&
                  categories
                    .filter((c) => c.id !== category?.id)
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                <FiImage style={{ marginBottom: -2, marginRight: 6 }} />
                URL Icon (Ảnh đại diện)
              </label>
              <input
                type="text"
                name="iconUrl"
                className="form-input"
                value={formData.iconUrl}
                onChange={handleChange}
                placeholder="https://neoshop.vn/icons/category.png"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-outline"
              onClick={onClose}
              style={{ padding: "0.6rem 1.2rem" }}
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{
                padding: "0.6rem 1.5rem",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <FiSave /> {loading ? "Đang lưu..." : "Lưu danh mục"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;
