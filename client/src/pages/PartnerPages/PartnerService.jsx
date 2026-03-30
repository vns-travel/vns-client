import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  TrendingUp,
  Star,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  PauseCircle,
  Search,
  RefreshCw,
  AlertCircle,
  Loader2,
} from "lucide-react";
import PartnerServiceModal from "../../components/PartnerServiceModal";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { serviceService, SERVICE_TYPE } from "../../services/serviceService";

const PartnerService = () => {
  const [activeFilter, setActiveFilter] = useState("Tất cả");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  const partnerId = user?.userId || user?.id || user?.partnerId;

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await serviceService.getPartnerServices(partnerId);
      // API may return array directly or wrapped in a property
      setServices(Array.isArray(data) ? data : data.items || data.data || []);
    } catch (err) {
      setError(err.message || "Không thể tải danh sách dịch vụ.");
    } finally {
      setLoading(false);
    }
  }, [partnerId]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // Map API serviceType (int) to UI filter key
  const getFilterKey = (serviceType) =>
    SERVICE_TYPE[serviceType]?.filterKey || "other";

  const filterTabs = [
    { label: "Tất cả", key: "all" },
    { label: "Homestay", key: "homestay" },
    { label: "Tour", key: "tour" },
    { label: "Khác", key: "other" },
  ];

  const filteredServices = services.filter((s) => {
    const matchesFilter =
      activeFilter === "Tất cả" ||
      getFilterKey(s.serviceType) ===
        filterTabs.find((t) => t.label === activeFilter)?.key;

    const title = s.title || "";
    const location = s.location || "";
    const matchesSearch =
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const sortedServices = [...filteredServices].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return new Date(b.updatedAt || b.createdAt || 0) -
          new Date(a.updatedAt || a.createdAt || 0);
      case "rating":
        return (b.averageRating || 0) - (a.averageRating || 0);
      default:
        return 0;
    }
  });

  const stats = {
    total: services.length,
    active: services.filter((s) => s.isActive || s.status === "active" || s.availability > 0).length,
    pending: services.filter((s) => s.isPending || s.status === "pending").length,
  };

  // Determine display status from API fields
  const getServiceStatus = (s) => {
    if (s.isPending || s.status === "pending") return "pending";
    if (s.isActive === false || s.availability === 0) return "inactive";
    return "active";
  };

  const getStatusBadge = (status) => ({
    active: { cls: "bg-green-100 text-green-800", icon: CheckCircle, text: "Đang hoạt động" },
    inactive: { cls: "bg-red-100 text-red-800", icon: XCircle, text: "Không hoạt động" },
    pending: { cls: "bg-yellow-100 text-yellow-800", icon: Clock, text: "Chờ duyệt" },
    paused: { cls: "bg-gray-100 text-gray-800", icon: PauseCircle, text: "Tạm dừng" },
  }[status] || { cls: "bg-gray-100 text-gray-800", icon: PauseCircle, text: "N/A" });

  const formatPrice = (price) =>
    price != null ? new Intl.NumberFormat("vi-VN").format(price) + " ₫" : "—";

  const handleDelete = async (serviceId, e) => {
    e.stopPropagation();
    if (!window.confirm("Bạn có chắc muốn xóa dịch vụ này?")) return;
    try {
      await serviceService.deleteService(serviceId);
      setServices((prev) => prev.filter((s) => s.serviceId !== serviceId));
    } catch (err) {
      alert(err.message || "Xóa thất bại.");
    }
  };

  const handleOpenDetail = (service) => {
    navigate("/PartnerService/detail", {
      state: { serviceId: service.serviceId, serviceType: service.serviceType },
    });
  };

  const tabCount = (key) => {
    if (key === "all") return services.length;
    return services.filter((s) => getFilterKey(s.serviceType) === key).length;
  };

  return (
    <div className="min-h-screen bg-bg-light p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dịch vụ của tôi</h1>
            <p className="text-gray-600">Quản lý homestay, tour du lịch và các dịch vụ khác</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white font-medium transition-all duration-200 hover:shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Thêm dịch vụ mới
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {stats.active}/{stats.total}
            </div>
            <div className="text-sm text-gray-500">Dịch vụ hoạt động</div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats.pending}</div>
            <div className="text-sm text-gray-500">Chờ phê duyệt</div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats.total}</div>
            <div className="text-sm text-gray-500">Tổng dịch vụ</div>
          </div>
        </div>

        {/* Search & Sort Bar */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, địa điểm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700">Sắp xếp:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary bg-white"
              >
                <option value="recent">Mới nhất</option>
                <option value="rating">Đánh giá cao nhất</option>
              </select>
              <button
                onClick={fetchServices}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Làm mới"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-2 overflow-x-auto">
              {filterTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveFilter(tab.label)}
                  className={`whitespace-nowrap pb-4 px-4 border-b-2 font-medium text-sm transition-all duration-200 ${
                    activeFilter === tab.label
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.label}
                  <span className="ml-1.5 text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">
                    {tabCount(tab.key)}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <Loader2 className="w-10 h-10 animate-spin mb-3" />
            <p>Đang tải dịch vụ...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md">
              <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
              <p className="text-red-700 font-medium mb-2">Không thể tải dữ liệu</p>
              <p className="text-red-600 text-sm mb-4">{error}</p>
              <button
                onClick={fetchServices}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover text-sm"
              >
                Thử lại
              </button>
            </div>
          </div>
        ) : sortedServices.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery
                ? `Không tìm thấy kết quả cho "${searchQuery}"`
                : "Chưa có dịch vụ nào"}
            </h3>
            <p className="text-gray-500 mb-6">
              {!searchQuery && "Bắt đầu bằng cách tạo dịch vụ đầu tiên của bạn."}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white font-medium"
              >
                <Plus className="w-5 h-5 mr-2" />
                Tạo dịch vụ đầu tiên
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedServices.map((service) => {
              const status = getServiceStatus(service);
              const badge = getStatusBadge(status);
              const StatusIcon = badge.icon;
              const typeInfo = SERVICE_TYPE[service.serviceType] || SERVICE_TYPE[2];
              const images = service.images || service.serviceImages || [];
              const coverImage = images[0]?.url || images[0] || null;
              const rating = service.averageRating || service.rating;

              return (
                <div
                  key={service.serviceId}
                  className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-gray-300 transform hover:-translate-y-1 overflow-hidden cursor-pointer"
                  onClick={() => handleOpenDetail(service)}
                >
                  {/* Image */}
                  <div className="relative h-48 bg-gray-100 overflow-hidden">
                    {coverImage ? (
                      <img
                        src={coverImage}
                        alt={service.title}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.style.display = "none"; }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <MapPin className="w-12 h-12" />
                      </div>
                    )}

                    {/* Status badge */}
                    <div className="absolute top-3 right-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${badge.cls}`}>
                        <StatusIcon className="w-3 h-3" />
                        {badge.text}
                      </span>
                    </div>

                    {/* Type badge */}
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 bg-[#E6F3F4] text-[#008fa0] rounded-full text-sm font-medium">
                        {typeInfo.label}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5">
                    <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2">
                      {service.title}
                    </h3>

                    {service.location && (
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                        <span className="truncate">{service.location}</span>
                      </div>
                    )}

                    {rating > 0 && (
                      <div className="flex items-center gap-1.5 mb-3">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-semibold text-gray-900">{rating.toFixed(1)}</span>
                        {service.reviewCount > 0 && (
                          <span className="text-sm text-gray-500">({service.reviewCount})</span>
                        )}
                      </div>
                    )}

                    {/* Price */}
                    {(service.price != null || service.platformFeeAmount != null) && (
                      <div className="mb-4 pb-4 border-b border-gray-100">
                        <span className="text-lg font-bold text-gray-900">
                          {formatPrice(service.price ?? service.platformFeeAmount)}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">{typeInfo.priceUnit}</span>
                      </div>
                    )}

                    {/* Availability */}
                    {service.availability != null && (
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                        <span>Còn trống</span>
                        <span className={`font-semibold ${service.availability > 0 ? "text-green-600" : "text-red-500"}`}>
                          {service.availability}
                        </span>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-hover rounded-lg transition-colors"
                        onClick={(e) => { e.stopPropagation(); handleOpenDetail(service); }}
                      >
                        <Edit2 className="w-4 h-4 mr-1" />
                        Chi tiết
                      </button>

                      <button
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa dịch vụ"
                        onClick={(e) => handleDelete(service.serviceId, e)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {isModalOpen && <PartnerServiceModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default PartnerService;
