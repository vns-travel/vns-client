import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const SideBar = ({
  navItems = [],
  userProfile = {},
  activeBgColor = "bg-primary",
  hoverBgColor = "hover:bg-slate-600",
}) => {
  const items = navItems.length > 0 ? navItems : [];
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const getInitials = (name) => {
    if (!name) return "VNS";
    return name
      .split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const displayName =
    user?.fullName || user?.businessName || user?.email || userProfile.name || "VNS";
  const initials = userProfile.initials || getInitials(displayName);
  const avatarBg = userProfile.avatarBg || "bg-slate-600";

  const handleLogout = () => {
    logout();
    navigate("/LoginPartner");
  };

  return (
    <div className="w-64 bg-slate-700 text-white h-screen flex flex-col items-center py-4">
      {/* User Profile Section */}
      <div className="flex flex-col items-center mb-8">
        <div
          className={`${avatarBg} w-12 h-12 rounded-lg flex items-center justify-center mb-2`}
        >
          <span className="text-sm font-medium">{initials}</span>
        </div>
        <span className="text-sm font-bold text-center px-2">{displayName}</span>
        {user?.email && (
          <span className="text-xs text-gray-400 mt-0.5 px-2 text-center truncate max-w-[200px]">
            {user.email}
          </span>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col space-y-2 w-full px-4">
        {items.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-colors duration-200 ${
                isActive ? activeBgColor : hoverBgColor
              }`
            }
          >
            <div>{item.icon}</div>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>

      {/* Logout Button */}
      <div className="w-full px-4 mt-4">
        <button
          className="w-full px-4 py-3 rounded-lg text-white bg-red-500 hover:bg-red-700 transition-colors duration-200 flex items-center justify-center"
          onClick={handleLogout}
        >
          <span>Đăng xuất</span>
        </button>
      </div>

      {/* Footer Section */}
      <div className="mt-auto text-xs text-gray-400">
        © 2025 VNS Travel Platform
      </div>
    </div>
  );
};

export default SideBar;
