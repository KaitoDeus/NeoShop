import {
  FiDollarSign,
  FiShoppingBag,
  FiKey,
  FiUsers,
  FiTrendingUp,
  FiTrendingDown,
  FiBox,
  FiCheckCircle,
  FiAlertTriangle,
  FiActivity,
  FiFileText,
  FiUserPlus,
  FiGrid,
  FiCheckSquare,
} from "react-icons/fi";
import "./DashboardWidgets.css";

const StatsCard = ({
  title,
  value,
  percent,
  isIncrease,
  compareText,
  iconType,
}) => {
  const getIcon = () => {
    switch (iconType) {
      case "money":
        return <FiDollarSign />;
      case "bag":
        return <FiShoppingBag />;
      case "key":
        return <FiKey />;
      case "user":
        return <FiUsers />;
      case "box":
        return <FiBox />;
      case "check":
        return <FiCheckCircle />;
      case "alert":
        return <FiAlertTriangle />;
      case "trend":
        return <FiActivity />;
      case "file-text":
        return <FiFileText />;
      case "user-add":
        return <FiUserPlus />;
      case "grid":
        return <FiGrid />;
      case "check-square":
        return <FiCheckSquare />;
      case "shopping-bag":
        return <FiShoppingBag />;
      default:
        return <FiDollarSign />;
    }
  };

  const getIconColor = () => {
    switch (iconType) {
      case "money":
        return "text-success bg-success-light";
      case "bag":
        return "text-purple bg-purple-light";
      case "key":
        return "text-orange bg-orange-light";
      case "user":
        return "text-blue bg-blue-light";
      case "box":
        return "text-indigo bg-indigo-light";
      case "check":
        return "text-success bg-success-light";
      case "alert":
        return "text-danger bg-danger-light";
      case "trend":
        return "text-blue bg-blue-light";
      case "file-text":
        return "text-purple bg-purple-light";
      case "user-add":
        return "text-orange bg-orange-light";
      case "grid":
        return "text-blue bg-blue-light";
      case "check-square":
        return "text-success bg-success-light";
      case "shopping-bag":
        return "text-purple bg-purple-light";
      default:
        return "text-gray bg-gray-light";
    }
  };

  return (
    <div className="stats-card">
      <div className="stats-header">
        <div className="stats-info">
          <h3 className="stats-title">{title}</h3>
          <div className="stats-value">{value}</div>
        </div>
        <div className={`stats-icon ${getIconColor()}`}>{getIcon()}</div>
      </div>

      <div className="stats-footer">
        <span
          className={`stats-percent ${isIncrease ? "increase" : "decrease"}`}
        >
          {isIncrease ? <FiTrendingUp /> : <FiTrendingDown />}
          {percent}%
        </span>
        <span className="stats-compare">{compareText}</span>
      </div>
    </div>
  );
};

export default StatsCard;
