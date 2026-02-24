import { useState, useEffect } from 'react';
import { FiX, FiSearch, FiUser, FiPlus, FiTrash2, FiShoppingBag, FiSave } from 'react-icons/fi';
import userService from '../../../services/userService';
import productService from '../../../services/productService';
import orderService from '../../../services/orderService';

const ManualOrderModal = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchUser, setSearchUser] = useState('');
  const [searchProduct, setSearchProduct] = useState('');
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('BANK_TRANSFER');
  const [shippingAddress, setShippingAddress] = useState('Giao hàng qua Email');
  const [couponCode, setCouponCode] = useState('');

  // Fetch users when searching
  useEffect(() => {
    if (searchUser.length > 1) {
      const timer = setTimeout(async () => {
        try {
          const data = await userService.getAllUsers(0, 5); // Tạm thời dùng getAllUsers, nếu có search API thì tốt hơn
          // Lọc thủ công nếu backend chưa hỗ trợ search query cho users (hoặc update getAllUsers sau)
          const filtered = data.content.filter(u => 
            u.username.toLowerCase().includes(searchUser.toLowerCase()) || 
            u.email.toLowerCase().includes(searchUser.toLowerCase())
          );
          setUsers(filtered);
        } catch (error) {
          console.error(error);
        }
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setUsers([]);
    }
  }, [searchUser]);

  // Fetch products when searching
  useEffect(() => {
    if (searchProduct.length > 1) {
      const timer = setTimeout(async () => {
        try {
          const data = await productService.getAllProductsAdmin(0, 5, searchProduct);
          setProducts(data.content);
        } catch (error) {
          console.error(error);
        }
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setProducts([]);
    }
  }, [searchProduct]);

  const addItem = (product) => {
    setSelectedItems(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        return prev.map(item => 
          item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { 
        productId: product.id, 
        title: product.title, 
        price: product.salePrice || product.price, 
        quantity: 1 
      }];
    });
    setSearchProduct('');
    setProducts([]);
  };

  const removeItem = (productId) => {
    setSelectedItems(prev => prev.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId, delta) => {
    setSelectedItems(prev => prev.map(item => {
      if (item.productId === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const calculateTotal = () => {
    return selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser) return alert('Vui lòng chọn khách hàng');
    if (selectedItems.length === 0) return alert('Vui lòng chọn ít nhất 1 sản phẩm');

    try {
      setLoading(true);
      const orderRequest = {
        items: selectedItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        })),
        paymentMethod,
        shippingAddress,
        couponCode: couponCode || null
      };

      await orderService.adminCreateOrder(selectedUser.id, orderRequest);
      alert('Tạo đơn hàng thành công!');
      onSuccess();
      onClose();
      // Reset state
      setSelectedUser(null);
      setSelectedItems([]);
      setSearchUser('');
      setSearchProduct('');
    } catch (error) {
      console.error(error);
      alert('Lỗi: ' + (error.response?.data?.message || 'Không thể tạo đơn hàng'));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '800px', width: '95%' }}>
        <div className="modal-header">
          <h2 className="modal-title">Tạo Đơn Hàng Thủ Công</h2>
          <button className="close-btn" onClick={onClose}><FiX /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            {/* Left Column: Customer & Settings */}
            <div className="form-section">
              <div className="form-group">
                <label className="form-label">Khách hàng</label>
                {!selectedUser ? (
                  <div style={{ position: 'relative' }}>
                    <div className="search-wrapper" style={{ margin: 0 }}>
                      <FiSearch className="search-icon" />
                      <input 
                        type="text" 
                        className="search-input" 
                        placeholder="Tìm theo tên hoặc email..." 
                        value={searchUser}
                        onChange={(e) => setSearchUser(e.target.value)}
                      />
                    </div>
                    {users.length > 0 && (
                      <div className="search-results-dropdown" style={{
                        position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10,
                        background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)', marginTop: '4px'
                      }}>
                        {users.map(u => (
                          <div key={u.id} className="search-result-item" onClick={() => setSelectedUser(u)} style={{
                            padding: '0.75rem', cursor: 'pointer', borderBottom: '1px solid #f1f5f9'
                          }}>
                            <div style={{ fontWeight: 600 }}>{u.username}</div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{u.email}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="selected-customer-box" style={{
                    padding: '0.75rem', background: '#f8fafc', borderRadius: '8px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div>
                      <div style={{ fontWeight: 600 }}><FiUser /> {selectedUser.username}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{selectedUser.email}</div>
                    </div>
                    <button type="button" className="text-danger" onClick={() => setSelectedUser(null)}><FiTrash2 /></button>
                  </div>
                )}
              </div>

              <div className="form-group margin-top-md" style={{ marginTop: '1rem' }}>
                <label className="form-label">Phương thức thanh toán</label>
                <select className="form-control" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                  <option value="BANK_TRANSFER">Chuyển khoản ngân hàng</option>
                  <option value="MOMO">Ví MoMo</option>
                  <option value="VISA">Thẻ Quốc Tế (Visa/Master)</option>
                </select>
              </div>

              <div className="form-group margin-top-md" style={{ marginTop: '1rem' }}>
                <label className="form-label">Địa chỉ nhận hàng (Ghi chú)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={shippingAddress}
                  onChange={e => setShippingAddress(e.target.value)}
                />
              </div>

              <div className="form-group margin-top-md" style={{ marginTop: '1rem' }}>
                <label className="form-label">Mã giảm giá (Nếu có)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="CODE10" 
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value)}
                />
              </div>
            </div>

            {/* Right Column: Products & Items */}
            <div className="form-section">
              <div className="form-group">
                <label className="form-label">Sản phẩm</label>
                <div style={{ position: 'relative' }}>
                  <div className="search-wrapper" style={{ margin: 0 }}>
                    <FiSearch className="search-icon" />
                    <input 
                      type="text" 
                      className="search-input" 
                      placeholder="Tìm tên sản phẩm..." 
                      value={searchProduct}
                      onChange={(e) => setSearchProduct(e.target.value)}
                    />
                  </div>
                  {products.length > 0 && (
                    <div className="search-results-dropdown" style={{
                      position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10,
                      background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)', marginTop: '4px',
                      maxHeight: '200px', overflowY: 'auto'
                    }}>
                      {products.map(p => (
                        <div key={p.id} className="search-result-item" onClick={() => addItem(p)} style={{
                          padding: '0.75rem', cursor: 'pointer', borderBottom: '1px solid #f1f5f9',
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                        }}>
                          <div>
                            <div style={{ fontWeight: 600 }}>{p.title}</div>
                            <div style={{ fontSize: '0.8rem', color: '#10b981' }}>{p.salePrice || p.price} đ</div>
                          </div>
                          <FiPlus />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="items-list" style={{ marginTop: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.5rem', minHeight: '150px' }}>
                {selectedItems.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>
                    <FiShoppingBag size={32} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
                    <div>Chưa có sản phẩm</div>
                  </div>
                ) : (
                  selectedItems.map(item => (
                    <div key={item.productId} className="selected-item-row" style={{
                      padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      borderBottom: '1px solid #f1f5f9'
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{item.title}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{item.price.toLocaleString()} đ</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button type="button" className="btn-icon btn-sm" onClick={() => updateQuantity(item.productId, -1)} style={{ padding: '2px 6px' }}>-</button>
                        <span style={{ minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                        <button type="button" className="btn-icon btn-sm" onClick={() => updateQuantity(item.productId, 1)} style={{ padding: '2px 6px' }}>+</button>
                        <button type="button" className="text-danger" style={{ marginLeft: '1rem' }} onClick={() => removeItem(item.productId)}><FiTrash2 /></button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="order-summary" style={{ marginTop: '1.5rem', padding: '1rem', background: '#f8fafc', borderRadius: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem' }}>
                  <span>Tổng tiền ước tính:</span>
                  <span className="text-primary">{calculateTotal().toLocaleString()} đ</span>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer" style={{ marginTop: '2rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>Hủy</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Đang tạo...' : <><FiSave /> Tạo đơn hàng</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManualOrderModal;
