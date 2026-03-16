import {
  CalendarCheck,
  CircleDollarSign,
  HandPlatter,
  LayoutDashboard,
  MessageCircleMore,
  TicketPercent,
  User,
} from "lucide-react";
import SideBar from "../../components/SideBar";
import { Outlet } from "react-router-dom";

const ManagerLayout = () => {
  return (
    <div className="flex h-screen">
      <SideBar
        navItems={[
          {
            path: "/ManagerAccountManagement",
            label: "Quản Lý Hồ Sơ",
            icon: <User />,
          },
          {
            path: "/ManagerDashboard",
            label: "Bảng Điều Khiển",
            icon: <LayoutDashboard />,
          },
        ]}
      />

      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default ManagerLayout;
