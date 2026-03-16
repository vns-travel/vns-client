import React, { useEffect, useState } from "react";
import {
  Home,
  MapPin,
  Camera,
  Calendar,
  Bed,
  CheckCircle,
  Pencil,
  Save,
  ToggleLeft,
  ToggleRight,
  Eye,
} from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";

const SERVICE_TYPES = {
  TOUR: "tour",
  HOMESTAY: "homestay",
  RENTAL: "rental",
  ACTIVITY: "activity",
};

const PartnerServiceDetails = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const mockData = {
      id: "tour-001",
      type: SERVICE_TYPES.TOUR,

      title: "Tour Ẩm Thực Phố Cổ Hà Nội",
      category: "Tour ẩm thực",
      location: "Quận Hoàn Kiếm, Hà Nội",

      description:
        "Khám phá ẩm thực đường phố Hà Nội cùng hướng dẫn viên địa phương.",

      basePrice: 450000,
      weekendPrice: 450000,

      rating: 4.9,
      reviewCount: 289,

      totalBookings: 567,
      thisMonthBookings: 41,
      viewCount: 3241,
      revenue: 255150000,

      duration: "4 giờ",
      groupSize: "2-12 người",

      startTimes: ["09:00", "14:00", "18:00"],
      language: ["Tiếng Việt", "Tiếng Anh"],

      included: ["Hướng dẫn viên", "Đồ ăn", "Nước uống"],

      availability: 95,
      responseTime: "< 30 phút",

      images: [],

      rooms: [
        {
          roomId: "room-001",
          roomName: "Phòng Deluxe View Biển",
          basePrice: 2500000,
          weekendPrice: 3000000,
          maxGuests: 3,
          numberOfRooms: 4,
        },
      ],

      isActive: true,
    };

    setProperty(mockData);
  }, [serviceId]);

  if (!property) return <div className="p-10">Đang tải dữ liệu...</div>;

  const tabs = [
    { id: "overview", label: "Tổng quan", icon: Home },

    ...(property.type === SERVICE_TYPES.HOMESTAY ||
    property.type === SERVICE_TYPES.RENTAL
      ? [{ id: "rooms", label: "Loại phòng", icon: Bed }]
      : []),

    { id: "availability", label: "Lịch trống", icon: Calendar },
  ];

  const toggleEdit = () => setIsEditing(!isEditing);

  const toggleActive = () => {
    setProperty((prev) => ({ ...prev, isActive: !prev.isActive }));
  };

  const saveChanges = () => {
    alert("Lưu thay đổi thành công!");
    setIsEditing(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* HEADER */}

      <header className="flex justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            {property.title || property.propertyName}
          </h1>

          <p className="text-gray-600 flex items-center gap-2 mt-1">
            <MapPin size={16} />
            {property.location}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={toggleEdit}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded"
          >
            <Pencil size={16} />
            {isEditing ? "Hủy chỉnh sửa" : "Chỉnh sửa"}
          </button>

          {isEditing && (
            <button
              onClick={saveChanges}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded"
            >
              <Save size={16} />
              Lưu thay đổi
            </button>
          )}

          <button
            onClick={toggleActive}
            className={`flex items-center gap-2 px-4 py-2 rounded ${
              property.isActive
                ? "bg-red-100 text-red-600"
                : "bg-green-100 text-green-600"
            }`}
          >
            {property.isActive ? (
              <>
                <ToggleLeft size={16} />
                Tạm ngưng
              </>
            ) : (
              <>
                <ToggleRight size={16} />
                Kích hoạt
              </>
            )}
          </button>
        </div>
      </header>

      {/* TRẠNG THÁI */}

      <div className="mb-6">
        <span
          className={`px-3 py-1 rounded-full text-sm ${
            property.isActive
              ? "bg-green-100 text-green-700"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          {property.isActive ? "ĐANG HOẠT ĐỘNG" : "TẠM NGƯNG"}
        </span>
      </div>

      {/* TABS */}

      <div className="flex gap-6 border-b mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 pb-3 border-b-2 ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent"
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="bg-white shadow rounded-xl p-6 space-y-8">
        {/* TỔNG QUAN */}

        {activeTab === "overview" && (
          <>
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Home size={18} />
                Thông tin cơ bản
              </h2>

              <p className="text-gray-700">{property.description}</p>
            </section>

            {(property.type === SERVICE_TYPES.TOUR ||
              property.type === SERVICE_TYPES.ACTIVITY) && (
              <section>
                <h2 className="text-xl font-bold mb-4">
                  Thông tin Tour / Trải nghiệm
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <InfoItem label="Thời lượng" value={property.duration} />
                  <InfoItem label="Số lượng khách" value={property.groupSize} />
                  <InfoItem
                    label="Ngôn ngữ"
                    value={property.language.join(", ")}
                  />
                  <InfoItem
                    label="Giá cơ bản"
                    value={`${property.basePrice.toLocaleString()}₫`}
                  />
                  <InfoItem
                    label="Giá cuối tuần"
                    value={`${property.weekendPrice.toLocaleString()}₫`}
                  />
                  <InfoItem
                    label="Thời gian phản hồi"
                    value={property.responseTime}
                  />
                </div>
              </section>
            )}

            {property.included && (
              <section>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <CheckCircle size={18} />
                  Bao gồm
                </h2>

                <div className="flex flex-wrap gap-2">
                  {property.included.map((item, i) => (
                    <span
                      key={i}
                      className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {property.startTimes && (
              <section>
                <h2 className="text-xl font-bold mb-4">Khung giờ khởi hành</h2>

                <div className="flex gap-2">
                  {property.startTimes.map((time, i) => (
                    <span
                      key={i}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded"
                    >
                      {time}
                    </span>
                  ))}
                </div>
              </section>
            )}

            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Eye size={18} />
                Hiệu suất dịch vụ
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Stat label="Đánh giá" value={property.rating} />
                <Stat label="Lượt đặt" value={property.totalBookings} />
                <Stat label="Lượt xem" value={property.viewCount} />
                <Stat
                  label="Doanh thu"
                  value={`${property.revenue.toLocaleString()}₫`}
                />
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Camera size={18} />
                Hình ảnh
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {property.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    className="rounded-lg object-cover h-32 w-full"
                  />
                ))}
              </div>
            </section>
          </>
        )}

        {/* PHÒNG */}

        {activeTab === "rooms" &&
          (property.type === SERVICE_TYPES.HOMESTAY ||
            property.type === SERVICE_TYPES.RENTAL) && (
            <section>
              <h2 className="text-xl font-bold mb-4">Danh sách phòng</h2>

              {property.rooms.map((room) => (
                <div
                  key={room.roomId}
                  className="border rounded-lg p-4 mb-4 bg-gray-50"
                >
                  <h3 className="font-semibold text-lg mb-2">
                    {room.roomName}
                  </h3>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <InfoItem
                      label="Giá cơ bản"
                      value={`${room.basePrice.toLocaleString()}₫`}
                    />

                    <InfoItem
                      label="Giá cuối tuần"
                      value={`${room.weekendPrice.toLocaleString()}₫`}
                    />

                    <InfoItem label="Số khách tối đa" value={room.maxGuests} />

                    <InfoItem label="Số phòng" value={room.numberOfRooms} />
                  </div>
                </div>
              ))}
            </section>
          )}

        {/* LỊCH TRỐNG */}

        {activeTab === "availability" && (
          <section>
            <h2 className="text-xl font-bold mb-4">Tình trạng đặt chỗ</h2>

            <p className="text-gray-600">
              Tỷ lệ còn trống: {property.availability}%
            </p>
          </section>
        )}
      </div>
    </div>
  );
};

const InfoItem = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-semibold">{value}</p>
  </div>
);

const Stat = ({ label, value }) => (
  <div className="bg-gray-50 p-4 rounded">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-lg font-bold">{value}</p>
  </div>
);

export default PartnerServiceDetails;
