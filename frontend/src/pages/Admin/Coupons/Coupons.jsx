import React, { useState, useEffect } from 'react';
import { 
  FiPlus, FiSearch, FiEdit2, FiTrash2, 
  FiChevronLeft, FiChevronRight, FiClock, FiDollarSign
} from 'react-icons/fi';
import couponService from '../../../services/couponService';
import './Coupons.css';
import StatsCard from '../../../components/admin/Dashboard/StatsCard';

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'PERCENT',
    discountValue: '',
    minOrderAmount: '',
    maxUsage: '',
    expiryDate: '',
    active: true
  });
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    used: 0
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const data = await couponService.getAllCoupons();
      setCoupons(data);
      
      // Calculate Stats
      const total = data.length;
      const active = data.filter(c => c.active).length;
      const used = data.reduce((acc, curr) => acc + (curr.currentUsage || 0), 0);
      setStats({ total, active, used });
    } catch (error) {
      console.error("Failed to fetch coupons:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await couponService.createCoupon(formData);
      setShowModal(false);
      resetForm();
      fetchCoupons();
    } catch (error) {
      console.error("Failed to create coupon:", error);
      alert("Lỗi khi tạo mã giảm giá. Vui lòng thử lại.");
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
    setFormData({
      code: '',
      discountType: 'PERCENT',
      discountValue: '',
      minOrderAmount: '',
      maxUsage: '',
      expiryDate: '',
      active: true
    });
  };

  return (
    <div className="coupons-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Quản lý Mã Giảm Giá</h1>
          <p className="page-subtitle">Tạo và quản lý các chương trình khuyến mãi</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <FiPlus size={20} />
          Tạo mã mới
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard 
          title="Tổng mã giảm giá" 
          value={stats.total} 
          icon={<FiDollarSign />} 
          trend="+2" 
          trendUp={true} 
        />
        <StatsCard 
          title="Đang hoạt động" 
          value={stats.active} 
          icon={<FiClock />} 
          trend="Active" 
          trendUp={true} 
        />
        <StatsCard 
          title="Lượt sử dụng" 
          value={stats.used} 
          icon={<FiSearch />} 
          trend="Used" 
          trendUp={true} 
        />
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow p-6">
        {/* Filters Bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-64">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Tìm kiếm mã code..." 
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-4">
            <select className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Tất cả trạng thái</option>
              <option>Hoạt động</option>
              <option>Hết hạn</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b text-gray-500 text-sm uppercase">
              <th className="py-3 px-4">Mã Code</th>
              <th className="py-3 px-4">Giảm giá</th>
              <th className="py-3 px-4">Đơn tối thiểu</th>
              <th className="py-3 px-4">Lượt dùng</th>
              <th className="py-3 px-4">Hết hạn</th>
              <th className="py-3 px-4">Trạng thái</th>
              <th className="py-3 px-4 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" className="text-center py-8">Loading...</td></tr>
            ) : coupons.length === 0 ? (
              <tr><td colSpan="7" className="text-center py-8 text-gray-500">Chưa có mã giảm giá nào</td></tr>
            ) : (
              coupons.map(coupon => (
                <tr key={coupon.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-blue-600 font-mono">{coupon.code}</td>
                  <td className="py-3 px-4">
                    {coupon.discountType === 'PERCENT' ? `${coupon.discountValue}%` : `${parseInt(coupon.discountValue).toLocaleString()}đ`}
                  </td>
                  <td className="py-3 px-4">
                    {coupon.minOrderAmount ? `${parseInt(coupon.minOrderAmount).toLocaleString()}đ` : '-'}
                  </td>
                  <td className="py-3 px-4">
                    {coupon.currentUsage} / {coupon.maxUsage || '∞'}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString() : 'Vĩnh viễn'}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${coupon.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {coupon.active ? 'Active' : 'Expired'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right flex justify-end gap-2">
                    <button className="text-gray-500 hover:text-blue-600 p-1"><FiEdit2 /></button>
                    <button onClick={() => handleDelete(coupon.id)} className="text-gray-500 hover:text-red-600 p-1"><FiTrash2 /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Tạo Mã Mới</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Mã Code (VD: SALE50)</label>
                  <input 
                    name="code" required
                    className="w-full border rounded px-3 py-2 uppercase font-mono"
                    value={formData.code} onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Loại giảm</label>
                    <select 
                      name="discountType"
                      className="w-full border rounded px-3 py-2"
                      value={formData.discountType} onChange={handleInputChange}
                    >
                      <option value="PERCENT">% Phần trăm</option>
                      <option value="FIXED">Số tiền cố định</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Giá trị giảm</label>
                    <input 
                      name="discountValue" type="number" required
                      className="w-full border rounded px-3 py-2"
                      value={formData.discountValue} onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Đơn tối thiểu</label>
                    <input 
                      name="minOrderAmount" type="number"
                      className="w-full border rounded px-3 py-2"
                      value={formData.minOrderAmount} onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Lượt dùng tối đa</label>
                    <input 
                      name="maxUsage" type="number"
                      className="w-full border rounded px-3 py-2"
                      value={formData.maxUsage} onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Ngày hết hạn</label>
                  <input 
                    name="expiryDate" type="datetime-local"
                    className="w-full border rounded px-3 py-2"
                    value={formData.expiryDate} onChange={handleInputChange}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" name="active" id="active"
                    checked={formData.active} onChange={handleInputChange}
                  />
                  <label htmlFor="active">Kích hoạt ngay</label>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded hover:bg-gray-50">Hủy</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Tạo Mã</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Coupons;
