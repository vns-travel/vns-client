import React, { useState, useEffect } from "react";
import {
  Home,
  MapPin,
  Camera,
  FileText,
  Bed,
  Car,
  List,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
  DollarSign,
  Users,
  Clock,
  Package,
  HandPlatter,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

/* ═══════════════════════════════════════════
   RENTAL STEPS
═══════════════════════════════════════════ */
const RENTAL_STEPS = [
  { id: 1, title: "Thông tin cơ bản", icon: Home },
  { id: 2, title: "Hình ảnh & Tiện nghi", icon: Camera },
  { id: 3, title: "Chính sách", icon: FileText },
  { id: 4, title: "Loại phòng", icon: Bed },
  { id: 5, title: "Xác nhận & Đăng", icon: CheckCircle },
];

const RENTAL_AMENITIES = [
  "WiFi miễn phí",
  "Điều hòa",
  "Nhà bếp",
  "Hồ bơi",
  "Bãi đỗ xe",
  "Thang máy",
  "Gym",
  "Lễ tân 24/7",
  "View biển",
  "Lò sưởi",
  "BBQ",
  "Vườn",
];

const RentalForm = ({
  step,
  formData,
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
            label="Tên cơ sở lưu trú *"
            value={formData.propertyName}
            onChange={(v) => update("propertyName", v)}
            placeholder="VD: Oceanview Deluxe Homestay"
          />
          <FormField
            label="Thành phố *"
            value={formData.city}
            onChange={(v) => update("city", v)}
            placeholder="VD: TP. Hồ Chí Minh"
          />
          <FormField
            label="Quận / Huyện"
            value={formData.district}
            onChange={(v) => update("district", v)}
            placeholder="VD: Quận 1"
          />
          <FormField
            label="Địa chỉ *"
            value={formData.address}
            onChange={(v) => update("address", v)}
            placeholder="Số nhà, đường..."
          />
          <FormField
            label="Giờ nhận phòng"
            value={formData.checkInTime}
            onChange={(v) => update("checkInTime", v)}
            type="time"
          />
          <FormField
            label="Giờ trả phòng"
            value={formData.checkOutTime}
            onChange={(v) => update("checkOutTime", v)}
            type="time"
          />
        </div>
        <FormTextarea
          label="Mô tả"
          value={formData.description}
          onChange={(v) => update("description", v)}
          placeholder="Mô tả ngắn về cơ sở lưu trú..."
        />
      </div>
    );

  if (step === 2)
    return (
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hình ảnh
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center text-gray-500 text-sm">
            <Camera className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            Kéo thả hoặc nhấn để tải lên hình ảnh
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Tiện nghi
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {RENTAL_AMENITIES.map((a) => (
              <label key={a} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.amenities.includes(a)}
                  onChange={(e) => {
                    const next = e.target.checked
                      ? [...formData.amenities, a]
                      : formData.amenities.filter((x) => x !== a);
                    update("amenities", next);
                  }}
                  className="rounded"
                />
                <span className="text-sm">{a}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    );

  if (step === 3)
    return (
      <div className="space-y-4">
        <FormTextarea
          label="Nội quy nhà"
          value={formData.houseRules}
          onChange={(v) => update("houseRules", v)}
          placeholder="Quy định về hút thuốc, thú cưng, tiệc tùng..."
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chính sách hủy phòng
          </label>
          <select
            value={formData.cancellationPolicy}
            onChange={(e) => update("cancellationPolicy", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <option value="">Chọn chính sách</option>
            <option value="flexible">Linh hoạt – Hoàn tiền 24h trước</option>
            <option value="moderate">Vừa phải – Hoàn tiền 5 ngày trước</option>
            <option value="strict">Nghiêm ngặt – Không hoàn tiền</option>
          </select>
        </div>
      </div>
    );

  if (step === 4)
    return (
      <div className="space-y-4">
        {formData.roomTypes.map((room, idx) => (
          <div
            key={idx}
            className="border border-gray-200 rounded-xl p-5 bg-gray-50 space-y-3"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-800">
                Loại phòng #{idx + 1}
              </h4>
              {formData.roomTypes.length > 1 && (
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
                label="Tên loại phòng *"
                value={room.roomName}
                onChange={(v) => updateRoom(idx, "roomName", v)}
                placeholder="VD: Phòng Deluxe"
              />
              <FormField
                label="Loại giường"
                value={room.bedType}
                onChange={(v) => updateRoom(idx, "bedType", v)}
                placeholder="VD: King Bed"
              />
              <FormField
                label="Giá cơ bản (₫/đêm)"
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
                label="Số khách tối đa"
                value={room.maxOccupancy}
                onChange={(v) => updateRoom(idx, "maxOccupancy", v)}
                type="number"
              />
              <FormField
                label="Số phòng loại này"
                value={room.numberOfRooms}
                onChange={(v) => updateRoom(idx, "numberOfRooms", v)}
                type="number"
              />
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

  return null;
};

/* ═══════════════════════════════════════════
   TOUR STEPS
═══════════════════════════════════════════ */
const TOUR_STEPS = [
  { id: 1, title: "Thông tin tour", icon: HandPlatter },
  { id: 2, title: "Địa điểm", icon: MapPin },
  { id: 3, title: "Số lượng & Điều kiện", icon: Users },
  { id: 4, title: "Bao gồm / Không bao gồm", icon: List },
  { id: 5, title: "Định giá", icon: DollarSign },
  { id: 6, title: "Hình ảnh", icon: Camera },
  { id: 7, title: "Xác nhận & Đăng", icon: CheckCircle },
];

const TourForm = ({
  step,
  formData,
  update,
  updateItinerary,
  addItinerary,
  removeItinerary,
}) => {
  if (step === 1)
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loại tour
            </label>
            <select
              value={formData.tourType}
              onChange={(e) => update("tourType", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="cultural">Văn hóa</option>
              <option value="food">Ẩm thực</option>
              <option value="adventure">Phiêu lưu</option>
              <option value="nature">Thiên nhiên</option>
              <option value="city">Thành phố</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Độ khó
            </label>
            <select
              value={formData.difficultyLevel}
              onChange={(e) => update("difficultyLevel", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="easy">Dễ</option>
              <option value="moderate">Vừa</option>
              <option value="hard">Khó</option>
            </select>
          </div>
          <FormField
            label="Tên tour *"
            value={formData.tourTitle}
            onChange={(v) => update("tourTitle", v)}
            placeholder="VD: Tour Ẩm Thực Phố Cổ Hà Nội"
          />
          <FormField
            label="Thời lượng (giờ)"
            value={formData.durationHours}
            onChange={(v) => update("durationHours", v)}
            type="number"
          />
        </div>
        <FormTextarea
          label="Mô tả ngắn"
          value={formData.shortDescription}
          onChange={(v) => update("shortDescription", v)}
          placeholder="Giới thiệu ngắn về tour..."
        />
      </div>
    );

  if (step === 2)
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Tên địa điểm *"
            value={formData.locationName}
            onChange={(v) => update("locationName", v)}
            placeholder="VD: Nhà Hát Lớn Hà Nội"
          />
          <FormField
            label="Thành phố"
            value={formData.city}
            onChange={(v) => update("city", v)}
            placeholder="VD: Hà Nội"
          />
          <FormField
            label="Quận / Huyện"
            value={formData.district}
            onChange={(v) => update("district", v)}
            placeholder="VD: Hoàn Kiếm"
          />
          <FormField
            label="Điểm hẹn"
            value={formData.meetingPoint}
            onChange={(v) => update("meetingPoint", v)}
            placeholder="VD: Cổng chính"
          />
        </div>
        <FormField
          label="Địa chỉ"
          value={formData.address}
          onChange={(v) => update("address", v)}
          placeholder="Số nhà, đường..."
        />
      </div>
    );

  if (step === 3)
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Số người tối thiểu"
            value={formData.minParticipants}
            onChange={(v) => update("minParticipants", v)}
            type="number"
          />
          <FormField
            label="Số người tối đa"
            value={formData.maxParticipants}
            onChange={(v) => update("maxParticipants", v)}
            type="number"
          />
        </div>
        <FormTextarea
          label="Giới hạn độ tuổi / Điều kiện tham gia"
          value={formData.ageRestrictions}
          onChange={(v) => update("ageRestrictions", v)}
          placeholder="VD: Phù hợp trẻ em từ 6 tuổi..."
        />
        <FormTextarea
          label="Cần mang theo"
          value={formData.whatToBring}
          onChange={(v) => update("whatToBring", v)}
          placeholder="VD: Kem chống nắng, mũ, máy ảnh..."
        />
      </div>
    );

  if (step === 4)
    return (
      <div className="space-y-5">
        <TagInput
          label="Bao gồm"
          tags={formData.includes}
          onChange={(v) => update("includes", v)}
          placeholder="Nhập và nhấn Enter..."
        />
        <TagInput
          label="Không bao gồm"
          tags={formData.excludes}
          onChange={(v) => update("excludes", v)}
          placeholder="Nhập và nhấn Enter..."
        />
      </div>
    );

  if (step === 5)
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            label="Giá người lớn (₫)"
            value={formData.pricePerAdult}
            onChange={(v) => update("pricePerAdult", v)}
            type="number"
          />
          <FormField
            label="Giá trẻ em (₫)"
            value={formData.pricePerChild}
            onChange={(v) => update("pricePerChild", v)}
            type="number"
          />
          <FormField
            label="Giá em bé (₫)"
            value={formData.pricePerInfant}
            onChange={(v) => update("pricePerInfant", v)}
            type="number"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Chính sách hủy
          </label>
          <select
            value={formData.cancellationPolicy}
            onChange={(e) => update("cancellationPolicy", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <option value="flexible">Linh hoạt</option>
            <option value="moderate">Vừa phải</option>
            <option value="strict">Nghiêm ngặt</option>
          </select>
        </div>
      </div>
    );

  if (step === 6)
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Hình ảnh tour
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center text-gray-500 text-sm">
          <Camera className="w-8 h-8 mx-auto mb-2 text-gray-300" />
          Kéo thả hoặc nhấn để tải lên hình ảnh
        </div>
      </div>
    );

  return null;
};

/* ═══════════════════════════════════════════
   CAR RENTAL STEPS
═══════════════════════════════════════════ */
const CAR_STEPS = [
  { id: 1, title: "Định nghĩa Depot", icon: MapPin },
  { id: 2, title: "Mẫu xe (Hạng xe)", icon: Car },
  { id: 3, title: "Phân bổ kho xe", icon: Package },
  { id: 4, title: "Xác nhận & Đăng", icon: CheckCircle },
];

const CarForm = ({ step, formData, update }) => {
  const addDepot = () => {
    const id = Date.now();
    update("depots", [
      ...formData.depots,
      {
        id,
        name: "",
        address: "",
        contact: "",
        openingHours: "08:00 - 20:00",
        isPrimary: false,
      },
    ]);
  };
  const removeDepot = (id) =>
    update(
      "depots",
      formData.depots.filter((d) => d.id !== id),
    );
  const updateDepot = (id, field, val) =>
    update(
      "depots",
      formData.depots.map((d) => (d.id === id ? { ...d, [field]: val } : d)),
    );

  const addFleet = () => {
    const id = Date.now();
    update("fleetTemplates", [
      ...formData.fleetTemplates,
      {
        id,
        brand: "",
        model: "",
        year: 2026,
        category: "Economy",
        seats: 5,
        transmissionType: "automatic",
        fuelType: "petrol",
        features: [],
        basePricePerDay: 0,
        minRentalHours: 4,
        maxRentalDays: 30,
        fuelPolicy: "Full-to-Full",
        lateReturnFeePerHour: 0,
        cleaningFee: 0,
        smokingPenalty: 0,
      },
    ]);
  };
  const removeFleet = (id) =>
    update(
      "fleetTemplates",
      formData.fleetTemplates.filter((t) => t.id !== id),
    );
  const updateFleet = (id, field, val) =>
    update(
      "fleetTemplates",
      formData.fleetTemplates.map((t) =>
        t.id === id ? { ...t, [field]: val } : t,
      ),
    );

  const updateInventory = (depotId, templateId, qty) => {
    const filtered = formData.depotInventories.filter(
      (i) => !(i.depotId === depotId && i.templateId === templateId),
    );
    if (qty > 0)
      update("depotInventories", [
        ...filtered,
        { depotId, templateId, quantity: qty },
      ]);
    else update("depotInventories", filtered);
  };
  const getQty = (depotId, templateId) =>
    formData.depotInventories.find(
      (i) => i.depotId === depotId && i.templateId === templateId,
    )?.quantity || 0;

  if (step === 1)
    return (
      <div className="space-y-4">
        {formData.depots.map((depot) => (
          <div
            key={depot.id}
            className="border border-gray-200 rounded-xl p-5 bg-gray-50 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-gray-800">Depot</h4>
                {depot.isPrimary && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    Chính
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={depot.isPrimary}
                    onChange={(e) =>
                      updateDepot(depot.id, "isPrimary", e.target.checked)
                    }
                    className="rounded"
                  />
                  Depot chính
                </label>
                {formData.depots.length > 1 && (
                  <button
                    onClick={() => removeDepot(depot.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FormField
                label="Tên Depot *"
                value={depot.name}
                onChange={(v) => updateDepot(depot.id, "name", v)}
                placeholder="VD: Sân bay Tân Sơn Nhất"
              />
              <FormField
                label="Giờ hoạt động"
                value={depot.openingHours}
                onChange={(v) => updateDepot(depot.id, "openingHours", v)}
                placeholder="VD: 08:00 - 20:00"
              />
              <FormField
                label="Địa chỉ *"
                value={depot.address}
                onChange={(v) => updateDepot(depot.id, "address", v)}
                placeholder="Địa chỉ đầy đủ"
              />
              <FormField
                label="Số điện thoại"
                value={depot.contact}
                onChange={(v) => updateDepot(depot.id, "contact", v)}
                placeholder="+84..."
              />
            </div>
          </div>
        ))}
        <button
          onClick={addDepot}
          className="flex items-center gap-2 text-sm text-primary hover:text-primary-hover font-medium"
        >
          <Plus className="w-4 h-4" /> Thêm Depot
        </button>
      </div>
    );

  if (step === 2)
    return (
      <div className="space-y-4">
        {formData.fleetTemplates.map((tmpl) => (
          <div
            key={tmpl.id}
            className="border border-gray-200 rounded-xl p-5 bg-gray-50 space-y-3"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-800">Hạng xe</h4>
              {formData.fleetTemplates.length > 1 && (
                <button
                  onClick={() => removeFleet(tmpl.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <FormField
                label="Hãng xe"
                value={tmpl.brand}
                onChange={(v) => updateFleet(tmpl.id, "brand", v)}
                placeholder="VD: Toyota"
              />
              <FormField
                label="Mẫu xe"
                value={tmpl.model}
                onChange={(v) => updateFleet(tmpl.id, "model", v)}
                placeholder="VD: Vios"
              />
              <FormField
                label="Năm sản xuất"
                value={tmpl.year}
                onChange={(v) => updateFleet(tmpl.id, "year", v)}
                type="number"
              />
              <FormField
                label="Số chỗ ngồi"
                value={tmpl.seats}
                onChange={(v) => updateFleet(tmpl.id, "seats", v)}
                type="number"
              />
              <FormField
                label="Giá/ngày (₫)"
                value={tmpl.basePricePerDay}
                onChange={(v) => updateFleet(tmpl.id, "basePricePerDay", v)}
                type="number"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phân loại
                </label>
                <select
                  value={tmpl.category}
                  onChange={(e) =>
                    updateFleet(tmpl.id, "category", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="Economy">Economy</option>
                  <option value="Compact">Compact</option>
                  <option value="SUV">SUV</option>
                  <option value="Luxury">Luxury</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hộp số
                </label>
                <select
                  value={tmpl.transmissionType}
                  onChange={(e) =>
                    updateFleet(tmpl.id, "transmissionType", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="automatic">Tự động</option>
                  <option value="manual">Số sàn</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nhiên liệu
                </label>
                <select
                  value={tmpl.fuelType}
                  onChange={(e) =>
                    updateFleet(tmpl.id, "fuelType", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="petrol">Xăng</option>
                  <option value="diesel">Dầu</option>
                  <option value="electric">Điện</option>
                </select>
              </div>
            </div>
          </div>
        ))}
        <button
          onClick={addFleet}
          className="flex items-center gap-2 text-sm text-primary hover:text-primary-hover font-medium"
        >
          <Plus className="w-4 h-4" /> Thêm hạng xe
        </button>
      </div>
    );

  if (step === 3)
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Nhập số lượng xe cho từng hạng tại mỗi Depot.
        </p>
        {formData.depots.map((depot) => (
          <div
            key={depot.id}
            className="border border-gray-200 rounded-xl p-5 bg-gray-50"
          >
            <h4 className="font-medium text-gray-800 mb-3">
              {depot.name || "Depot chưa đặt tên"}
            </h4>
            <div className="space-y-2">
              {formData.fleetTemplates.map((tmpl) => (
                <div
                  key={tmpl.id}
                  className="flex items-center justify-between bg-white border border-gray-100 rounded-lg px-4 py-2"
                >
                  <span className="text-sm text-gray-700">
                    {tmpl.brand} {tmpl.model} ({tmpl.category})
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={getQty(depot.id, tmpl.id)}
                    onChange={(e) =>
                      updateInventory(
                        depot.id,
                        tmpl.id,
                        parseInt(e.target.value) || 0,
                      )
                    }
                    className="w-20 border border-gray-300 rounded-lg px-2 py-1 text-sm text-center focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="0"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );

  return null;
};

/* ═══════════════════════════════════════════
   SHARED COMPONENTS
═══════════════════════════════════════════ */
const FormField = ({ label, value, onChange, type = "text", placeholder }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
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

const FormTextarea = ({ label, value, onChange, placeholder }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={3}
      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary resize-none"
    />
  </div>
);

const TagInput = ({ label, tags, onChange, placeholder }) => {
  const [input, setInput] = useState("");
  const addTag = () => {
    if (input.trim() && !tags.includes(input.trim())) {
      onChange([...tags, input.trim()]);
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

/* ═══════════════════════════════════════════
   CONFIRM PANEL
═══════════════════════════════════════════ */
const ConfirmPanel = ({ serviceType, formData }) => {
  const typeLabel = { rental: "Cho thuê", tour: "Tour", car: "Thuê xe" }[
    serviceType
  ];
  const title =
    formData.propertyName ||
    formData.tourTitle ||
    formData.depots?.[0]?.name ||
    "Chưa đặt tên";
  const location = formData.city || formData.locationName || "Chưa có địa chỉ";

  return (
    <div className="space-y-4">
      <div className="bg-green-50 border border-green-200 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <h3 className="font-semibold text-green-800">
            Sẵn sàng đăng dịch vụ
          </h3>
        </div>
        <div className="space-y-1 text-sm text-green-700">
          <p>
            <span className="font-medium">Loại dịch vụ:</span> {typeLabel}
          </p>
          <p>
            <span className="font-medium">Tên:</span> {title}
          </p>
          <p>
            <span className="font-medium">Địa điểm:</span> {location}
          </p>
          {serviceType === "rental" && (
            <p>
              <span className="font-medium">Số loại phòng:</span>{" "}
              {formData.roomTypes?.length}
            </p>
          )}
          {serviceType === "tour" && (
            <p>
              <span className="font-medium">Thời lượng:</span>{" "}
              {formData.durationHours} giờ
            </p>
          )}
          {serviceType === "car" && (
            <p>
              <span className="font-medium">Số depot:</span>{" "}
              {formData.depots?.length} | Hạng xe:{" "}
              {formData.fleetTemplates?.length}
            </p>
          )}
        </div>
      </div>
      <p className="text-sm text-gray-600">
        Sau khi đăng, dịch vụ sẽ được gửi đến quản lý để xét duyệt trước khi
        hiển thị công khai.
      </p>
    </div>
  );
};

/* MAIN COMPONENT*/
const PartnerServiceRegistration = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [serviceType] = useState(location.state?.type || null);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    if (!serviceType) navigate("/PartnerService", { replace: true });
  }, [serviceType, navigate]);

  // Rental data
  const [rentalData, setRentalData] = useState({
    propertyName: "",
    description: "",
    address: "",
    city: "",
    district: "",
    ward: "",
    checkInTime: "14:00",
    checkOutTime: "11:00",
    cancellationPolicy: "",
    houseRules: "",
    images: [],
    amenities: [],
    roomTypes: [
      {
        roomName: "",
        bedType: "Queen Bed",
        maxOccupancy: 2,
        basePrice: 0,
        weekendPrice: 0,
        numberOfRooms: 1,
      },
    ],
  });

  // Tour data
  const [tourData, setTourData] = useState({
    tourType: "cultural",
    tourTitle: "",
    shortDescription: "",
    durationHours: 4,
    difficultyLevel: "easy",
    locationName: "",
    address: "",
    city: "",
    district: "",
    meetingPoint: "",
    minParticipants: 2,
    maxParticipants: 10,
    ageRestrictions: "",
    whatToBring: "",
    includes: [],
    excludes: [],
    pricePerAdult: "",
    pricePerChild: "",
    pricePerInfant: "0",
    cancellationPolicy: "flexible",
    images: [],
    itinerary: [{ id: 1, time: "", title: "", description: "" }],
  });

  // Car data
  const [carData, setCarData] = useState({
    depots: [
      {
        id: 1,
        name: "",
        address: "",
        contact: "",
        openingHours: "08:00 - 20:00",
        isPrimary: true,
      },
    ],
    fleetTemplates: [
      {
        id: 1,
        brand: "Toyota",
        model: "Vios",
        year: 2026,
        category: "Economy",
        seats: 5,
        transmissionType: "automatic",
        fuelType: "petrol",
        basePricePerDay: 800000,
        features: [],
        minRentalHours: 4,
        maxRentalDays: 30,
        fuelPolicy: "Full-to-Full",
        lateReturnFeePerHour: 0,
        cleaningFee: 0,
        smokingPenalty: 0,
      },
    ],
    depotInventories: [],
  });

  const steps =
    serviceType === "rental"
      ? RENTAL_STEPS
      : serviceType === "tour"
        ? TOUR_STEPS
        : serviceType === "car"
          ? CAR_STEPS
          : [];
  const isLastStep = currentStep === steps.length;

  const updateRental = (f, v) => setRentalData((p) => ({ ...p, [f]: v }));
  const updateRentalRoom = (idx, f, v) => {
    const r = [...rentalData.roomTypes];
    r[idx] = { ...r[idx], [f]: v };
    setRentalData((p) => ({ ...p, roomTypes: r }));
  };
  const addRoom = () =>
    setRentalData((p) => ({
      ...p,
      roomTypes: [
        ...p.roomTypes,
        {
          roomName: "",
          bedType: "Queen Bed",
          maxOccupancy: 2,
          basePrice: 0,
          weekendPrice: 0,
          numberOfRooms: 1,
        },
      ],
    }));
  const removeRoom = (idx) =>
    setRentalData((p) => ({
      ...p,
      roomTypes: p.roomTypes.filter((_, i) => i !== idx),
    }));

  const updateTour = (f, v) => setTourData((p) => ({ ...p, [f]: v }));
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
        { id: Date.now(), time: "", title: "", description: "" },
      ],
    }));
  const removeItinerary = (idx) =>
    setTourData((p) => ({
      ...p,
      itinerary: p.itinerary.filter((_, i) => i !== idx),
    }));

  const updateCar = (f, v) => setCarData((p) => ({ ...p, [f]: v }));

  const handlePublish = () => {
    alert("Dịch vụ đã được gửi để xét duyệt!");
    navigate("/PartnerService");
  };

  if (!serviceType) return null;

  const formData =
    serviceType === "rental"
      ? rentalData
      : serviceType === "tour"
        ? tourData
        : carData;
  const currentStepObj = steps[currentStep - 1];
  const typeLabel = { rental: "Cho thuê", tour: "Tour", car: "Thuê xe" }[
    serviceType
  ];

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

        {/* Step Indicator */}
        <div className="flex items-center mb-8 bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            const isActive = currentStep === s.id;
            const isDone = currentStep > s.id;
            return (
              <React.Fragment key={s.id}>
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${
                      isDone
                        ? "bg-green-500 text-white"
                        : isActive
                          ? "bg-primary text-white"
                          : "bg-gray-100 text-gray-400"
                    }`}
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

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {isLastStep ? (
            <ConfirmPanel serviceType={serviceType} formData={formData} />
          ) : serviceType === "rental" ? (
            <RentalForm
              step={currentStep}
              formData={rentalData}
              update={updateRental}
              updateRoom={updateRentalRoom}
              addRoom={addRoom}
              removeRoom={removeRoom}
            />
          ) : serviceType === "tour" ? (
            <TourForm
              step={currentStep}
              formData={tourData}
              update={updateTour}
              updateItinerary={updateItinerary}
              addItinerary={addItinerary}
              removeItinerary={removeItinerary}
            />
          ) : (
            <CarForm step={currentStep} formData={carData} update={updateCar} />
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
              className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-hover font-medium"
            >
              <CheckCircle className="w-4 h-4" />
              Đăng dịch vụ
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
