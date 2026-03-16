import React, { useState } from "react";
import {
  Home,
  MapPin,
  Wifi,
  DollarSign,
  Camera,
  FileText,
  Bed,
  Users,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const PartnerRentalRegistration = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1
    propertyName: "",
    description: "",
    address: "",
    city: "",
    district: "",
    ward: "",
    postalCode: "",
    latitude: "",
    longitude: "",
    checkInTime: "14:00",
    checkOutTime: "11:00",
    cancellationPolicy: "",
    houseRules: "",

    // Step 2
    images: [],
    amenities: [],

    // Step 4 (Room Types)
    roomTypes: [
      {
        roomName: "",
        roomDescription: "",
        maxOccupancy: 2,
        roomSizeSqm: 0,
        bedType: "Queen Bed",
        bedCount: 1,
        privateBathroom: true,
        basePrice: 0,
        weekendPrice: 0,
        holidayPrice: 0,
        roomAmenities: [],
        images: [],
        numberOfRooms: 1, // CRITICAL: How many physical rooms of this type
      },
    ],

    // Step 5
    availabilityStartDate: "",
    availabilityEndDate: "",
    applyToAllDates: true,
  });

  const navigate = useNavigate();

  const steps = [
    { id: 1, title: "Thông tin cơ bản", icon: Home },
    { id: 2, title: "Hình ảnh & Tiện nghi", icon: Camera },
    { id: 3, title: "Chính sách", icon: FileText },
    { id: 4, title: "Loại phòng", icon: Bed },
    { id: 5, title: "Xác nhận & Đăng", icon: CheckCircle },
  ];

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateRoomField = (roomIndex, field, value) => {
    const newRooms = [...formData.roomTypes];
    newRooms[roomIndex] = { ...newRooms[roomIndex], [field]: value };
    setFormData((prev) => ({ ...prev, roomTypes: newRooms }));
  };

  const addRoomType = () => {
    setFormData((prev) => ({
      ...prev,
      roomTypes: [
        ...prev.roomTypes,
        {
          roomName: "",
          roomDescription: "",
          maxOccupancy: 2,
          roomSizeSqm: 0,
          bedType: "Queen Bed",
          bedCount: 1,
          privateBathroom: true,
          basePrice: 0,
          weekendPrice: 0,
          holidayPrice: 0,
          roomAmenities: [],
          images: [],
          numberOfRooms: 1,
        },
      ],
    }));
  };

  const removeRoomType = (index) => {
    const newRooms = [...formData.roomTypes];
    newRooms.splice(index, 1);
    setFormData((prev) => ({ ...prev, roomTypes: newRooms }));
  };

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleImageUpload = (e, roomIndex = null) => {
    const files = Array.from(e.target.files);
    if (roomIndex !== null) {
      const newRooms = [...formData.roomTypes];
      newRooms[roomIndex].images = [...newRooms[roomIndex].images, ...files];
      setFormData((prev) => ({ ...prev, roomTypes: newRooms }));
    } else {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...files],
      }));
    }
  };

  const toggleAmenity = (amenity, roomIndex = null) => {
    if (roomIndex !== null) {
      const newRooms = [...formData.roomTypes];
      const currentAmenities = newRooms[roomIndex].roomAmenities;
      newRooms[roomIndex].roomAmenities = currentAmenities.includes(amenity)
        ? currentAmenities.filter((a) => a !== amenity)
        : [...currentAmenities, amenity];
      setFormData((prev) => ({ ...prev, roomTypes: newRooms }));
    } else {
      setFormData((prev) => ({
        ...prev,
        amenities: prev.amenities.includes(amenity)
          ? prev.amenities.filter((a) => a !== amenity)
          : [...prev.amenities, amenity],
      }));
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Thông tin cơ bản về chỗ ở
            </h2>
            <p className="text-gray-600 mb-4">
              Điền tên, mô tả và địa chỉ chính xác cho chỗ ở của bạn.
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên chỗ ở *
              </label>
              <input
                type="text"
                value={formData.propertyName}
                onChange={(e) => updateFormData("propertyName", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-hover focus:border-primary"
                placeholder="Villa Biển Xanh Đà Nẵng"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mô tả ngắn
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => updateFormData("description", e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-hover focus:border-primary"
                placeholder="Mô tả điểm nổi bật của chỗ ở..."
              />
            </div>
            <div className="space-y-4">
              <h3 className="font-medium text-gray-800">Vị trí</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => updateFormData("address", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-hover focus:border-primary"
                  placeholder="Số nhà, tên đường"
                />
                <input
                  type="text"
                  value={formData.ward}
                  onChange={(e) => updateFormData("ward", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-hover focus:border-primary"
                  placeholder="Phường/Xã"
                />
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => updateFormData("district", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-hover focus:border-primary"
                  placeholder="Quận/Huyện"
                />
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => updateFormData("city", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-hover focus:border-primary"
                  placeholder="Thành phố"
                />
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => updateFormData("postalCode", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-hover focus:border-primary"
                  placeholder="Mã bưu điện"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={formData.latitude}
                    onChange={(e) => updateFormData("latitude", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-hover focus:border-primary"
                    placeholder="Vĩ độ"
                  />
                  <input
                    type="text"
                    value={formData.longitude}
                    onChange={(e) =>
                      updateFormData("longitude", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-hover focus:border-primary"
                    placeholder="Kinh độ"
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giờ nhận phòng
                </label>
                <input
                  type="time"
                  value={formData.checkInTime}
                  onChange={(e) =>
                    updateFormData("checkInTime", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-hover focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giờ trả phòng
                </label>
                <input
                  type="time"
                  value={formData.checkOutTime}
                  onChange={(e) =>
                    updateFormData("checkOutTime", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-hover focus:border-primary"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chính sách hủy
              </label>
              <textarea
                value={formData.cancellationPolicy}
                onChange={(e) =>
                  updateFormData("cancellationPolicy", e.target.value)
                }
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-hover focus:border-primary"
                placeholder="Miễn phí hủy trong vòng 7 ngày trước nhận phòng..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nội quy nhà
              </label>
              <textarea
                value={formData.houseRules}
                onChange={(e) => updateFormData("houseRules", e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-hover focus:border-primary"
                placeholder="Không hút thuốc, không thú cưng, giờ yên tĩnh sau 22h..."
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Hình ảnh & Tiện nghi chung
            </h2>
            <p className="text-gray-600 mb-4">
              Tải lên ảnh đại diện và chọn các tiện nghi có sẵn tại chỗ ở.
            </p>

            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
              <div className="space-y-1 text-center">
                <Camera className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-hover">
                    <span>Tải ảnh lên</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e)}
                      className="sr-only"
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF tối đa 10MB
                </p>
              </div>
            </div>

            {formData.images.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-2">
                {formData.images.map((file, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Preview"
                      className="h-24 w-full object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newImages = [...formData.images];
                        newImages.splice(index, 1);
                        setFormData({ ...formData, images: newImages });
                      }}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6">
              <h3 className="font-medium text-gray-800 mb-3">
                Tiện nghi chung
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  "WiFi",
                  "Điều hòa",
                  "Hồ bơi",
                  "Bãi biển riêng",
                  "Bữa sáng",
                  "Bếp",
                  "TV",
                  "Đỗ xe miễn phí",
                ].map((amenity) => (
                  <div
                    key={amenity}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      formData.amenities.includes(amenity)
                        ? "border-primary bg-[#e6f7f9]"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => toggleAmenity(amenity)}
                  >
                    <span className="text-sm font-medium">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Xác nhận chính sách
            </h2>
            <p className="text-gray-600 mb-4">
              Kiểm tra lại giờ nhận/trả phòng, chính sách hủy và nội quy.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div>
                <span className="font-medium">Giờ nhận phòng:</span>{" "}
                {formData.checkInTime}
              </div>
              <div>
                <span className="font-medium">Giờ trả phòng:</span>{" "}
                {formData.checkOutTime}
              </div>
              <div>
                <span className="font-medium">Chính sách hủy:</span>{" "}
                {formData.cancellationPolicy || "Chưa thiết lập"}
              </div>
              <div>
                <span className="font-medium">Nội quy nhà:</span>{" "}
                {formData.houseRules || "Chưa thiết lập"}
              </div>
            </div>
            <div className="text-sm text-gray-600 italic">
              Bạn có thể chỉnh sửa các chính sách này sau trong trang quản lý
              dịch vụ.
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">
                Định nghĩa loại phòng
              </h2>
              <button
                onClick={addRoomType}
                className="px-3 py-1 bg-primary text-white text-sm rounded hover:bg-primary-hover"
              >
                + Thêm loại phòng
              </button>
            </div>
            <p className="text-gray-600 mb-4">
              Mỗi loại phòng có giá, tiện nghi và số lượng phòng vật lý riêng.
            </p>

            {formData.roomTypes.map((room, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 mb-4 bg-white"
              >
                {formData.roomTypes.length > 1 && (
                  <div className="flex justify-between mb-3">
                    <h3 className="font-medium text-gray-800">
                      Loại phòng #{index + 1}
                    </h3>
                    <button
                      onClick={() => removeRoomType(index)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Xóa loại phòng này
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    value={room.roomName}
                    onChange={(e) =>
                      updateRoomField(index, "roomName", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-hover focus:border-primary"
                    placeholder="Tên loại phòng (VD: Deluxe Ocean View)"
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số lượng phòng vật lý
                    </label>
                    <input
                      type="number"
                      value={room.numberOfRooms === 0 ? "" : room.numberOfRooms}
                      onChange={(e) =>
                        updateRoomField(
                          index,
                          "numberOfRooms",
                          e.target.value === ""
                            ? ""
                            : parseInt(e.target.value) || ""
                        )
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-hover focus:border-primary"
                      min="1"
                      placeholder="VD: 3"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số khách tối đa
                    </label>
                    <input
                      type="number"
                      value={room.maxOccupancy === 0 ? "" : room.maxOccupancy}
                      onChange={(e) =>
                        updateRoomField(
                          index,
                          "maxOccupancy",
                          e.target.value === ""
                            ? ""
                            : parseInt(e.target.value) || ""
                        )
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-hover focus:border-primary"
                      min="1"
                      placeholder="VD: 2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Diện tích phòng (m²)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={room.roomSizeSqm === 0 ? "" : room.roomSizeSqm}
                      onChange={(e) =>
                        updateRoomField(
                          index,
                          "roomSizeSqm",
                          e.target.value === ""
                            ? ""
                            : parseFloat(e.target.value) || ""
                        )
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-hover focus:border-primary"
                      placeholder="VD: 25.5"
                    />
                  </div>
                  <select
                    value={room.bedType}
                    onChange={(e) =>
                      updateRoomField(index, "bedType", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-hover focus:border-primary"
                  >
                    <option value="">Chọn loại giường</option>
                    <option value="Single Bed">Giường đơn</option>
                    <option value="Double Bed">Giường đôi</option>
                    <option value="Queen Bed">Giường Queen</option>
                    <option value="King Bed">Giường King</option>
                    <option value="Twin Beds">2 Giường đơn</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Giá cơ bản (VND/đêm)
                    </label>
                    <input
                      type="number"
                      value={room.basePrice === 0 ? "" : room.basePrice}
                      onChange={(e) =>
                        updateRoomField(
                          index,
                          "basePrice",
                          e.target.value === ""
                            ? ""
                            : parseFloat(e.target.value) || ""
                        )
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-hover focus:border-primary"
                      placeholder="VD: 1500000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Giá cuối tuần (VND/đêm)
                    </label>
                    <input
                      type="number"
                      value={room.weekendPrice === 0 ? "" : room.weekendPrice}
                      onChange={(e) =>
                        updateRoomField(
                          index,
                          "weekendPrice",
                          e.target.value === ""
                            ? ""
                            : parseFloat(e.target.value) || ""
                        )
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-hover focus:border-primary"
                      placeholder="VD: 1800000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Giá ngày lễ (VND/đêm)
                    </label>
                    <input
                      type="number"
                      value={room.holidayPrice === 0 ? "" : room.holidayPrice}
                      onChange={(e) =>
                        updateRoomField(
                          index,
                          "holidayPrice",
                          e.target.value === ""
                            ? ""
                            : parseFloat(e.target.value) || ""
                        )
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-hover focus:border-primary"
                      placeholder="VD: 2200000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tiện nghi phòng
                  </label>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {["Mini-bar", "Tủ an toàn", "Máy sấy tóc", "Bồn tắm"].map(
                      (amenity) => (
                        <div
                          key={amenity}
                          className={`p-2 text-xs border rounded cursor-pointer ${
                            room.roomAmenities.includes(amenity)
                              ? "border-primary bg-[#e6f7f9]"
                              : "border-gray-200"
                          }`}
                          onClick={() => toggleAmenity(amenity, index)}
                        >
                          {amenity}
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ảnh phòng
                  </label>
                  <div className="mt-1 flex justify-center px-4 py-3 border-2 border-gray-300 border-dashed rounded">
                    <label className="cursor-pointer text-sm text-primary">
                      <span>Chọn ảnh</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, index)}
                        className="sr-only"
                      />
                    </label>
                  </div>
                  {room.images.length > 0 && (
                    <div className="mt-2 grid grid-cols-4 gap-2">
                      {room.images.map((file, imgIndex) => (
                        <div key={imgIndex} className="relative">
                          <img
                            src={URL.createObjectURL(file)}
                            alt="Room"
                            className="h-16 w-full object-cover rounded"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Thiết lập sẵn sàng & Xác nhận
            </h2>
            <p className="text-gray-600 mb-4">
              Chọn khoảng thời gian đầu tiên bạn muốn mở đặt phòng.
            </p>

            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-gray-800 mb-3">
                Thiết lập sẵn sàng ban đầu
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="date"
                  value={formData.availabilityStartDate}
                  onChange={(e) =>
                    updateFormData("availabilityStartDate", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-hover focus:border-primary"
                  min={new Date().toISOString().split("T")[0]}
                />
                <input
                  type="date"
                  value={formData.availabilityEndDate}
                  onChange={(e) =>
                    updateFormData("availabilityEndDate", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-hover focus:border-primary"
                  min={
                    formData.availabilityStartDate ||
                    new Date().toISOString().split("T")[0]
                  }
                />
              </div>
              <div className="mt-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.applyToAllDates}
                    onChange={(e) =>
                      updateFormData("applyToAllDates", e.target.checked)
                    }
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">
                    Áp dụng giá cơ bản cho tất cả ngày trong khoảng này
                  </span>
                </label>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <h3 className="font-medium text-gray-900">Tổng quan</h3>
              <div>
                <h4 className="font-medium">Thông tin chỗ ở</h4>
                <p>{formData.propertyName}</p>
                <p>
                  {formData.address}, {formData.city}
                </p>
              </div>
              <div>
                <h4 className="font-medium">Loại phòng đã thêm</h4>
                <ul className="list-disc list-inside text-sm">
                  {formData.roomTypes.map((room, i) => (
                    <li key={i}>
                      {room.roomName} - {room.numberOfRooms} phòng -{" "}
                      {room.basePrice.toLocaleString()}₫/đêm
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium">Sẵn sàng từ</h4>
                <p>
                  {formData.availabilityStartDate} đến{" "}
                  {formData.availabilityEndDate}
                </p>
              </div>
            </div>

            <div className="flex items-center mt-4">
              <input
                id="publish-confirmation"
                type="checkbox"
                required
                className="h-4 w-4 text-primary focus:ring-primary-hover border-gray-300 rounded"
              />
              <label
                htmlFor="publish-confirmation"
                className="ml-2 block text-sm text-gray-900"
              >
                Tôi xác nhận thông tin chính xác và đồng ý đăng dịch vụ này.
              </label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const publishListing = async () => {
    // In real app, this would call your final POST /submit API
    console.log("Submitting homestay registration:", formData);
    alert("🎉 Đăng ký chỗ ở thành công! Chờ xác minh từ quản trị viên.");
    navigate("/PartnerService");
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Đăng ký chỗ ở mới
          </h1>
          <p className="text-gray-600 mt-2">
            Hoàn thành các bước để đưa chỗ ở của bạn lên nền tảng
          </p>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="mb-10">
        <div className="flex justify-between relative">
          <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 -z-10"></div>
          <div
            className="absolute top-4 left-0 h-1 bg-primary -z-10 transition-all duration-500"
            style={{
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            }}
          ></div>
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.id} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep === step.id
                      ? "bg-primary text-white border-2 border-primary"
                      : currentStep > step.id
                      ? "bg-green-500 text-white border-2 border-green-500"
                      : "bg-white border-2 border-gray-300 text-gray-500"
                  }`}
                >
                  {currentStep > step.id ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>
                <span
                  className={`mt-2 text-xs font-medium text-center ${
                    currentStep === step.id ? "text-primary" : "text-gray-500"
                  }`}
                >
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        {renderStep()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          className={`flex items-center px-5 py-2 rounded-lg ${
            currentStep === 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Trước
        </button>
        {currentStep < 5 ? (
          <button
            onClick={nextStep}
            className="flex items-center px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover"
          >
            Tiếp theo
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        ) : (
          <button
            onClick={publishListing}
            className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Đăng dịch vụ
          </button>
        )}
      </div>
    </div>
  );
};

export default PartnerRentalRegistration;
