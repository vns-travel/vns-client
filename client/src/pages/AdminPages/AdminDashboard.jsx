import { useNavigate } from "react-router-dom";
import {
  Users,
  Building,
  Shield,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowRight,
  UserCheck,
  Settings,
  Activity,
} from "lucide-react";

const fmt = (n) => new Intl.NumberFormat("vi-VN").format(n) + " ₫";

const platformStats = {
  totalUsers: 12450,
  totalPartners: 142,
  totalManagers: 8,
  totalRevenue: 4560000000,
  monthlyRevenue: 785000000,
  activeServices: 387,
  totalBookings: 8940,
  growth: 18.2,
};

const metrics = [
  {
    label: "Người dùng",
    value: platformStats.totalUsers.toLocaleString("vi-VN"),
    icon: Users,
    color: "bg-blue-100 text-blue-600",
    path: "/AdminUserManagement",
  },
  {
    label: "Đối tác",
    value: platformStats.totalPartners,
    icon: Building,
    color: "bg-green-100 text-green-600",
    path: "/AdminPartnerManagement",
  },
  {
    label: "Doanh thu tháng",
    value: fmt(platformStats.monthlyRevenue),
    icon: DollarSign,
    color: "bg-purple-100 text-purple-600",
    path: "/AdminDashboard",
  },
  {
    label: "Tổng đặt chỗ",
    value: platformStats.totalBookings.toLocaleString("vi-VN"),
    icon: Activity,
    color: "bg-orange-100 text-orange-600",
    path: "/AdminDashboard",
  },
];

const quickActions = [
  {
    label: "Quản lý người dùng",
    path: "/AdminUserManagement",
    icon: Users,
    color: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    label: "Quản lý đối tác",
    path: "/AdminPartnerManagement",
    icon: Building,
    color: "bg-green-50 text-green-700 border-green-200",
  },
  // {
  //   label: "Phân quyền",
  //   path: "/AdminRoleManagement",
  //   icon: Shield,
  //   color: "bg-red-50 text-red-700 border-red-200",
  // },
  // {
  //   label: "Cài đặt hệ thống",
  //   path: "/AdminDashboard",
  //   icon: Settings,
  //   color: "bg-gray-50 text-gray-700 border-gray-200",
  // },
];

const recentActivities = [
  {
    text: "Người dùng mới đăng ký",
    detail: "Nguyễn Thị Lan",
    time: "5 phút trước",
    icon: Users,
    color: "text-blue-500 bg-blue-50",
  },
  {
    text: "Đối tác được xác minh",
    detail: "Saigon Food Tour",
    time: "20 phút trước",
    icon: CheckCircle,
    color: "text-green-500 bg-green-50",
  },
  {
    text: "Quản lý mới được tạo",
    detail: "Trần Văn B",
    time: "2 giờ trước",
    icon: UserCheck,
    color: "text-purple-500 bg-purple-50",
  },
  {
    text: "Đối tác bị báo cáo vi phạm",
    detail: "Unknown Hotel",
    time: "3 giờ trước",
    icon: AlertCircle,
    color: "text-red-500 bg-red-50",
  },
  {
    text: "Cập nhật phân quyền hệ thống",
    detail: "Manager role updated",
    time: "5 giờ trước",
    icon: Shield,
    color: "text-orange-500 bg-orange-50",
  },
];

const managers = [
  {
    id: "MGR-001",
    name: "Nguyễn Văn An",
    email: "an.nv@vns.vn",
    role: "Manager",
    status: "active",
    region: "Hà Nội",
  },
  {
    id: "MGR-002",
    name: "Trần Thị Bình",
    email: "binh.tt@vns.vn",
    role: "Manager",
    status: "active",
    region: "TP.HCM",
  },
  {
    id: "MGR-003",
    name: "Lê Văn Cường",
    email: "cuong.lv@vns.vn",
    role: "Manager",
    status: "inactive",
    region: "Đà Nẵng",
  },
];

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg-light p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-gray-900">
                Bảng điều khiển Quản trị
              </h1>
            </div>
            <p className="text-gray-500 text-sm">
              Toàn quyền quản lý nền tảng VietNamSea
            </p>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((m) => {
            const Icon = m.icon;
            return (
              <button
                key={m.label}
                onClick={() => navigate(m.path)}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 text-left hover:shadow-md hover:border-primary/30 transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg ${m.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors" />
                </div>
                <p className="text-sm text-gray-500 mb-1">{m.label}</p>
                <p className="text-xl font-bold text-gray-900">{m.value}</p>
                <p className="text-xs text-gray-400 mt-1">{m.sub}</p>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left */}
          <div className="space-y-6">
            {/* Quick actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Tác vụ nhanh</h3>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((a) => {
                  const Icon = a.icon;
                  return (
                    <button
                      key={a.label}
                      onClick={() => navigate(a.path)}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border text-xs font-medium hover:opacity-80 transition-opacity ${a.color}`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-center leading-tight">
                        {a.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="lg:col-span-2 space-y-6">
            {/* Manager accounts */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">
                  Tài khoản Quản lý
                </h3>
                <button
                  onClick={() => navigate("/AdminRoleManagement")}
                  className="text-sm text-primary hover:text-primary-hover font-medium flex items-center gap-1"
                >
                  Quản lý <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left pb-3 text-xs font-medium text-gray-500 uppercase">
                        Tên
                      </th>
                      <th className="text-left pb-3 text-xs font-medium text-gray-500 uppercase hidden md:table-cell">
                        Email
                      </th>
                      <th className="text-left pb-3 text-xs font-medium text-gray-500 uppercase">
                        Khu vực
                      </th>
                      <th className="text-left pb-3 text-xs font-medium text-gray-500 uppercase">
                        Trạng thái
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {managers.map((m) => (
                      <tr key={m.id} className="hover:bg-gray-50">
                        <td className="py-3 font-medium text-gray-900">
                          {m.name}
                        </td>
                        <td className="py-3 text-gray-500 hidden md:table-cell">
                          {m.email}
                        </td>
                        <td className="py-3 text-gray-500">{m.region}</td>
                        <td className="py-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                              m.status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {m.status === "active" ? (
                              <>
                                <CheckCircle className="w-3 h-3" /> Hoạt động
                              </>
                            ) : (
                              <>
                                <Clock className="w-3 h-3" /> Ngừng hoạt động
                              </>
                            )}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-4">
                Hoạt động gần đây
              </h3>
              <div className="space-y-3">
                {recentActivities.map((a, i) => {
                  const Icon = a.icon;
                  return (
                    <div key={i} className="flex items-start gap-3">
                      <div
                        className={`p-1.5 rounded-lg flex-shrink-0 ${a.color}`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-700">
                          {a.text}:{" "}
                          <span className="font-medium">{a.detail}</span>
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{a.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
