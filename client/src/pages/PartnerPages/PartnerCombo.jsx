import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { comboService } from "../../services/comboService";
import {
  Search,
  Filter,
  Plus,
  Edit3,
  Trash2,
  Eye,
  MoreHorizontal,
  Calendar,
  Users,
  TrendingUp,
  TrendingDown,
  Package,
  Gift,
  Copy,
  BarChart3,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Percent,
  Star,
  Activity,
  Target,
  Zap,
  Award,
  Tag,
  PauseCircle,
  PlayCircle,
  XCircle,
} from "lucide-react";

const PartnerCombo = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("created");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewItem, setViewItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [combosAndPromotions, setCombosAndPromotions] = useState([
    {
      id: 1,
      type: "combo",
      name: "Trải nghiệm Hà Nội hoàn hảo",
      description:
        "Gói 3 ngày 2 đêm hoàn chỉnh với khách sạn boutique, tour ẩm thực và đưa đón sân bay VIP",
      status: "active",
      originalPrice: 4500000,
      currentPrice: 3600000,
      discount: 20,
      validFrom: "2026-01-15",
      validUntil: "2026-12-31",
      bookings: 127,
      revenue: 457200000,
      rating: 4.8,
      services: [
        "Phòng Deluxe (2 đêm)",
        "Tour ẩm thực phố cổ (4 giờ)",
        "Đưa đón sân bay VIP",
        "Bữa sáng buffet (2 ngày)",
      ],
      maxBookings: 200,
      conversionRate: 8.5, // Percentage
      averageStars: 4.8,
      created: "2026-01-10",
      lastModified: "2026-03-14",
      views: 1493,
      clickThroughRate: 12.3,
      customerSavings: 114300000, // Total saved by customers
    },
    // {
    //   id: 2,
    //   type: "promotion",
    //   name: "Ưu đãi đặt sớm - Mùa hè 2026",
    //   description:
    //     "Giảm 25% cho tất cả đặt phòng trước 45 ngày. Áp dụng cho kỳ nghỉ từ tháng 6-8/2024.",
    //   status: "active",
    //   promoCode: "SUMMER2024",
    //   discountType: "percentage",
    //   discountValue: 25,
    //   minOrderValue: 1000000,
    //   usageLimit: 500,
    //   usedCount: 167,
    //   validFrom: "2026-03-01",
    //   validUntil: "2024-05-31",
    //   bookings: 167,
    //   revenue: 125250000,
    //   applicableServices: "Tất cả phòng và villa",
    //   created: "2024-02-20",
    //   lastModified: "2024-03-10",
    //   views: 2847,
    //   clickThroughRate: 15.8,
    //   customerSavings: 41750000,
    //   avgBookingValue: 750000,
    //   repeatCustomers: 23, // Number of repeat customers
    //   maxUsesPerCustomer: 2,
    // },
    {
      id: 3,
      type: "combo",
      name: "Khám phá miền Tây 4N3Đ",
      description:
        "Du thuyền sang trọng, homestay địa phương, lớp nấu ăn và khám phá chợ nổi",
      status: "draft",
      originalPrice: 5200000,
      currentPrice: 4160000,
      discount: 20,
      validFrom: "2026-04-01",
      validUntil: "2026-11-30",
      bookings: 0,
      revenue: 0,
      rating: 0,
      services: [
        "Du thuyền Mekong Luxury (2 đêm)",
        "Homestay vườn cà phê (1 đêm)",
        "Lớp học nấu ăn truyền thống",
        "Tour chợ nổi Cái Răng",
        "Xe đưa đón riêng",
      ],
      maxBookings: 100,
      conversionRate: 0,
      averageStars: 0,
      created: "2026-03-05",
      lastModified: "2026-03-05",
      views: 0,
      clickThroughRate: 0,
      customerSavings: 0,
      draftReason: "Chờ phê duyệt từ ban quản lý",
    },
    // {
    //   id: 4,
    //   type: "promotion",
    //   name: "Flash Sale Cuối Tuần",
    //   description:
    //     "Giảm ngay 300.000đ cho đặt phòng cuối tuần. Chỉ áp dụng thứ 6-7-CN.",
    //   status: "expired",
    //   promoCode: "WEEKEND300",
    //   discountType: "fixed",
    //   discountValue: 300000,
    //   minOrderValue: 1500000,
    //   usageLimit: 200,
    //   usedCount: 200,
    //   validFrom: "2026-02-01",
    //   validUntil: "2024-02-29",
    //   bookings: 200,
    //   revenue: 340000000,
    //   applicableServices: "Phòng Deluxe và Suite",
    //   created: "2024-01-25",
    //   lastModified: "2024-02-29",
    //   views: 3421,
    //   clickThroughRate: 18.2,
    //   customerSavings: 60000000,
    //   avgBookingValue: 1700000,
    //   repeatCustomers: 45,
    //   maxUsesPerCustomer: 1,
    //   performance: "Vượt mục tiêu 100%",
    // },
    {
      id: 5,
      type: "combo",
      name: "Honeymoon Paradise Đà Nẵng",
      description:
        "Gói tuần trăng mật lãng mạn với villa hướng biển, spa couple và bữa tối nến",
      status: "paused",
      originalPrice: 8500000,
      currentPrice: 7225000,
      discount: 15,
      validFrom: "2026-01-01",
      validUntil: "2026-12-31",
      bookings: 34,
      revenue: 245650000,
      rating: 4.9,
      services: [
        "Villa Ocean View (3 đêm)",
        "Spa couple massage (90 phút)",
        "Bữa tối nến bãi biển",
        "Champagne chào mừng",
        "Trang trí phòng honeymoon",
      ],
      maxBookings: 150,
      conversionRate: 11.2,
      averageStars: 4.9,
      created: "2026-12-10",
      lastModified: "2026-03-01",
      views: 892,
      clickThroughRate: 14.5,
      customerSavings: 43350000,
    },
    // {
    //   id: 6,
    //   type: "promotion",
    //   name: "Sinh nhật VietNamSea - Giảm 30%",
    //   description:
    //     "Khuyến mãi đặc biệt nhân dịp sinh nhật 2 năm VietNamSea. Mã giới hạn!",
    //   status: "active",
    //   promoCode: "BIRTHDAY30",
    //   discountType: "percentage",
    //   discountValue: 30,
    //   minOrderValue: 2000000,
    //   usageLimit: 100,
    //   usedCount: 78,
    //   validFrom: "2024-03-10",
    //   validUntil: "2024-03-20",
    //   bookings: 78,
    //   revenue: 109200000,
    //   applicableServices: "Tất cả dịch vụ",
    //   created: "2026-03-05",
    //   lastModified: "2024-03-15",
    //   views: 1245,
    //   clickThroughRate: 22.1,
    //   customerSavings: 46800000,
    //   avgBookingValue: 1400000,
    //   repeatCustomers: 12,
    //   maxUsesPerCustomer: 1,
    //   urgency: "Chỉ còn 22 mã!",
    //   trending: true,
    // },
    {
      id: 7,
      type: "combo",
      name: "Family Fun Phú Quốc",
      description:
        "Kỳ nghỉ gia đình hoàn hảo với resort 5 sao, vui chơi giải trí và tour lặn biển",
      status: "active",
      originalPrice: 12000000,
      currentPrice: 9600000,
      discount: 20,
      validFrom: "2026-02-01",
      validUntil: "2026-10-31",
      bookings: 45,
      revenue: 432000000,
      rating: 4.7,
      services: [
        "Vinpearl Resort (4 đêm)",
        "Vé VinWonders (cả gia đình)",
        "Tour lặn biển (2 người lớn)",
        "Buffet sáng hàng ngày",
        "Xe đưa đón sân bay",
      ],
      maxBookings: 80,
      conversionRate: 9.8,
      averageStars: 4.7,
      created: "2026-01-15",
      lastModified: "2026-03-12",
      views: 1567,
      clickThroughRate: 10.2,
      customerSavings: 108000000,
      targetAudience: "Gia đình có trẻ em",
    },
  ]);

  // Normalise API combo shape to the field names the existing UI expects
  function normalise(c) {
    return {
      id:            c.comboId,
      type:          "combo",
      name:          c.title,
      description:   c.description || "",
      status:        c.status,           // pending | approved | rejected
      originalPrice: c.originalPrice,
      currentPrice:  c.discountedPrice,
      discount:      c.originalPrice > 0
        ? Math.round((1 - c.discountedPrice / c.originalPrice) * 100)
        : 0,
      validFrom:     c.validFrom,
      validUntil:    c.validTo,
      maxBookings:   c.maxBookings,
      bookings:      c.currentBookings || 0,
      revenue:       0,
      views:         0,
      rating:        0,
      conversionRate: 0,
      services:      [],          // detail endpoint would give full list
      serviceCount:  c.serviceCount,
      rejectionReason: c.rejectionReason,
      created:       c.createdAt,
      customerSavings: 0,
    };
  }

  async function loadCombos() {
    setLoading(true);
    setLoadError("");
    try {
      const raw = await comboService.listPartnerCombos();
      setCombosAndPromotions((Array.isArray(raw) ? raw : []).map(normalise));
    } catch (err) {
      setLoadError(err.message || "Không thể tải danh sách combo.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadCombos(); }, []);

  const handleDelete = (id) => {
    setCombosAndPromotions((prev) => prev.filter((item) => item.id !== id));
    setDeleteId(null);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " ₫";
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat("vi-VN").format(num);
  };

  const STATUS_LABEL = {
    pending:  "Chờ duyệt",
    approved: "Đã duyệt",
    rejected: "Bị từ chối",
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved": return "bg-green-100 text-green-800";
      case "pending":  return "bg-yellow-100 text-yellow-800";
      case "rejected": return "bg-red-100 text-red-800";
      default:         return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved": return <CheckCircle className="w-4 h-4" />;
      case "pending":  return <Clock className="w-4 h-4" />;
      case "rejected": return <XCircle className="w-4 h-4" />;
      default:         return <Clock className="w-4 h-4" />;
    }
  };

  const filteredItems = combosAndPromotions.filter((item) => {
    const matchesTab = activeTab === "all" || item.type === activeTab;
    const matchesStatus =
      filterStatus === "all" || item.status === filterStatus;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.promoCode &&
        item.promoCode.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesTab && matchesStatus && matchesSearch;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case "created":
        return new Date(b.created) - new Date(a.created);
      case "bookings":
        return b.bookings - a.bookings;
      case "revenue":
        return b.revenue - a.revenue;
      case "performance":
        return (b.clickThroughRate || 0) - (a.clickThroughRate || 0);
      default:
        return 0;
    }
  });

  const copyPromoCode = (code) => {
    navigator.clipboard.writeText(code);
  };

  return (
    <>
    <div className="min-h-screen bg-bg-light p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Combo dịch vụ
            </h1>
            <p className="text-gray-600">Quản lý gói dịch vụ của bạn</p>
          </div>
          <button
            onClick={() => {
              navigate("/PartnerCombo/create");
            }}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tạo mới
          </button>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
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

            {/* Filter by Status */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chờ duyệt</option>
              <option value="approved">Đã duyệt</option>
              <option value="rejected">Bị từ chối</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white"
            >
              <option value="created">Mới nhất</option>
              <option value="bookings">Nhiều đặt chỗ nhất</option>
              <option value="revenue">Doanh thu cao nhất</option>
            </select>

            {/* Refresh */}
            <button
              onClick={loadCombos}
              disabled={loading}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 text-gray-600 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                {
                  id: "all",
                  label: "Tất cả",
                  count: combosAndPromotions.length,
                },
                // {
                //   id: "combo",
                //   label: "Combo",
                //   count: combosAndPromotions.filter((i) => i.type === "combo")
                //     .length,
                // },
                // {
                //   id: "promotion",
                //   label: "Khuyến mãi",
                //   count: combosAndPromotions.filter(
                //     (i) => i.type === "promotion",
                //   ).length,
                // },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-primary text-primary"
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

        {/* Loading / Error states */}
        {loadError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {loadError}
          </div>
        )}
        {loading && (
          <div className="flex justify-center py-12 text-gray-400 text-sm gap-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            Đang tải...
          </div>
        )}

        {/* Items Grid */}
        {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {sortedItems.map((item) => {
            const statusInfo = getStatusIcon(item.status);
            const daysLeft =
              item.status === "active"
                ? Math.ceil(
                    (new Date(item.validUntil) - new Date()) /
                      (1000 * 60 * 60 * 24),
                  )
                : null;

            return (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200"
              >
                {/* Card Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(item.status)}`}
                        >
                          {statusInfo}
                          {STATUS_LABEL[item.status] ?? item.status}
                        </span>
                        {item.trending && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            Trending
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Type Badge */}
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#E6F3F4] text-[#008fa0]">
                    {item.type === "combo" ? (
                      <Package className="w-3 h-3 mr-1" />
                    ) : (
                      <Gift className="w-3 h-3 mr-1" />
                    )}
                    {item.type === "combo" ? "Gói combo" : "Mã khuyến mãi"}
                  </span>

                  {/* Pricing Info for Combos */}
                  {item.type === "combo" && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xl font-bold text-primary">
                              {formatPrice(item.currentPrice)}
                            </span>
                            {item.originalPrice !== item.currentPrice && (
                              <span className="text-sm text-gray-500 line-through">
                                {formatPrice(item.originalPrice)}
                              </span>
                            )}
                          </div>
                          {item.discount > 0 && (
                            <span className="inline-flex items-center text-sm text-green-600 font-medium mt-1">
                              <Tag className="w-3 h-3 mr-1" />
                              Tiết kiệm {item.discount}%
                            </span>
                          )}
                        </div>
                        {item.rating > 0 && (
                          <div className="flex flex-col items-end">
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm font-semibold text-gray-900 ml-1">
                                {item.rating}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500">
                              {item.bookings} đánh giá
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Promo Code Info */}
                  {item.type === "promotion" && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <code className="px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-800 text-sm font-mono font-semibold rounded">
                            {item.promoCode}
                          </code>
                          <button
                            onClick={() => copyPromoCode(item.promoCode)}
                            className="p-1.5 text-gray-400 hover:text-primary hover:bg-gray-100 rounded transition-colors"
                            title="Sao chép mã"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
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
                      </div>
                      {/* Usage Progress */}
                      <div className="mt-3">
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
                  )}
                </div>

                {/* Card Body - Stats */}
                <div className="p-6 bg-gray-50">
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">
                        {formatNumber(item.bookings)}
                      </div>
                      <div className="text-xs text-gray-500">Đặt chỗ</div>
                    </div>
                    <div className="text-center border-l border-r border-gray-200">
                      <div className="text-lg font-bold text-primary">
                        {formatPrice(item.revenue)}
                      </div>
                      <div className="text-xs text-gray-500">Doanh thu</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">
                        {formatNumber(item.views || 0)}
                      </div>
                      <div className="text-xs text-gray-500">Lượt xem</div>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  {/* {item.clickThroughRate > 0 && (
                    <div className="flex items-center justify-between text-xs mb-4 pb-4 border-b border-gray-200">
                      <span className="text-gray-600">Tỷ lệ CTR:</span>
                      <span className="font-semibold text-gray-900">
                        {item.clickThroughRate}%
                      </span>
                    </div>
                  )} */}

                  {/* Validity Period */}
                  <div className="text-xs text-gray-600 mb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>Hiệu lực:</span>
                      </div>
                      {daysLeft !== null && daysLeft > 0 && (
                        <span
                          className={`font-medium ${daysLeft <= 7 ? "text-red-600" : "text-green-600"}`}
                        >
                          Còn {daysLeft} ngày
                        </span>
                      )}
                    </div>
                    <div className="mt-1 text-gray-500">
                      {new Date(item.validFrom).toLocaleDateString("vi-VN")} -{" "}
                      {new Date(item.validUntil).toLocaleDateString("vi-VN")}
                    </div>
                  </div>

                  {/* Services (for combos) */}
                  {item.type === "combo" && item.services && (
                    <div className="mb-4">
                      <div className="text-xs font-medium text-gray-700 mb-2">
                        Dịch vụ bao gồm:
                      </div>
                      <div className="space-y-1">
                        {item.services.slice(0, 3).map((service, index) => (
                          <div
                            key={index}
                            className="flex items-start text-xs text-gray-600"
                          >
                            <CheckCircle className="w-3 h-3 mr-1.5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>{service}</span>
                          </div>
                        ))}
                        {item.services.length > 3 && (
                          <button className="text-xs text-primary hover:underline ml-4">
                            +{item.services.length - 3} dịch vụ khác
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Applicable Services (for promotions) */}
                  {item.type === "promotion" && item.applicableServices && (
                    <div className="mb-4">
                      <div className="text-xs text-gray-600 mb-1">
                        Áp dụng cho:
                      </div>
                      <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                        {item.applicableServices}
                      </span>
                    </div>
                  )}

                  {/* Draft/Paused Reasons */}
                  {/* {item.draftReason && (
                    <div className="flex items-start gap-2 p-2 bg-yellow-50 rounded-lg mb-3">
                      <Clock className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-yellow-800">
                        {item.draftReason}
                      </p>
                    </div>
                  )} */}

                  {item.pausedReason && (
                    <div className="flex items-start gap-2 p-2 bg-orange-50 rounded-lg mb-3">
                      <PauseCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-orange-800">
                        {item.pausedReason}
                      </p>
                    </div>
                  )}

                  {/* Customer Impact */}
                  {item.customerSavings > 0 && (
                    <div className="p-2 bg-green-50 rounded-lg mb-3">
                      <div className="text-xs text-green-800">
                        <span className="font-semibold">Khách tiết kiệm:</span>
                        <span className="ml-1 font-bold">
                          {formatPrice(item.customerSavings)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="px-6 py-4 bg-white border-t border-gray-200 rounded-b-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setViewItem(item)}
                        className="p-2 text-gray-400 hover:text-primary hover:bg-gray-100 rounded transition-colors"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => navigate("/PartnerCombo/create", { state: { item } })}
                        className="p-2 text-gray-400 hover:text-primary hover:bg-gray-100 rounded transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      {/* <button
                        className="p-2 text-gray-400 hover:text-primary hover:bg-gray-100 rounded transition-colors"
                        title="Xem thống kê"
                      >
                        <BarChart3 className="w-4 h-4" />
                      </button> */}
                    </div>
                    <div className="flex items-center space-x-2">
                      {item.status === "active" && (
                        <button className="text-xs bg-yellow-100 text-yellow-800 px-3 py-1.5 rounded hover:bg-yellow-200 transition-colors flex items-center gap-1">
                          <PauseCircle className="w-3 h-3" />
                          Tạm dừng
                        </button>
                      )}
                      {(item.status === "draft" ||
                        item.status === "paused") && (
                        <button className="text-xs bg-green-100 text-green-800 px-3 py-1.5 rounded hover:bg-green-200 transition-colors flex items-center gap-1">
                          <PlayCircle className="w-3 h-3" />
                          Kích hoạt
                        </button>
                      )}
                      <button
                        onClick={() => setDeleteId(item.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        </div>
        )}

        {/* Empty State */}
        {!loading && sortedItems.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {activeTab === "combo" ? (
                <Package className="w-10 h-10 text-gray-400" />
              ) : activeTab === "promotion" ? (
                <Gift className="w-10 h-10 text-gray-400" />
              ) : (
                <Activity className="w-10 h-10 text-gray-400" />
              )}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchQuery
                ? `Không tìm thấy kết quả cho "${searchQuery}"`
                : `Không tìm thấy ${activeTab === "all" ? "mục nào" : activeTab === "combo" ? "combo" : "khuyến mãi"}`}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery
                ? "Thử tìm kiếm với từ khóa khác"
                : filterStatus !== "all"
                  ? `Không có ${activeTab === "all" ? "mục" : activeTab === "combo" ? "combo" : "khuyến mãi"} với trạng thái này`
                  : `Tạo ${activeTab === "all" ? "combo hoặc khuyến mãi" : activeTab === "combo" ? "combo" : "khuyến mãi"} đầu tiên của bạn để bắt đầu`}
            </p>
            {!searchQuery && (
              <button className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-hover flex items-center mx-auto">
                <Plus className="w-5 h-5 mr-2" />
                Tạo{" "}
                {activeTab === "all"
                  ? "mục mới"
                  : activeTab === "combo"
                    ? "combo"
                    : "khuyến mãi"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>

    {/* View Modal */}
    {viewItem && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">{viewItem.name}</h2>
            <button
              onClick={() => setViewItem(null)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6 space-y-4">
            <p className="text-sm text-gray-600">{viewItem.description}</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Trạng thái:</span>
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(viewItem.status)}`}>
                  {STATUS_LABEL[viewItem.status] ?? viewItem.status}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Loại:</span>
                <span className="ml-2 text-gray-900">{viewItem.type === "combo" ? "Gói combo" : "Khuyến mãi"}</span>
              </div>
              {viewItem.type === "combo" && (
                <>
                  <div>
                    <span className="font-medium text-gray-700">Giá gốc:</span>
                    <span className="ml-2 text-gray-500 line-through">{formatPrice(viewItem.originalPrice)}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Giá ưu đãi:</span>
                    <span className="ml-2 text-primary font-semibold">{formatPrice(viewItem.currentPrice)}</span>
                  </div>
                </>
              )}
              <div>
                <span className="font-medium text-gray-700">Đặt chỗ:</span>
                <span className="ml-2 text-gray-900">{viewItem.bookings}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Doanh thu:</span>
                <span className="ml-2 text-gray-900">{formatPrice(viewItem.revenue)}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Hiệu lực từ:</span>
                <span className="ml-2 text-gray-900">{new Date(viewItem.validFrom).toLocaleDateString("vi-VN")}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Đến:</span>
                <span className="ml-2 text-gray-900">{new Date(viewItem.validUntil).toLocaleDateString("vi-VN")}</span>
              </div>
            </div>
            <div>
              <span className="font-medium text-gray-700">Số dịch vụ:</span>
              <span className="ml-2 text-gray-900">{viewItem.serviceCount ?? viewItem.services?.length ?? 0}</span>
            </div>
            {viewItem.rejectionReason && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                <p className="font-medium mb-1">Lý do từ chối:</p>
                <p>{viewItem.rejectionReason}</p>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-3 px-6 pb-6">
            <button
              onClick={() => { setViewItem(null); navigate("/PartnerCombo/create", { state: { item: viewItem } }); }}
              className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover text-sm"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Chỉnh sửa
            </button>
            <button
              onClick={() => setViewItem(null)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Delete Confirmation Modal */}
    {deleteId !== null && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
            <Trash2 className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Xác nhận xóa</h3>
          <p className="text-sm text-gray-600 text-center mb-6">
            Bạn có chắc muốn xóa combo này không? Hành động này không thể hoàn tác.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => handleDelete(deleteId)}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
            >
              Xóa
            </button>
            <button
              onClick={() => setDeleteId(null)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default PartnerCombo;
