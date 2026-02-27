import React from "react";
import { Link } from "react-router-dom";
import "./Logo.css";

const Logo = ({ disableLink = false }) => {
  const preventDefault = (e) => {
    if (disableLink) e.preventDefault();
  };

  if (disableLink) {
    return (
      <div className="neo-logo-link" style={{ cursor: "default" }}>
        <LogoContent />
      </div>
    );
  }

  return (
    <Link to="/" className="neo-logo-link" aria-label="NeoShop Home">
      <LogoContent />
    </Link>
  );
};

const LogoContent = () => (
  <>
    <svg
      className="neo-logo-icon"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0891b2" />
          <stop offset="50%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>

      {/* Shopping Bag Handle */}
      <path
        d="M22 20C22 14.4772 26.4772 10 32 10C37.5228 10 42 14.4772 42 20"
        stroke="url(#neonGradient)"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Shopping Bag Body - Geometric/Wireframe Style */}
      <path
        d="M14 20H50L54 50C54.6667 52 53 54 51 54H13C11 54 9.33333 52 10 50L14 20Z"
        stroke="url(#neonGradient)"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* Internal Geometric Details (Polygons) */}
      <path
        d="M14 20L32 36L50 20"
        stroke="url(#neonGradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
      <path
        d="M32 36V54"
        stroke="url(#neonGradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.8"
      />
      <path
        d="M12.5 40L32 36L51.5 40"
        stroke="url(#neonGradient)"
        strokeWidth="2"
        strokeLinejoin="round"
        opacity="0.7"
      />
    </svg>

    <div className="neo-logo-text">
      <span className="text-neo">Neo</span>
      <span className="text-shop">Shop</span>
    </div>
  </>
);

export default Logo;
