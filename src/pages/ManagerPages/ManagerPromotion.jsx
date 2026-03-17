import React, { useState } from "react";
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  Eye,
  RefreshCw,
  Gift,
  Calendar,
  CheckCircle,
  Clock,
  PauseCircle,
  XCircle,
  DollarSign,
  Percent,
  Copy,
  AlertCircle,
  TrendingUp,
  Users,
  Activity,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ManagerPromotion = () => {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("created");
  const [searchQuery, setSearchQuery] = useState("");

  const promotions = [
    {
      id: 1,
      name: "Ưu đãi đặt sớm - Mùa hè 2024",
      description:
        "Giảm 25% cho tất cả đặt phòng trước 45 ngày. Áp dụng cho kỳ nghỉ từ tháng 6-8/2024.",
      status: "active",
      promoCode: "SUMMER2024",
      discountType: "percentage",
      discountValue: 25,
      minOrderValue: 1000000,
      usageLimit: 500,
      usedCount: 167,
      validFrom: "2024-03-01",
      validUntil: "2024-05-31",
      bookings: 167,
      revenue: 125250000,
      applicableServices: "Tất cả phòng và villa",
      created: "2024-02-20",
      views: 2847,
      customerSavings: 41750000,
      maxUsesPerCustomer: 2,
    },
    {
      id: 2,
      name: "Flash Sale Cuối Tuần",
      description:
        "Giảm ngay 300.000đ cho đặt phòng cuối tuần. Chỉ áp dụng thứ 6-7-CN.",
      status: "expired",
      promoCode: "WEEKEND300",
      discountType: "fixed",
      discountValue: 300000,
      minOrderValue: 1500000,
      usageLimit: 200,
      usedCount: 200,
      validFrom: "2024-02-01",
      validUntil: "2024-02-29",
      bookings: 200,
      revenue: 340000000,
      applicableServices: "Phòng Deluxe và Suite",
      created: "2024-01-25",
      views: 3421,
      customerSavings: 60000000,
      maxUsesPerCustomer: 1,
    },
    {
      id: 3,
      name: "Sinh nhật VietNamSea - Giảm 30%",
      description:
        "Khuyến mãi đặc biệt nhân dịp sinh nhật 2 năm VietNamSea. Mã giới hạn!",
      status: "active",
      promoCode: "BIRTHDAY30",
      discountType: "percentage",
      discountValue: 30,
      minOrderValue: 2000000,
      usageLimit: 100,
      usedCount: 78,
      validFrom: "2024-03-10",
      validUntil: "2024-03-20",
      bookings: 78,
      revenue: 109200000,
      applicableServices: "Tất cả dịch vụ",
      created: "2024-03-05",
      views: 1245,
      customerSavings: 46800000,
      maxUsesPerCustomer: 1,
      urgency: "Chỉ còn 22 mã!",
    },
    {
      id: 4,
      name: "Khuyến mãi mùa thấp điểm",
      description: "Giảm 15% cho tất cả tour và phòng vào tháng 9-11.",
      status: "draft",
      promoCode: "LOWSEASON15",
      discountType: "percentage",
      discountValue: 15,
      minOrderValue: 500000,
      usageLimit: 300,
      usedCount: 0,
      validFrom: "2024-09-01",
      validUntil: "2024-11-30",
      bookings: 0,
      revenue: 0,
      applicableServices: "Tour và lưu trú",
      created: "2024-03-15",
      views: 0,
      customerSavings: 0,
      maxUsesPerCustomer: 3,
    },
  ];

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN").format(price) + " ₫";

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "paused":
        return "bg-yellow-100 text-yellow-800";
      case "expired":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4" />;
      case "draft":
        return <Clock className="w-4 h-4" />;
      case "paused":
        return <PauseCircle className="w-4 h-4" />;
      case "expired":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "active": return "Đang hoạt động";
      case "draft": return "Bản nháp";
      case "paused": return "Tạm dừng";
      case "expired": return "Đã hết hạn";
      default: return status;
    }
  };

  const filtered = promotions
    .filter((p) => {
      const matchStatus = filterStatus === "all" || p.status === filterStatus;
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.promoCode.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "created":
          return new Date(b.created) - new Date(a.created);
        case "bookings":
          return b.bookings - a.bookings;
        case "revenue":
          return b.revenue - a.revenue;
        default:
          return 0;
      }
    });

  const stats = {
    total: promotions.length,
    active: promotions.filter((p) => p.status === "active").length,
    totalBookings: promotions.reduce((s, p) => s + p.bookings, 0),
    totalRevenue: promotions.reduce((s, p) => s + p.revenue, 0),
  };

  return (
    <div className="min-h-screen bg-bg-light p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Khuyến mãi
            </h1>
            <p className="text-gray-600">Quản lý mã khuyến mãi toàn nền tảng</p>
          </div>
          <button
            onClick={() => navigate("/ManagerPromotion/create")}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tạo khuyến mãi
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Gift className="w-5 h-5 text-blue-600" />
              </div>
              <Activity className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">
              Tổng khuyến mãi
            </p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-xs text-gray-500 mt-1">
              {stats.active} đang hoạt động
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">
              Tổng doanh thu
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {formatPrice(stats.totalRevenue)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">
              Tổng lượt sử dụng
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.totalBookings}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Zap className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">
              Đang hoạt động
            </p>
            <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, mã khuyến mãi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary bg-white"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="draft">Bản nháp</option>
              <option value="paused">Tạm dừng</option>
              <option value="expired">Đã hết hạn</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary bg-white"
            >
              <option value="created">Mới nhất</option>
              <option value="bookings">Sử dụng nhiều nhất</option>
              <option value="revenue">Doanh thu cao nhất</option>
            </select>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <RefreshCw className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200"
            >
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(item.status)}`}
                  >
                    {getStatusIcon(item.status)}
                    {getStatusLabel(item.status)}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                  {item.description}
                </p>

                {/* Promo Code */}
                <div className="flex items-center gap-2 mb-3">
                  <code className="px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-800 text-sm font-mono font-semibold rounded">
                    {item.promoCode}
                  </code>
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(item.promoCode)
                    }
                    className="p-1.5 text-gray-400 hover:text-primary hover:bg-gray-100 rounded"
                    title="Sao chép mã"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>

                {/* Discount */}
                <div className="flex items-center gap-3 text-sm">
                  {item.discountType === "percentage" ? (
                    <span className="flex items-center text-green-600 font-semibold">
                      <Percent className="w-4 h-4 mr-1" />
                      Giảm {item.discountValue}%
                    </span>
                  ) : (
                    <span className="flex items-center text-green-600 font-semibold">
                      <DollarSign className="w-4 h-4 mr-1" />
                      Giảm {formatPrice(item.discountValue)}
                    </span>
                  )}
                  <span className="text-gray-400 text-xs">
                    Đơn tối thiểu {formatPrice(item.minOrderValue)}
                  </span>
                </div>

                {/* Usage Progress */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                    <span>Đã sử dụng</span>
                    <span className="font-medium">
                      {item.usedCount}/{item.usageLimit}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        item.usedCount / item.usageLimit >= 0.9
                          ? "bg-red-500"
                          : item.usedCount / item.usageLimit >= 0.7
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                      style={{
                        width: `${(item.usedCount / item.usageLimit) * 100}%`,
                      }}
                    />
                  </div>
                  {item.urgency && (
                    <p className="text-xs text-red-600 font-medium mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {item.urgency}
                    </p>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="p-6 bg-gray-50">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">
                      {item.bookings}
                    </div>
                    <div className="text-xs text-gray-500">Sử dụng</div>
                  </div>
                  <div className="text-center border-l border-r border-gray-200">
                    <div className="text-sm font-bold text-primary">
                      {formatPrice(item.revenue)}
                    </div>
                    <div className="text-xs text-gray-500">Doanh thu</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">
                      {item.views}
                    </div>
                    <div className="text-xs text-gray-500">Lượt xem</div>
                  </div>
                </div>

                {/* Validity */}
                <div className="text-xs text-gray-600 mb-3">
                  <div className="flex items-center gap-1 mb-1">
                    <Calendar className="w-3 h-3" />
                    <span>Hiệu lực:</span>
                  </div>
                  <div className="text-gray-500">
                    {new Date(item.validFrom).toLocaleDateString("vi-VN")} —{" "}
                    {new Date(item.validUntil).toLocaleDateString("vi-VN")}
                  </div>
                </div>

                <div className="text-xs text-gray-600 mb-1">
                  Áp dụng:{" "}
                  <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 rounded">
                    {item.applicableServices}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="px-6 py-4 bg-white border-t border-gray-200 rounded-b-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      navigate("/ManagerPromotion/detail", {
                        state: { promotion: item },
                      })
                    }
                    className="p-2 text-gray-400 hover:text-primary hover:bg-gray-100 rounded"
                    title="Xem chi tiết"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() =>
                      navigate("/ManagerPromotion/edit", {
                        state: { promotion: item },
                      })
                    }
                    className="p-2 text-gray-400 hover:text-primary hover:bg-gray-100 rounded"
                    title="Chỉnh sửa"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
                <button
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
                  title="Xóa"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchQuery
                ? `Không tìm thấy kết quả cho "${searchQuery}"`
                : "Không có khuyến mãi nào"}
            </h3>
            <p className="text-gray-600 mb-6">
              {!searchQuery && "Tạo khuyến mãi đầu tiên để bắt đầu"}
            </p>
            {!searchQuery && (
              <button
                onClick={() => navigate("/ManagerPromotion/create")}
                className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-hover flex items-center mx-auto"
              >
                <Plus className="w-5 h-5 mr-2" />
                Tạo khuyến mãi
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerPromotion;
