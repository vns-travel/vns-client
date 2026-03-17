import React, { useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  MoreVertical,
  TrendingUp,
  Calendar,
  Users,
  Star,
  DollarSign,
  MapPin,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  PauseCircle,
  BarChart3,
  Download,
  Filter,
  Search,
  RefreshCw,
} from "lucide-react";
import PartnerServiceModal from "../../components/PartnerServiceModal";
import { useNavigate } from "react-router-dom";

const PartnerService = () => {
  const [activeFilter, setActiveFilter] = useState("Tất cả");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const navigate = useNavigate();

  const services = [
    {
      id: 1,
      title: "Oceanview Deluxe Homestay",
      type: "rental",
      category: "Khách sạn",
      status: "active",
      location: "Quận 1, TP. Hồ Chí Minh",
      basePrice: 1200000,
      weekendPrice: 1500000,
      rating: 4.8,
      reviewCount: 127,
      totalBookings: 342,
      thisMonthBookings: 23,
      viewCount: 1847,
      revenue: 410400000, // Total revenue
      lastBooked: "2026-03-15",
      availability: 85, // Percentage
      responseTime: "< 1 giờ",
      image: "/images/car.jpg",
      amenities: ["WiFi miễn phí", "Điều hòa", "Nhà bếp", "Hồ bơi"],
      maxGuests: 4,
      bedrooms: 2,
      createdAt: "2026-08-15",
      lastModified: "2026-03-10",
    },
    {
      id: 2,
      title: "Tour ẩm thực Hội An",
      type: "tour",
      category: "Tour ẩm thực",
      status: "active",
      location: "Quận Hoàn Kiếm, Hà Nội",
      basePrice: 450000,
      weekendPrice: 450000,
      rating: 4.9,
      reviewCount: 289,
      totalBookings: 567,
      thisMonthBookings: 41,
      viewCount: 3241,
      revenue: 255150000,
      lastBooked: "2026-03-16",
      availability: 95,
      responseTime: "< 30 phút",
      image: "/api/placeholder/400/300",
      duration: "4 giờ",
      groupSize: "2-12 người",
      included: ["Hướng dẫn viên", "Đồ ăn", "Nước uống"],
      startTimes: ["09:00", "14:00", "18:00"],
      language: ["Tiếng Việt", "Tiếng Anh"],
      createdAt: "2026-05-20",
      lastModified: "2026-02-28",
    },
    {
      id: 3,
      title: "Thuê Xe SUV 7 Chỗ - Toyota Fortuner",
      type: "car",
      category: "Thuê xe có tài xế",
      status: "active",
      location: "Quận 7, TP. Hồ Chí Minh",
      basePrice: 800000,
      weekendPrice: 950000,
      rating: 4.7,
      reviewCount: 94,
      totalBookings: 178,
      thisMonthBookings: 12,
      viewCount: 892,
      revenue: 142400000,
      lastBooked: "2026-03-14",
      availability: 70,
      responseTime: "< 2 giờ",
      image: "/api/placeholder/400/300",
      vehicleType: "SUV 7 chỗ",
      transmission: "Tự động",
      fuelType: "Xăng",
      year: "2022",
      included: ["Tài xế", "Xăng", "Bảo hiểm"],
      createdAt: "2026-11-10",
      lastModified: "2026-03-05",
    },
    {
      id: 4,
      title: "Biệt Thự Mountain View Đà Lạt",
      type: "rental",
      category: "Biệt thự",
      status: "active",
      location: "Phường 4, Đà Lạt",
      basePrice: 3500000,
      weekendPrice: 4500000,
      rating: 4.9,
      reviewCount: 78,
      totalBookings: 156,
      thisMonthBookings: 8,
      viewCount: 2341,
      revenue: 546000000,
      lastBooked: "2026-03-13",
      availability: 60,
      responseTime: "< 2 giờ",
      image: "/api/placeholder/400/300",
      amenities: ["View núi", "Lò sưởi", "BBQ", "Vườn rộng"],
      maxGuests: 10,
      bedrooms: 5,
      createdAt: "2026-06-01",
      lastModified: "2026-03-08",
    },
    {
      id: 5,
      title: "Thám hiểm sông Mekong",
      type: "tour",
      category: "Tour khám phá",
      status: "inactive",
      location: "Cần Thơ, Đồng bằng sông Cửu Long",
      basePrice: 2800000,
      weekendPrice: 2800000,
      rating: 4.6,
      reviewCount: 45,
      totalBookings: 89,
      thisMonthBookings: 0,
      viewCount: 567,
      revenue: 249200000,
      lastBooked: "2026-02-28",
      availability: 0, // Inactive
      responseTime: "Không hoạt động",
      image: "/api/placeholder/400/300",
      duration: "3 ngày 2 đêm",
      groupSize: "4-15 người",
      included: ["Khách sạn", "Bữa ăn", "Hướng dẫn viên", "Vận chuyển"],
      startTimes: ["Thứ 6 hàng tuần"],
      language: ["Tiếng Việt", "Tiếng Anh"],
      inactiveReason: "Đang bảo trì",
      createdAt: "2026-09-15",
      lastModified: "2026-02-25",
    },
    {
      id: 6,
      title: "Thuê Xe Sedan Mercedes C-Class",
      type: "car",
      category: "Thuê xe tự lái",
      status: "pending",
      location: "Quận 3, TP. Hồ Chí Minh",
      basePrice: 1500000,
      weekendPrice: 1800000,
      rating: 0,
      reviewCount: 0,
      totalBookings: 0,
      thisMonthBookings: 0,
      viewCount: 0,
      revenue: 0,
      lastBooked: null,
      availability: 0,
      responseTime: "Đang chờ duyệt",
      image: "/api/placeholder/400/300",
      vehicleType: "Sedan 5 chỗ",
      transmission: "Tự động",
      fuelType: "Xăng",
      year: "2023",
      included: ["Bảo hiểm", "Hỗ trợ 24/7"],
      pendingReason: "Đang chờ xác minh giấy tờ xe",
      createdAt: "2026-03-12",
      lastModified: "2026-03-12",
    },
    {
      id: 7,
      title: "Căn Hộ Mặt Biển Nha Trang",
      type: "rental",
      category: "Căn hộ",
      status: "active",
      location: "Trần Phú, Nha Trang",
      basePrice: 1800000,
      weekendPrice: 2200000,
      rating: 4.8,
      reviewCount: 156,
      totalBookings: 298,
      thisMonthBookings: 19,
      viewCount: 2156,
      revenue: 536400000,
      lastBooked: "2026-03-15",
      availability: 75,
      responseTime: "< 1 giờ",
      image: "/api/placeholder/400/300",
      amenities: ["View biển", "Hồ bơi", "Gym", "Bãi đỗ xe"],
      maxGuests: 6,
      bedrooms: 3,
      createdAt: "2026-07-20",
      lastModified: "2026-03-11",
    },
    {
      id: 8,
      title: "Đi bộ Hội An",
      type: "tour",
      category: "Tour văn hóa",
      status: "active",
      location: "Phố cổ Hội An, Quảng Nam",
      basePrice: 350000,
      weekendPrice: 350000,
      rating: 5.0,
      reviewCount: 203,
      totalBookings: 412,
      thisMonthBookings: 28,
      viewCount: 1923,
      revenue: 144200000,
      lastBooked: "2026-03-16",
      availability: 90,
      responseTime: "< 30 phút",
      image: "/api/placeholder/400/300",
      duration: "3 giờ",
      groupSize: "2-8 người",
      included: ["Hướng dẫn viên", "Vé tham quan", "Nước uống"],
      startTimes: ["08:00", "15:00"],
      language: ["Tiếng Việt", "Tiếng Anh", "Tiếng Pháp"],
      createdAt: "2026-04-10",
      lastModified: "2026-03-09",
    },
  ];

  const filterTabs = ["Tất cả", "Cho thuê", "Tour", "Thuê xe"];

  // Enhanced filtering logic
  const filteredServices = services.filter((service) => {
    const matchesFilter =
      activeFilter === "Tất cả" ||
      (activeFilter === "Cho thuê" && service.type === "rental") ||
      (activeFilter === "Tour" && service.type === "tour") ||
      (activeFilter === "Thuê xe" && service.type === "car");

    const matchesSearch =
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  // Sorting logic
  const sortedServices = [...filteredServices].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return new Date(b.lastModified) - new Date(a.lastModified);
      case "popular":
        return b.viewCount - a.viewCount;
      case "bookings":
        return b.totalBookings - a.totalBookings;
      case "rating":
        return b.rating - a.rating;
      case "revenue":
        return b.revenue - a.revenue;
      default:
        return 0;
    }
  });

  // Calculate enhanced stats
  const stats = {
    total: services.length,
    active: services.filter((s) => s.status === "active").length,
    inactive: services.filter((s) => s.status === "inactive").length,
    pending: services.filter((s) => s.status === "pending").length,
    totalRevenue: services.reduce((sum, s) => sum + s.revenue, 0),
    thisMonthRevenue: services.reduce(
      (sum, s) => sum + s.thisMonthBookings * s.basePrice,
      0,
    ),
    totalBookings: services.reduce((sum, s) => sum + s.totalBookings, 0),
    thisMonthBookings: services.reduce(
      (sum, s) => sum + s.thisMonthBookings,
      0,
    ),
    avgRating: (
      services.reduce((sum, s) => sum + s.rating, 0) /
      services.filter((s) => s.rating > 0).length
    ).toFixed(1),
    totalViews: services.reduce((sum, s) => sum + s.viewCount, 0),
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: {
        class: "bg-green-100 text-green-800",
        icon: CheckCircle,
        text: "Đang hoạt động",
      },
      inactive: {
        class: "bg-red-100 text-red-800",
        icon: XCircle,
        text: "Không hoạt động",
      },
      pending: {
        class: "bg-yellow-100 text-yellow-800",
        icon: Clock,
        text: "Chờ duyệt",
      },
      paused: {
        class: "bg-gray-100 text-gray-800",
        icon: PauseCircle,
        text: "Tạm dừng",
      },
    };
    return badges[status] || badges.active;
  };

  const getTypeDisplay = (type) => {
    const typeMap = {
      rental: "Cho thuê",
      tour: "Tour",
      car: "Thuê xe",
    };
    return typeMap[type] || type;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " ₫";
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat("vi-VN").format(num);
  };

  const handleAddNewService = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenDetail = (service) => {
    navigate("/PartnerService/detail", { state: { type: service.type, id: service.id } });
  };

  return (
    <div className="min-h-screen bg-bg-light p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Dịch vụ của tôi
            </h1>
            <p className="text-gray-600">
              Quản lý bất động sản cho thuê, tour du lịch và dịch vụ thuê xe
            </p>
          </div>

          {/* Add New Service Button */}
          <button
            onClick={handleAddNewService}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 rounded-lg text-white font-medium transition-all duration-200 hover:shadow-lg transform hover:scale-105"
            style={{
              backgroundColor: "var(--color-primary)",
            }}
            onMouseEnter={(e) =>
              (e.target.style.backgroundColor = "var(--color-primary-hover)")
            }
            onMouseLeave={(e) =>
              (e.target.style.backgroundColor = "var(--color-primary)")
            }
          >
            <Plus className="w-5 h-5 mr-2" />
            Thêm dịch vụ mới
          </button>
        </div>
        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Revenue Card */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {formatPrice(stats.totalRevenue)}
            </div>
            <div className="text-sm text-gray-500 mb-2">Tổng doanh thu</div>
            {/* <div className="text-xs text-green-600 font-medium">
              +{formatPrice(stats.thisMonthRevenue)} tháng này
            </div> */}
          </div>

          {/* Total Bookings Card */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                +{stats.thisMonthBookings}
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {formatNumber(stats.totalBookings)}
            </div>
            <div className="text-sm text-gray-500 mb-2">Tổng đặt chỗ</div>
            {/* <div className="text-xs text-blue-600 font-medium">
              {stats.thisMonthBookings} đặt chỗ mới tháng này
            </div> */}
          </div>

          {/* Active Services Card */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm font-semibold text-gray-900">
                  {stats.avgRating}
                </span>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {stats.active}/{stats.total}
            </div>
            <div className="text-sm text-gray-500 mb-2">Dịch vụ hoạt động</div>
            {/* <div className="text-xs text-gray-600">
              {stats.pending} đang chờ duyệt
            </div> */}
          </div>

          {/* Total Views Card */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Eye className="w-5 h-5 text-orange-600" />
              </div>
              <TrendingUp className="w-4 h-4 text-orange-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {formatNumber(stats.totalViews)}
            </div>
            <div className="text-sm text-gray-500 mb-2">Lượt xem</div>
            {/* <div className="text-xs text-orange-600 font-medium">
              Trung bình {Math.round(stats.totalViews / stats.total)} mỗi dịch
              vụ
            </div> */}
          </div>
        </div>
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, địa điểm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            {/* Sort */}
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700">
                Sắp xếp:
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white"
              >
                <option value="recent">Mới nhất</option>
                <option value="popular">Phổ biến nhất</option>
                <option value="bookings">Nhiều đặt chỗ nhất</option>
                <option value="rating">Đánh giá cao nhất</option>
                <option value="revenue">Doanh thu cao nhất</option>
              </select>

              {/* Refresh Button */}
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        {/* Filter Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {filterTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                    activeFilter === tab
                      ? "text-white border-transparent rounded-t-lg px-4 py-2"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                  style={
                    activeFilter === tab
                      ? { backgroundColor: "var(--color-primary)" }
                      : {}
                  }
                >
                  {tab}
                  <span className="ml-2 text-xs">
                    (
                    {tab === "Tất cả"
                      ? services.length
                      : tab === "Cho thuê"
                        ? services.filter((s) => s.type === "rental").length
                        : tab === "Tour"
                          ? services.filter((s) => s.type === "tour").length
                          : services.filter((s) => s.type === "car").length}
                    )
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>
        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedServices.map((service) => {
            const statusInfo = getStatusBadge(service.status);
            const StatusIcon = statusInfo.icon;

            return (
              <div
                key={service.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-gray-300 transform hover:-translate-y-1 overflow-hidden"
              >
                {/* Service Image */}
                <div className="relative h-48 bg-gray-200 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Status Badge Overlay */}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusInfo.class}`}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {statusInfo.text}
                    </span>
                  </div>
                  {/* Type Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-[#E6F3F4] text-[#008fa0] rounded-full text-sm font-medium">
                      {getTypeDisplay(service.type)}
                    </span>
                  </div>
                </div>

                {/* Service Card Content */}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {service.title}
                    </h3>

                    {/* Location and Category */}
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                      <span className="truncate">{service.location}</span>
                    </div>

                    <div className="text-sm text-gray-600 mb-3">
                      {service.category}
                    </div>

                    {/* Rating and Reviews */}
                    {service.rating > 0 && (
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="ml-1 text-sm font-semibold text-gray-900">
                            {service.rating}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          ({service.reviewCount} đánh giá)
                        </span>
                      </div>
                    )}

                    {/* Key Stats */}
                    <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-gray-100">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">
                          Đặt chỗ
                        </div>
                        <div className="font-semibold text-gray-900">
                          {formatNumber(service.totalBookings)}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">
                          Lượt xem
                        </div>
                        <div className="font-semibold text-gray-900">
                          {formatNumber(service.viewCount)}
                        </div>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="mb-3">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold text-gray-900">
                          {formatPrice(service.basePrice)}
                        </span>
                        <span className="text-sm text-gray-500">
                          {service.type === "rental"
                            ? "/đêm"
                            : service.type === "tour"
                              ? "/người"
                              : "/ngày"}
                        </span>
                      </div>
                      {service.weekendPrice !== service.basePrice && (
                        <div className="text-xs text-gray-500 mt-1">
                          Cuối tuần: {formatPrice(service.weekendPrice)}
                        </div>
                      )}
                    </div>

                    {/* Additional Info */}
                    {/* {service.status === "active" && (
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {service.responseTime}
                        </div>
                        <div
                          className={`font-medium ${service.availability >= 70 ? "text-green-600" : "text-orange-600"}`}
                        >
                          {service.availability}% sẵn sàng
                        </div>
                      </div>
                    )} */}

                    {/* Pending/Inactive Info */}
                    {/* {service.status === "pending" && service.pendingReason && (
                      <div className="flex items-start gap-2 p-2 bg-yellow-50 rounded-lg mb-3">
                        <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-yellow-800">
                          {service.pendingReason}
                        </p>
                      </div>
                    )}

                    {service.status === "inactive" &&
                      service.inactiveReason && (
                        <div className="flex items-start gap-2 p-2 bg-red-50 rounded-lg mb-3">
                          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-red-800">
                            {service.inactiveReason}
                          </p>
                        </div>
                      )} */}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-white rounded-lg transition-all duration-200 hover:shadow-md"
                      style={{
                        backgroundColor: "var(--color-primary)",
                      }}
                      onMouseEnter={(e) =>
                        (e.target.style.backgroundColor =
                          "var(--color-primary-hover)")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.backgroundColor =
                          "var(--color-primary)")
                      }
                      onClick={() => handleOpenDetail(service)}
                    >
                      <Edit2 className="w-4 h-4 mr-1" />
                      Chỉnh sửa
                    </button>

                    <button
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Xem thống kê"
                    >
                      <BarChart3 className="w-4 h-4" />
                    </button>

                    <button
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Xóa dịch vụ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {/* Empty State */}
        {sortedServices.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không tìm thấy dịch vụ
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery
                ? `Không tìm thấy dịch vụ phù hợp với "${searchQuery}"`
                : activeFilter === "Tất cả"
                  ? "Bạn chưa tạo bất kỳ dịch vụ nào."
                  : `Không tìm thấy dịch vụ ${activeFilter.toLowerCase()}.`}
            </p>
            {!searchQuery && (
              <button
                onClick={handleAddNewService}
                className="inline-flex items-center px-4 py-2 rounded-lg text-white font-medium transition-all duration-200"
                style={{
                  backgroundColor: "var(--color-primary)",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor =
                    "var(--color-primary-hover)")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "var(--color-primary)")
                }
              >
                <Plus className="w-5 h-5 mr-2" />
                Tạo dịch vụ đầu tiên
              </button>
            )}
          </div>
        )}
      </div>

      {isModalOpen && <PartnerServiceModal onClose={handleCloseModal} />}
    </div>
  );
};

export default PartnerService;
