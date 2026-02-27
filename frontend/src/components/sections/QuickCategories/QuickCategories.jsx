import React from "react";
import { FiGrid, FiFileText, FiMonitor, FiShield } from "react-icons/fi";
import { Link } from "react-router-dom";
import "./QuickCategories.css";

const categories = [
  {
    icon: <FiGrid />,
    color: "#3b82f6",
    bg: "rgba(59, 130, 246, 0.1)",
    title: "Key Windows",
    sub: "Win 10/11",
  },
  {
    icon: <FiFileText />,
    color: "#f97316",
    bg: "rgba(249, 115, 22, 0.1)",
    title: "Office",
    sub: "365 & Vĩnh viễn",
  },
  {
    icon: <FiMonitor />,
    color: "#e11d48",
    bg: "rgba(225, 29, 72, 0.1)",
    title: "Game",
    sub: "Steam & Xbox",
  },
  {
    icon: <FiShield />,
    color: "#10b981",
    bg: "rgba(16, 185, 129, 0.1)",
    title: "Bảo mật",
    sub: "VPN & Diệt Virus",
  },
];

const QuickCategories = () => {
  return (
    <section className="categories-section">
      <div className="container categories-grid">
        {categories.map((cat, index) => (
          <Link
            to="/category"
            key={index}
            className="category-card"
            style={{ textDecoration: "none" }}
          >
            <div
              className="category-icon"
              style={{ color: cat.color, backgroundColor: cat.bg }}
            >
              {cat.icon}
            </div>
            <div className="category-info">
              <h3>{cat.title}</h3>
              <p>{cat.sub}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default QuickCategories;
