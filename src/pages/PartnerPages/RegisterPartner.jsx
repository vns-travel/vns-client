import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Phone,
  Building,
  Eye,
  EyeOff,
  Check,
  ArrowLeft,
} from "lucide-react";
import { authService } from "../../services/authService";

export default function RegisterPartner() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    businessName: "",
  });
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.email.trim()) newErrors.email = "Email là bắt buộc";
      else if (!/\S+@\S+\.\S+/.test(formData.email))
        newErrors.email = "Email không hợp lệ";

      if (!formData.phoneNumber.trim())
        newErrors.phoneNumber = "Số điện thoại là bắt buộc";
      else if (!/^[0-9]{10,11}$/.test(formData.phoneNumber.replace(/\s/g, "")))
        newErrors.phoneNumber = "Số điện thoại không hợp lệ (10-11 chữ số)";

      if (!formData.password) newErrors.password = "Mật khẩu là bắt buộc";
      else if (formData.password.length < 6)
        newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";

      if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    if (step === 2) {
      if (!formData.businessName.trim())
        newErrors.businessName = "Tên doanh nghiệp là bắt buộc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setLoading(true);
    try {
      await authService.registerPartner({
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        businessName: formData.businessName,
      });
      navigate("/LoginPartner", {
        state: { message: "Đăng ký thành công! Vui lòng đăng nhập." },
      });
    } catch (err) {
      setErrors({ submit: err.message || "Đăng ký thất bại, vui lòng thử lại." });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full pl-10 pr-4 py-3 border ${
      errors[field] ? "border-red-500" : "border-gray-200"
    } rounded-xl focus:outline-none focus:border-primary transition-colors`;

  return (
    <div className="min-h-screen bg-bg-light flex items-center justify-center py-8 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Building className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">VNS Partner</h1>
          <p className="text-gray-600 text-sm">Đăng ký tài khoản đối tác</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2].map((step, i) => (
              <div key={step} className="flex items-center">
                {i > 0 && (
                  <div
                    className={`w-8 h-1 mr-4 ${
                      currentStep >= step ? "bg-primary" : "bg-gray-200"
                    }`}
                  />
                )}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep >= step
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {currentStep > step ? <Check className="w-4 h-4" /> : step}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Account Info */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Thông tin tài khoản
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Nhập email của bạn"
                  className={inputClass("email")}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số điện thoại
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    handleInputChange("phoneNumber", e.target.value)
                  }
                  placeholder="Nhập số điện thoại"
                  className={inputClass("phoneNumber")}
                />
              </div>
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder="Tối thiểu 6 ký tự"
                  className={`${inputClass("password")} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  placeholder="Nhập lại mật khẩu"
                  className={`${inputClass("confirmPassword")} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              onClick={handleNext}
              className="w-full bg-primary hover:bg-primary-hover text-white font-medium py-3 rounded-xl transition-colors"
            >
              Tiếp theo
            </button>
          </div>
        )}

        {/* Step 2: Business Info */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="flex items-center mb-4">
              <button
                onClick={handleBack}
                className="mr-3 text-gray-600 hover:text-primary"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-semibold text-gray-800">
                Thông tin doanh nghiệp
              </h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên doanh nghiệp
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) =>
                    handleInputChange("businessName", e.target.value)
                  }
                  placeholder="Nhập tên doanh nghiệp"
                  className={inputClass("businessName")}
                />
              </div>
              {errors.businessName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.businessName}
                </p>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-800">
                <strong>Lưu ý:</strong> Tài khoản đối tác sẽ được xem xét và
                phê duyệt bởi quản lý trước khi sử dụng.
              </p>
            </div>

            {errors.submit && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {errors.submit}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-hover text-white font-medium py-3 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Đang đăng ký..." : "Hoàn tất đăng ký"}
            </button>
          </div>
        )}

        {/* Footer Links */}
        <div className="text-center mt-6 space-y-2">
          <a
            href="/LoginPartner"
            className="text-primary hover:underline text-sm"
          >
            Đã có tài khoản? Đăng nhập
          </a>
          <p className="text-xs text-gray-500">
            Cần trợ giúp? Liên hệ với quản trị viên của bạn
          </p>
        </div>
      </div>
    </div>
  );
}
