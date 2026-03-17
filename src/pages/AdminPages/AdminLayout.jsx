import { LayoutDashboard, Users, Building, Shield } from "lucide-react";
import SideBar from "../../components/SideBar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex h-screen">
      <SideBar
        userProfile={{ initials: "AD", name: "Super Admin", avatarBg: "bg-red-600" }}
        navItems={[
          { path: "/AdminDashboard", label: "Bảng Điều Khiển", icon: <LayoutDashboard /> },
          { path: "/AdminUserManagement", label: "Quản Lý Người Dùng", icon: <Users /> },
          { path: "/AdminPartnerManagement", label: "Quản Lý Đối Tác", icon: <Building /> },
          { path: "/AdminRoleManagement", label: "Phân Quyền", icon: <Shield /> },
        ]}
      />
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
