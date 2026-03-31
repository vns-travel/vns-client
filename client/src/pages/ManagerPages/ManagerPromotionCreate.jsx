import React, { useState } from "react";
import {
  Gift,
  Percent,
  Calendar,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  DollarSign,
  Tag,
  Users,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { voucherService, SCOPE_OPTIONS, scopeValueToTypes } from "../../services/voucherService";

const ManagerPromotionCreate = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    promoCode: "",
    discountType: "percentage",
    discountValue: "",
    minOrderValue: "",
    applicableServices: "all",
    validFrom: "",
    validUntil: "",
    usageLimit: "",
  });

  const steps = [
    { id: 1, title: "Thông tin", icon: Gift },
    { id: 2, title: "Ưu đãi", icon: Percent },
    { id: 3, title: "Phạm vi", icon: Tag },
    { id: 4, title: "Thời hạn", icon: Calendar },
    { id: 5, title: "Xác nhận", icon: CheckCircle },
  ];

  const update = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const formatPrice = (price) =>
    price ? new Intl.NumberFormat("vi-VN").format(price) + " ₫" : "—";

  const nextStep = () => setCurrentStep((s) => Math.min(s + 1, 5));
  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 1));

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError("");
    try {
      await voucherService.createVoucher({
        name:        formData.name,
        description: formData.description || undefined,
        code:        formData.promoCode,
        type:        formData.discountType === "percentage" ? "percent" : "fixed",
        value:       Number(formData.discountValue),
        minSpend:    formData.minOrderValue ? Number(formData.minOrderValue) : 0,
        maxUses:     formData.usageLimit ? Number(formData.usageLimit) : undefined,
        validFrom:   formData.validFrom   || undefined,
        validTo:     formData.validUntil  || undefined,
        applicableServiceTypes: scopeValueToTypes(formData.applicableServices),
      });
      navigate("/ManagerPromotion");
    } catch (err) {
      setSubmitError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg-light p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/ManagerPromotion")}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Tạo khuyến mãi mới
            </h1>
            <p className="text-gray-500 text-sm">
              Tạo mã khuyến mãi áp dụng trên toàn nền tảng
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
                Thông tin khuyến mãi
              </h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên khuyến mãi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="VD: Ưu đãi đặt sớm mùa hè 2026"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => update("description", e.target.value)}
                  placeholder="Mô tả điều kiện và lợi ích của khuyến mãi..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mã khuyến mãi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.promoCode}
                  onChange={(e) =>
                    update("promoCode", e.target.value.toUpperCase())
                  }
                  placeholder="VD: SUMMER2026"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary font-mono"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Mã chỉ dùng chữ in hoa và số
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Discount */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Loại ưu đãi
              </h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hình thức giảm giá <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => update("discountType", "percentage")}
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-colors ${
                      formData.discountType === "percentage"
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    <Percent className="w-5 h-5" />
                    <div className="text-left">
                      <p className="font-medium text-sm">Theo phần trăm</p>
                      <p className="text-xs text-gray-400">VD: Giảm 25%</p>
                    </div>
                  </button>
                  <button
                    onClick={() => update("discountType", "fixed")}
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-colors ${
                      formData.discountType === "fixed"
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    <DollarSign className="w-5 h-5" />
                    <div className="text-left">
                      <p className="font-medium text-sm">Số tiền cố định</p>
                      <p className="text-xs text-gray-400">VD: Giảm 300.000₫</p>
                    </div>
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giá trị giảm{" "}
                  {formData.discountType === "percentage" ? "(%)" : "(₫)"}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.discountValue}
                  onChange={(e) => update("discountValue", e.target.value)}
                  placeholder={
                    formData.discountType === "percentage" ? "VD: 25" : "VD: 300000"
                  }
                  max={formData.discountType === "percentage" ? 100 : undefined}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giá trị đơn hàng tối thiểu (₫)
                </label>
                <input
                  type="number"
                  value={formData.minOrderValue}
                  onChange={(e) => update("minOrderValue", e.target.value)}
                  placeholder="VD: 1000000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
          )}

          {/* Step 3: Scope */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Phạm vi áp dụng
              </h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dịch vụ áp dụng <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.applicableServices}
                  onChange={(e) => update("applicableServices", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white"
                >
                  {SCOPE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
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
                  Tổng số lượt sử dụng tối đa
                </label>
                <input
                  type="number"
                  min={1}
                  value={formData.usageLimit}
                  onChange={(e) => update("usageLimit", e.target.value)}
                  placeholder="VD: 500 (để trống nếu không giới hạn)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
          )}

          {/* Step 5: Confirm */}
          {currentStep === 5 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Xác nhận & Tạo
              </h2>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                    Tên khuyến mãi
                  </p>
                  <p className="font-semibold text-gray-900">
                    {formData.name || "—"}
                  </p>
                  {formData.description && (
                    <p className="text-sm text-gray-500 mt-1">
                      {formData.description}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                      Mã khuyến mãi
                    </p>
                    <code className="text-primary font-mono font-bold text-lg">
                      {formData.promoCode || "—"}
                    </code>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                      Giảm giá
                    </p>
                    <p className="font-bold text-green-600 text-lg">
                      {formData.discountValue
                        ? formData.discountType === "percentage"
                          ? `${formData.discountValue}%`
                          : formatPrice(formData.discountValue)
                        : "—"}
                    </p>
                    {formData.minOrderValue && (
                      <p className="text-xs text-gray-500 mt-1">
                        Đơn tối thiểu {formatPrice(formData.minOrderValue)}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                      Áp dụng cho
                    </p>
                    <p className="text-sm text-gray-700">
                      {SCOPE_OPTIONS.find((o) => o.value === formData.applicableServices)?.label ?? "—"}
                    </p>
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
                    {formData.usageLimit && (
                      <p className="text-xs text-gray-500 mt-1">
                        Tối đa {formData.usageLimit} lượt sử dụng
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Submit error */}
        {submitError && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
            {submitError}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <button
            onClick={
              currentStep === 1
                ? () => navigate("/ManagerPromotion")
                : prevStep
            }
            className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            disabled={submitting}
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
              className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-hover font-medium disabled:opacity-60"
            >
              <CheckCircle className="w-4 h-4" />
              {submitting ? "Đang tạo..." : "Tạo Khuyến mãi"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerPromotionCreate;
