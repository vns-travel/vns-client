import React, { useState, useEffect } from "react";
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
import { useAuth } from "../../context/AuthContext";
import { bookingService } from "../../services/bookingService";
import { serviceService } from "../../services/serviceService";
import { paymentService } from "../../services/paymentService";

const formatPrice = (n) => new Intl.NumberFormat("vi-VN").format(n) + " ₫";

const formatDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
};

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
  in_progress: {
    label: "Đang diễn ra",
    color: "bg-indigo-100 text-indigo-800",
    icon: TrendingUp,
  },
  refunded: {
    label: "Đã hoàn tiền",
    color: "bg-gray-100 text-gray-800",
    icon: XCircle,
  },
};

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

const PartnerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [services, setServices] = useState([]);
  const [bookingsResult, setBookingsResult] = useState({ data: [], meta: {} });
  const [earnings, setEarnings] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [bookingsRes, servicesRes, earningsRes] = await Promise.all([
          bookingService.getPartnerBookings({ limit: 100 }),
          serviceService.getPartnerServices(),
          paymentService.getPartnerEarnings(),
        ]);
        setBookingsResult(bookingsRes);
        setServices(servicesRes);
        setEarnings(earningsRes);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Derive dashboard figures from live data
  const activeServices = services.filter((s) => s.status === "approved").length;
  const totalBookings = bookingsResult.meta.total ?? bookingsResult.data.length;
  const pendingCount = bookingsResult.data.filter(
    (b) => b.status === "pending",
  ).length;
  const confirmedCount = bookingsResult.data.filter(
    (b) => b.status === "confirmed",
  ).length;
  const completedCount = bookingsResult.data.filter(
    (b) => b.status === "completed",
  ).length;
  const cancelledCount = bookingsResult.data.filter(
    (b) => b.status === "cancelled",
  ).length;
  const monthlyGross = earnings?.summary?.monthlyGross ?? 0;

  // Aggregate rating/review count across all partner services
  const avgRating =
    services.length > 0
      ? (
          services.reduce((sum, s) => sum + (s.averageRating || 0), 0) /
          services.length
        ).toFixed(1)
      : null;
  const totalReviews = services.reduce(
    (sum, s) => sum + (s.reviewCount || 0),
    0,
  );

  const recentBookings = bookingsResult.data.slice(0, 5);

  const metrics = [
    {
      label: "Dịch vụ",
      value: loading ? "…" : services.length,
      sub: loading ? "" : `${activeServices} đang hoạt động`,
      color: "bg-blue-100 text-blue-600",
      icon: HandPlatter,
      path: "/PartnerService",
    },
    {
      label: "Đặt chỗ",
      value: loading ? "…" : totalBookings,
      sub: loading ? "" : `${pendingCount} chờ xử lý`,
      color: "bg-green-100 text-green-600",
      icon: CalendarCheck,
      path: "/PartnerBooking",
    },
    {
      label: "Doanh thu",
      value: loading ? "…" : formatPrice(monthlyGross),
      sub: "Tháng này",
      color: "bg-purple-100 text-purple-600",
      icon: CircleDollarSign,
      path: "/PartnerFinance",
    },
    {
      label: "Đánh giá",
      value: loading ? "…" : avgRating !== null ? `${avgRating}★` : "—",
      sub: loading ? "" : `${totalReviews} lượt đánh giá`,
      color: "bg-yellow-100 text-yellow-600",
      icon: Star,
      path: "/PartnerBooking",
    },
  ];

  const bookingStats = [
    {
      label: "Chờ xử lý",
      value: pendingCount,
      icon: Clock,
      color: "text-yellow-500",
    },
    {
      label: "Đã xác nhận",
      value: confirmedCount,
      icon: CheckCircle,
      color: "text-green-500",
    },
    {
      label: "Hoàn thành",
      value: completedCount,
      icon: CheckCircle,
      color: "text-blue-500",
    },
    {
      label: "Đã hủy",
      value: cancelledCount,
      icon: XCircle,
      color: "text-red-500",
    },
  ];

  if (error) {
    return (
      <div className="min-h-screen bg-bg-light p-6 flex items-center justify-center">
        <div className="bg-white rounded-xl border border-red-200 p-6 text-center max-w-md">
          <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-3" />
          <p className="text-red-600 font-medium">Không thể tải dữ liệu</p>
          <p className="text-sm text-gray-400 mt-1">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 text-sm text-primary hover:underline"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-light p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-gray-900">
                Chào mừng trở lại, {user?.fullName || "Đối tác"}!
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
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="h-10 bg-gray-100 rounded animate-pulse"
                    />
                  ))}
                </div>
              ) : recentBookings.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">
                  Chưa có đặt chỗ nào
                </p>
              ) : (
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
                        const s =
                          statusConfig[b.status] ?? statusConfig.pending;
                        const Icon = s.icon;
                        return (
                          <tr
                            key={b.bookingId}
                            className="hover:bg-gray-50 cursor-pointer"
                            onClick={() => navigate("/PartnerBookingDetails")}
                          >
                            <td className="py-3 font-medium text-gray-900 font-mono text-xs">
                              #{b.bookingId.slice(0, 8).toUpperCase()}
                            </td>
                            <td className="py-3 text-gray-600">
                              {b.customer.name}
                            </td>
                            <td className="py-3 text-gray-600 hidden md:table-cell">
                              {b.service.title}
                            </td>
                            <td className="py-3 text-gray-400 hidden lg:table-cell">
                              {formatDate(b.createdAt)}
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
                              {formatPrice(b.finalAmount)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerDashboard;
