import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Plus,
  Eye,
  RefreshCw,
  Gift,
  Calendar,
  CheckCircle,
  Clock,
  PauseCircle,
  PlayCircle,
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
import { voucherService, serviceTypesToLabel, deriveStatus } from "../../services/voucherService";

// Map API response fields to the shape the card UI expects.
function toCardShape(v) {
  return {
    id:                 v.id,
    name:               v.name ?? v.code,
    description:        v.description ?? "",
    status:             deriveStatus(v),
    promoCode:          v.code,
    discountType:       v.type === "percent" ? "percentage" : "fixed",
    discountValue:      v.value,
    minOrderValue:      v.minSpend,
    usageLimit:         v.maxUses,
    usedCount:          v.usedCount,
    validFrom:          v.validFrom ? v.validFrom.slice(0, 10) : null,
    validUntil:         v.validTo   ? v.validTo.slice(0, 10)   : null,
    applicableServices: serviceTypesToLabel(v.applicableServiceTypes),
    created:            v.createdAt ? v.createdAt.slice(0, 10) : null,
    isActive:           v.isActive,
    _raw:               v,
  };
}

const ManagerPromotion = () => {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("created");
  const [searchQuery, setSearchQuery] = useState("");
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const fetchVouchers = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const raw = await voucherService.listVouchers({ search: searchQuery, status: filterStatus });
      setPromotions(raw.map(toCardShape));
    } catch (err) {
      setLoadError(err.message);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filterStatus]);

  useEffect(() => { fetchVouchers(); }, [fetchVouchers]);

  async function handleToggle(item) {
    try {
      await voucherService.toggleVoucher(item.id);
      fetchVouchers();
    } catch (err) {
      alert(err.message);
    }
  }

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

  // Search + status filtering is handled server-side via query params.
  // Client-side sort only (API doesn't sort).
  const filtered = [...promotions].sort((a, b) => {
    if (sortBy === "created") return new Date(b.created) - new Date(a.created);
    return 0;
  });

  const stats = {
    total:  promotions.length,
    active: promotions.filter((p) => p.status === "active").length,
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
              <option value="inactive">Tạm dừng</option>
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
            <button
              onClick={fetchVouchers}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              title="Tải lại"
            >
              <RefreshCw className={`w-5 h-5 text-gray-600 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Error */}
        {loadError && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-6">
            {loadError}
          </div>
        )}

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
                  {item.usageLimit && item.usedCount / item.usageLimit >= 0.9 && (
                    <p className="text-xs text-red-600 font-medium mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Chỉ còn {item.usageLimit - item.usedCount} lượt!
                    </p>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="p-6 bg-gray-50">
                {/* Validity */}
                <div className="text-xs text-gray-600 mb-3">
                  <div className="flex items-center gap-1 mb-1">
                    <Calendar className="w-3 h-3" />
                    <span>Hiệu lực:</span>
                  </div>
                  <div className="text-gray-500">
                    {item.validFrom
                      ? new Date(item.validFrom).toLocaleDateString("vi-VN")
                      : "—"}{" "}
                    —{" "}
                    {item.validUntil
                      ? new Date(item.validUntil).toLocaleDateString("vi-VN")
                      : "—"}
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
                </div>
                <button
                  onClick={() => handleToggle(item)}
                  className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded"
                  title={item.isActive ? "Tạm dừng" : "Kích hoạt"}
                >
                  {item.isActive ? <PauseCircle className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
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
