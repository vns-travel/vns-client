import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building,
  Package,
  Calendar,
  DollarSign,
  Star,
  Users,
  TrendingUp,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

const PartnerDashboard = () => {
  const navigate = useNavigate();
  const [guides, setGuides] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGuide, setEditingGuide] = useState(null);
  const [guideForm, setGuideForm] = useState({
    name: "",
    email: "",
    bio: "",
    languages: [],
    availability: [],
  });
  const [dashboardData, setDashboardData] = useState({
    profile: {
      businessName: "Loading...",
      businessCategory: "Loading...",
      isVerified: false,
      totalServices: 0,
      totalBookings: 0,
      totalRevenue: 0,
      averageRating: 0,
      totalReviews: 0,
    },
    recentBookings: [],
    quickStats: {
      pendingBookings: 0,
      confirmedBookings: 0,
      completedBookings: 0,
      cancelledBookings: 0,
    },
  });

  // In a real app, this would be an API call
  useEffect(() => {
    // Mock data - replace with actual API call
    const mockData = {
      profile: {
        businessName: "Hanoi Heritage Hotel",
        businessCategory: "Hotel & Accommodation",
        isVerified: true,
        totalServices: 12,
        totalBookings: 124,
        totalRevenue: 45670000, // VND
        averageRating: 4.7,
        totalReviews: 89,
      },
      recentBookings: [
        {
          id: "B001",
          customer: "Nguyen Van A",
          service: "Deluxe Room",
          date: "2023-05-15",
          status: "confirmed",
          amount: 2500000,
        },
        {
          id: "B002",
          customer: "Tran Thi B",
          service: "City Tour",
          date: "2023-05-16",
          status: "pending",
          amount: 1200000,
        },
        {
          id: "B003",
          customer: "Le Van C",
          service: "Spa Package",
          date: "2023-05-14",
          status: "completed",
          amount: 800000,
        },
      ],
      quickStats: {
        pendingBookings: 5,
        confirmedBookings: 12,
        completedBookings: 89,
        cancelledBookings: 2,
      },
      guides: [
        {
          guideId: "G001",
          name: "Nguyen Van A",
          email: "nguyen.a@example.com",
          bio: "Local historian with 5 years guiding cultural tours in Hanoi.",
          languages: ["Vietnamese", "English"],
          availability: ["Monday", "Wednesday", "Friday"],
        },
        {
          guideId: "G002",
          name: "Tran Thi B",
          email: "tran.b@example.com",
          bio: "Adventure guide specializing in trekking and outdoor activities.",
          languages: ["Vietnamese", "English", "French"],
          availability: ["Tuesday", "Thursday", "Saturday"],
        },
      ],
    };

    // Simulate API delay
    setTimeout(() => {
      setDashboardData(mockData);
      setGuides(mockData.guides); // Initialize guides state
    }, 1000);
  }, []);

  const openModal = (guide = null) => {
    setEditingGuide(guide);
    setGuideForm(
      guide || {
        name: "",
        email: "",
        bio: "",
        languages: [],
        certifications: [],
        availability: [],
      }
    );
    setIsModalOpen(true);
  };

  const handleSaveGuide = () => {
    if (!guideForm.name.trim()) {
      alert("Vui lòng nhập tên hướng dẫn viên!");
      return;
    }
    if (
      guides.some(
        (g) =>
          g.name.trim().toLowerCase() === guideForm.name.trim().toLowerCase() &&
          g.guideId !== (editingGuide?.guideId || "")
      )
    ) {
      alert("Hướng dẫn viên với tên này đã tồn tại!");
      return;
    }
    if (editingGuide) {
      setGuides((prev) =>
        prev.map((g) =>
          g.guideId === editingGuide.guideId
            ? { ...guideForm, guideId: g.guideId }
            : g
        )
      );
    } else {
      const newGuideId = `G${(guides.length + 1).toString().padStart(3, "0")}`;
      setGuides((prev) => [...prev, { ...guideForm, guideId: newGuideId }]);
    }
    setIsModalOpen(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "cancelled":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "completed":
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "confirmed":
        return "Đã xác nhận";
      case "pending":
        return "Chờ xử lý";
      case "cancelled":
        return "Đã hủy";
      case "completed":
        return "Hoàn thành";
      default:
        return status;
    }
  };

  const handleAddGuide = (name, email) => {
    if (!name.trim()) {
      alert("Vui lòng nhập tên hướng dẫn viên!");
      return;
    }
    const newGuideId = `G${(guides.length + 1).toString().padStart(3, "0")}`;
    setGuides((prev) => [...prev, { guideId: newGuideId, name, email }]);
  };

  const handleDeleteGuide = (guideId) => {
    if (window.confirm("Bạn có chắc muốn xóa hướng dẫn viên này?")) {
      setGuides((prev) => prev.filter((guide) => guide.guideId !== guideId));
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
                Chào mừng trở lại, {dashboardData.profile.businessName}!
              </h1>
              <p className="text-gray-600">
                Theo dõi hiệu suất kinh doanh của bạn ở đây
              </p>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100 text-blue-600 mr-4">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Dịch vụ</p>
                <p className="text-2xl font-bold">
                  {dashboardData.profile.totalServices}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-100 text-green-600 mr-4">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Đặt chỗ</p>
                <p className="text-2xl font-bold">
                  {dashboardData.profile.totalBookings}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-100 text-purple-600 mr-4">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Doanh thu</p>
                <p className="text-2xl font-bold">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(dashboardData.profile.totalRevenue)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-yellow-100 text-yellow-600 mr-4">
                <Star className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Đánh giá</p>
                <p className="text-2xl font-bold">
                  {dashboardData.profile.averageRating}
                  <span className="text-sm font-normal text-gray-500">
                    {" "}
                    ({dashboardData.profile.totalReviews})
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Stats */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Thống kê đặt chỗ
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-yellow-500 mr-2" />
                    <span>Chờ xử lý</span>
                  </div>
                  <span className="font-semibold">
                    {dashboardData.quickStats.pendingBookings}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span>Đã xác nhận</span>
                  </div>
                  <span className="font-semibold">
                    {dashboardData.quickStats.confirmedBookings}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-blue-500 mr-2" />
                    <span>Hoàn thành</span>
                  </div>
                  <span className="font-semibold">
                    {dashboardData.quickStats.completedBookings}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <XCircle className="w-4 h-4 text-red-500 mr-2" />
                    <span>Đã hủy</span>
                  </div>
                  <span className="font-semibold">
                    {dashboardData.quickStats.cancelledBookings}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow p-6 mb-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Đặt chỗ gần đây
                </h3>
                <button
                  onClick={() => navigate("/partner/bookings")}
                  className="text-primary hover:text-primary-hover text-sm font-medium"
                >
                  Xem tất cả
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Mã
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Khách hàng
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Dịch vụ
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Ngày
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Trạng thái
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Số tiền
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dashboardData.recentBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {booking.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {booking.customer}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {booking.service}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {booking.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            {getStatusIcon(booking.status)}
                            <span className="ml-2">
                              {getStatusText(booking.status)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(booking.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {/* Guide Management */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Quản lý hướng dẫn viên
                  </h3>
                  <button
                    onClick={() => openModal()}
                    className="text-primary hover:text-primary-hover text-sm font-medium"
                  >
                    Thêm hướng dẫn viên
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Mã
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tên
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Hành động
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {guides.map((guide) => (
                        <tr key={guide.guideId} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {guide.guideId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {guide.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {guide.email || "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => openModal(guide)}
                              className="text-blue-600 hover:text-blue-800 mr-4"
                            >
                              Sửa
                            </button>
                            <button
                              onClick={() => handleDeleteGuide(guide.guideId)}
                              className="text-red-600 hover:text-red-800 mr-4"
                            >
                              Xóa
                            </button>
                            <button
                              onClick={() =>
                                alert(JSON.stringify(guide, null, 2))
                              }
                              className="text-green-600 hover:text-green-800"
                            >
                              Xem hồ sơ
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Modal for Adding/Editing Guide */}
            {isModalOpen && (
              <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
                <div className="bg-white rounded-lg p-6 w-full max-w-md">
                  <h3 className="text-lg font-semibold mb-4">
                    {editingGuide
                      ? "Sửa hướng dẫn viên"
                      : "Thêm hướng dẫn viên"}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Tên *
                      </label>
                      <input
                        type="text"
                        value={guideForm.name}
                        onChange={(e) =>
                          setGuideForm({ ...guideForm, name: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="Nguyen Van A"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        value={guideForm.email}
                        onChange={(e) =>
                          setGuideForm({ ...guideForm, email: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="nguyen.a@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Tiểu sử
                      </label>
                      <textarea
                        value={guideForm.bio}
                        onChange={(e) =>
                          setGuideForm({ ...guideForm, bio: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="Giới thiệu ngắn về hướng dẫn viên..."
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Ngôn ngữ
                      </label>
                      <input
                        type="text"
                        value={guideForm.languages.join(", ")}
                        onChange={(e) =>
                          setGuideForm({
                            ...guideForm,
                            languages: e.target.value
                              .split(", ")
                              .filter(Boolean),
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="Vietnamese, English, French"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Chứng chỉ
                      </label>
                      <input
                        type="text"
                        value={guideForm.certifications.join(", ")}
                        onChange={(e) =>
                          setGuideForm({
                            ...guideForm,
                            certifications: e.target.value
                              .split(", ")
                              .filter(Boolean),
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="Certified Tour Guide, First Aid"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Ngày trống
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          "Monday",
                          "Tuesday",
                          "Wednesday",
                          "Thursday",
                          "Friday",
                          "Saturday",
                          "Sunday",
                        ].map((day) => (
                          <label key={day} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={guideForm.availability.includes(day)}
                              onChange={(e) => {
                                const newAvailability = e.target.checked
                                  ? [...guideForm.availability, day]
                                  : guideForm.availability.filter(
                                      (d) => d !== day
                                    );
                                setGuideForm({
                                  ...guideForm,
                                  availability: newAvailability,
                                });
                              }}
                              className="mr-2"
                            />
                            {day === "Monday"
                              ? "Thứ Hai"
                              : day === "Tuesday"
                              ? "Thứ Ba"
                              : day === "Wednesday"
                              ? "Thứ Tư"
                              : day === "Thursday"
                              ? "Thứ Năm"
                              : day === "Friday"
                              ? "Thứ Sáu"
                              : day === "Saturday"
                              ? "Thứ Bảy"
                              : "Chủ Nhật"}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end space-x-2">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleSaveGuide}
                      className="px-4 py-2 bg-primary text-white rounded-lg"
                    >
                      Lưu
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerDashboard;
