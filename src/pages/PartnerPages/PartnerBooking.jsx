import React, { useState, useEffect } from "react";
import {
  Eye,
  Filter as FilterIcon,
  Search,
  Download,
  Calendar,
  User,
  MapPin,
  Phone,
  Mail,
  Clock,
  CreditCard,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  DollarSign,
  Package,
  RefreshCw,
  MoreVertical,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const PartnerBooking = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");

  const navigate = useNavigate();

  // Enhanced mock data with detailed Vietnamese information
  useEffect(() => {
    setTimeout(() => {
      const mockBookings = [
        // Homestay Bookings
        {
          id: "VNS-HB-20241501",
          bookingId: "uuid-hb-001",
          customerName: "Nguyễn Văn Minh",
          email: "nguyen.minh@gmail.com",
          phone: "+84 901 234 567",
          serviceType: "Homestay",
          serviceName: "Oceanview Deluxe Homestay",
          checkInDate: "2026-06-10",
          checkOutDate: "2026-06-15",
          nights: 5,
          guests: "2 người lớn, 1 trẻ em",
          status: "confirmed",
          amount: 7500000,
          paidAmount: 7500000,
          paymentMethod: "ZaloPay",
          paymentStatus: "paid",
          address: "123 Trần Phú, Quận 1, TP. Hồ Chí Minh",
          notes: "Yêu cầu phòng tầng cao. Đến muộn khoảng 22:00.",
          roomName: "Phòng Deluxe Ocean View",
          roomRate: 1500000,
          numberOfRooms: 1,
          bookingDate: "2026-05-20",
          lastUpdated: "2026-05-22",
          customerAvatar: "NVM",
          specialRequests: "Giường cũi cho trẻ em",
          bookingSource: "Website",
        },
        {
          id: "VNS-HB-20241502",
          bookingId: "uuid-hb-002",
          customerName: "Trần Thị Hương",
          email: "tran.huong@email.com",
          phone: "+84 912 345 678",
          serviceType: "Homestay",
          serviceName: "Biệt Thự Mountain View Đà Lạt",
          checkInDate: "2026-06-20",
          checkOutDate: "2026-06-23",
          nights: 3,
          guests: "4 người lớn",
          status: "pending",
          amount: 13500000,
          paidAmount: 0,
          paymentMethod: "Chuyển khoản",
          paymentStatus: "pending",
          address: "45 Phường 4, Đà Lạt, Lâm Đồng",
          notes: "Đặt cho kỳ nghỉ gia đình",
          roomName: "Villa 5 phòng ngủ",
          roomRate: 4500000,
          numberOfRooms: 1,
          bookingDate: "2026-06-01",
          lastUpdated: "2026-06-01",
          customerAvatar: "TTH",
          specialRequests: "Cần bếp đầy đủ thiết bị",
          bookingSource: "Mobile App",
        },
        // Tour Bookings
        {
          id: "VNS-TB-20241503",
          bookingId: "uuid-tb-003",
          customerName: "Lê Hoàng Nam",
          email: "le.nam@email.com",
          phone: "+84 987 654 321",
          serviceType: "Tour",
          serviceName: "Hanoi Old Quarter Street Food Tour",
          tourDate: "2026-06-18",
          timeSlot: "09:00 - 13:00",
          participants: 3,
          status: "confirmed",
          amount: 1350000,
          paidAmount: 1350000,
          paymentMethod: "PayOS",
          paymentStatus: "paid",
          address: "Điểm hẹn: Nhà hát Lớn Hà Nội",
          notes: "Có 1 người ăn chay",
          guideName: "Nguyễn Văn Tú",
          pickupLocation: "Cổng chính Nhà hát Lớn",
          duration: "4 giờ",
          language: "Tiếng Việt, Tiếng Anh",
          bookingDate: "2026-06-05",
          lastUpdated: "2026-06-06",
          customerAvatar: "LHN",
          specialRequests: "1 người ăn chay",
          bookingSource: "Website",
          included: ["Hướng dẫn viên", "Đồ ăn", "Nước uống"],
        },
        {
          id: "VNS-TB-20241504",
          bookingId: "uuid-tb-004",
          customerName: "Phạm Minh Châu",
          email: "pham.chau@email.com",
          phone: "+84 903 456 789",
          serviceType: "Tour",
          serviceName: "Hội An Cultural Heritage Walk",
          tourDate: "2026-06-25",
          timeSlot: "08:00 - 11:00",
          participants: 2,
          status: "completed",
          amount: 700000,
          paidAmount: 700000,
          paymentMethod: "Tiền mặt",
          paymentStatus: "paid",
          address: "Điểm hẹn: Chùa Cầu, Hội An",
          notes: "Khách nước ngoài, cần hướng dẫn tiếng Anh",
          guideName: "Trần Văn Hùng",
          pickupLocation: "Chùa Cầu",
          duration: "3 giờ",
          language: "Tiếng Anh",
          bookingDate: "2026-06-10",
          lastUpdated: "2026-06-25",
          customerAvatar: "PMC",
          specialRequests: "Guide nói tiếng Anh",
          bookingSource: "Partner Referral",
          included: ["Hướng dẫn viên", "Vé tham quan", "Nước uống"],
          rating: 5,
          review: "Tour rất tuyệt vời, hướng dẫn viên nhiệt tình!",
        },
        // Vehicle Rental Bookings
        {
          id: "VNS-VB-20241505",
          bookingId: "uuid-vb-005",
          customerName: "Võ Thanh Tùng",
          email: "vo.tung@email.com",
          phone: "+84 333 444 555",
          serviceType: "Car Rental",
          serviceName: "Thuê Xe SUV 7 Chỗ - Toyota Fortuner",
          rentalStartTime: "2026-06-22T08:00:00",
          rentalEndTime: "2026-06-24T18:00:00",
          rentalHours: 58,
          rentalDays: 3,
          status: "confirmed",
          amount: 2400000,
          paidAmount: 1200000,
          deposit: 3000000,
          paymentMethod: "ZaloPay",
          paymentStatus: "partial",
          address: "Nhận xe: Sân bay Tân Sơn Nhất",
          notes: "Trả xe tại depot Quận 1, cần ghế trẻ em",
          vehicleName: "Toyota Fortuner 2022",
          vehicleType: "SUV 7 chỗ",
          pickupLocation: "Sân bay Tân Sơn Nhất",
          returnLocation: "180 Nguyễn Văn Trỗi, Quận 1",
          driverIncluded: true,
          driverName: "Nguyễn Văn Đức",
          bookingDate: "2026-06-08",
          lastUpdated: "2026-06-15",
          customerAvatar: "VTT",
          specialRequests: "Cần 1 ghế trẻ em (3 tuổi)",
          bookingSource: "Website",
          included: ["Tài xế", "Xăng", "Bảo hiểm", "Nước uống"],
          transmission: "Tự động",
          fuelType: "Xăng",
        },
        {
          id: "VNS-VB-20241506",
          bookingId: "uuid-vb-006",
          customerName: "Đặng Thị Mai",
          email: "dang.mai@email.com",
          phone: "+84 909 876 543",
          serviceType: "Car Rental",
          serviceName: "Thuê Xe Sedan Mercedes C-Class",
          rentalStartTime: "2026-07-01T09:00:00",
          rentalEndTime: "2026-07-01T21:00:00",
          rentalHours: 12,
          rentalDays: 1,
          status: "cancelled",
          amount: 1800000,
          paidAmount: 0,
          deposit: 0,
          paymentMethod: "Chưa thanh toán",
          paymentStatus: "cancelled",
          address: "Nhận xe: Quận 3, TP. Hồ Chí Minh",
          notes: "Hủy do thay đổi kế hoạch",
          vehicleName: "Mercedes C-Class 2026",
          vehicleType: "Sedan 5 chỗ",
          pickupLocation: "123 Võ Văn Tần, Quận 3",
          returnLocation: "123 Võ Văn Tần, Quận 3",
          driverIncluded: false,
          driverName: null,
          bookingDate: "2026-06-25",
          lastUpdated: "2026-06-28",
          customerAvatar: "DTM",
          specialRequests: null,
          bookingSource: "Mobile App",
          cancellationReason: "Thay đổi lịch trình cá nhân",
          cancelledAt: "2026-06-28",
          transmission: "Tự động",
          fuelType: "Xăng",
        },
        {
          id: "VNS-HB-20241507",
          bookingId: "uuid-hb-007",
          customerName: "Bùi Văn Khoa",
          email: "bui.khoa@email.com",
          phone: "+84 918 765 432",
          serviceType: "Homestay",
          serviceName: "Căn Hộ Mặt Biển Nha Trang",
          checkInDate: "2026-06-28",
          checkOutDate: "2026-07-02",
          nights: 4,
          guests: "2 người lớn, 2 trẻ em",
          status: "confirmed",
          amount: 8800000,
          paidAmount: 8800000,
          paymentMethod: "PayOS",
          paymentStatus: "paid",
          address: "88 Trần Phú, Nha Trang, Khánh Hòa",
          notes: "Kỷ niệm ngày cưới, nhờ trang trí phòng",
          roomName: "Căn hộ 3 phòng ngủ view biển",
          roomRate: 2200000,
          numberOfRooms: 1,
          bookingDate: "2026-06-10",
          lastUpdated: "2026-06-12",
          customerAvatar: "BVK",
          specialRequests: "Trang trí phòng lãng mạn, bánh kem",
          bookingSource: "Website",
        },
      ];
      setBookings(mockBookings);
      setLoading(false);
    }, 800);
  }, []);

  // Calculate enhanced stats
  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    completed: bookings.filter((b) => b.status === "completed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
    totalRevenue: bookings.reduce(
      (sum, b) => sum + (b.status !== "cancelled" ? b.paidAmount : 0),
      0,
    ),
    pendingRevenue: bookings
      .filter((b) => b.status === "pending")
      .reduce((sum, b) => sum + b.amount, 0),
    thisWeek: bookings.filter((b) => {
      const bookingDate = new Date(b.bookingDate);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return bookingDate >= weekAgo;
    }).length,
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
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

  const getServiceTypeText = (type) => {
    switch (type) {
      case "Homestay":
        return "Lưu trú";
      case "Tour":
        return "Tour";
      case "Car Rental":
        return "Thuê xe";
      default:
        return type;
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " ₫";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // Enhanced filtering
  const filteredBookings = bookings.filter((booking) => {
    const matchesTab = activeTab === "all" || booking.status === activeTab;
    const matchesSearch =
      booking.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.serviceName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  // Sorting
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return new Date(b.bookingDate) - new Date(a.bookingDate);
      case "amount":
        return b.amount - a.amount;
      case "checkIn":
        if (a.serviceType === "Homestay" && b.serviceType === "Homestay") {
          return new Date(a.checkInDate) - new Date(b.checkInDate);
        }
        return 0;
      default:
        return 0;
    }
  });

  const handleConfirmBooking = (bookingId) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.bookingId === bookingId
          ? { ...b, status: "confirmed", lastUpdated: new Date().toISOString() }
          : b,
      ),
    );
    alert("✅ Đặt chỗ đã được xác nhận!");
  };

  const handleCancelBooking = (bookingId) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.bookingId === bookingId
          ? {
              ...b,
              status: "cancelled",
              cancelledAt: new Date().toISOString(),
              lastUpdated: new Date().toISOString(),
            }
          : b,
      ),
    );
    setShowCancelModal(false);
    alert("❌ Đặt chỗ đã bị hủy!");
  };

  const viewDetail = (booking) => {
    let route = "";
    if (booking.serviceType === "Homestay") {
      route = `/partner/bookings/homestay/${booking.bookingId}`;
    } else if (booking.serviceType === "Tour") {
      route = `/partner/bookings/tour/${booking.bookingId}`;
    } else if (booking.serviceType === "Car Rental") {
      route = `/partner/bookings/vehicle/${booking.bookingId}`;
    }
    navigate(route);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#e9e9e9] p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center pt-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Quản lý đặt chỗ
              </h1>
              <p className="text-gray-600 mt-1">
                Theo dõi và quản lý các đặt chỗ của bạn
              </p>
            </div>
          </div>
          <div className="mt-10 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#008fa0]"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#e9e9e9] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center pt-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Quản lý đặt chỗ
            </h1>
            <p className="text-gray-600 mt-1">
              Theo dõi và quản lý các đặt chỗ của bạn
            </p>
          </div>
          {/* <div className="flex items-center gap-3 mt-4 md:mt-0">
            <button className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              <Download className="w-4 h-4 mr-2" />
              Xuất báo cáo
            </button>
            <button className="flex items-center px-4 py-2 text-gray-600 hover:bg-white rounded-lg border border-transparent hover:border-gray-300">
              <RefreshCw className="w-4 h-4 mr-2" />
              Làm mới
            </button>
          </div> */}
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Revenue */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {formatPrice(stats.totalRevenue)}
            </div>
            <div className="text-sm text-gray-500 mb-2">Doanh thu đã nhận</div>
            {/* <div className="text-xs text-orange-600 font-medium">
              +{formatPrice(stats.pendingRevenue)} đang chờ
            </div> */}
          </div>

          {/* Total Bookings */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              {/* <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                +{stats.thisWeek} tuần này
              </span> */}
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {stats.total}
            </div>
            <div className="text-sm text-gray-500 mb-2">Tổng đặt chỗ</div>
            {/* <div className="text-xs text-gray-600">
              {stats.completed} đã hoàn thành
            </div> */}
          </div>

          {/* Pending Actions */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <AlertCircle className="w-4 h-4 text-yellow-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {stats.pending}
            </div>
            <div className="text-sm text-gray-500 mb-2">Đang chờ xác nhận</div>
            {/* <div className="text-xs text-yellow-600 font-medium">
              Cần xử lý ngay
            </div> */}
          </div>

          {/* Confirmed Bookings */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-purple-600" />
              </div>
              {/* <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                {stats.confirmed} sắp tới
              </span> */}
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {stats.confirmed}
            </div>
            <div className="text-sm text-gray-500 mb-2">Đã xác nhận</div>
            {/* <div className="text-xs text-gray-600">
              {stats.cancelled} đã hủy
            </div> */}
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm theo mã đặt chỗ, tên khách, dịch vụ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#008fa0] focus:border-[#008fa0]"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#008fa0] focus:border-[#008fa0] bg-white"
            >
              <option value="recent">Mới nhất</option>
              <option value="amount">Giá trị cao nhất</option>
              <option value="checkIn">Ngày nhận phòng</option>
            </select>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: "all", label: "Tất cả", count: stats.total },
                { id: "pending", label: "Đang chờ", count: stats.pending },
                {
                  id: "confirmed",
                  label: "Đã xác nhận",
                  count: stats.confirmed,
                },
                {
                  id: "completed",
                  label: "Hoàn thành",
                  count: stats.completed,
                },
                { id: "cancelled", label: "Đã hủy", count: stats.cancelled },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-[#008fa0] text-[#008fa0]"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.label}
                  <span className="ml-2 py-0.5 px-2 rounded-full text-xs bg-gray-100 text-gray-600">
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                {sortedBookings.length} đặt chỗ
              </h3>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mã đặt chỗ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Khách hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dịch vụ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thời gian
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thanh toán
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedBookings.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      <div className="flex flex-col items-center">
                        <Package className="w-12 h-12 text-gray-300 mb-3" />
                        <p className="text-lg font-medium text-gray-900 mb-1">
                          Không có đặt chỗ nào
                        </p>
                        <p className="text-sm text-gray-500">
                          {searchQuery
                            ? `Không tìm thấy kết quả cho "${searchQuery}"`
                            : activeTab === "all"
                              ? "Chưa có đặt chỗ nào"
                              : `Không có đặt chỗ ${getStatusText(activeTab).toLowerCase()}`}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  sortedBookings.map((booking) => (
                    <tr
                      key={booking.bookingId}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-gray-900">
                            {booking.id}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(booking.bookingDate)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {booking.customerAvatar}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {booking.customerName}
                            </div>
                            <div className="text-xs text-gray-500 flex items-center">
                              <Phone className="w-3 h-3 mr-1" />
                              {booking.phone}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <div className="text-sm font-medium text-gray-900 mb-1">
                            {booking.serviceName}
                          </div>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#E6F3F4] text-[#008fa0] w-fit">
                            {getServiceTypeText(booking.serviceType)}
                          </span>
                          {booking.specialRequests && (
                            <div className="text-xs text-orange-600 mt-1 flex items-center">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              {booking.specialRequests}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {booking.serviceType === "Homestay" && (
                            <div className="flex flex-col">
                              <div className="flex items-center mb-1">
                                <Calendar className="w-3 h-3 mr-1 text-gray-400" />
                                <span>{formatDate(booking.checkInDate)}</span>
                              </div>
                              <div className="text-xs text-gray-500">
                                {booking.nights} đêm • {booking.guests}
                              </div>
                            </div>
                          )}
                          {booking.serviceType === "Tour" && (
                            <div className="flex flex-col">
                              <div className="flex items-center mb-1">
                                <Calendar className="w-3 h-3 mr-1 text-gray-400" />
                                <span>{formatDate(booking.tourDate)}</span>
                              </div>
                              <div className="text-xs text-gray-500">
                                {booking.timeSlot} • {booking.participants}{" "}
                                người
                              </div>
                            </div>
                          )}
                          {booking.serviceType === "Car Rental" && (
                            <div className="flex flex-col">
                              <div className="flex items-center mb-1">
                                <Calendar className="w-3 h-3 mr-1 text-gray-400" />
                                <span>
                                  {formatDate(booking.rentalStartTime)}
                                </span>
                              </div>
                              <div className="text-xs text-gray-500">
                                {booking.rentalDays} ngày •{" "}
                                {booking.driverIncluded
                                  ? "Có tài xế"
                                  : "Tự lái"}
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <div className="text-sm font-semibold text-gray-900">
                            {formatPrice(booking.amount)}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {booking.paymentStatus === "paid" && (
                              <span className="text-green-600 flex items-center">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Đã thanh toán
                              </span>
                            )}
                            {booking.paymentStatus === "pending" && (
                              <span className="text-yellow-600 flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                Chờ thanh toán
                              </span>
                            )}
                            {booking.paymentStatus === "partial" && (
                              <span className="text-orange-600 flex items-center">
                                <AlertCircle className="w-3 h-3 mr-1" />
                                Đã cọc {formatPrice(booking.paidAmount)}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
                            booking.status,
                          )}`}
                        >
                          {getStatusIcon(booking.status)}
                          {getStatusText(booking.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end items-center gap-2">
                          <button
                            onClick={() => viewDetail(booking)}
                            className="p-2 text-[#008fa0] hover:bg-[#E6F3F4] rounded-lg transition-colors"
                            title="Xem chi tiết"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {booking.status === "pending" && (
                            <button
                              onClick={() =>
                                handleConfirmBooking(booking.bookingId)
                              }
                              className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-lg hover:bg-green-200 transition-colors"
                              title="Xác nhận"
                            >
                              Xác nhận
                            </button>
                          )}
                          {booking.status !== "cancelled" &&
                            booking.status !== "completed" && (
                              <button
                                onClick={() => {
                                  setSelectedBooking(booking);
                                  setShowCancelModal(true);
                                }}
                                className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-lg hover:bg-red-200 transition-colors"
                                title="Hủy"
                              >
                                Hủy
                              </button>
                            )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Enhanced Cancel Modal */}
      {showCancelModal && selectedBooking && (
        <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Hủy đặt chỗ #{selectedBooking.id}
              </h3>

              {/* Booking Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center mb-2">
                  <User className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-700">
                    {selectedBooking.customerName}
                  </span>
                </div>
                <div className="flex items-center mb-2">
                  <Package className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-700">
                    {selectedBooking.serviceName}
                  </span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm font-semibold text-gray-900">
                    {formatPrice(selectedBooking.amount)}
                  </span>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                Bạn có chắc chắn muốn hủy đặt chỗ này không? Hành động này không
                thể hoàn tác.
              </p>

              {selectedBooking.status === "confirmed" && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5 mr-2" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium mb-1">Lưu ý quan trọng:</p>
                    <p>
                      Đặt chỗ này đã được xác nhận. Việc hủy có thể ảnh hưởng
                      đến uy tín của bạn và có thể phát sinh phí hủy theo chính
                      sách.
                    </p>
                  </div>
                </div>
              )}

              {selectedBooking.paymentStatus === "paid" && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">Hoàn tiền:</span> Khách hàng
                    đã thanh toán {formatPrice(selectedBooking.paidAmount)}. Vui
                    lòng xử lý hoàn tiền theo chính sách.
                  </p>
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Không, giữ lại
              </button>
              <button
                onClick={() => handleCancelBooking(selectedBooking.bookingId)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Có, hủy đặt chỗ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnerBooking;
