import React, { useState } from "react";
import {
  ArrowLeft,
  Edit3,
  Save,
  X,
  CheckCircle,
  Clock,
  PauseCircle,
  XCircle,
  Gift,
  Percent,
  DollarSign,
  Calendar,
  Users,
  Eye,
  TrendingUp,
  Copy,
  AlertCircle,
  Tag,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const defaultPromotion = {
  id: 1,
  name: "Ưu đãi đặt sớm - Mùa hè 2026",
  description:
    "Giảm 25% cho tất cả đặt phòng trước 45 ngày. Áp dụng cho kỳ nghỉ từ tháng 6-8/2026.",
  status: "active",
  promoCode: "SUMMER2026",
  discountType: "percentage",
  discountValue: 25,
  minOrderValue: 1000000,
  usageLimit: 500,
  usedCount: 167,
  validFrom: "2026-03-01",
  validUntil: "2026-05-31",
  bookings: 167,
  revenue: 125250000,
  applicableServices: "Tất cả phòng và villa",
  created: "2026-02-20",
  views: 2847,
  customerSavings: 41750000,
  maxUsesPerCustomer: 2,
};

const ManagerPromotionDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initial = location.state?.promotion || defaultPromotion;

  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ ...initial });

  const update = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN").format(price) + " ₫";

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "draft": return "bg-gray-100 text-gray-800";
      case "paused": return "bg-yellow-100 text-yellow-800";
      case "expired": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active": return <CheckCircle className="w-4 h-4" />;
      case "draft": return <Clock className="w-4 h-4" />;
      case "paused": return <PauseCircle className="w-4 h-4" />;
      case "expired": return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
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

  const usagePercent = (formData.usedCount / formData.usageLimit) * 100;

  return (
    <div className="min-h-screen bg-bg-light p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/ManagerPromotion")}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Chi tiết khuyến mãi
              </h1>
              <p className="text-gray-500 text-sm">
                Xem và quản lý thông tin khuyến mãi
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {editing ? (
              <>
                <button
                  onClick={() => {
                    setFormData({ ...initial });
                    setEditing(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  <X className="w-4 h-4" />
                  Hủy
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover"
                >
                  <Save className="w-4 h-4" />
                  Lưu
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover"
              >
                <Edit3 className="w-4 h-4" />
                Chỉnh sửa
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-gray-900">
                  Thông tin cơ bản
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(formData.status)}`}
                >
                  {getStatusIcon(formData.status)}
                  {getStatusLabel(formData.status)}
                </span>
              </div>

              {editing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tên khuyến mãi
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => update("name", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mô tả
                    </label>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) => update("description", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Trạng thái
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => update("status", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary bg-white"
                    >
                      <option value="active">Đang hoạt động</option>
                      <option value="draft">Bản nháp</option>
                      <option value="paused">Tạm dừng</option>
                      <option value="expired">Đã hết hạn</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {formData.name}
                  </h3>
                  <p className="text-gray-600 text-sm">{formData.description}</p>
                </div>
              )}
            </div>

            {/* Promo Code & Discount */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4">
                Mã & Ưu đãi
              </h2>
              {editing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mã khuyến mãi
                    </label>
                    <input
                      type="text"
                      value={formData.promoCode}
                      onChange={(e) =>
                        update("promoCode", e.target.value.toUpperCase())
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hình thức giảm
                      </label>
                      <select
                        value={formData.discountType}
                        onChange={(e) => update("discountType", e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary bg-white"
                      >
                        <option value="percentage">Phần trăm (%)</option>
                        <option value="fixed">Số tiền cố định (₫)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Giá trị giảm
                      </label>
                      <input
                        type="number"
                        value={formData.discountValue}
                        onChange={(e) =>
                          update("discountValue", Number(e.target.value))
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Giá trị đơn tối thiểu (₫)
                    </label>
                    <input
                      type="number"
                      value={formData.minOrderValue}
                      onChange={(e) =>
                        update("minOrderValue", Number(e.target.value))
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <code className="px-4 py-2 bg-blue-50 border border-blue-200 text-blue-800 text-base font-mono font-bold rounded-lg">
                      {formData.promoCode}
                    </code>
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(formData.promoCode)
                      }
                      className="p-2 text-gray-400 hover:text-primary hover:bg-gray-100 rounded"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    {formData.discountType === "percentage" ? (
                      <span className="flex items-center gap-1 text-green-600 font-semibold">
                        <Percent className="w-4 h-4" />
                        Giảm {formData.discountValue}%
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-green-600 font-semibold">
                        <DollarSign className="w-4 h-4" />
                        Giảm {formatPrice(formData.discountValue)}
                      </span>
                    )}
                    <span className="text-sm text-gray-500">
                      Đơn tối thiểu {formatPrice(formData.minOrderValue)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Scope & Validity */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4">
                Phạm vi & Thời hạn
              </h2>
              {editing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dịch vụ áp dụng
                    </label>
                    <select
                      value={formData.applicableServices}
                      onChange={(e) =>
                        update("applicableServices", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary bg-white"
                    >
                      <option value="Tất cả dịch vụ">Tất cả dịch vụ</option>
                      <option value="Tất cả phòng và villa">
                        Tất cả phòng và villa
                      </option>
                      <option value="Tour và lưu trú">Tour và lưu trú</option>
                      <option value="Phòng Deluxe và Suite">
                        Phòng Deluxe và Suite
                      </option>
                      <option value="Combo dịch vụ">Combo dịch vụ</option>
                      <option value="Thuê xe">Thuê xe</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ngày bắt đầu
                      </label>
                      <input
                        type="date"
                        value={formData.validFrom}
                        onChange={(e) => update("validFrom", e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ngày kết thúc
                      </label>
                      <input
                        type="date"
                        value={formData.validUntil}
                        onChange={(e) => update("validUntil", e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tổng lượt sử dụng tối đa
                      </label>
                      <input
                        type="number"
                        value={formData.usageLimit}
                        onChange={(e) =>
                          update("usageLimit", Number(e.target.value))
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tối đa mỗi khách
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={formData.maxUsesPerCustomer}
                        onChange={(e) =>
                          update("maxUsesPerCustomer", Number(e.target.value))
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Tag className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Áp dụng cho:</span>
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                      {formData.applicableServices}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>
                      {new Date(formData.validFrom).toLocaleDateString("vi-VN")}{" "}
                      —{" "}
                      {new Date(formData.validUntil).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span>
                      Tối đa {formData.maxUsesPerCustomer} lần/khách hàng
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-6">
            {/* Usage */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4">
                Mức độ sử dụng
              </h2>
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Đã sử dụng</span>
                  <span className="font-semibold">
                    {formData.usedCount}/{formData.usageLimit}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${
                      usagePercent >= 90
                        ? "bg-red-500"
                        : usagePercent >= 70
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                    style={{ width: `${Math.min(usagePercent, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {usagePercent.toFixed(1)}% đã sử dụng
                </p>
              </div>
            </div>

            {/* Performance */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4">
                Hiệu suất
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    Lượt đặt
                  </div>
                  <span className="font-semibold text-gray-900">
                    {formData.bookings}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <DollarSign className="w-4 h-4" />
                    Doanh thu
                  </div>
                  <span className="font-semibold text-primary">
                    {formatPrice(formData.revenue)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Eye className="w-4 h-4" />
                    Lượt xem
                  </div>
                  <span className="font-semibold text-gray-900">
                    {formData.views?.toLocaleString("vi-VN")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Gift className="w-4 h-4" />
                    KH tiết kiệm
                  </div>
                  <span className="font-semibold text-green-600">
                    {formatPrice(formData.customerSavings)}
                  </span>
                </div>
              </div>
            </div>

            {/* Created */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-3">
                Thông tin tạo
              </h2>
              <p className="text-sm text-gray-600">
                Ngày tạo:{" "}
                <span className="font-medium text-gray-900">
                  {new Date(formData.created).toLocaleDateString("vi-VN")}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerPromotionDetails;
