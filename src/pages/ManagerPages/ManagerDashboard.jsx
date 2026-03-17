import { useNavigate } from "react-router-dom";
import {
  Users,
  Building,
  FileText,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Star,
  BarChart3,
  ArrowRight,
  ShieldCheck,
  TicketPercent,
  Wrench,
} from "lucide-react";

const formatPrice = (n) => new Intl.NumberFormat("vi-VN").format(n) + " ₫";

const stats = {
  totalPartners: 142,
  verifiedPartners: 128,
  pendingVerification: 7,
  totalUsers: 2450,
  activeServices: 387,
  pendingServices: 14,
  totalBookings: 1240,
  monthlyRevenue: 785000000,
  platformFees: 78500000,
};

const metrics = [
  {
    label: "Đối tác",
    value: stats.totalPartners,
    sub: `${stats.verifiedPartners} đã xác minh · ${stats.pendingVerification} chờ duyệt`,
    color: "bg-blue-100 text-blue-600",
    icon: Building,
    path: "/ManagerAccountManagement",
    alert: stats.pendingVerification > 0,
  },
  {
    label: "Người dùng",
    value: stats.totalUsers.toLocaleString("vi-VN"),
    sub: "Tổng tài khoản đã đăng ký",
    color: "bg-purple-100 text-purple-600",
    icon: Users,
    path: "/ManagerAccountManagement",
  },
  {
    label: "Dịch vụ",
    value: stats.activeServices,
    sub: `${stats.pendingServices} chờ phê duyệt`,
    color: "bg-green-100 text-green-600",
    icon: FileText,
    path: "/ManagerServiceApproval",
    alert: stats.pendingServices > 0,
  },
  {
    label: "Doanh thu tháng",
    value: formatPrice(stats.monthlyRevenue),
    sub: `Phí nền tảng: ${formatPrice(stats.platformFees)}`,
    color: "bg-yellow-100 text-yellow-600",
    icon: DollarSign,
    path: "/ManagerFinance",
  },
];

const quickActions = [
  { label: "Duyệt hồ sơ đối tác", path: "/ManagerAccountManagement", icon: ShieldCheck, color: "bg-blue-50 text-blue-700 border-blue-200", badge: stats.pendingVerification },
  { label: "Duyệt dịch vụ", path: "/ManagerServiceApproval", icon: Wrench, color: "bg-green-50 text-green-700 border-green-200", badge: stats.pendingServices },
  { label: "Xét duyệt tài liệu", path: "/ManagerDocumentReview", icon: FileText, color: "bg-orange-50 text-orange-700 border-orange-200" },
  { label: "Quản lý khuyến mãi", path: "/ManagerPromotion", icon: TicketPercent, color: "bg-purple-50 text-purple-700 border-purple-200" },
  { label: "Tài chính nền tảng", path: "/ManagerFinance", icon: DollarSign, color: "bg-teal-50 text-teal-700 border-teal-200" },
  { label: "Thống kê tổng quan", path: "/ManagerDashboard", icon: BarChart3, color: "bg-gray-50 text-gray-700 border-gray-200" },
];

const verificationRequests = [
  { id: "P001", name: "Saigon Street Food Tour", submitted: "15/05/2026", type: "Đối tác mới" },
  { id: "P002", name: "Halong Bay Cruise", submitted: "14/05/2026", type: "Đối tác mới" },
  { id: "P003", name: "Hoi An Photography", submitted: "14/05/2026", type: "Cập nhật hồ sơ" },
];

const pendingServices = [
  { id: "S001", partner: "Dalat Riverside Resort", service: "Villa 4 phòng ngủ", type: "Lưu trú", submitted: "16/05/2026" },
  { id: "S002", partner: "Mekong Delta Tours", service: "Tour sông Mekong 2N1Đ", type: "Tour", submitted: "15/05/2026" },
  { id: "S003", partner: "Phu Quoc Car Rental", service: "Thuê xe 7 chỗ có lái", type: "Thuê xe", submitted: "15/05/2026" },
];

const recentActivities = [
  { type: "partner_registered", text: "Đối tác mới đăng ký", detail: "Hanoi Heritage Hotel", time: "2 phút trước", icon: Building, color: "text-blue-500 bg-blue-50" },
  { type: "booking_completed", text: "Đặt chỗ hoàn thành", detail: "Đảo Ngọc Xanh Tour", time: "15 phút trước", icon: CheckCircle, color: "text-green-500 bg-green-50" },
  { type: "verification_submitted", text: "Yêu cầu xác minh từ", detail: "Saigon Street Food Tour", time: "1 giờ trước", icon: AlertCircle, color: "text-yellow-500 bg-yellow-50" },
  { type: "new_user", text: "Người dùng mới đăng ký", detail: "Nguyễn Văn A", time: "2 giờ trước", icon: Users, color: "text-purple-500 bg-purple-50" },
  { type: "service_added", text: "Dịch vụ mới từ", detail: "Dalat Riverside Resort", time: "3 giờ trước", icon: FileText, color: "text-indigo-500 bg-indigo-50" },
];

const ManagerDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg-light p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Bảng điều khiển Quản lý</h1>
            <p className="text-gray-500 text-sm">Theo dõi hoạt động nền tảng và quản lý đối tác</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span>+12.5% so với tháng trước</span>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((m) => {
            const Icon = m.icon;
            return (
              <button
                key={m.label}
                onClick={() => navigate(m.path)}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 text-left hover:shadow-md hover:border-primary/30 transition-all group relative"
              >
                {m.alert && (
                  <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full" />
                )}
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
          {/* Left column */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Tác vụ nhanh</h3>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((a) => {
                  const Icon = a.icon;
                  return (
                    <button
                      key={a.label}
                      onClick={() => navigate(a.path)}
                      className={`relative flex flex-col items-center gap-1.5 p-3 rounded-lg border text-xs font-medium hover:opacity-80 transition-opacity ${a.color}`}
                    >
                      {a.badge > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                          {a.badge}
                        </span>
                      )}
                      <Icon className="w-4 h-4" />
                      <span className="text-center leading-tight">{a.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* System Health */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Trạng thái hệ thống</h3>
              <div className="space-y-3">
                {[
                  { label: "Đặt chỗ trực tuyến", ok: true },
                  { label: "Xử lý thanh toán", ok: true },
                  { label: "Xác thực người dùng", ok: true },
                ].map((s) => (
                  <div key={s.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className={`w-4 h-4 ${s.ok ? "text-green-500" : "text-red-500"}`} />
                      <span className="text-sm text-gray-600">{s.label}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${s.ok ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                      {s.ok ? "Hoạt động" : "Bảo trì"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Platform Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Tổng quan nhanh</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tổng đặt chỗ</span>
                  <span className="font-bold text-gray-900">{stats.totalBookings.toLocaleString("vi-VN")}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Dịch vụ đang chạy</span>
                  <span className="font-bold text-gray-900">{stats.activeServices}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Đánh giá TB</span>
                  <span className="font-bold text-gray-900 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" /> 4.7
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tăng trưởng</span>
                  <span className="font-bold text-green-600">+12.5%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pending Verifications */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900">Hồ sơ chờ xác minh</h3>
                  <span className="w-5 h-5 bg-yellow-100 text-yellow-800 text-xs rounded-full flex items-center justify-center font-bold">
                    {verificationRequests.length}
                  </span>
                </div>
                <button
                  onClick={() => navigate("/ManagerAccountManagement")}
                  className="text-sm text-primary hover:text-primary-hover font-medium flex items-center gap-1"
                >
                  Xem tất cả <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="space-y-2">
                {verificationRequests.map((r) => (
                  <div key={r.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{r.name}</p>
                      <p className="text-xs text-gray-400">{r.type} · Gửi: {r.submitted}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium">Chờ xử lý</span>
                      <button
                        onClick={() => navigate("/ManagerAccountManagement")}
                        className="text-xs text-primary font-medium hover:underline"
                      >
                        Xem
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pending Services */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900">Dịch vụ chờ duyệt</h3>
                  <span className="w-5 h-5 bg-orange-100 text-orange-800 text-xs rounded-full flex items-center justify-center font-bold">
                    {pendingServices.length}
                  </span>
                </div>
                <button
                  onClick={() => navigate("/ManagerServiceApproval")}
                  className="text-sm text-primary hover:text-primary-hover font-medium flex items-center gap-1"
                >
                  Xem tất cả <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="space-y-2">
                {pendingServices.map((s) => (
                  <div key={s.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{s.service}</p>
                      <p className="text-xs text-gray-400">{s.partner} · {s.type} · {s.submitted}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate("/ManagerServiceApproval")}
                        className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 font-medium"
                      >
                        Duyệt
                      </button>
                      <button className="px-2 py-1 text-xs bg-red-50 text-red-600 rounded hover:bg-red-100 font-medium">
                        Từ chối
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Hoạt động gần đây</h3>
              <div className="space-y-3">
                {recentActivities.map((a, i) => {
                  const Icon = a.icon;
                  return (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`p-1.5 rounded-lg flex-shrink-0 ${a.color}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-700">
                          {a.text}: <span className="font-medium">{a.detail}</span>
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

export default ManagerDashboard;
