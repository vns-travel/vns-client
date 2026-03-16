import { NavLink, useNavigate } from "react-router-dom";

const SideBar = ({
  navItems = [],
  userProfile = {},
  activeBgColor = "bg-primary",
  hoverBgColor = "hover:bg-slate-600",
}) => {
  const items = navItems.length > 0 ? navItems : 0;
  const navigate = useNavigate();

  // Default user profile if none provided
  const defaultUserProfile = {
    initials: "MT",
    name: "Minh Tri",
    avatarBg: "bg-slate-600",
  };

  const profile = { ...defaultUserProfile, ...userProfile };

  return (
    <div
      className={
        "w-64 bg-slate-700 text-white h-screen flex flex-col items-center py-4"
      }
    >
      {/* User Profile Section */}
      <div className="flex flex-col items-center mb-8">
        <div
          className={`${profile.avatarBg} w-12 h-12 rounded-lg flex items-center justify-center mb-2`}
        >
          <span className="text-sm font-medium">{profile.initials}</span>
        </div>
        <span className="text-sm font-bold">{profile.name}</span>
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
          onClick={() => navigate("/LoginPartner")}
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
