import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiMail, FiLock, FiUser, FiPhone, FiEye, FiEyeOff, 
  FiArrowLeft, FiCheck, FiAlertCircle
} from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const Auth = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  // Trạng thái view: 'login', 'register', 'forgot'
  const [view, setView] = useState('login');
  
  // Trạng thái form
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Form đăng nhập
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    remember: false
  });

  // Form đăng ký
  const [registerData, setRegisterData] = useState({
    username: '',
    emailOrPhone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });

  // Form quên mật khẩu
  const [forgotEmail, setForgotEmail] = useState('');

  // Các hàm xử lý
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      const user = await login(loginData.email, loginData.password);
      setMessage({ type: 'success', text: 'Đăng nhập thành công! Đang chuyển hướng...' });
      
      setTimeout(() => {
        if (user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }, 1000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Đăng nhập thất bại. Vui lòng kiểm tra lại.' });
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    // Kiểm tra validation
    if (registerData.password !== registerData.confirmPassword) {
      setMessage({ type: 'error', text: 'Mật khẩu nhập lại không khớp!' });
      return;
    }

    if (registerData.password.length < 6) {
      setMessage({ type: 'error', text: 'Mật khẩu phải có ít nhất 6 ký tự!' });
      return;
    }

    if (!registerData.agreeTerms) {
      setMessage({ type: 'error', text: 'Vui lòng đồng ý với điều khoản dịch vụ!' });
      return;
    }

    setIsLoading(true);
    
    const result = await register(registerData.username, registerData.emailOrPhone, registerData.password);
    
    setIsLoading(false);
    
    if (result.success) {
      setMessage({ type: 'success', text: 'Đăng ký thành công! Đang chuyển hướng...' });
      setTimeout(() => navigate('/'), 1500);
    } else {
      setMessage({ type: 'error', text: result.message });
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });
    
    setTimeout(() => {
      setIsLoading(false);
      setMessage({ type: 'success', text: 'Đã gửi email khôi phục mật khẩu! Vui lòng kiểm tra hộp thư.' });
    }, 1500);
  };

  const handleSocialLogin = (provider) => {
    setMessage({ type: 'info', text: `Đang kết nối với ${provider}...` });
  };

  const switchView = (newView) => {
    setView(newView);
    setMessage({ type: '', text: '' });
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        {/* LOGIN FORM */}
        {view === 'login' && (
          <div className="form-wrapper">
            <div className="form-header">
              <h2>Đăng nhập</h2>
              <p>Chào mừng bạn quay lại! Vui lòng đăng nhập.</p>
            </div>

            {/* Social Login */}
            <div className="social-login">
              <button 
                className="social-btn google"
                onClick={() => handleSocialLogin('Google')}
              >
                <FcGoogle size={20} />
                <span>Google</span>
              </button>
              <button 
                className="social-btn facebook"
                onClick={() => handleSocialLogin('Facebook')}
              >
                <FaFacebook size={20} />
                <span>Facebook</span>
              </button>
            </div>

            <div className="divider">
              <span>hoặc đăng nhập với email</span>
            </div>

            {/* Message */}
            {message.text && (
              <div className={`message ${message.type}`}>
                {message.type === 'error' ? <FiAlertCircle /> : <FiCheck />}
                {message.text}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="input-group">
                <label>Email hoặc số điện thoại</label>
                <div className="input-wrapper">
                  <FiMail className="input-icon" />
                  <input
                    type="text"
                    placeholder="example@email.com"
                    value={loginData.email}
                    onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Mật khẩu</label>
                <div className="input-wrapper">
                  <FiLock className="input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Nhập mật khẩu"
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                    required
                  />
                  <button 
                    type="button" 
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <div className="form-options">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={loginData.remember}
                    onChange={(e) => setLoginData({...loginData, remember: e.target.checked})}
                  />
                  <span className="checkmark"></span>
                  Ghi nhớ đăng nhập
                </label>
                <button 
                  type="button" 
                  className="forgot-link"
                  onClick={() => switchView('forgot')}
                >
                  Quên mật khẩu?
                </button>
              </div>

              <button 
                type="submit" 
                className={`submit-btn ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
              </button>
            </form>

            <p className="switch-form">
              Chưa có tài khoản? 
              <button onClick={() => switchView('register')}>Đăng ký ngay</button>
            </p>
          </div>
        )}

        {/* REGISTER FORM */}
        {view === 'register' && (
          <div className="form-wrapper">
            <div className="form-header">
              <h2>Đăng ký tài khoản</h2>
              <p>Tạo tài khoản mới để mua sắm dễ dàng hơn.</p>
            </div>

            {/* Social Register */}
            <div className="social-login">
              <button 
                className="social-btn google"
                onClick={() => handleSocialLogin('Google')}
              >
                <FcGoogle size={20} />
                <span>Google</span>
              </button>
              <button 
                className="social-btn facebook"
                onClick={() => handleSocialLogin('Facebook')}
              >
                <FaFacebook size={20} />
                <span>Facebook</span>
              </button>
            </div>

            <div className="divider">
              <span>hoặc đăng ký với email</span>
            </div>

            {/* Message */}
            {message.text && (
              <div className={`message ${message.type}`}>
                {message.type === 'error' ? <FiAlertCircle /> : <FiCheck />}
                {message.text}
              </div>
            )}

            <form onSubmit={handleRegister}>
              <div className="input-group">
                <label>Tên đăng nhập</label>
                <div className="input-wrapper">
                  <FiUser className="input-icon" />
                  <input
                    type="text"
                    placeholder="Nhập tên đăng nhập"
                    value={registerData.username}
                    onChange={(e) => setRegisterData({...registerData, username: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Email hoặc số điện thoại</label>
                <div className="input-wrapper">
                  <FiMail className="input-icon" />
                  <input
                    type="text"
                    placeholder="example@email.com hoặc 0912345678"
                    value={registerData.emailOrPhone}
                    onChange={(e) => setRegisterData({...registerData, emailOrPhone: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Mật khẩu</label>
                <div className="input-wrapper">
                  <FiLock className="input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Tối thiểu 6 ký tự"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                    required
                  />
                  <button 
                    type="button" 
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <div className="input-group">
                <label>Nhập lại mật khẩu</label>
                <div className="input-wrapper">
                  <FiLock className="input-icon" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Nhập lại mật khẩu"
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                    required
                  />
                  <button 
                    type="button" 
                    className="toggle-password"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <div className="form-options">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={registerData.agreeTerms}
                    onChange={(e) => setRegisterData({...registerData, agreeTerms: e.target.checked})}
                  />
                  <span className="checkmark"></span>
                  Tôi đồng ý với <Link to="/terms">Điều khoản dịch vụ</Link>
                </label>
              </div>

              <button 
                type="submit" 
                className={`submit-btn ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? 'Đang xử lý...' : 'Đăng ký'}
              </button>
            </form>

            <p className="switch-form">
              Đã có tài khoản? 
              <button onClick={() => switchView('login')}>Đăng nhập</button>
            </p>
          </div>
        )}

        {/* FORGOT PASSWORD FORM */}
        {view === 'forgot' && (
          <div className="form-wrapper">
            <div className="form-header">
              <h2>Quên mật khẩu?</h2>
              <p>Nhập email của bạn để nhận link khôi phục mật khẩu.</p>
            </div>

            {/* Message */}
            {message.text && (
              <div className={`message ${message.type}`}>
                {message.type === 'error' ? <FiAlertCircle /> : <FiCheck />}
                {message.text}
              </div>
            )}

            <form onSubmit={handleForgotPassword}>
              <div className="input-group">
                <label>Email</label>
                <div className="input-wrapper">
                  <FiMail className="input-icon" />
                  <input
                    type="email"
                    placeholder="Nhập email đã đăng ký"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className={`submit-btn ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? 'Đang gửi...' : 'Gửi link khôi phục'}
              </button>
            </form>

            <p className="switch-form">
              Nhớ mật khẩu rồi? 
              <button onClick={() => switchView('login')}>Quay lại đăng nhập</button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;
