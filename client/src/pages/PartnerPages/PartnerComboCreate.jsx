import React, { useState } from "react";
import {
  Package,
  FileText,
  DollarSign,
  Calendar,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
  Tag,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const PartnerComboCreate = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    services: [""],
    originalPrice: "",
    discount: 0,
    validFrom: "",
    validUntil: "",
    maxBookings: "",
  });

  const steps = [
    { id: 1, title: "Thông tin cơ bản", icon: Package },
    { id: 2, title: "Dịch vụ bao gồm", icon: FileText },
    { id: 3, title: "Định giá", icon: DollarSign },
    { id: 4, title: "Thời hạn & Giới hạn", icon: Calendar },
    { id: 5, title: "Xác nhận & Đăng", icon: CheckCircle },
  ];

  const update = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const updateService = (index, value) => {
    const updated = [...formData.services];
    updated[index] = value;
    update("services", updated);
  };

  const addService = () => update("services", [...formData.services, ""]);

  const removeService = (index) =>
    update(
      "services",
      formData.services.filter((_, i) => i !== index)
    );

  const currentPrice =
    formData.originalPrice && formData.discount
      ? Math.round(formData.originalPrice * (1 - formData.discount / 100))
      : formData.originalPrice || 0;

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN").format(price) + " ₫";

  const nextStep = () => setCurrentStep((s) => Math.min(s + 1, 5));
  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 1));

  return (
    <div className="min-h-screen bg-bg-light p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/PartnerCombo")}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tạo Combo mới</h1>
            <p className="text-gray-500 text-sm">
              Đóng gói dịch vụ để tạo gói combo hấp dẫn
            </p>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center mb-8 bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isDone = currentStep > step.id;
            return (
              <React.Fragment key={step.id}>
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
                    className={`text-xs text-center hidden md:block ${
                      isActive ? "text-primary font-medium" : "text-gray-400"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 mx-1 ${
                      currentStep > step.id ? "bg-green-400" : "bg-gray-200"
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Thông tin cơ bản
              </h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên combo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="VD: Trải nghiệm Hà Nội hoàn hảo 3N2Đ"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => update("description", e.target.value)}
                  placeholder="Mô tả ngắn gọn về combo này..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                />
              </div>
            </div>
          )}

          {/* Step 2: Services */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Dịch vụ bao gồm
              </h2>
              <p className="text-sm text-gray-500">
                Liệt kê các dịch vụ có trong combo này.
              </p>
              {formData.services.map((service, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={service}
                    onChange={(e) => updateService(index, e.target.value)}
                    placeholder={`Dịch vụ ${index + 1} (VD: Phòng Deluxe 2 đêm)`}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                  {formData.services.length > 1 && (
                    <button
                      onClick={() => removeService(index)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addService}
                className="flex items-center gap-2 text-primary hover:text-primary-hover text-sm font-medium mt-2"
              >
                <Plus className="w-4 h-4" />
                Thêm dịch vụ
              </button>
            </div>
          )}

          {/* Step 3: Pricing */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Định giá
              </h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giá gốc (₫) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.originalPrice}
                  onChange={(e) =>
                    update("originalPrice", Number(e.target.value))
                  }
                  placeholder="VD: 5000000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giảm giá (%)
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={formData.discount}
                  onChange={(e) => update("discount", Number(e.target.value))}
                  placeholder="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              {formData.originalPrice > 0 && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-800">
                    <Tag className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      Giá bán sau giảm:
                    </span>
                    <span className="text-lg font-bold">
                      {formatPrice(currentPrice)}
                    </span>
                  </div>
                  {formData.discount > 0 && (
                    <p className="text-xs text-green-600 mt-1">
                      Khách tiết kiệm:{" "}
                      {formatPrice(formData.originalPrice - currentPrice)}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 4: Validity */}
          {currentStep === 4 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Thời hạn & Giới hạn
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày bắt đầu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.validFrom}
                    onChange={(e) => update("validFrom", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày kết thúc <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.validUntil}
                    onChange={(e) => update("validUntil", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số lượng đặt tối đa
                </label>
                <input
                  type="number"
                  min={1}
                  value={formData.maxBookings}
                  onChange={(e) => update("maxBookings", e.target.value)}
                  placeholder="VD: 100 (để trống nếu không giới hạn)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
          )}

          {/* Step 5: Confirm */}
          {currentStep === 5 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Xác nhận & Đăng
              </h2>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                    Tên combo
                  </p>
                  <p className="font-semibold text-gray-900">
                    {formData.name || "—"}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                    Mô tả
                  </p>
                  <p className="text-gray-700 text-sm">
                    {formData.description || "—"}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs font-medium text-gray-500 uppercase mb-2">
                    Dịch vụ bao gồm (
                    {formData.services.filter(Boolean).length})
                  </p>
                  <ul className="space-y-1">
                    {formData.services.filter(Boolean).map((s, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-sm text-gray-700"
                      >
                        <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                      Giá bán
                    </p>
                    <p className="font-bold text-primary text-lg">
                      {formatPrice(currentPrice)}
                    </p>
                    {formData.discount > 0 && (
                      <p className="text-xs text-gray-500 line-through">
                        {formatPrice(formData.originalPrice)}
                      </p>
                    )}
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                      Thời hạn
                    </p>
                    <p className="text-sm text-gray-700">
                      {formData.validFrom
                        ? new Date(formData.validFrom).toLocaleDateString(
                            "vi-VN"
                          )
                        : "—"}{" "}
                      —{" "}
                      {formData.validUntil
                        ? new Date(formData.validUntil).toLocaleDateString(
                            "vi-VN"
                          )
                        : "—"}
                    </p>
                    {formData.maxBookings && (
                      <p className="text-xs text-gray-500 mt-1">
                        Tối đa {formData.maxBookings} đặt chỗ
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <button
            onClick={
              currentStep === 1 ? () => navigate("/PartnerCombo") : prevStep
            }
            className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4" />
            {currentStep === 1 ? "Hủy" : "Quay lại"}
          </button>
          {currentStep < 5 ? (
            <button
              onClick={nextStep}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-hover"
            >
              Tiếp theo
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => navigate("/PartnerCombo")}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-hover font-medium"
            >
              <CheckCircle className="w-4 h-4" />
              Đăng Combo
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PartnerComboCreate;
