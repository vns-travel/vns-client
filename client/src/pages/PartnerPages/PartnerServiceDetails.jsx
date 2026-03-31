import { useState, useEffect } from "react";
import {
  Home,
  MapPin,
  Camera,
  Calendar,
  Bed,
  List,
  Clock,
  Pencil,
  Save,
  ToggleLeft,
  ToggleRight,
  Eye,
  ArrowLeft,
  Star,
  Users,
  TrendingUp,
  Loader2,
  AlertCircle,
  MessageSquare,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { serviceService, SERVICE_TYPE } from "../../services/serviceService";
import { reviewService } from "../../services/reviewService";

const formatPrice = (n) =>
  n != null ? new Intl.NumberFormat("vi-VN").format(n) + " ₫" : "—";
const formatNumber = (n) =>
  n != null ? new Intl.NumberFormat("vi-VN").format(n) : "—";

const InfoItem = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500 mb-0.5">{label}</p>
    <p className="font-semibold text-gray-800">{value ?? "—"}</p>
  </div>
);

const StatCard = ({ label, value, icon: Icon, color }) => (
  <div className="bg-gray-50 rounded-lg p-4 flex items-center gap-3">
    <div className={`p-2 rounded-lg ${color}`}>
      <Icon className="w-4 h-4" />
    </div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-base font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

/* ─── Tour Itinerary Tab ─── */
const ItineraryTab = ({ itinerary }) => {
  if (!itinerary || itinerary.length === 0)
    return <p className="text-sm text-gray-400 italic">Chưa có lịch trình.</p>;
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-800 text-lg">Lịch trình tour</h3>
      <div className="relative">
        {itinerary.map((step, idx) => (
          <div key={step.itineraryId || idx} className="flex gap-4 mb-5">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                {step.stepOrder || idx + 1}
              </div>
              {idx < itinerary.length - 1 && (
                <div className="w-px flex-1 bg-gray-200 mt-1" />
              )}
            </div>
            <div className="pb-4 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-gray-900">{step.activity || step.title}</span>
                {step.durationMinutes && (
                  <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded">
                    {step.durationMinutes} phút
                  </span>
                )}
              </div>
              {step.location && (
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {step.location}
                </p>
              )}
              <p className="text-sm text-gray-600">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Tour Schedules Tab ─── */
const SchedulesTab = ({ schedules }) => {
  if (!schedules || schedules.length === 0)
    return <p className="text-sm text-gray-400 italic">Chưa có lịch khởi hành.</p>;
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-800 text-lg">Lịch khởi hành</h3>
      {schedules.map((s, idx) => (
        <div key={s.scheduleId || idx} className="border border-gray-200 rounded-xl p-5 bg-gray-50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <InfoItem label="Ngày" value={s.tourDate ? new Date(s.tourDate).toLocaleDateString("vi-VN") : "—"} />
            <InfoItem label="Giờ bắt đầu" value={s.startTime} />
            <InfoItem label="Giờ kết thúc" value={s.endTime} />
            <InfoItem label="Slot còn" value={`${s.availableSlots - (s.bookedSlots || 0)}/${s.availableSlots}`} />
            <InfoItem label="Giá" value={formatPrice(s.price)} />
            {s.meetingPoint && <InfoItem label="Điểm hẹn" value={s.meetingPoint} />}
            {s.guideId && <InfoItem label="Hướng dẫn viên" value={s.guideId} />}
            <InfoItem label="Trạng thái" value={s.isActive ? "Hoạt động" : "Tạm ngưng"} />
          </div>
        </div>
      ))}
    </div>
  );
};

/* ─── Homestay Rooms Tab ─── */
const RoomsTab = ({ rooms }) => {
  if (!rooms || rooms.length === 0)
    return <p className="text-sm text-gray-400 italic">Chưa có phòng nào.</p>;
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-800 text-lg">Danh sách loại phòng</h3>
      {rooms.map((room, idx) => (
        <div key={room.roomId || idx} className="border border-gray-200 rounded-xl p-5 bg-gray-50">
          <h4 className="font-semibold text-gray-900 mb-3">{room.roomName}</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <InfoItem label="Giá ngày thường" value={formatPrice(room.basePrice)} />
            <InfoItem label="Giá cuối tuần" value={formatPrice(room.weekendPrice)} />
            <InfoItem label="Khách tối đa" value={room.maxOccupancy ? `${room.maxOccupancy} người` : null} />
            <InfoItem label="Số phòng" value={room.numberOfRooms ? `${room.numberOfRooms} phòng` : null} />
            {room.bedType && <InfoItem label="Loại giường" value={room.bedType} />}
            {room.roomSizeSqm && <InfoItem label="Diện tích" value={`${room.roomSizeSqm} m²`} />}
          </div>
          {room.roomAmenities && room.roomAmenities.length > 0 && (
            <div className="mt-3">
              <p className="text-xs text-gray-500 mb-1">Tiện nghi</p>
              <div className="flex flex-wrap gap-2">
                {room.roomAmenities.map((a, i) => (
                  <span key={i} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">{a}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

/* ─── Images Tab ─── */
const ImagesTab = ({ images }) => {
  const imgs = Array.isArray(images) ? images : [];
  return (
    <div>
      <h3 className="font-semibold text-gray-800 text-lg mb-3">Hình ảnh dịch vụ</h3>
      {imgs.length === 0 ? (
        <p className="text-sm text-gray-400 italic">Chưa có hình ảnh.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {imgs.map((img, i) => {
            const url = img.url || img;
            return (
              <img key={i} src={url} alt={img.caption || ""} className="rounded-lg object-cover h-32 w-full" />
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ─── Reviews Tab ─── */
const StarDisplay = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((n) => (
      <Star
        key={n}
        className={`w-3.5 h-3.5 ${n <= rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
      />
    ))}
  </div>
);

const ReviewsTab = ({ serviceId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    reviewService
      .getReviewsByService(serviceId)
      .then(setReviews)
      .catch((err) => setError(err.message || "Không thể tải đánh giá."))
      .finally(() => setLoading(false));
  }, [serviceId]);

  if (loading)
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );

  if (error)
    return <p className="text-sm text-red-500 italic">{error}</p>;

  if (reviews.length === 0)
    return <p className="text-sm text-gray-400 italic">Chưa có đánh giá nào.</p>;

  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <h3 className="font-semibold text-gray-800 text-lg">Đánh giá từ khách</h3>
        <div className="flex items-center gap-1.5 bg-yellow-50 px-3 py-1 rounded-full">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="text-sm font-bold text-gray-800">{avg.toFixed(1)}</span>
          <span className="text-xs text-gray-500">({reviews.length} đánh giá)</span>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((r) => (
          <div key={r.id} className="border border-gray-200 rounded-xl p-4 bg-gray-50">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  {r.reviewer_name || "Khách hàng"}
                </p>
                <StarDisplay rating={r.rating} />
              </div>
              <p className="text-xs text-gray-400 whitespace-nowrap">
                {new Date(r.created_at).toLocaleDateString("vi-VN")}
              </p>
            </div>
            {r.comment && (
              <p className="text-sm text-gray-600 leading-relaxed">{r.comment}</p>
            )}
            {r.image_urls && r.image_urls.length > 0 && (
              <div className="flex gap-2 mt-3 flex-wrap">
                {r.image_urls.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt=""
                    className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Main Component ─── */
const PartnerServiceDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { serviceId, serviceType } = location.state || {};

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!serviceId) {
      setError("Không tìm thấy mã dịch vụ.");
      setLoading(false);
      return;
    }
    serviceService.getServiceById(serviceId)
      .then((data) => setService(data))
      .catch((err) => setError(err.message || "Không thể tải dịch vụ."))
      .finally(() => setLoading(false));
  }, [serviceId]);

  if (loading)
    return (
      <div className="min-h-screen bg-bg-light flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );

  if (error || !service)
    return (
      <div className="min-h-screen bg-bg-light flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <p className="text-red-600">{error || "Không tìm thấy dịch vụ."}</p>
          <button
            onClick={() => navigate("/PartnerService")}
            className="mt-4 text-primary hover:underline text-sm"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );

  // Derive type: use serviceType from state or from fetched service
  const svcType = service.serviceType ?? serviceType;
  const typeInfo = SERVICE_TYPE[svcType] || SERVICE_TYPE[2];

  // Extract nested data
  const tourDetails = service.tourDetails || service.tour || {};
  const rooms = service.rooms || service.homestayRooms || [];
  const schedules = tourDetails.schedules || service.schedules || [];
  const itinerary = tourDetails.itineraries || service.itineraries || [];
  const images = service.serviceImages || service.images || [];
  const rating = service.averageRating || service.rating;

  // Build tabs based on serviceType
  const baseTabs = [{ id: "overview", label: "Tổng quan", icon: Home }];
  const extraTabs =
    svcType === 0
      ? [
          { id: "rooms", label: "Loại phòng", icon: Bed },
          { id: "availability", label: "Lịch trống", icon: Calendar },
        ]
      : svcType === 1
      ? [
          { id: "itinerary", label: "Lịch trình", icon: List },
          { id: "schedules", label: "Lịch khởi hành", icon: Clock },
        ]
      : [];
  const imagTab = [{ id: "images", label: "Hình ảnh", icon: Camera }];
  const reviewTab = [{ id: "reviews", label: "Đánh giá", icon: MessageSquare }];
  const tabs = [...baseTabs, ...extraTabs, ...imagTab, ...reviewTab];

  return (
    <div className="min-h-screen bg-bg-light p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/PartnerService")}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Quay lại dịch vụ
          </button>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary-hover"
                >
                  <Save className="w-4 h-4" /> Lưu thay đổi
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Pencil className="w-4 h-4" /> Chỉnh sửa
              </button>
            )}
          </div>
        </div>

        {/* Title Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  {typeInfo.label}
                </span>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    service.isActive !== false
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {service.isActive !== false ? "Đang hoạt động" : "Tạm ngưng"}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{service.title}</h1>
              {service.location && (
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {service.location}
                </p>
              )}
            </div>
            {rating > 0 && (
              <div className="text-right flex-shrink-0">
                <div className="flex items-center gap-1 justify-end">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="font-bold text-gray-900">{rating.toFixed(1)}</span>
                </div>
                {service.reviewCount > 0 && (
                  <p className="text-xs text-gray-500">{formatNumber(service.reviewCount)} đánh giá</p>
                )}
              </div>
            )}
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-5">
            <StatCard
              label="Lượt xem"
              value={formatNumber(service.viewCount ?? 0)}
              icon={Eye}
              color="bg-orange-100 text-orange-600"
            />
            <StatCard
              label="Còn trống"
              value={formatNumber(service.availability)}
              icon={TrendingUp}
              color="bg-green-100 text-green-600"
            />
            <StatCard
              label="Loại dịch vụ"
              value={typeInfo.label}
              icon={Users}
              color="bg-purple-100 text-purple-600"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200 px-6">
            <nav className="flex gap-1 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                      activeTab === tab.id
                        ? "border-primary text-primary"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Mô tả</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {service.description || "Chưa có mô tả."}
                  </p>
                </div>

                {/* Homestay overview */}
                {svcType === 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Thông tin homestay</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <InfoItem label="Giá cơ bản" value={formatPrice(service.price)} />
                      <InfoItem label="Nhận phòng" value={service.checkInTime || tourDetails.checkInTime} />
                      <InfoItem label="Trả phòng" value={service.checkOutTime || tourDetails.checkOutTime} />
                      <InfoItem label="Chính sách hủy" value={service.cancellationPolicy} />
                      <InfoItem label="Nội quy" value={service.houseRules} />
                    </div>
                  </div>
                )}

                {/* Tour overview */}
                {svcType === 1 && Object.keys(tourDetails).length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Thông tin tour</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                      <InfoItem label="Thời lượng" value={tourDetails.durationHours ? `${tourDetails.durationHours} giờ` : null} />
                      <InfoItem
                        label="Số người"
                        value={
                          tourDetails.minParticipants != null
                            ? `${tourDetails.minParticipants}–${tourDetails.maxParticipants} người`
                            : null
                        }
                      />
                      <InfoItem label="Độ khó" value={tourDetails.difficultyLevel} />
                      <InfoItem label="Chính sách hủy" value={tourDetails.cancellationPolicy} />
                      <InfoItem label="Giới hạn tuổi" value={tourDetails.ageRestrictions} />
                      <InfoItem label="Yêu cầu sức khỏe" value={tourDetails.fitnessRequirements} />
                    </div>

                    {tourDetails.includes && tourDetails.includes.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-2">Bao gồm</p>
                          <div className="flex flex-wrap gap-2">
                            {tourDetails.includes.map((x, i) => (
                              <span key={i} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">{x}</span>
                            ))}
                          </div>
                        </div>
                        {tourDetails.excludes && tourDetails.excludes.length > 0 && (
                          <div>
                            <p className="text-xs text-gray-500 mb-2">Không bao gồm</p>
                            <div className="flex flex-wrap gap-2">
                              {tourDetails.excludes.map((x, i) => (
                                <span key={i} className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded">{x}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {tourDetails.whatToBring && (
                      <div className="mt-3">
                        <p className="text-xs text-gray-500 mb-1">Cần mang theo</p>
                        <p className="text-sm text-gray-700">{tourDetails.whatToBring}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Other service overview */}
                {svcType === 2 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <InfoItem label="Phí nền tảng" value={formatPrice(service.platformFeeAmount)} />
                    <InfoItem label="Còn trống" value={formatNumber(service.availability)} />
                  </div>
                )}
              </div>
            )}

            {/* Homestay tabs */}
            {activeTab === "rooms" && <RoomsTab rooms={rooms} />}
            {activeTab === "availability" && (
              <div>
                <h3 className="font-semibold text-gray-800 text-lg mb-3">Tình trạng phòng trống</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">
                    Còn trống:{" "}
                    <span className="font-bold text-gray-900">{formatNumber(service.availability)}</span>
                  </p>
                </div>
              </div>
            )}

            {/* Tour tabs */}
            {activeTab === "itinerary" && <ItineraryTab itinerary={itinerary} />}
            {activeTab === "schedules" && <SchedulesTab schedules={schedules} />}

            {/* Images tab */}
            {activeTab === "images" && <ImagesTab images={images} />}

            {/* Reviews tab */}
            {activeTab === "reviews" && <ReviewsTab serviceId={serviceId} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerServiceDetails;
