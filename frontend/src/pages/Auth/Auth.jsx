import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiMail,
  FiLock,
  FiUser,
  FiEye,
  FiEyeOff,
  FiCheck,
  FiAlertCircle,
} from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../../context/AuthContext";
import "./Auth.css";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

const Auth = () => {
  const { login, register, googleLogin } = useAuth();
  const navigate = useNavigate();

  // Trạng thái view: 'login', 'register', 'forgot'
  const [view, setView] = useState("login");

  // Trạng thái form
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Form đăng nhập
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  // Form đăng ký
  const [registerData, setRegisterData] = useState({
    username: "",
    emailOrPhone: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  // Form quên mật khẩu
  const [forgotEmail, setForgotEmail] = useState("");

  // Google OAuth callback
  const handleGoogleCallback = useCallback(
    async (response) => {
      if (response.credential) {
        setIsGoogleLoading(true);
        setMessage({ type: "", text: "" });
        try {
          const user = await googleLogin(response.credential);
          setMessage({
            type: "success",
            text: "Đăng nhập Google thành công! Đang chuyển hướng...",
          });
          setTimeout(() => {
            if (user.role === "admin") {
              navigate("/admin");
            } else {
              navigate("/");
            }
          }, 1000);
        } catch (error) {
          console.error("Google login error:", error);
          setMessage({
            type: "error",
            text:
              error.response?.data?.message ||
              "Đăng nhập Google thất bại. Vui lòng thử lại.",
          });
          setIsGoogleLoading(false);
        }
      }
    },
    [googleLogin, navigate],
  );

  // Initialize Google Identity Services
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID === "your_google_client_id") {
      return;
    }

    const initializeGoogle = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleCallback,
          auto_select: false,
          cancel_on_tap_outside: true,
        });
      }
    };

    // If the script is already loaded
    if (window.google?.accounts?.id) {
      initializeGoogle();
    } else {
      // Wait for script to load
      const checkInterval = setInterval(() => {
        if (window.google?.accounts?.id) {
          initializeGoogle();
          clearInterval(checkInterval);
        }
      }, 100);

      // Cleanup after 10 seconds
      const timeout = setTimeout(() => clearInterval(checkInterval), 10000);
      return () => {
        clearInterval(checkInterval);
        clearTimeout(timeout);
      };
    }
  }, [handleGoogleCallback]);

  // Trigger Google login popup
  const handleGoogleLogin = () => {
    if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID === "your_google_client_id") {
      setMessage({
        type: "error",
        text: "Chưa cấu hình Google Client ID. Vui lòng liên hệ quản trị viên.",
      });
      return;
    }

    if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed()) {
          // Fallback: Use the One Tap couldn't display, try popup
          // This can happen if third-party cookies are blocked
          setMessage({
            type: "info",
            text: "Không thể hiển thị popup Google. Hãy kiểm tra trình duyệt cho phép popup.",
          });
        }
      });
    } else {
      setMessage({
        type: "error",
        text: "Google Identity Services chưa sẵn sàng. Vui lòng tải lại trang.",
      });
    }
  };

  // Các hàm xử lý
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const user = await login(loginData.email, loginData.password);
      setMessage({
        type: "success",
        text: "Đăng nhập thành công! Đang chuyển hướng...",
      });

      setTimeout(() => {
        if (user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }, 1000);
    } catch (error) {
      setMessage({
        type: "error",
        text: "Đăng nhập thất bại. Vui lòng kiểm tra lại.",
      });
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    // Kiểm tra validation
    const usernameRegex = /^[a-zA-Z0-9._-]{4,20}$/;
    if (!usernameRegex.test(registerData.username)) {
      setMessage({
        type: "error",
        text: "Tên đăng nhập (4-20 ký tự) chỉ chứa chữ cái, số, _, -, .",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerData.emailOrPhone)) {
      setMessage({ type: "error", text: "Email không hợp lệ!" });
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      setMessage({ type: "error", text: "Mật khẩu nhập lại không khớp!" });
      return;
    }

    const passwordRegex =
      /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!_]).{8,}$/;
    if (!passwordRegex.test(registerData.password)) {
      setMessage({
        type: "error",
        text: "Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt!",
      });
      return;
    }

    if (!registerData.agreeTerms) {
      setMessage({
        type: "error",
        text: "Vui lòng đồng ý với điều khoản dịch vụ!",
      });
      return;
    }

    setIsLoading(true);

    const result = await register(
      registerData.username,
      registerData.emailOrPhone,
      registerData.password,
    );

    setIsLoading(false);

    if (result.success) {
      setMessage({
        type: "success",
        text: "Đăng ký thành công! Đang chuyển hướng...",
      });
      setTimeout(() => navigate("/"), 1500);
    } else {
      setMessage({ type: "error", text: result.message });
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    setTimeout(() => {
      setIsLoading(false);
      setMessage({
        type: "success",
        text: "Đã gửi email khôi phục mật khẩu! Vui lòng kiểm tra hộp thư.",
      });
    }, 1500);
  };

  const switchView = (newView) => {
    setView(newView);
    setMessage({ type: "", text: "" });
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        {/* LOGIN FORM */}
        {view === "login" && (
          <div className="form-wrapper">
            <div className="form-header">
              <h2>Đăng nhập</h2>
              <p>Chào mừng bạn quay lại! Vui lòng đăng nhập.</p>
            </div>

            {/* Social Login - Google Only */}
            <div className="social-login">
              <button
                className={`social-btn google full-width ${isGoogleLoading ? "loading" : ""}`}
                onClick={handleGoogleLogin}
                disabled={isGoogleLoading}
              >
                <FcGoogle size={20} />
                <span>
                  {isGoogleLoading
                    ? "Đang xử lý..."
                    : "Tiếp tục với Google"}
                </span>
              </button>
            </div>

            <div className="divider">
              <span>hoặc đăng nhập với email</span>
            </div>

            {/* Message */}
            {message.text && (
              <div className={`message ${message.type}`}>
                {message.type === "error" ? <FiAlertCircle /> : <FiCheck />}
                {message.text}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="input-group">
                <div className="input-wrapper">
                  <FiMail className="input-icon" />
                  <input
                    type="text"
                    placeholder="Email hoặc Tên đăng nhập"
                    value={loginData.email}
                    onChange={(e) =>
                      setLoginData({ ...loginData, email: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <div className="input-wrapper">
                  <FiLock className="input-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Mật khẩu của bạn"
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
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
                    onChange={(e) =>
                      setLoginData({ ...loginData, remember: e.target.checked })
                    }
                  />
                  <span className="checkmark"></span>
                  Ghi nhớ đăng nhập
                </label>
                <button
                  type="button"
                  className="forgot-link"
                  onClick={() => switchView("forgot")}
                >
                  Quên mật khẩu?
                </button>
              </div>

              <button
                type="submit"
                className={`submit-btn ${isLoading ? "loading" : ""}`}
                disabled={isLoading}
              >
                {isLoading ? "Đang xử lý..." : "Đăng nhập"}
              </button>
            </form>

            <p className="switch-form">
              Chưa có tài khoản?
              <button onClick={() => switchView("register")}>
                Đăng ký ngay
              </button>
            </p>
          </div>
        )}

        {/* REGISTER FORM */}
        {view === "register" && (
          <div className="form-wrapper">
            <div className="form-header">
              <h2>Đăng ký tài khoản</h2>
              <p>Tạo tài khoản mới để mua sắm dễ dàng hơn.</p>
            </div>

            {/* Social Register - Google Only */}
            <div className="social-login">
              <button
                className={`social-btn google full-width ${isGoogleLoading ? "loading" : ""}`}
                onClick={handleGoogleLogin}
                disabled={isGoogleLoading}
              >
                <FcGoogle size={20} />
                <span>
                  {isGoogleLoading
                    ? "Đang xử lý..."
                    : "Đăng ký với Google"}
                </span>
              </button>
            </div>

            <div className="divider">
              <span>hoặc đăng ký với email</span>
            </div>

            {/* Message */}
            {message.text && (
              <div className={`message ${message.type}`}>
                {message.type === "error" ? <FiAlertCircle /> : <FiCheck />}
                {message.text}
              </div>
            )}

            <form onSubmit={handleRegister}>
              <div className="input-group">
                <div className="input-wrapper">
                  <FiUser className="input-icon" />
                  <input
                    type="text"
                    placeholder="Tên đăng nhập"
                    value={registerData.username}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        username: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <div className="input-wrapper">
                  <FiMail className="input-icon" />
                  <input
                    type="text"
                    placeholder="Email"
                    value={registerData.emailOrPhone}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        emailOrPhone: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <div className="input-wrapper">
                  <FiLock className="input-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Mật khẩu"
                    value={registerData.password}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        password: e.target.value,
                      })
                    }
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
                <div className="input-wrapper">
                  <FiLock className="input-icon" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Nhập lại mật khẩu"
                    value={registerData.confirmPassword}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        confirmPassword: e.target.value,
                      })
                    }
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
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        agreeTerms: e.target.checked,
                      })
                    }
                  />
                  <span className="checkmark"></span>
                  Tôi đồng ý với <Link to="/terms">Điều khoản dịch vụ</Link>
                </label>
              </div>

              <button
                type="submit"
                className={`submit-btn ${isLoading ? "loading" : ""}`}
                disabled={isLoading}
              >
                {isLoading ? "Đang xử lý..." : "Đăng ký"}
              </button>
            </form>

            <p className="switch-form">
              Đã có tài khoản?
              <button onClick={() => switchView("login")}>Đăng nhập</button>
            </p>
          </div>
        )}

        {/* FORGOT PASSWORD FORM */}
        {view === "forgot" && (
          <div className="form-wrapper">
            <div className="form-header">
              <h2>Quên mật khẩu?</h2>
              <p>Nhập email của bạn để nhận link khôi phục mật khẩu.</p>
            </div>

            {/* Message */}
            {message.text && (
              <div className={`message ${message.type}`}>
                {message.type === "error" ? <FiAlertCircle /> : <FiCheck />}
                {message.text}
              </div>
            )}

            <form onSubmit={handleForgotPassword}>
              <div className="input-group">
                <div className="input-wrapper">
                  <FiMail className="input-icon" />
                  <input
                    type="email"
                    placeholder="Nhập Email để nhận mã khôi phục"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className={`submit-btn ${isLoading ? "loading" : ""}`}
                disabled={isLoading}
              >
                {isLoading ? "Đang gửi..." : "Gửi link khôi phục"}
              </button>
            </form>

            <p className="switch-form">
              Nhớ mật khẩu rồi?
              <button onClick={() => switchView("login")}>
                Quay lại đăng nhập
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;
