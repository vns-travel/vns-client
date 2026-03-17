import React from "react";
import { useNavigate } from "react-router-dom";
import {
  HandPlatter,
  CalendarCheck,
  CircleDollarSign,
  Package,
  Star,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowRight,
  MessageCircleMore,
  TicketPercent,
  User,
} from "lucide-react";

const formatPrice = (n) => new Intl.NumberFormat("vi-VN").format(n) + " ₫";

const profile = {
  businessName: "Minh Tri",
  isVerified: true,
};

const metrics = [
  {
    label: "Dịch vụ",
    value: 12,
    sub: "4 đang hoạt động",
    color: "bg-blue-100 text-blue-600",
    icon: HandPlatter,
    path: "/PartnerService",
  },
  {
    label: "Đặt chỗ",
    value: 124,
    sub: "5 chờ xử lý",
    color: "bg-green-100 text-green-600",
    icon: CalendarCheck,
    path: "/PartnerBooking",
  },
  {
    label: "Doanh thu",
    value: formatPrice(45670000),
    sub: "+12.5% tháng này",
    color: "bg-purple-100 text-purple-600",
    icon: CircleDollarSign,
    path: "/PartnerFinance",
  },
  {
    label: "Đánh giá",
    value: "4.7★",
    sub: "89 lượt đánh giá",
    color: "bg-yellow-100 text-yellow-600",
    icon: Star,
    path: "/PartnerBooking",
  },
];

const bookingStats = [
  { label: "Chờ xử lý", value: 5, icon: Clock, color: "text-yellow-500" },
  {
    label: "Đã xác nhận",
    value: 12,
    icon: CheckCircle,
    color: "text-green-500",
  },
  { label: "Hoàn thành", value: 89, icon: CheckCircle, color: "text-blue-500" },
  { label: "Đã hủy", value: 2, icon: XCircle, color: "text-red-500" },
];

const recentBookings = [
  {
    id: "B001",
    customer: "Nguyễn Văn A",
    service: "Phòng Deluxe",
    date: "15/05/2026",
    status: "confirmed",
    amount: 2500000,
  },
  {
    id: "B002",
    customer: "Trần Thị B",
    service: "City Tour",
    date: "16/05/2026",
    status: "pending",
    amount: 1200000,
  },
  {
    id: "B003",
    customer: "Lê Văn C",
    service: "Gói Spa",
    date: "14/05/2026",
    status: "completed",
    amount: 800000,
  },
  {
    id: "B004",
    customer: "Phạm Thị D",
    service: "Phòng Suite",
    date: "17/05/2026",
    status: "confirmed",
    amount: 4500000,
  },
];

const quickActions = [
  {
    label: "Thêm dịch vụ",
    path: "/PartnerService",
    icon: HandPlatter,
    color: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    label: "Tạo combo",
    path: "/PartnerCombo/create",
    icon: Package,
    color: "bg-purple-50 text-purple-700 border-purple-200",
  },
  {
    label: "Xem đặt chỗ",
    path: "/PartnerBooking",
    icon: CalendarCheck,
    color: "bg-green-50 text-green-700 border-green-200",
  },
  {
    label: "Tin nhắn",
    path: "/PartnerMessaging",
    icon: MessageCircleMore,
    color: "bg-orange-50 text-orange-700 border-orange-200",
  },
  {
    label: "Tài chính",
    path: "/PartnerFinance",
    icon: CircleDollarSign,
    color: "bg-teal-50 text-teal-700 border-teal-200",
  },
  {
    label: "Hồ sơ",
    path: "/PartnerProfile",
    icon: User,
    color: "bg-gray-50 text-gray-700 border-gray-200",
  },
];

const statusConfig = {
  confirmed: {
    label: "Đã xác nhận",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
  },
  pending: {
    label: "Chờ xử lý",
    color: "bg-yellow-100 text-yellow-800",
    icon: Clock,
  },
  completed: {
    label: "Hoàn thành",
    color: "bg-blue-100 text-blue-800",
    icon: CheckCircle,
  },
  cancelled: {
    label: "Đã hủy",
    color: "bg-red-100 text-red-800",
    icon: XCircle,
  },
};

const PartnerDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg-light p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-gray-900">
                Chào mừng trở lại, {profile.businessName}!
              </h1>
            </div>
            <p className="text-gray-500 text-sm">
              Theo dõi hiệu suất kinh doanh của bạn
            </p>
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
          {/* Left column */}
          <div className="space-y-6">
            {/* Booking Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-4">
                Thống kê đặt chỗ
              </h3>
              <div className="space-y-3">
                {bookingStats.map((s) => {
                  const Icon = s.icon;
                  return (
                    <div
                      key={s.label}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${s.color}`} />
                        <span className="text-sm text-gray-600">{s.label}</span>
                      </div>
                      <span className="font-semibold text-gray-900">
                        {s.value}
                      </span>
                    </div>
                  );
                })}
              </div>
              <button
                onClick={() => navigate("/PartnerBooking")}
                className="mt-4 w-full text-center text-sm text-primary hover:text-primary-hover font-medium flex items-center justify-center gap-1"
              >
                Xem tất cả đặt chỗ <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-4">
                Truy cập nhanh
              </h3>
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
                      {a.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Alerts */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Thông báo</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                  <AlertCircle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-yellow-800">
                      5 đặt chỗ chờ xác nhận
                    </p>
                    <button
                      onClick={() => navigate("/PartnerBooking")}
                      className="text-xs text-yellow-600 underline mt-0.5"
                    >
                      Xử lý ngay
                    </button>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <TicketPercent className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-blue-800">
                      2 combo sắp hết hạn
                    </p>
                    <button
                      onClick={() => navigate("/PartnerCombo")}
                      className="text-xs text-blue-600 underline mt-0.5"
                    >
                      Kiểm tra
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Recent Bookings */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-gray-900">Đặt chỗ gần đây</h3>
                <button
                  onClick={() => navigate("/PartnerBooking")}
                  className="text-sm text-primary hover:text-primary-hover font-medium flex items-center gap-1"
                >
                  Xem tất cả <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left pb-3 text-xs font-medium text-gray-500 uppercase">
                        Mã
                      </th>
                      <th className="text-left pb-3 text-xs font-medium text-gray-500 uppercase">
                        Khách
                      </th>
                      <th className="text-left pb-3 text-xs font-medium text-gray-500 uppercase hidden md:table-cell">
                        Dịch vụ
                      </th>
                      <th className="text-left pb-3 text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">
                        Ngày
                      </th>
                      <th className="text-left pb-3 text-xs font-medium text-gray-500 uppercase">
                        Trạng thái
                      </th>
                      <th className="text-right pb-3 text-xs font-medium text-gray-500 uppercase">
                        Số tiền
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {recentBookings.map((b) => {
                      const s = statusConfig[b.status];
                      const Icon = s.icon;
                      return (
                        <tr
                          key={b.id}
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() => navigate("/PartnerBookingDetails")}
                        >
                          <td className="py-3 font-medium text-gray-900">
                            {b.id}
                          </td>
                          <td className="py-3 text-gray-600">{b.customer}</td>
                          <td className="py-3 text-gray-600 hidden md:table-cell">
                            {b.service}
                          </td>
                          <td className="py-3 text-gray-400 hidden lg:table-cell">
                            {b.date}
                          </td>
                          <td className="py-3">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${s.color}`}
                            >
                              <Icon className="w-3 h-3" />
                              {s.label}
                            </span>
                          </td>
                          <td className="py-3 text-right font-medium text-gray-900">
                            {formatPrice(b.amount)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerDashboard;
