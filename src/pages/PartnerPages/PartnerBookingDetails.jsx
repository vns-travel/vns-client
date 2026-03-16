import React, { useState } from "react";
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  Users,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Home,
  Car,
  Camera,
  MessageSquare,
  CreditCard,
} from "lucide-react";

const PartnerBookingDetails = () => {
  const [activeTab, setActiveTab] = useState("details");

  // Mock booking data updated for Oceanview Homestay
  const booking = {
    bookingId: "BK-2024-001",
    bookingReference: "VNS-HCM-240815-001",
    bookingType: "Homestay", // Homestay, Tour, Vehicle Rental
    bookingStatus: "pending",
    paymentStatus: "paid",
    paymentMethod: "credit_card",
    totalAmount: 3200000, // VND
    depositAmount: 640000, // VND
    remainingAmount: 2560000, // VND
    numberOfGuests: 6,
    specialRequests:
      "Ưa thích nhận phòng sớm nếu có thể, vui lòng xác nhận chi tiết quyền truy cập hồ bơi",
    createdAt: "2024-08-10T14:20:00",
    updatedAt: "2024-08-10T15:45:00",

    // Customer information
    customer: {
      fullName: "Trần Thị Thủy",
      email: "thuy.tran@email.com",
      phoneNumber: "+84 912 345 678",
      avatarUrl: "https://via.placeholder.com/100  ",
    },

    // Homestay booking details
    homestayBooking: {
      checkInDate: "2024-08-20T15:00:00",
      checkOutDate: "2024-08-25T11:00:00",
      nights: 5,
      adults: 4,
      children: 2,
      roomRate: 500000, // VND per night
      cleaningFee: 200000, // VND
      serviceFee: 300000, // VND
      totalAccommodationCost: 3200000, // VND
      hostApprovalRequired: true,
      hostApprovedAt: "2024-08-10T15:45:00",
    },

    // Service and location info - Updated for Oceanview Homestay
    service: {
      title: "Oceanview Homestay - Căn hộ sang trọng với tầm nhìn sông",
      serviceType: "Homestay",
      location: {
        name: "Saigon Riverside",
        address:
          "123 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, Thành phố Hồ Chí Minh",
        city: "Thành phố Hồ Chí Minh",
        district: "Quận 1",
        ward: "Phường Bến Nghé",
      },
    },

    // Room details - Updated for Oceanview Homestay
    room: {
      roomName: "Suite 3 Phòng Ngủ Premium với Tầm Nhìn Sông",
      maxOccupancy: 6,
      bedType: "3 Giường King",
      privateBathroom: true,
      amenities: [
        "WiFi miễn phí",
        "Điều hòa",
        "TV màn hình phẳng",
        "Bếp đầy đủ tiện nghi",
        "Máy giặt",
        "Ban công với tầm nhìn sông",
        "Tầm nhìn thành phố",
      ],
    },

    // Payment history
    payments: [
      {
        paymentId: "PAY-001",
        amount: 640000,
        paymentType: "deposit",
        paymentTime: "2024-08-10T14:35:00",
        transactionId: "TXN-VNP-240810-001",
        paymentMethod: "credit_card",
        paymentStatus: "completed",
      },
      {
        paymentId: "PAY-002",
        amount: 2560000,
        paymentType: "balance",
        paymentTime: "2024-08-18T10:00:00",
        transactionId: "TXN-VNP-240818-002",
        paymentMethod: "credit_card",
        paymentStatus: "completed",
      },
    ],
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "confirmed":
        return "Đã xác nhận";
      case "pending":
        return "Đang chờ";
      case "completed":
        return "Đã hoàn thành";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateOnly = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[#e9e9e9] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          {/* <button className="flex items-center text-[#008fa0] hover:text-[#007a8a] mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại Quản lý đặt chỗ
          </button> */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Chi tiết đặt chỗ
              </h1>
              <p className="text-gray-600 mt-1">
                Mã tham chiếu: {booking.bookingReference}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <span
                className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                  booking.bookingStatus
                )}`}
              >
                {getStatusText(booking.bookingStatus)}
              </span>
              <span className="text-2xl font-bold text-gray-900">
                {formatCurrency(booking.totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: "details", label: "Chi tiết đặt chỗ", icon: FileText },
                { key: "customer", label: "Thông tin khách hàng", icon: User },
                {
                  key: "payments",
                  label: "Lịch sử thanh toán",
                  icon: CreditCard,
                },
              ].map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === tab.key
                        ? "border-[#008fa0] text-[#008fa0]"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Booking Details Tab */}
            {activeTab === "details" && (
              <div className="space-y-6">
                {/* Service Information */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center mb-4">
                    <Home className="h-5 w-5 text-[#008fa0] mr-2" />
                    <h3 className="text-lg font-medium text-gray-900">
                      Thông tin dịch vụ
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Tên dịch vụ
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {booking.service.title}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Loại dịch vụ
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {booking.service.serviceType}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Địa điểm
                      </label>
                      <div className="mt-1 flex items-start">
                        <MapPin className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                        <p className="text-sm text-gray-900">
                          {booking.service.location.address}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Homestay Details */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center mb-4">
                    <Calendar className="h-5 w-5 text-[#008fa0] mr-2" />
                    <h3 className="text-lg font-medium text-gray-900">
                      Chi tiết lưu trú
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Ngày nhận phòng
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {formatDateOnly(booking.homestayBooking.checkInDate)}
                      </p>
                      <p className="text-xs text-gray-500">3:00 PM</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Ngày trả phòng
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {formatDateOnly(booking.homestayBooking.checkOutDate)}
                      </p>
                      <p className="text-xs text-gray-500">11:00 AM</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Số đêm
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {booking.homestayBooking.nights} đêm
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Người lớn
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {booking.homestayBooking.adults} người lớn
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Trẻ em
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {booking.homestayBooking.children} trẻ em
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Tổng số khách
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {booking.numberOfGuests} khách
                      </p>
                    </div>
                  </div>
                </div>

                {/* Room Information */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Thông tin phòng
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Tên phòng
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {booking.room.roomName}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Loại giường
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {booking.room.bedType}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Số khách tối đa
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {booking.room.maxOccupancy} khách
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Phòng tắm riêng
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {booking.room.privateBathroom ? "Có" : "Không"}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Tiện nghi phòng
                      </label>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {booking.room.amenities.map((amenity, index) => (
                          <span
                            key={index}
                            className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Special Requests */}
                {booking.specialRequests && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center mb-4">
                      <MessageSquare className="h-5 w-5 text-[#008fa0] mr-2" />
                      <h3 className="text-lg font-medium text-gray-900">
                        Yêu cầu đặc biệt
                      </h3>
                    </div>
                    <p className="text-sm text-gray-900">
                      {booking.specialRequests}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Customer Info Tab */}
            {activeTab === "customer" && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center mb-6">
                  <User className="h-5 w-5 text-[#008fa0] mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">
                    Thông tin khách hàng
                  </h3>
                </div>
                <div className="flex items-start space-x-4 mb-6">
                  <img
                    src={booking.customer.avatarUrl}
                    alt={booking.customer.fullName}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-xl font-medium text-gray-900">
                      {booking.customer.fullName}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Khách hàng từ tháng 8 năm 2024
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-gray-400 mr-3" />
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <p className="text-sm text-gray-900">
                          {booking.customer.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-gray-400 mr-3" />
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Số điện thoại
                        </label>
                        <p className="text-sm text-gray-900">
                          {booking.customer.phoneNumber}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Lịch sử đặt chỗ
                      </label>
                      <p className="text-sm text-gray-900">
                        1 đặt chỗ trước đó
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Đánh giá khách hàng
                      </label>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-900">5.0/5.0</span>
                        <span className="text-xs text-gray-500 ml-2">
                          (3 đánh giá)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Payment History Tab */}
            {activeTab === "payments" && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center">
                    <CreditCard className="h-5 w-5 text-[#008fa0] mr-2" />
                    <h3 className="text-lg font-medium text-gray-900">
                      Lịch sử thanh toán
                    </h3>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Mã thanh toán
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Loại
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Số tiền
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Phương thức
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ngày
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Trạng thái
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {booking.payments.map((payment) => (
                        <tr key={payment.paymentId}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {payment.paymentId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {payment.paymentType === "deposit"
                              ? "Đặt cọc"
                              : "Số dư"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(payment.amount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {payment.paymentMethod === "credit_card"
                              ? "Thẻ tín dụng"
                              : "Khác"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(payment.paymentTime)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                payment.paymentStatus
                              )}`}
                            >
                              {getStatusText(payment.paymentStatus)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Hành động nhanh
              </h3>
              <div className="space-y-3">
                {booking.bookingStatus === "pending" && (
                  <button className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Xác nhận đặt chỗ
                  </button>
                )}
                {booking.bookingStatus !== "cancelled" &&
                  booking.bookingStatus !== "completed" && (
                    <button className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                      <XCircle className="h-4 w-4 mr-2" />
                      Hủy đặt chỗ
                    </button>
                  )}
                <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Nhắn tin khách hàng
                </button>
              </div>
            </div>

            {/* Booking Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Tổng kết đặt chỗ
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Giá phòng ({booking.homestayBooking.nights} đêm @{" "}
                    {formatCurrency(booking.homestayBooking.roomRate)}/đêm)
                  </span>
                  <span className="text-gray-900">
                    {formatCurrency(
                      booking.homestayBooking.roomRate *
                        booking.homestayBooking.nights
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Phí dọn dẹp</span>
                  <span className="text-gray-900">
                    {formatCurrency(booking.homestayBooking.cleaningFee)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Phí dịch vụ</span>
                  <span className="text-gray-900">
                    {formatCurrency(booking.homestayBooking.serviceFee)}
                  </span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between text-base font-medium">
                  <span className="text-gray-900">Tổng cộng</span>
                  <span className="text-gray-900">
                    {formatCurrency(booking.totalAmount)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Đã đặt cọc</span>
                  <span className="text-green-600">
                    {formatCurrency(booking.depositAmount)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Số dư còn lại</span>
                  <span className="text-gray-900">
                    {formatCurrency(booking.remainingAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Dòng thời gian đặt chỗ
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      Đặt chỗ được tạo
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(booking.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      Chủ nhà đã duyệt
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(booking.homestayBooking.hostApprovedAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      Ngày nhận phòng
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDateOnly(booking.homestayBooking.checkInDate)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerBookingDetails;
