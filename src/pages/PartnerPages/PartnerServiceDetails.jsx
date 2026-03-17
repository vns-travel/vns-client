import React, { useState, useEffect } from "react";
import {
  Home,
  MapPin,
  Camera,
  Calendar,
  Bed,
  Car,
  List,
  Clock,
  CheckCircle,
  Pencil,
  Save,
  ToggleLeft,
  ToggleRight,
  Eye,
  ArrowLeft,
  Star,
  Users,
  DollarSign,
  TrendingUp,
  Package,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

/* ─── Mock data per service type ─── */
const MOCK = {
  rental: {
    id: "rental-001",
    type: "rental",
    title: "Oceanview Deluxe Homestay",
    category: "Khách sạn",
    location: "Quận 1, TP. Hồ Chí Minh",
    description: "Khu nghỉ dưỡng sang trọng với view biển tuyệt đẹp, đầy đủ tiện nghi hiện đại.",
    basePrice: 1200000,
    weekendPrice: 1500000,
    rating: 4.8,
    reviewCount: 127,
    totalBookings: 342,
    thisMonthBookings: 23,
    viewCount: 1847,
    revenue: 410400000,
    availability: 85,
    responseTime: "< 1 giờ",
    checkInTime: "14:00",
    checkOutTime: "11:00",
    amenities: ["WiFi miễn phí", "Điều hòa", "Nhà bếp", "Hồ bơi"],
    images: [],
    isActive: true,
    rooms: [
      { roomId: "r-001", roomName: "Phòng Deluxe View Biển", basePrice: 1200000, weekendPrice: 1500000, maxGuests: 3, numberOfRooms: 4, bedType: "Queen Bed" },
      { roomId: "r-002", roomName: "Phòng Suite Cao Cấp", basePrice: 2500000, weekendPrice: 3000000, maxGuests: 4, numberOfRooms: 2, bedType: "King Bed" },
    ],
  },
  tour: {
    id: "tour-001",
    type: "tour",
    title: "Tour Ẩm Thực Phố Cổ Hà Nội",
    category: "Tour ẩm thực",
    location: "Quận Hoàn Kiếm, Hà Nội",
    description: "Khám phá tinh hoa ẩm thực Hà Nội qua 5 món ăn đặc sắc cùng hướng dẫn viên địa phương.",
    basePrice: 500000,
    weekendPrice: 500000,
    rating: 4.9,
    reviewCount: 289,
    totalBookings: 567,
    thisMonthBookings: 41,
    viewCount: 3241,
    revenue: 255150000,
    availability: 95,
    responseTime: "< 30 phút",
    durationHours: 4,
    tourType: "cultural",
    groupSize: "2–12 người",
    minParticipants: 2,
    maxParticipants: 12,
    pricePerAdult: 500000,
    pricePerChild: 300000,
    pricePerInfant: 0,
    cancellationPolicy: "flexible",
    meetingPoint: "Cổng chính Nhà Hát Lớn Hà Nội",
    includes: ["Hướng dẫn viên", "Đồ ăn", "Nước uống"],
    excludes: ["Tiền tip", "Đồ uống có cồn"],
    whatToBring: "Kem chống nắng, mũ, máy ảnh",
    startTimes: ["09:00", "14:00", "18:00"],
    language: ["Tiếng Việt", "Tiếng Anh"],
    images: [],
    isActive: true,
    itinerary: [
      { id: 1, time: "09:00", title: "Tập trung điểm xuất phát", description: "Gặp mặt tại Nhà Hát Lớn Hà Nội, giới thiệu tour." },
      { id: 2, time: "09:30", title: "Phố Hàng Buồm", description: "Thưởng thức bánh cuốn và chả cá truyền thống." },
      { id: 3, time: "10:30", title: "Chợ Đồng Xuân", description: "Khám phá chợ đầu mối lớn nhất Hà Nội." },
      { id: 4, time: "11:30", title: "Bún chả Obama", description: "Dùng bữa tại quán bún chả nổi tiếng." },
      { id: 5, time: "13:00", title: "Kết thúc tour", description: "Chụp ảnh kỷ niệm và kết thúc hành trình." },
    ],
  },
  car: {
    id: "car-001",
    type: "car",
    title: "Saigon Car Rental – Dịch vụ thuê xe",
    category: "Thuê xe tự lái",
    location: "Quận 7, TP. Hồ Chí Minh",
    description: "Dịch vụ thuê xe uy tín với đa dạng dòng xe từ Economy đến SUV hạng sang.",
    basePrice: 800000,
    rating: 4.7,
    reviewCount: 94,
    totalBookings: 178,
    thisMonthBookings: 12,
    viewCount: 892,
    revenue: 142400000,
    availability: 70,
    responseTime: "< 2 giờ",
    images: [],
    isActive: true,
    businessLicense: "456789",
    insurancePolicy: "ABC-123-XYZ",
    depots: [
      { id: 1, name: "Sân bay Tân Sơn Nhất", address: "Nhà ga Quốc tế, Tân Sơn Nhất", contact: "+84 901 234 567", openingHours: "06:00 – 22:00", isPrimary: true },
      { id: 2, name: "Trung tâm Quận 1", address: "123 Nguyễn Huệ, Quận 1, TP. HCM", contact: "+84 901 234 568", openingHours: "08:00 – 20:00", isPrimary: false },
    ],
    fleetTemplates: [
      { id: 1, brand: "Toyota", model: "Vios", year: 2026, category: "Economy", seats: 5, transmissionType: "automatic", fuelType: "petrol", basePricePerDay: 800000, features: ["Điều hòa", "Bluetooth", "Camera lùi"] },
      { id: 2, brand: "KIA", model: "Sorento", year: 2026, category: "SUV", seats: 7, transmissionType: "automatic", fuelType: "diesel", basePricePerDay: 1500000, features: ["Điều hòa", "Ghế da", "Cửa sổ trời"] },
    ],
    depotInventories: [
      { depotId: 1, templateId: 1, quantity: 5 },
      { depotId: 1, templateId: 2, quantity: 3 },
      { depotId: 2, templateId: 1, quantity: 2 },
    ],
  },
};

const formatPrice = (n) => new Intl.NumberFormat("vi-VN").format(n) + " ₫";
const formatNumber = (n) => new Intl.NumberFormat("vi-VN").format(n);

/* ─── Sub-components ─── */
const InfoItem = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500 mb-0.5">{label}</p>
    <p className="font-semibold text-gray-800">{value}</p>
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

/* ─── Tab: Rental – Rooms ─── */
const RoomsTab = ({ rooms }) => (
  <div className="space-y-4">
    <h3 className="font-semibold text-gray-800 text-lg">Danh sách loại phòng</h3>
    {rooms.map((room) => (
      <div key={room.roomId} className="border border-gray-200 rounded-xl p-5 bg-gray-50">
        <h4 className="font-semibold text-gray-900 mb-3">{room.roomName}</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <InfoItem label="Giá ngày thường" value={formatPrice(room.basePrice)} />
          <InfoItem label="Giá cuối tuần" value={formatPrice(room.weekendPrice)} />
          <InfoItem label="Khách tối đa" value={`${room.maxGuests} người`} />
          <InfoItem label="Số phòng" value={`${room.numberOfRooms} phòng`} />
          {room.bedType && <InfoItem label="Loại giường" value={room.bedType} />}
        </div>
      </div>
    ))}
  </div>
);

/* ─── Tab: Tour – Itinerary ─── */
const ItineraryTab = ({ itinerary }) => (
  <div className="space-y-4">
    <h3 className="font-semibold text-gray-800 text-lg">Lịch trình tour</h3>
    <div className="relative">
      {itinerary.map((step, idx) => (
        <div key={step.id} className="flex gap-4 mb-5">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
              {idx + 1}
            </div>
            {idx < itinerary.length - 1 && <div className="w-px flex-1 bg-gray-200 mt-1" />}
          </div>
          <div className="pb-4 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">{step.time}</span>
              <span className="font-semibold text-gray-900">{step.title}</span>
            </div>
            <p className="text-sm text-gray-600">{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* ─── Tab: Car – Depots ─── */
const DepotsTab = ({ depots }) => (
  <div className="space-y-4">
    <h3 className="font-semibold text-gray-800 text-lg">Danh sách Depot</h3>
    {depots.map((d) => (
      <div key={d.id} className="border border-gray-200 rounded-xl p-5 bg-gray-50">
        <div className="flex items-center gap-2 mb-3">
          <h4 className="font-semibold text-gray-900">{d.name}</h4>
          {d.isPrimary && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Chính</span>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InfoItem label="Địa chỉ" value={d.address} />
          <InfoItem label="Liên hệ" value={d.contact} />
          <InfoItem label="Giờ hoạt động" value={d.openingHours} />
        </div>
      </div>
    ))}
  </div>
);

/* ─── Tab: Car – Fleet ─── */
const FleetTab = ({ fleetTemplates }) => (
  <div className="space-y-4">
    <h3 className="font-semibold text-gray-800 text-lg">Mẫu xe (Hạng xe)</h3>
    {fleetTemplates.map((v) => (
      <div key={v.id} className="border border-gray-200 rounded-xl p-5 bg-gray-50">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-gray-900">{v.brand} {v.model} ({v.year})</h4>
          <span className="text-sm font-bold text-primary">{formatPrice(v.basePricePerDay)}/ngày</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
          <InfoItem label="Phân loại" value={v.category} />
          <InfoItem label="Số chỗ" value={`${v.seats} chỗ`} />
          <InfoItem label="Hộp số" value={v.transmissionType === "automatic" ? "Tự động" : "Số sàn"} />
          <InfoItem label="Nhiên liệu" value={v.fuelType === "petrol" ? "Xăng" : "Dầu"} />
        </div>
        <div className="flex flex-wrap gap-2">
          {v.features.map((f, i) => (
            <span key={i} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">{f}</span>
          ))}
        </div>
      </div>
    ))}
  </div>
);

/* ─── Tab: Car – Inventory ─── */
const InventoryTab = ({ depots, fleetTemplates, depotInventories }) => (
  <div className="space-y-4">
    <h3 className="font-semibold text-gray-800 text-lg">Phân bổ kho xe</h3>
    {depots.map((depot) => {
      const items = depotInventories.filter((inv) => inv.depotId === depot.id);
      return (
        <div key={depot.id} className="border border-gray-200 rounded-xl p-5 bg-gray-50">
          <h4 className="font-semibold text-gray-900 mb-3">{depot.name}</h4>
          {items.length === 0 ? (
            <p className="text-sm text-gray-500">Chưa có xe phân bổ</p>
          ) : (
            <div className="space-y-2">
              {items.map((inv, i) => {
                const tmpl = fleetTemplates.find((t) => t.id === inv.templateId);
                return (
                  <div key={i} className="flex items-center justify-between bg-white border border-gray-100 rounded-lg px-4 py-2">
                    <span className="text-sm text-gray-800">{tmpl ? `${tmpl.brand} ${tmpl.model}` : "N/A"}</span>
                    <span className="text-sm font-semibold text-gray-900">{inv.quantity} xe</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
    })}
  </div>
);

/* ─── Main Component ─── */
const PartnerServiceDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const serviceType = location.state?.type || "rental";
  const serviceId = location.state?.id;

  const [service, setService] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // In real app, fetch by serviceId + type from API
    setService(MOCK[serviceType] || MOCK.rental);
    setActiveTab("overview");
  }, [serviceType, serviceId]);

  if (!service) return <div className="p-10 text-gray-500">Đang tải dữ liệu...</div>;

  /* ─── Build tab list per type ─── */
  const baseTabs = [{ id: "overview", label: "Tổng quan", icon: Home }];
  const typeTabs = {
    rental: [{ id: "rooms", label: "Loại phòng", icon: Bed }, { id: "availability", label: "Lịch trống", icon: Calendar }],
    tour: [{ id: "itinerary", label: "Lịch trình", icon: List }, { id: "pricing", label: "Định giá", icon: DollarSign }],
    car: [{ id: "depots", label: "Depot", icon: MapPin }, { id: "fleet", label: "Hạng xe", icon: Car }, { id: "inventory", label: "Kho xe", icon: Package }],
  };
  const tabs = [...baseTabs, ...(typeTabs[service.type] || [])];

  const typeLabel = { rental: "Cho thuê", tour: "Tour", car: "Thuê xe" }[service.type];

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
                  onClick={() => { alert("Lưu thay đổi thành công!"); setIsEditing(false); }}
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
            <button
              onClick={() => setService((prev) => ({ ...prev, isActive: !prev.isActive }))}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                service.isActive ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-green-50 text-green-600 hover:bg-green-100"
              }`}
            >
              {service.isActive ? <><ToggleLeft className="w-4 h-4" /> Tạm ngưng</> : <><ToggleRight className="w-4 h-4" /> Kích hoạt</>}
            </button>
          </div>
        </div>

        {/* Title card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">{typeLabel}</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${service.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                  {service.isActive ? "Đang hoạt động" : "Tạm ngưng"}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{service.title}</h1>
              <p className="text-sm text-gray-500 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{service.location}</p>
            </div>
            {service.rating > 0 && (
              <div className="text-right flex-shrink-0">
                <div className="flex items-center gap-1 justify-end">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="font-bold text-gray-900">{service.rating}</span>
                </div>
                <p className="text-xs text-gray-500">{formatNumber(service.reviewCount)} đánh giá</p>
              </div>
            )}
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
            <StatCard label="Tổng đặt chỗ" value={formatNumber(service.totalBookings)} icon={Calendar} color="bg-blue-100 text-blue-600" />
            <StatCard label="Lượt xem" value={formatNumber(service.viewCount)} icon={Eye} color="bg-orange-100 text-orange-600" />
            <StatCard label="Doanh thu" value={formatPrice(service.revenue)} icon={TrendingUp} color="bg-green-100 text-green-600" />
            <StatCard label="Tháng này" value={`${service.thisMonthBookings} đặt`} icon={Users} color="bg-purple-100 text-purple-600" />
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
            {/* Overview — shared */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Mô tả</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
                </div>

                {/* Rental-specific overview */}
                {service.type === "rental" && (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Thông tin cơ sở lưu trú</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <InfoItem label="Giá cơ bản" value={`${formatPrice(service.basePrice)}/đêm`} />
                      <InfoItem label="Giá cuối tuần" value={`${formatPrice(service.weekendPrice)}/đêm`} />
                      <InfoItem label="Nhận phòng" value={service.checkInTime} />
                      <InfoItem label="Trả phòng" value={service.checkOutTime} />
                      <InfoItem label="Tỷ lệ trống" value={`${service.availability}%`} />
                      <InfoItem label="Thời gian phản hồi" value={service.responseTime} />
                    </div>
                    {service.amenities && (
                      <div className="mt-4">
                        <p className="text-xs text-gray-500 mb-2">Tiện nghi</p>
                        <div className="flex flex-wrap gap-2">
                          {service.amenities.map((a, i) => (
                            <span key={i} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">{a}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Tour-specific overview */}
                {service.type === "tour" && (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Thông tin tour</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                      <InfoItem label="Thời lượng" value={`${service.durationHours} giờ`} />
                      <InfoItem label="Số người" value={`${service.minParticipants}–${service.maxParticipants} người`} />
                      <InfoItem label="Điểm hẹn" value={service.meetingPoint} />
                      <InfoItem label="Ngôn ngữ" value={service.language?.join(", ")} />
                      <InfoItem label="Thời gian phản hồi" value={service.responseTime} />
                      <InfoItem label="Tỷ lệ còn trống" value={`${service.availability}%`} />
                    </div>
                    {service.startTimes && (
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 mb-2">Khung giờ khởi hành</p>
                        <div className="flex gap-2">
                          {service.startTimes.map((t, i) => (
                            <span key={i} className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded">{t}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {service.includes && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-2">Bao gồm</p>
                          <div className="flex flex-wrap gap-2">
                            {service.includes.map((x, i) => (
                              <span key={i} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">{x}</span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-2">Không bao gồm</p>
                          <div className="flex flex-wrap gap-2">
                            {service.excludes?.map((x, i) => (
                              <span key={i} className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded">{x}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Car-specific overview */}
                {service.type === "car" && (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Thông tin dịch vụ thuê xe</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <InfoItem label="Số depot" value={`${service.depots?.length} địa điểm`} />
                      <InfoItem label="Số hạng xe" value={`${service.fleetTemplates?.length} hạng`} />
                      <InfoItem label="Giá từ" value={`${formatPrice(service.basePrice)}/ngày`} />
                      <InfoItem label="Tỷ lệ còn trống" value={`${service.availability}%`} />
                      <InfoItem label="Thời gian phản hồi" value={service.responseTime} />
                    </div>
                  </div>
                )}

                {/* Images */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2"><Camera className="w-4 h-4" />Hình ảnh</h3>
                  {service.images?.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {service.images.map((img, i) => (
                        <img key={i} src={img} alt="" className="rounded-lg object-cover h-32 w-full" />
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 italic">Chưa có hình ảnh</p>
                  )}
                </div>
              </div>
            )}

            {/* Rental: Rooms */}
            {activeTab === "rooms" && service.type === "rental" && <RoomsTab rooms={service.rooms} />}

            {/* Rental / Tour: Availability */}
            {activeTab === "availability" && (
              <div>
                <h3 className="font-semibold text-gray-800 text-lg mb-3">Tình trạng đặt chỗ</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Tỷ lệ còn trống: <span className="font-bold text-gray-900">{service.availability}%</span></p>
                </div>
              </div>
            )}

            {/* Tour: Itinerary */}
            {activeTab === "itinerary" && service.type === "tour" && <ItineraryTab itinerary={service.itinerary} />}

            {/* Tour: Pricing */}
            {activeTab === "pricing" && service.type === "tour" && (
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800 text-lg">Bảng giá</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border border-gray-200 rounded-xl p-4 text-center">
                    <p className="text-xs text-gray-500 mb-1">Người lớn</p>
                    <p className="text-xl font-bold text-primary">{formatPrice(service.pricePerAdult)}</p>
                  </div>
                  <div className="border border-gray-200 rounded-xl p-4 text-center">
                    <p className="text-xs text-gray-500 mb-1">Trẻ em</p>
                    <p className="text-xl font-bold text-primary">{formatPrice(service.pricePerChild)}</p>
                  </div>
                  <div className="border border-gray-200 rounded-xl p-4 text-center">
                    <p className="text-xs text-gray-500 mb-1">Em bé</p>
                    <p className="text-xl font-bold text-primary">{service.pricePerInfant === 0 ? "Miễn phí" : formatPrice(service.pricePerInfant)}</p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <InfoItem label="Chính sách hủy" value={{ flexible: "Linh hoạt", moderate: "Vừa phải", strict: "Nghiêm ngặt" }[service.cancellationPolicy] || service.cancellationPolicy} />
                </div>
              </div>
            )}

            {/* Car: Depots */}
            {activeTab === "depots" && service.type === "car" && <DepotsTab depots={service.depots} />}

            {/* Car: Fleet */}
            {activeTab === "fleet" && service.type === "car" && <FleetTab fleetTemplates={service.fleetTemplates} />}

            {/* Car: Inventory */}
            {activeTab === "inventory" && service.type === "car" && (
              <InventoryTab depots={service.depots} fleetTemplates={service.fleetTemplates} depotInventories={service.depotInventories} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerServiceDetails;
