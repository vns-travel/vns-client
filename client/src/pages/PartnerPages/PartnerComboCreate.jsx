import React, { useState, useEffect } from "react";
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
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { comboService } from "../../services/comboService";
import { serviceService } from "../../services/serviceService";

const PartnerComboCreate = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Partner's own services — loaded on mount for step 2 selector
  const [partnerServices, setPartnerServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    // Each entry: { serviceId, includedFeatures, quantity }
    services: [{ serviceId: "", includedFeatures: "", quantity: 1 }],
    originalPrice: "",
    discount: 0,
    validFrom: "",
    validTo: "",
    maxBookings: "",
  });

  useEffect(() => {
    setServicesLoading(true);
    serviceService
      .getPartnerServices()
      .then((data) => setPartnerServices(Array.isArray(data) ? data : []))
      .catch(() => setPartnerServices([]))
      .finally(() => setServicesLoading(false));
  }, []);

  const steps = [
    { id: 1, title: "Thông tin cơ bản", icon: Package },
    { id: 2, title: "Dịch vụ bao gồm", icon: FileText },
    { id: 3, title: "Định giá", icon: DollarSign },
    { id: 4, title: "Thời hạn & Giới hạn", icon: Calendar },
    { id: 5, title: "Xác nhận & Đăng", icon: CheckCircle },
  ];

  const update = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const updateServiceItem = (index, field, value) => {
    const updated = [...formData.services];
    updated[index] = { ...updated[index], [field]: value };
    update("services", updated);
  };

  const addServiceItem = () =>
    update("services", [
      ...formData.services,
      { serviceId: "", includedFeatures: "", quantity: 1 },
    ]);

  const removeServiceItem = (index) =>
    update(
      "services",
      formData.services.filter((_, i) => i !== index)
    );

  const discountedPrice =
    formData.originalPrice && formData.discount !== undefined
      ? Math.round(Number(formData.originalPrice) * (1 - Number(formData.discount) / 100))
      : Number(formData.originalPrice) || 0;

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN").format(price) + " ₫";

  const nextStep = () => setCurrentStep((s) => Math.min(s + 1, 5));
  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError("");
    try {
      const validServices = formData.services.filter((s) => s.serviceId);
      await comboService.createCombo({
        title:           formData.title,
        description:     formData.description || undefined,
        originalPrice:   Number(formData.originalPrice),
        discountedPrice: discountedPrice,
        maxBookings:     formData.maxBookings ? Number(formData.maxBookings) : undefined,
        validFrom:       formData.validFrom ? new Date(formData.validFrom).toISOString() : undefined,
        validTo:         formData.validTo   ? new Date(formData.validTo).toISOString()   : undefined,
        services:        validServices.map((s, i) => ({
          serviceId:        s.serviceId,
          quantity:         Number(s.quantity) || 1,
          includedFeatures: s.includedFeatures || undefined,
          sequenceOrder:    i + 1,
        })),
      });
      navigate("/PartnerCombo");
    } catch (err) {
      setSubmitError(err.message || "Không thể tạo combo, vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  // Find service title by ID for the confirmation summary
  const serviceTitle = (id) =>
    partnerServices.find((s) => s.id === id || s.serviceId === id)?.title || id;

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
                  value={formData.title}
                  onChange={(e) => update("title", e.target.value)}
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

          {/* Step 2: Services — pick from real partner services */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Dịch vụ bao gồm
              </h2>
              <p className="text-sm text-gray-500">
                Chọn các dịch vụ của bạn để đưa vào combo này.
              </p>

              {servicesLoading && (
                <div className="flex items-center gap-2 text-gray-400 text-sm py-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang tải danh sách dịch vụ...
                </div>
              )}

              {!servicesLoading && partnerServices.length === 0 && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-yellow-700">
                    Bạn chưa có dịch vụ nào được duyệt. Hãy tạo và đăng dịch vụ trước khi tạo combo.
                  </p>
                </div>
              )}

              {formData.services.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-start">
                  <div className="col-span-5">
                    <select
                      value={item.serviceId}
                      onChange={(e) => updateServiceItem(index, "serviceId", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white text-sm"
                    >
                      <option value="">— Chọn dịch vụ —</option>
                      {partnerServices.map((svc) => (
                        <option key={svc.id || svc.serviceId} value={svc.id || svc.serviceId}>
                          {svc.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-4">
                    <input
                      type="text"
                      value={item.includedFeatures}
                      onChange={(e) => updateServiceItem(index, "includedFeatures", e.target.value)}
                      placeholder="Chi tiết (VD: 2 đêm)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => updateServiceItem(index, "quantity", e.target.value)}
                      placeholder="SL"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                    />
                  </div>
                  <div className="col-span-1 flex justify-center pt-2">
                    {formData.services.length > 1 && (
                      <button
                        onClick={() => removeServiceItem(index)}
                        className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              <div className="flex gap-1 text-xs text-gray-400 px-1 -mt-1">
                <span className="w-5/12">Dịch vụ</span>
                <span className="w-4/12">Chi tiết bao gồm</span>
                <span className="w-2/12">Số lượng</span>
              </div>

              <button
                onClick={addServiceItem}
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
                  onChange={(e) => update("originalPrice", e.target.value)}
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
                  max={99}
                  value={formData.discount}
                  onChange={(e) => update("discount", e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              {Number(formData.originalPrice) > 0 && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-800">
                    <Tag className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      Giá bán sau giảm:
                    </span>
                    <span className="text-lg font-bold">
                      {formatPrice(discountedPrice)}
                    </span>
                  </div>
                  {Number(formData.discount) > 0 && (
                    <p className="text-xs text-green-600 mt-1">
                      Khách tiết kiệm:{" "}
                      {formatPrice(Number(formData.originalPrice) - discountedPrice)}
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
                    Ngày bắt đầu
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
                    Ngày kết thúc
                  </label>
                  <input
                    type="date"
                    value={formData.validTo}
                    onChange={(e) => update("validTo", e.target.value)}
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

              {submitError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start gap-2 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  {submitError}
                </div>
              )}

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                    Tên combo
                  </p>
                  <p className="font-semibold text-gray-900">
                    {formData.title || "—"}
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
                    {formData.services.filter((s) => s.serviceId).length})
                  </p>
                  <ul className="space-y-1">
                    {formData.services.filter((s) => s.serviceId).map((s, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-sm text-gray-700"
                      >
                        <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                        {serviceTitle(s.serviceId)}
                        {s.includedFeatures && (
                          <span className="text-gray-400 text-xs">— {s.includedFeatures}</span>
                        )}
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
                      {formatPrice(discountedPrice)}
                    </p>
                    {Number(formData.discount) > 0 && (
                      <p className="text-xs text-gray-500 line-through">
                        {formatPrice(Number(formData.originalPrice))}
                      </p>
                    )}
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                      Thời hạn
                    </p>
                    <p className="text-sm text-gray-700">
                      {formData.validFrom
                        ? new Date(formData.validFrom).toLocaleDateString("vi-VN")
                        : "—"}{" "}
                      —{" "}
                      {formData.validTo
                        ? new Date(formData.validTo).toLocaleDateString("vi-VN")
                        : "—"}
                    </p>
                    {formData.maxBookings && (
                      <p className="text-xs text-gray-500 mt-1">
                        Tối đa {formData.maxBookings} đặt chỗ
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
                  Combo sẽ được gửi lên để manager duyệt trước khi hiển thị cho khách hàng.
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
            disabled={submitting}
            className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
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
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-hover font-medium disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              {submitting ? "Đang gửi..." : "Đăng Combo"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PartnerComboCreate;
