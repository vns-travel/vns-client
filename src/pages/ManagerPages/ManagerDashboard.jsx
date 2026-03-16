import React, { useState, useEffect } from "react";
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
} from "lucide-react";

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalPartners: 0,
      verifiedPartners: 0,
      pendingVerification: 0,
      totalUsers: 0,
      activeServices: 0,
      totalBookings: 0,
      monthlyRevenue: 0,
      platformFees: 0,
    },
    recentActivities: [],
    partnerVerificationRequests: [],
    systemHealth: {
      onlineBookings: true,
      paymentProcessing: true,
      userAuth: true,
    },
  });

  // In a real app, this would be an API call
  useEffect(() => {
    // Mock data - replace with actual API call
    const mockData = {
      stats: {
        totalPartners: 142,
        verifiedPartners: 128,
        pendingVerification: 7,
        totalUsers: 2450,
        activeServices: 387,
        totalBookings: 1240,
        monthlyRevenue: 785000000, // VND
        platformFees: 78500000, // 10% of revenue
      },
      recentActivities: [
        {
          id: 1,
          type: "partner_registered",
          partner: "Hanoi Heritage Hotel",
          time: "2 phút trước",
        },
        {
          id: 2,
          type: "booking_completed",
          service: "Đảo Ngọc Xanh Tour",
          time: "15 phút trước",
        },
        {
          id: 3,
          type: "verification_submitted",
          partner: "Saigon Street Food Tour",
          time: "1 giờ trước",
        },
        { id: 4, type: "new_user", user: "Nguyen Van A", time: "2 giờ trước" },
        {
          id: 5,
          type: "service_added",
          partner: "Dalat Riverside Resort",
          time: "3 giờ trước",
        },
      ],
      partnerVerificationRequests: [
        {
          id: "P001",
          name: "Saigon Street Food Tour",
          submitted: "2023-05-15",
          status: "pending",
        },
        {
          id: "P002",
          name: "Halong Bay Cruise",
          submitted: "2023-05-14",
          status: "pending",
        },
        {
          id: "P003",
          name: "Hoi An Photography Workshop",
          submitted: "2023-05-14",
          status: "pending",
        },
      ],
      systemHealth: {
        onlineBookings: true,
        paymentProcessing: true,
        userAuth: true,
      },
    };

    // Simulate API delay
    setTimeout(() => {
      setDashboardData(mockData);
    }, 1000);
  }, []);

  const getActivityIcon = (type) => {
    switch (type) {
      case "partner_registered":
        return <Building className="w-4 h-4 text-blue-500" />;
      case "booking_completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "verification_submitted":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case "new_user":
        return <Users className="w-4 h-4 text-purple-500" />;
      case "service_added":
        return <FileText className="w-4 h-4 text-indigo-500" />;
      default:
        return <BarChart3 className="w-4 h-4 text-gray-500" />;
    }
  };

  const getActivityText = (activity) => {
    switch (activity.type) {
      case "partner_registered":
        return (
          <span>
            Đối tác mới đăng ký: <strong>{activity.partner}</strong>
          </span>
        );
      case "booking_completed":
        return (
          <span>
            Đặt chỗ hoàn thành cho: <strong>{activity.service}</strong>
          </span>
        );
      case "verification_submitted":
        return (
          <span>
            Yêu cầu xác minh từ: <strong>{activity.partner}</strong>
          </span>
        );
      case "new_user":
        return (
          <span>
            Người dùng mới: <strong>{activity.user}</strong>
          </span>
        );
      case "service_added":
        return (
          <span>
            Dịch vụ mới từ: <strong>{activity.partner}</strong>
          </span>
        );
      default:
        return <span>Hoạt động hệ thống</span>;
    }
  };

  return (
    <div className="min-h-screen bg-bg-light pb-20">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center pt-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Chào mừng trở lại, Quản trị viên!
              </h1>
              <p className="text-gray-600">
                Theo dõi hiệu suất hệ thống và quản lý đối tác của bạn.
              </p>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100 text-blue-600 mr-4">
                <Building className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Đối tác</p>
                <p className="text-2xl font-bold">
                  {dashboardData.stats.totalPartners}
                </p>
                <p className="text-xs text-green-600">
                  {dashboardData.stats.verifiedPartners} đã xác minh
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-100 text-purple-600 mr-4">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Người dùng</p>
                <p className="text-2xl font-bold">
                  {dashboardData.stats.totalUsers}
                </p>
                <p className="text-xs text-gray-500">
                  Tổng số người dùng đã đăng ký
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-100 text-green-600 mr-4">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Dịch vụ</p>
                <p className="text-2xl font-bold">
                  {dashboardData.stats.activeServices}
                </p>
                <p className="text-xs text-gray-500">Dịch vụ đang hoạt động</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-yellow-100 text-yellow-600 mr-4">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Doanh thu tháng</p>
                <p className="text-2xl font-bold">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(dashboardData.stats.monthlyRevenue)}
                </p>
                <p className="text-xs text-gray-500">
                  Phí nền tảng:{" "}
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(dashboardData.stats.platformFees)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* System Health */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Trạng thái hệ thống
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <CheckCircle
                      className={`w-5 h-5 mr-2 ${
                        dashboardData.systemHealth.onlineBookings
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    />
                    <span>Đặt chỗ trực tuyến</span>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      dashboardData.systemHealth.onlineBookings
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {dashboardData.systemHealth.onlineBookings
                      ? "Hoạt động"
                      : "Bảo trì"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <CheckCircle
                      className={`w-5 h-5 mr-2 ${
                        dashboardData.systemHealth.paymentProcessing
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    />
                    <span>Xử lý thanh toán</span>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      dashboardData.systemHealth.paymentProcessing
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {dashboardData.systemHealth.paymentProcessing
                      ? "Hoạt động"
                      : "Bảo trì"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <CheckCircle
                      className={`w-5 h-5 mr-2 ${
                        dashboardData.systemHealth.userAuth
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    />
                    <span>Xác thực người dùng</span>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      dashboardData.systemHealth.userAuth
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {dashboardData.systemHealth.userAuth
                      ? "Hoạt động"
                      : "Bảo trì"}
                  </span>
                </div>
              </div>
            </div>

            {/* Verification Requests */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Yêu cầu xác minh
                </h3>
                <button
                  onClick={() => navigate("/manager/partner-verification")}
                  className="text-primary hover:text-primary-hover text-sm font-medium"
                >
                  Xem tất cả
                </button>
              </div>
              <div className="space-y-4">
                {dashboardData.partnerVerificationRequests.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {request.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Gửi: {request.submitted}
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                      Chờ xử lý
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Hoạt động gần đây
              </h3>

              <div className="space-y-4">
                {dashboardData.recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start p-4 hover:bg-gray-50 rounded-lg"
                  >
                    <div className="p-2 bg-gray-100 rounded-lg mr-4">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900">
                        {getActivityText(activity)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-md font-semibold text-gray-900 mb-4">
                  Thống kê tổng quan
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <BarChart3 className="w-5 h-5 text-blue-600 mr-2" />
                      <span className="text-sm font-medium text-gray-700">
                        Tổng đặt chỗ
                      </span>
                    </div>
                    <p className="text-xl font-bold mt-2">
                      {dashboardData.stats.totalBookings}
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                      <span className="text-sm font-medium text-gray-700">
                        Tăng trưởng
                      </span>
                    </div>
                    <p className="text-xl font-bold mt-2">+12.5%</p>
                    <p className="text-xs text-gray-500">So với tháng trước</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-purple-600 mr-2" />
                      <span className="text-sm font-medium text-gray-700">
                        Đánh giá TB
                      </span>
                    </div>
                    <p className="text-xl font-bold mt-2">4.7/5</p>
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

export default ManagerDashboard;
