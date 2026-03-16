import React, { useState } from "react";
import {
  User,
  Building,
  Mail,
  Phone,
  Lock,
  Shield,
  Upload,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";

export default function PartnerProfileEdit() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "Minh Trí",
    businessName: "Công Ty Du Lịch Việt Nam",
    email: "minhtri@dulichtour.vn",
    phone: "+84 901 234 567",
    businessType: "tours",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [verificationStatus] = useState({
    houseRental: "verified",
    tours: "pending",
    carRentals: "not_verified",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "verified":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Đã Xác Minh
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <AlertCircle className="w-3 h-3 mr-1" />
            Đang Chờ
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
            <AlertCircle className="w-3 h-3 mr-1" />
            Chưa Xác Minh
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-bg-light pb-20">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center pt-6 px-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Hồ Sơ Đối Tác
            </h1>
            <p className="text-gray-600 mt-1">
              Quản lý thông tin tài khoản và xác minh tài liệu
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6 pt-8 space-y-6">
        {/* Account Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center">
              <User className="w-5 h-5 text-primary mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">
                Thông Tin Tài Khoản
              </h2>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Họ và Tên
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-hover focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên Doanh Nghiệp
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-hover focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Địa Chỉ Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-hover focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số Điện Thoại
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-hover focus:border-transparent"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loại Hình Kinh Doanh
                </label>
                <select
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-hover focus:border-transparent"
                >
                  <option value="tours">Tour & Hoạt Động</option>
                  <option value="accommodation">Cho Thuê Nhà</option>
                  <option value="transportation">Cho Thuê Xe</option>
                  <option value="mixed">Nhiều Dịch Vụ</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Password & Security */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center">
              <Lock className="w-5 h-5 text-primary mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">
                Mật Khẩu & Bảo Mật
              </h2>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mật Khẩu Hiện Tại
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-hover focus:border-transparent"
                    placeholder="Nhập mật khẩu hiện tại"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mật Khẩu Mới
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-hover focus:border-transparent"
                      placeholder="Nhập mật khẩu mới"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Xác Nhận Mật Khẩu Mới
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-hover focus:border-transparent"
                      placeholder="Xác nhận mật khẩu mới"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Business Verification */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center">
              <Shield className="w-5 h-5 text-primary mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">
                Xác Minh Kinh Doanh
              </h2>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-8">
              {/* House Rental License */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-md font-medium text-gray-900">
                    Giấy Phép Cho Thuê Nhà
                  </h3>
                  {getStatusBadge(verificationStatus.houseRental)}
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-hover transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Tải lên giấy phép kinh doanh cho thuê nhà
                  </p>
                  <button className="text-primary hover:text-primary-hover font-medium text-sm">
                    Chọn tệp hoặc kéo thả vào đây
                  </button>
                </div>
              </div>

              {/* Tours Booking License */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-md font-medium text-gray-900">
                    Giấy Phép Đặt Tour
                  </h3>
                  {getStatusBadge(verificationStatus.tours)}
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-hover transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Tải lên giấy phép kinh doanh tour và hoạt động
                  </p>
                  <button className="text-primary hover:text-primary-hover font-medium text-sm">
                    Chọn tệp hoặc kéo thả vào đây
                  </button>
                </div>
              </div>

              {/* Car Rentals License */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-md font-medium text-gray-900">
                    Giấy Phép Cho Thuê Xe
                  </h3>
                  {getStatusBadge(verificationStatus.carRentals)}
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-hover transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Tải lên giấy phép kinh doanh cho thuê xe
                  </p>
                  <button className="text-primary hover:text-primary-hover font-medium text-sm">
                    Chọn tệp hoặc kéo thả vào đây
                  </button>
                </div>
              </div>

              {/* Additional Certificates */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-md font-medium text-gray-900">
                    Chứng Chỉ Bổ Sung
                  </h3>
                  <span className="text-xs text-gray-500">Tùy chọn</span>
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-hover transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Tải lên các chứng chỉ kinh doanh hoặc bằng cấp bổ sung
                  </p>
                  <button className="text-primary hover:text-primary-hover font-medium text-sm">
                    Chọn tệp hoặc kéo thả vào đây
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            className="px-6 py-2 border bg-slate-100 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
          >
            Hủy Bỏ
          </button>
          <button
            type="submit"
            className="px-6 py-2 text-white rounded-lg hover:bg-primary-hover font-medium transition-colors"
            style={{
              backgroundColor: "var(--color-primary)",
            }}
          >
            Lưu Thay Đổi
          </button>
        </div>
      </div>
    </div>
  );
}
