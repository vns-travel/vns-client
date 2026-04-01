import React, { useState, useEffect } from "react";
import {
  Home,
  MapPin,
  FileText,
  Bed,
  List,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
  Clock,
  Loader2,
  AlertCircle,
  Compass,
  Car,
  Building2,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { serviceService } from "../../services/serviceService";
import ImageUpload from "../../components/ImageUpload";

/* ═══════════════════════════════════════════
   SHARED COMPONENTS
═══════════════════════════════════════════ */
const FormField = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary"
    />
  </div>
);

const FormTextarea = ({ label, value, onChange, placeholder, rows = 3 }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary resize-none"
    />
  </div>
);

const FormSelect = ({ label, value, onChange, options }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  </div>
);

const TagInput = ({ label, tags, onChange, placeholder }) => {
  const [input, setInput] = useState("");
  const addTag = () => {
    const v = input.trim();
    if (v && !tags.includes(v)) {
      onChange([...tags, v]);
      setInput("");
    }
  };
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag, i) => (
          <span
            key={i}
            className="flex items-center gap-1 text-sm bg-primary/10 text-primary px-2 py-1 rounded-full"
          >
            {tag}
            <button
              onClick={() => onChange(tags.filter((_, j) => j !== i))}
              className="hover:text-red-600 ml-1"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
          placeholder={placeholder}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary"
        />
        <button
          onClick={addTag}
          className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const LocationSelect = ({ label, value, onChange, destinations }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    {destinations.length > 0 ? (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary"
      >
        <option value="">-- Chọn địa điểm --</option>
        {destinations.map((d) => (
          <option key={d.destinationId} value={d.destinationId}>
            {d.name} {d.city ? `– ${d.city}` : ""}
          </option>
        ))}
      </select>
    ) : (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Nhập Location ID (UUID)"
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary"
      />
    )}
  </div>
);

/* ═══════════════════════════════════════════
   HOMESTAY STEPS
═══════════════════════════════════════════ */
const HOMESTAY_STEPS = [
  { id: 1, title: "Thông tin cơ bản", icon: Home },
  { id: 2, title: "Loại phòng", icon: Bed },
  { id: 3, title: "Khung thời gian", icon: Clock },
  { id: 4, title: "Xác nhận & Đăng", icon: CheckCircle },
];

const ROOM_AMENITIES = [
  "WiFi",
  "Điều hòa",
  "Bếp",
  "Tủ lạnh",
  "TV",
  "Máy sấy tóc",
  "Ban công",
  "View núi",
  "View biển",
  "Phòng tắm riêng",
];

const HomestayForm = ({
  step,
  data,
  update,
  updateRoom,
  addRoom,
  removeRoom,
}) => {
  if (step === 1)
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Tên homestay"
            value={data.title}
            onChange={(v) => update("title", v)}
            placeholder="VD: Sapa Cloud Homestay"
            required
          />
          <FormField
            label="Số điện thoại liên hệ"
            value={data.phoneNumber}
            onChange={(v) => update("phoneNumber", v)}
            placeholder="+84..."
          />
          <FormField
            label="Thành phố"
            value={data.city}
            onChange={(v) => update("city", v)}
            placeholder="VD: Lào Cai"
            required
          />
          <FormField
            label="Quận / Huyện"
            value={data.district}
            onChange={(v) => update("district", v)}
            placeholder="VD: Sa Pa"
          />
          <FormField
            label="Phường / Xã"
            value={data.ward}
            onChange={(v) => update("ward", v)}
            placeholder="VD: Sa Pa Ward"
          />
          <FormField
            label="Mã bưu chính"
            value={data.postalCode}
            onChange={(v) => update("postalCode", v)}
            placeholder="VD: 330000"
          />
          <FormField
            label="Địa chỉ"
            value={data.address}
            onChange={(v) => update("address", v)}
            placeholder="Số nhà, đường..."
            required
          />
          <FormField
            label="Giờ hoạt động"
            value={data.openingHours}
            onChange={(v) => update("openingHours", v)}
            placeholder="VD: 24/7"
          />
          <FormField
            label="Giờ nhận phòng"
            value={data.checkInTime}
            onChange={(v) => update("checkInTime", v)}
            type="time"
          />
          <FormField
            label="Giờ trả phòng"
            value={data.checkOutTime}
            onChange={(v) => update("checkOutTime", v)}
            type="time"
          />
        </div>
        <FormTextarea
          label="Mô tả"
          value={data.description}
          onChange={(v) => update("description", v)}
          placeholder="Mô tả ngắn về homestay của bạn..."
          rows={4}
        />
        <FormTextarea
          label="Nội quy"
          value={data.houseRules}
          onChange={(v) => update("houseRules", v)}
          placeholder="Quy định hút thuốc, thú cưng, tiệc tùng..."
        />
        <FormTextarea
          label="Chính sách hủy"
          value={data.cancellationPolicy}
          onChange={(v) => update("cancellationPolicy", v)}
          placeholder="VD: Hoàn tiền 100% nếu hủy trước 48 giờ..."
        />
        <ImageUpload
          storagePath="services/homestay"
          urls={data.images}
          onChange={(urls) => update("images", urls)}
          label="Hình ảnh homestay"
        />
      </div>
    );

  if (step === 2)
    return (
      <div className="space-y-4">
        {data.rooms.map((room, idx) => (
          <div
            key={idx}
            className="border border-gray-200 rounded-xl p-5 bg-gray-50 space-y-3"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-800">
                Loại phòng #{idx + 1}
              </h4>
              {data.rooms.length > 1 && (
                <button
                  onClick={() => removeRoom(idx)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FormField
                label="Tên phòng *"
                value={room.roomName}
                onChange={(v) => updateRoom(idx, "roomName", v)}
                placeholder="VD: Phòng Deluxe"
              />
              <FormField
                label="Loại giường"
                value={room.bedType}
                onChange={(v) => updateRoom(idx, "bedType", v)}
                placeholder="VD: Queen"
              />
              <FormField
                label="Số giường"
                value={room.bedCount}
                onChange={(v) => updateRoom(idx, "bedCount", v)}
                type="number"
              />
              <FormField
                label="Số khách tối đa"
                value={room.maxOccupancy}
                onChange={(v) => updateRoom(idx, "maxOccupancy", v)}
                type="number"
              />
              <FormField
                label="Diện tích (m²)"
                value={room.roomSizeSqm}
                onChange={(v) => updateRoom(idx, "roomSizeSqm", v)}
                type="number"
              />
              <FormField
                label="Số phòng loại này"
                value={room.numberOfRooms}
                onChange={(v) => updateRoom(idx, "numberOfRooms", v)}
                type="number"
              />
              <FormField
                label="Giá cơ bản (₫/đêm) *"
                value={room.basePrice}
                onChange={(v) => updateRoom(idx, "basePrice", v)}
                type="number"
              />
              <FormField
                label="Giá cuối tuần (₫/đêm)"
                value={room.weekendPrice}
                onChange={(v) => updateRoom(idx, "weekendPrice", v)}
                type="number"
              />
              <FormField
                label="Giá lễ tết (₫/đêm)"
                value={room.holidayPrice}
                onChange={(v) => updateRoom(idx, "holidayPrice", v)}
                type="number"
              />
              <div>
                <label className="flex items-center gap-2 mt-5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={room.privateBathroom}
                    onChange={(e) =>
                      updateRoom(idx, "privateBathroom", e.target.checked)
                    }
                    className="rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Phòng tắm riêng
                  </span>
                </label>
              </div>
            </div>
            <FormTextarea
              label="Mô tả phòng"
              value={room.roomDescription}
              onChange={(v) => updateRoom(idx, "roomDescription", v)}
              placeholder="Mô tả phòng..."
              rows={2}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tiện nghi phòng
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {ROOM_AMENITIES.map((a) => (
                  <label
                    key={a}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={room.roomAmenities.includes(a)}
                      onChange={(e) => {
                        const next = e.target.checked
                          ? [...room.roomAmenities, a]
                          : room.roomAmenities.filter((x) => x !== a);
                        updateRoom(idx, "roomAmenities", next);
                      }}
                      className="rounded"
                    />
                    <span className="text-sm">{a}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        ))}
        <button
          onClick={addRoom}
          className="flex items-center gap-2 text-sm text-primary hover:text-primary-hover font-medium"
        >
          <Plus className="w-4 h-4" /> Thêm loại phòng
        </button>
      </div>
    );

  if (step === 3)
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Cài đặt khung thời gian có phòng. Sẽ áp dụng cho tất cả các loại
          phòng.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Ngày bắt đầu *"
            value={data.availStartDate}
            onChange={(v) => update("availStartDate", v)}
            type="date"
          />
          <FormField
            label="Ngày kết thúc *"
            value={data.availEndDate}
            onChange={(v) => update("availEndDate", v)}
            type="date"
          />
          <FormField
            label="Giá mặc định (₫/đêm)"
            value={data.availDefaultPrice}
            onChange={(v) => update("availDefaultPrice", v)}
            type="number"
            placeholder="0"
          />
          <FormField
            label="Số đêm tối thiểu"
            value={data.availMinNights}
            onChange={(v) => update("availMinNights", v)}
            type="number"
            placeholder="1"
          />
        </div>
      </div>
    );

  return null;
};

/* ═══════════════════════════════════════════
   TOUR STEPS
═══════════════════════════════════════════ */
const TOUR_STEPS = [
  { id: 1, title: "Thông tin tour", icon: Compass },
  { id: 2, title: "Chi tiết", icon: List },
  { id: 3, title: "Lịch trình", icon: Clock },
  { id: 4, title: "Hành trình", icon: MapPin },
  { id: 5, title: "Xác nhận & Đăng", icon: CheckCircle },
];

const TOUR_TYPES = [
  { value: "0", label: "Văn hóa" },
  { value: "1", label: "Ẩm thực" },
  { value: "2", label: "Phiêu lưu" },
  { value: "3", label: "Thiên nhiên" },
  { value: "4", label: "Thành phố" },
];

const DIFFICULTY_LEVELS = [
  { value: "0", label: "Dễ" },
  { value: "1", label: "Vừa" },
  { value: "2", label: "Khó" },
];

const TourForm = ({
  step,
  data,
  update,
  updateSchedule,
  addSchedule,
  removeSchedule,
  updateItinerary,
  addItinerary,
  removeItinerary,
  destinations,
}) => {
  if (step === 1)
    return (
      <div className="space-y-4">
        <FormField
          label="Tên tour *"
          value={data.title}
          onChange={(v) => update("title", v)}
          placeholder="VD: Tour Ẩm Thực Phố Cổ Hà Nội"
        />
        <FormTextarea
          label="Mô tả"
          value={data.description}
          onChange={(v) => update("description", v)}
          placeholder="Giới thiệu ngắn về tour..."
          rows={4}
        />
        <LocationSelect
          label="Điểm đến *"
          value={data.destinationId}
          onChange={(v) => update("destinationId", v)}
          destinations={destinations}
        />
        <ImageUpload
          storagePath="services/tour"
          urls={data.images}
          onChange={(urls) => update("images", urls)}
          label="Hình ảnh tour"
        />
      </div>
    );

  if (step === 2)
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormSelect
            label="Loại tour"
            value={data.tourType}
            onChange={(v) => update("tourType", v)}
            options={TOUR_TYPES}
          />
          <FormSelect
            label="Độ khó"
            value={data.difficultyLevel}
            onChange={(v) => update("difficultyLevel", v)}
            options={DIFFICULTY_LEVELS}
          />
          <FormField
            label="Thời lượng (giờ)"
            value={data.durationHours}
            onChange={(v) => update("durationHours", v)}
            type="number"
          />
          <FormField
            label="Số người tối thiểu"
            value={data.minParticipants}
            onChange={(v) => update("minParticipants", v)}
            type="number"
          />
          <FormField
            label="Số người tối đa"
            value={data.maxParticipants}
            onChange={(v) => update("maxParticipants", v)}
            type="number"
          />
          <FormField
            label="Giới hạn độ tuổi"
            value={data.ageRestrictions}
            onChange={(v) => update("ageRestrictions", v)}
            placeholder="VD: 12+"
          />
        </div>
        <TagInput
          label="Bao gồm"
          tags={data.includes}
          onChange={(v) => update("includes", v)}
          placeholder="Nhập và nhấn Enter..."
        />
        <TagInput
          label="Không bao gồm"
          tags={data.excludes}
          onChange={(v) => update("excludes", v)}
          placeholder="Nhập và nhấn Enter..."
        />
        <FormTextarea
          label="Cần mang theo"
          value={data.whatToBring}
          onChange={(v) => update("whatToBring", v)}
          placeholder="VD: Kem chống nắng, mũ, máy ảnh..."
        />
        <FormTextarea
          label="Yêu cầu thể lực"
          value={data.fitnessRequirements}
          onChange={(v) => update("fitnessRequirements", v)}
          placeholder="VD: Cần sức khỏe tốt cơ bản..."
        />
        <FormTextarea
          label="Chính sách hủy"
          value={data.cancellationPolicy}
          onChange={(v) => update("cancellationPolicy", v)}
          placeholder="VD: Hủy trước 48 giờ được hoàn tiền..."
        />
      </div>
    );

  if (step === 3)
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Thêm các ngày khởi hành. Mỗi ngày là một lịch trình riêng.
        </p>
        {data.schedules.map((s, idx) => (
          <div
            key={idx}
            className="border border-gray-200 rounded-xl p-5 bg-gray-50 space-y-3"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-800">
                Lịch trình #{idx + 1}
              </h4>
              {data.schedules.length > 1 && (
                <button
                  onClick={() => removeSchedule(idx)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FormField
                label="Ngày khởi hành *"
                value={s.tourDate}
                onChange={(v) => updateSchedule(idx, "tourDate", v)}
                type="date"
              />
              <FormField
                label="Giá (₫/người) *"
                value={s.price}
                onChange={(v) => updateSchedule(idx, "price", v)}
                type="number"
              />
              <FormField
                label="Giờ bắt đầu"
                value={s.startTime}
                onChange={(v) => updateSchedule(idx, "startTime", v)}
                type="time"
              />
              <FormField
                label="Giờ kết thúc"
                value={s.endTime}
                onChange={(v) => updateSchedule(idx, "endTime", v)}
                type="time"
              />
              <FormField
                label="Số chỗ trống"
                value={s.availableSlots}
                onChange={(v) => updateSchedule(idx, "availableSlots", v)}
                type="number"
              />
              <FormField
                label="Điểm hẹn"
                value={s.meetingPoint}
                onChange={(v) => updateSchedule(idx, "meetingPoint", v)}
                placeholder="VD: Cổng chính"
              />
              <FormField
                label="ID Hướng dẫn viên (tùy chọn)"
                value={s.guideId}
                onChange={(v) => updateSchedule(idx, "guideId", v)}
                placeholder="GUIDE-..."
              />
            </div>
          </div>
        ))}
        <button
          onClick={addSchedule}
          className="flex items-center gap-2 text-sm text-primary hover:text-primary-hover font-medium"
        >
          <Plus className="w-4 h-4" /> Thêm lịch trình
        </button>
      </div>
    );

  if (step === 4)
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Mô tả các điểm dừng và hoạt động trong tour.
        </p>
        {data.itinerary.map((item, idx) => (
          <div
            key={idx}
            className="border border-gray-200 rounded-xl p-5 bg-gray-50 space-y-3"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-800">
                Điểm #{item.stepOrder}
              </h4>
              {data.itinerary.length > 1 && (
                <button
                  onClick={() => removeItinerary(idx)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FormField
                label="Địa điểm *"
                value={item.location}
                onChange={(v) => updateItinerary(idx, "location", v)}
                placeholder="VD: Ba Na Hills"
              />
              <FormField
                label="Thời gian (phút)"
                value={item.durationMinutes}
                onChange={(v) => updateItinerary(idx, "durationMinutes", v)}
                type="number"
              />
              <div className="md:col-span-2">
                <FormField
                  label="Hoạt động *"
                  value={item.activity}
                  onChange={(v) => updateItinerary(idx, "activity", v)}
                  placeholder="VD: Cáp treo và tham quan"
                />
              </div>
            </div>
            <FormTextarea
              label="Mô tả"
              value={item.description}
              onChange={(v) => updateItinerary(idx, "description", v)}
              placeholder="Chi tiết hoạt động..."
              rows={2}
            />
          </div>
        ))}
        <button
          onClick={addItinerary}
          className="flex items-center gap-2 text-sm text-primary hover:text-primary-hover font-medium"
        >
          <Plus className="w-4 h-4" /> Thêm điểm dừng
        </button>
      </div>
    );

  return null;
};

/* ═══════════════════════════════════════════
   CAR RENTAL STEPS
═══════════════════════════════════════════ */
const CAR_RENTAL_STEPS = [
  { id: 1, title: "Thông tin công ty", icon: Building2 },
  { id: 2, title: "Đội xe", icon: Car },
  { id: 3, title: "Giờ hoạt động", icon: Clock },
  { id: 4, title: "Xác nhận & Đăng", icon: CheckCircle },
];

const VEHICLE_TYPES = [
  { value: "sedan", label: "Sedan" },
  { value: "suv", label: "SUV" },
  { value: "van", label: "Van / Minibus" },
  { value: "motorbike", label: "Xe máy" },
];

const VEHICLE_FEATURES = [
  "Bảo hiểm", "Xăng", "Ghế trẻ em", "GPS", "Wi-Fi", "Điều hòa",
  "Lái xe riêng", "Hành lý thêm",
];

const CarRentalForm = ({
  step,
  data,
  update,
  updateVehicle,
  addVehicle,
  removeVehicle,
}) => {
  if (step === 1)
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Tên công ty / dịch vụ *"
            value={data.title}
            onChange={(v) => update("title", v)}
            placeholder="VD: Phu Quoc Car Rental"
            required
          />
          <FormField
            label="Số điện thoại"
            value={data.phoneNumber}
            onChange={(v) => update("phoneNumber", v)}
            placeholder="+84..."
          />
          <FormField
            label="Thành phố *"
            value={data.city}
            onChange={(v) => update("city", v)}
            placeholder="VD: Phú Quốc"
            required
          />
          <FormField
            label="Địa chỉ"
            value={data.address}
            onChange={(v) => update("address", v)}
            placeholder="Số nhà, đường..."
          />
        </div>
        <FormTextarea
          label="Mô tả"
          value={data.description}
          onChange={(v) => update("description", v)}
          placeholder="Giới thiệu về dịch vụ cho thuê xe của bạn..."
          rows={4}
        />
        <FormTextarea
          label="Chính sách hủy"
          value={data.cancellationPolicy}
          onChange={(v) => update("cancellationPolicy", v)}
          placeholder="VD: Hoàn tiền 100% nếu hủy trước 24 giờ..."
        />
        <ImageUpload
          storagePath="services/car-rental"
          urls={data.images}
          onChange={(urls) => update("images", urls)}
          label="Hình ảnh dịch vụ"
        />
      </div>
    );

  if (step === 2)
    return (
      <div className="space-y-4">
        {data.vehicles.map((v, idx) => (
          <div
            key={idx}
            className="border border-gray-200 rounded-xl p-5 bg-gray-50 space-y-3"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-800">Xe #{idx + 1}</h4>
              {data.vehicles.length > 1 && (
                <button
                  onClick={() => removeVehicle(idx)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FormField
                label="Hãng xe *"
                value={v.make}
                onChange={(val) => updateVehicle(idx, "make", val)}
                placeholder="VD: Toyota"
              />
              <FormField
                label="Dòng xe *"
                value={v.model}
                onChange={(val) => updateVehicle(idx, "model", val)}
                placeholder="VD: Fortuner"
              />
              <FormField
                label="Năm sản xuất"
                value={v.year}
                onChange={(val) => updateVehicle(idx, "year", val)}
                type="number"
                placeholder="VD: 2022"
              />
              <FormField
                label="Số chỗ ngồi *"
                value={v.capacity}
                onChange={(val) => updateVehicle(idx, "capacity", val)}
                type="number"
                placeholder="VD: 7"
              />
              <FormSelect
                label="Loại xe"
                value={v.vehicleType}
                onChange={(val) => updateVehicle(idx, "vehicleType", val)}
                options={VEHICLE_TYPES}
              />
              <FormSelect
                label="Hình thức tính giá"
                value={v.pricingModel}
                onChange={(val) => updateVehicle(idx, "pricingModel", val)}
                options={[
                  { value: "daily", label: "Theo ngày" },
                  { value: "hourly", label: "Theo giờ" },
                ]}
              />
              {v.pricingModel === "daily" && (
                <FormField
                  label="Giá theo ngày (₫) *"
                  value={v.dailyRate}
                  onChange={(val) => updateVehicle(idx, "dailyRate", val)}
                  type="number"
                  placeholder="VD: 800000"
                />
              )}
              {v.pricingModel === "hourly" && (
                <FormField
                  label="Giá theo giờ (₫) *"
                  value={v.hourlyRate}
                  onChange={(val) => updateVehicle(idx, "hourlyRate", val)}
                  type="number"
                  placeholder="VD: 120000"
                />
              )}
              <FormField
                label="Đặt cọc (₫)"
                value={v.depositAmount}
                onChange={(val) => updateVehicle(idx, "depositAmount", val)}
                type="number"
                placeholder="0"
              />
              <div>
                <label className="flex items-center gap-2 mt-5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={v.driverIncluded}
                    onChange={(e) =>
                      updateVehicle(idx, "driverIncluded", e.target.checked)
                    }
                    className="rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Có tài xế
                  </span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bao gồm
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {VEHICLE_FEATURES.map((feat) => (
                  <label key={feat} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={v.includedFeatures.includes(feat)}
                      onChange={(e) => {
                        const next = e.target.checked
                          ? [...v.includedFeatures, feat]
                          : v.includedFeatures.filter((x) => x !== feat);
                        updateVehicle(idx, "includedFeatures", next);
                      }}
                      className="rounded"
                    />
                    <span className="text-sm">{feat}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        ))}
        <button
          onClick={addVehicle}
          className="flex items-center gap-2 text-sm text-primary hover:text-primary-hover font-medium"
        >
          <Plus className="w-4 h-4" /> Thêm xe
        </button>
      </div>
    );

  if (step === 3)
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Cài đặt khung thời gian hoạt động. Sẽ áp dụng cho tất cả các xe trong đội.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Ngày bắt đầu *"
            value={data.availStartDate}
            onChange={(v) => update("availStartDate", v)}
            type="date"
          />
          <FormField
            label="Ngày kết thúc *"
            value={data.availEndDate}
            onChange={(v) => update("availEndDate", v)}
            type="date"
          />
          <FormField
            label="Giờ mở cửa"
            value={data.availableFrom}
            onChange={(v) => update("availableFrom", v)}
            type="time"
          />
          <FormField
            label="Giờ đóng cửa"
            value={data.availableTo}
            onChange={(v) => update("availableTo", v)}
            type="time"
          />
        </div>
      </div>
    );

  return null;
};

/* ═══════════════════════════════════════════
   CONFIRM PANEL
═══════════════════════════════════════════ */
const ConfirmPanel = ({
  serviceType,
  homestayData,
  tourData,
  carRentalData,
  publishError,
}) => {
  const summaryItems =
    serviceType === "homestay"
      ? [
          { label: "Tên homestay", value: homestayData.title || "—" },
          {
            label: "Địa chỉ",
            value:
              `${homestayData.address || ""}, ${homestayData.city || ""}`
                .trim()
                .replace(/^,\s*/, "") || "—",
          },
          { label: "Số loại phòng", value: homestayData.rooms.length },
          { label: "Nhận phòng", value: homestayData.checkInTime || "—" },
        ]
      : serviceType === "car-rental"
      ? [
          { label: "Tên công ty", value: carRentalData.title || "—" },
          { label: "Thành phố", value: carRentalData.city || "—" },
          { label: "Số xe trong đội", value: carRentalData.vehicles.length },
          {
            label: "Thời gian hoạt động",
            value:
              carRentalData.availStartDate && carRentalData.availEndDate
                ? `${carRentalData.availStartDate} → ${carRentalData.availEndDate}`
                : "—",
          },
        ]
      : [
          { label: "Tên tour", value: tourData.title || "—" },
          {
            label: "Thời lượng",
            value: tourData.durationHours
              ? `${tourData.durationHours} giờ`
              : "—",
          },
          { label: "Số lịch trình", value: tourData.schedules.length },
          { label: "Số điểm hành trình", value: tourData.itinerary.length },
        ];

  return (
    <div className="space-y-4">
      <div className="bg-green-50 border border-green-200 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <h3 className="font-semibold text-green-800">
            Sẵn sàng đăng dịch vụ
          </h3>
        </div>
        <div className="space-y-1.5 text-sm text-green-700">
          {summaryItems.map((item) => (
            <p key={item.label}>
              <span className="font-medium">{item.label}:</span> {item.value}
            </p>
          ))}
        </div>
      </div>
      <p className="text-sm text-gray-600">
        Sau khi đăng, dịch vụ sẽ được gửi đến quản lý để xét duyệt trước khi
        hiển thị công khai.
      </p>
      {publishError && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          {publishError}
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════
   STEP INDICATOR
═══════════════════════════════════════════ */
const StepIndicator = ({ steps, currentStep }) => (
  <div className="flex items-center mb-8 bg-white rounded-lg p-4 shadow-sm border border-gray-200">
    {steps.map((s, idx) => {
      const Icon = s.icon;
      const isActive = currentStep === s.id;
      const isDone = currentStep > s.id;
      return (
        <React.Fragment key={s.id}>
          <div className="flex flex-col items-center flex-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${isDone ? "bg-green-500 text-white" : isActive ? "bg-primary text-white" : "bg-gray-100 text-gray-400"}`}
            >
              {isDone ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <Icon className="w-5 h-5" />
              )}
            </div>
            <span
              className={`text-xs text-center hidden md:block ${isActive ? "text-primary font-medium" : "text-gray-400"}`}
            >
              {s.title}
            </span>
          </div>
          {idx < steps.length - 1 && (
            <div
              className={`h-0.5 flex-1 mx-1 ${currentStep > s.id ? "bg-green-400" : "bg-gray-200"}`}
            />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
const PartnerServiceRegistration = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [serviceType] = useState(location.state?.type || null);
  const [currentStep, setCurrentStep] = useState(1);
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState("");
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    if (!serviceType) navigate("/PartnerService", { replace: true });
  }, [serviceType, navigate]);

  useEffect(() => {
    serviceService
      .getDestinations()
      .then((data) =>
        setDestinations(
          Array.isArray(data) ? data : data.items || data.data || [],
        ),
      )
      .catch(() => setDestinations([]));
  }, []);

  /* --- Homestay state --- */
  const [homestayData, setHomestayData] = useState({
    title: "",
    description: "",
    locationName: "",
    address: "",
    city: "",
    district: "",
    ward: "",
    postalCode: "",
    latitude: "",
    longitude: "",
    phoneNumber: "",
    openingHours: "24/7",
    checkInTime: "14:00",
    checkOutTime: "12:00",
    cancellationPolicy: "",
    houseRules: "",
    availStartDate: "",
    availEndDate: "",
    availDefaultPrice: "",
    availMinNights: "1",
    images: [],
    rooms: [
      {
        roomName: "",
        roomDescription: "",
        bedType: "Queen",
        bedCount: 1,
        maxOccupancy: 2,
        roomSizeSqm: "",
        privateBathroom: true,
        basePrice: "",
        weekendPrice: "",
        holidayPrice: "",
        roomAmenities: [],
        numberOfRooms: 1,
      },
    ],
  });
  const updateHomestay = (f, v) => setHomestayData((p) => ({ ...p, [f]: v }));
  const updateHomestayRoom = (idx, f, v) => {
    const r = [...homestayData.rooms];
    r[idx] = { ...r[idx], [f]: v };
    setHomestayData((p) => ({ ...p, rooms: r }));
  };
  const addRoom = () =>
    setHomestayData((p) => ({
      ...p,
      rooms: [
        ...p.rooms,
        {
          roomName: "",
          roomDescription: "",
          bedType: "Queen",
          bedCount: 1,
          maxOccupancy: 2,
          roomSizeSqm: "",
          privateBathroom: true,
          basePrice: "",
          weekendPrice: "",
          holidayPrice: "",
          roomAmenities: [],
          numberOfRooms: 1,
        },
      ],
    }));
  const removeRoom = (idx) =>
    setHomestayData((p) => ({
      ...p,
      rooms: p.rooms.filter((_, i) => i !== idx),
    }));

  /* --- Tour state --- */
  const [tourData, setTourData] = useState({
    title: "",
    description: "",
    destinationId: "",
    tourType: "0",
    durationHours: "4",
    difficultyLevel: "0",
    minParticipants: "2",
    maxParticipants: "10",
    includes: [],
    excludes: [],
    whatToBring: "",
    fitnessRequirements: "",
    cancellationPolicy: "",
    ageRestrictions: "",
    images: [],
    schedules: [
      {
        tourDate: "",
        startTime: "08:00",
        endTime: "17:00",
        availableSlots: "20",
        guideId: "",
        meetingPoint: "",
        price: "",
      },
    ],
    itinerary: [
      {
        stepOrder: 1,
        location: "",
        activity: "",
        durationMinutes: "60",
        description: "",
      },
    ],
  });
  const updateTour = (f, v) => setTourData((p) => ({ ...p, [f]: v }));
  const updateSchedule = (idx, f, v) => {
    const s = [...tourData.schedules];
    s[idx] = { ...s[idx], [f]: v };
    setTourData((p) => ({ ...p, schedules: s }));
  };
  const addSchedule = () =>
    setTourData((p) => ({
      ...p,
      schedules: [
        ...p.schedules,
        {
          tourDate: "",
          startTime: "08:00",
          endTime: "17:00",
          availableSlots: "20",
          guideId: "",
          meetingPoint: "",
          price: "",
        },
      ],
    }));
  const removeSchedule = (idx) =>
    setTourData((p) => ({
      ...p,
      schedules: p.schedules.filter((_, i) => i !== idx),
    }));
  const updateItinerary = (idx, f, v) => {
    const it = [...tourData.itinerary];
    it[idx] = { ...it[idx], [f]: v };
    setTourData((p) => ({ ...p, itinerary: it }));
  };
  const addItinerary = () =>
    setTourData((p) => ({
      ...p,
      itinerary: [
        ...p.itinerary,
        {
          stepOrder: p.itinerary.length + 1,
          location: "",
          activity: "",
          durationMinutes: "60",
          description: "",
        },
      ],
    }));
  const removeItinerary = (idx) =>
    setTourData((p) => ({
      ...p,
      itinerary: p.itinerary
        .filter((_, i) => i !== idx)
        .map((item, i) => ({ ...item, stepOrder: i + 1 })),
    }));

  /* --- Car Rental state --- */
  const blankVehicle = () => ({
    make: "",
    model: "",
    year: "",
    vehicleType: "sedan",
    capacity: "4",
    pricingModel: "daily",
    dailyRate: "",
    hourlyRate: "",
    driverIncluded: false,
    depositAmount: "0",
    includedFeatures: [],
  });
  const [carRentalData, setCarRentalData] = useState({
    title: "",
    city: "",
    address: "",
    phoneNumber: "",
    description: "",
    cancellationPolicy: "",
    availStartDate: "",
    availEndDate: "",
    availableFrom: "08:00",
    availableTo: "20:00",
    vehicles: [blankVehicle()],
    images: [],
  });
  const updateCarRental = (f, v) => setCarRentalData((p) => ({ ...p, [f]: v }));
  const updateCarRentalVehicle = (idx, f, v) => {
    const vs = [...carRentalData.vehicles];
    vs[idx] = { ...vs[idx], [f]: v };
    setCarRentalData((p) => ({ ...p, vehicles: vs }));
  };
  const addCarRentalVehicle = () =>
    setCarRentalData((p) => ({ ...p, vehicles: [...p.vehicles, blankVehicle()] }));
  const removeCarRentalVehicle = (idx) =>
    setCarRentalData((p) => ({
      ...p,
      vehicles: p.vehicles.filter((_, i) => i !== idx),
    }));

  /* --- Publish --- */
  const handlePublish = async () => {
    setPublishing(true);
    setPublishError("");
    try {
      if (serviceType === "tour") {
        const result = await serviceService.createPartnerService({
          destinationId: tourData.destinationId || undefined,
          serviceType: 1,
          title: tourData.title,
          description: tourData.description,
          platformFeeAmount: 0,
          tourDetails: {
            tourType: Number(tourData.tourType),
            durationHours: Number(tourData.durationHours),
            difficultyLevel: Number(tourData.difficultyLevel),
            minParticipants: Number(tourData.minParticipants),
            maxParticipants: Number(tourData.maxParticipants),
            includes: tourData.includes,
            excludes: tourData.excludes,
            whatToBring: tourData.whatToBring,
            cancellationPolicy: tourData.cancellationPolicy,
            ageRestrictions: tourData.ageRestrictions,
            fitnessRequirements: tourData.fitnessRequirements,
          },
        });
        const tourServiceId = result.serviceId || result.id;
        if (tourServiceId && tourData.images.length > 0) {
          await serviceService.addServiceImages(tourServiceId, tourData.images);
        }
        const tourId = result.tourId || result.id;
        if (tourId) {
          for (const s of tourData.schedules) {
            if (!s.tourDate || !s.price) continue;
            await serviceService.addTourSchedule(tourId, {
              tourDate: s.tourDate,
              startTime: s.startTime || "08:00",
              endTime: s.endTime || "17:00",
              availableSlots: Number(s.availableSlots) || 0,
              guideId: s.guideId || undefined,
              meetingPoint: s.meetingPoint || undefined,
              isActive: true,
              price: Number(s.price),
            });
          }
          for (const item of tourData.itinerary) {
            if (!item.location || !item.activity) continue;
            await serviceService.addTourItinerary(tourId, {
              stepOrder: item.stepOrder,
              location: item.location,
              activity: item.activity,
              durationMinutes: Number(item.durationMinutes) || 60,
              description: item.description,
            });
          }
        }
      } else if (serviceType === "homestay") {
        const hs = await serviceService.createHomestay({
          title: homestayData.title,
          description: homestayData.description,
          location: {
            name: homestayData.title,
            address: homestayData.address,
            city: homestayData.city,
            district: homestayData.district,
            ward: homestayData.ward,
            postalCode: homestayData.postalCode,
            latitude: Number(homestayData.latitude) || 0,
            longitude: Number(homestayData.longitude) || 0,
            phoneNumber: homestayData.phoneNumber,
            openingHours: homestayData.openingHours,
          },
          checkInTime: homestayData.checkInTime,
          checkOutTime: homestayData.checkOutTime,
          cancellationPolicy: homestayData.cancellationPolicy || undefined,
          houseRules: homestayData.houseRules || undefined,
        });
        const homestayId = hs.homestayId || hs.id || hs.serviceId;

        const roomIds = [];
        for (const room of homestayData.rooms) {
          if (!room.roomName || !room.basePrice) continue;
          const rr = await serviceService.addHomestayRoom(homestayId, {
            roomName: room.roomName,
            roomDescription: room.roomDescription,
            maxOccupancy: Number(room.maxOccupancy) || 2,
            roomSizeSqm: Number(room.roomSizeSqm) || 0,
            bedType: room.bedType,
            bedCount: Number(room.bedCount) || 1,
            privateBathroom: room.privateBathroom,
            basePrice: Number(room.basePrice),
            weekendPrice: Number(room.weekendPrice) || Number(room.basePrice),
            holidayPrice:
              Number(room.holidayPrice) ||
              Number(room.weekendPrice) ||
              Number(room.basePrice),
            roomAmenities: room.roomAmenities,
            numberOfRooms: Number(room.numberOfRooms) || 1,
          });
          if (rr.roomId || rr.id) roomIds.push(rr.roomId || rr.id);
        }

        if (
          homestayData.availStartDate &&
          homestayData.availEndDate &&
          roomIds.length > 0
        ) {
          await serviceService.bulkHomestayAvailability(homestayId, {
            startDate: homestayData.availStartDate,
            endDate: homestayData.availEndDate,
            rooms: roomIds.map((roomId) => ({
              roomId,
              defaultPrice: Number(homestayData.availDefaultPrice) || 0,
              minNights: Number(homestayData.availMinNights) || 1,
            })),
            applyToAllDates: true,
          });
        }

        if (homestayData.images.length > 0) {
          await serviceService.addServiceImages(homestayId, homestayData.images);
        }
        await serviceService.submitHomestay(homestayId);
      } else if (serviceType === "car-rental") {
        if (carRentalData.vehicles.length === 0) {
          setPublishError("Vui lòng thêm ít nhất một xe.");
          return;
        }

        // 1. Create the service (company) record — use explicit string type so DB CHECK passes
        const svc = await serviceService.createService({
          serviceType: 'car_rental',
          title: carRentalData.title,
          city: carRentalData.city,
          address: carRentalData.address || undefined,
          description: carRentalData.description || undefined,
          cancellationPolicy: carRentalData.cancellationPolicy || undefined,
        });
        const serviceId = svc.data?.serviceId || svc.serviceId || svc.id;

        // 2. Add each vehicle and set its availability window
        for (const v of carRentalData.vehicles) {
          if (!v.make || !v.model || !v.capacity) continue;
          const vr = await serviceService.createVehicle({
            serviceId,
            make: v.make,
            model: v.model,
            year: v.year ? Number(v.year) : undefined,
            vehicleType: v.vehicleType,
            capacity: Number(v.capacity),
            pricingModel: v.pricingModel,
            dailyRate: v.pricingModel === "daily" && v.dailyRate ? Number(v.dailyRate) : undefined,
            hourlyRate: v.pricingModel === "hourly" && v.hourlyRate ? Number(v.hourlyRate) : undefined,
            driverIncluded: v.driverIncluded,
            depositAmount: Number(v.depositAmount) || 0,
            includedFeatures: v.includedFeatures,
          });
          const vehicleId = vr.data?.vehicleId || vr.vehicleId || vr.id;

          if (vehicleId && carRentalData.availStartDate && carRentalData.availEndDate) {
            await serviceService.bulkVehicleAvailability(vehicleId, {
              startDate: carRentalData.availStartDate,
              endDate: carRentalData.availEndDate,
              availableFrom: carRentalData.availableFrom,
              availableTo: carRentalData.availableTo,
            });
          }
        }

        // 3. Save images if any were uploaded
        if (carRentalData.images.length > 0) {
          await serviceService.addServiceImages(serviceId, carRentalData.images);
        }

        // 4. Submit for manager review
        await serviceService.submitCarRentalService(serviceId);
      }

      navigate("/PartnerService", {
        state: { message: "Dịch vụ đã được gửi để xét duyệt!" },
      });
    } catch (err) {
      setPublishError(
        err.message || "Đăng dịch vụ thất bại. Vui lòng thử lại.",
      );
    } finally {
      setPublishing(false);
    }
  };

  if (!serviceType) return null;

  const steps =
    serviceType === "homestay"
      ? HOMESTAY_STEPS
      : serviceType === "car-rental"
      ? CAR_RENTAL_STEPS
      : TOUR_STEPS;
  const isLastStep = currentStep === steps.length;
  const typeLabel =
    serviceType === "homestay"
      ? "Homestay"
      : serviceType === "car-rental"
      ? "Cho thuê xe"
      : "Tour";

  return (
    <div className="min-h-screen bg-bg-light p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => {
              if (currentStep === 1) navigate("/PartnerService");
              else setCurrentStep((s) => s - 1);
            }}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Đăng ký dịch vụ mới
            </h1>
            <p className="text-gray-500 text-sm">
              {typeLabel} — Bước {currentStep}/{steps.length}
            </p>
          </div>
        </div>

        <StepIndicator steps={steps} currentStep={currentStep} />

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {isLastStep ? (
            <ConfirmPanel
              serviceType={serviceType}
              homestayData={homestayData}
              tourData={tourData}
              carRentalData={carRentalData}
              publishError={publishError}
            />
          ) : serviceType === "homestay" ? (
            <HomestayForm
              step={currentStep}
              data={homestayData}
              update={updateHomestay}
              updateRoom={updateHomestayRoom}
              addRoom={addRoom}
              removeRoom={removeRoom}
            />
          ) : serviceType === "car-rental" ? (
            <CarRentalForm
              step={currentStep}
              data={carRentalData}
              update={updateCarRental}
              updateVehicle={updateCarRentalVehicle}
              addVehicle={addCarRentalVehicle}
              removeVehicle={removeCarRentalVehicle}
            />
          ) : (
            <TourForm
              step={currentStep}
              data={tourData}
              update={updateTour}
              updateSchedule={updateSchedule}
              addSchedule={addSchedule}
              removeSchedule={removeSchedule}
              updateItinerary={updateItinerary}
              addItinerary={addItinerary}
              removeItinerary={removeItinerary}
              destinations={destinations}
            />
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => {
              if (currentStep === 1) navigate("/PartnerService");
              else setCurrentStep((s) => s - 1);
            }}
            className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4" />
            {currentStep === 1 ? "Hủy" : "Quay lại"}
          </button>

          {isLastStep ? (
            <button
              onClick={handlePublish}
              disabled={publishing}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-hover font-medium disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {publishing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              {publishing ? "Đang đăng..." : "Đăng dịch vụ"}
            </button>
          ) : (
            <button
              onClick={() => setCurrentStep((s) => s + 1)}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-hover"
            >
              Tiếp theo
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PartnerServiceRegistration;
