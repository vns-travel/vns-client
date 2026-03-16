import React, { useState } from "react";
import {
  User,
  Mail,
  Lock,
  Phone,
  Building,
  MapPin,
  FileText,
  Upload,
  Eye,
  EyeOff,
  Check,
  ArrowLeft,
} from "lucide-react";

export default function RegisterPartner() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",

    // Business Information
    businessName: "",
    businessCategory: "",
    businessAddress: "",
    businessDescription: "",

    // Documents
    businessLicense: null,
    certifications: null,
  });

  const [errors, setErrors] = useState({});

  const businessCategories = [
    "Khách sạn và chỗ ở",
    "Dịch vụ tour du lịch",
    "Dịch vụ thuê xe",
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleFileUpload = (field, file) => {
    setFormData((prev) => ({
      ...prev,
      [field]: file,
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.fullName.trim())
        newErrors.fullName = "Họ và tên là bắt buộc";
      if (!formData.email.trim()) newErrors.email = "Email là bắt buộc";
      else if (!/\S+@\S+\.\S+/.test(formData.email))
        newErrors.email = "Email không hợp lệ";
      if (!formData.phone.trim()) newErrors.phone = "Số điện thoại là bắt buộc";
      else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, "")))
        newErrors.phone = "Số điện thoại không hợp lệ";
      if (!formData.password) newErrors.password = "Mật khẩu là bắt buộc";
      else if (formData.password.length < 6)
        newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
      if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    if (step === 2) {
      if (!formData.businessName.trim())
        newErrors.businessName = "Tên doanh nghiệp là bắt buộc";
      if (!formData.businessCategory)
        newErrors.businessCategory = "Loại hình kinh doanh là bắt buộc";
      if (!formData.businessAddress.trim())
        newErrors.businessAddress = "Địa chỉ kinh doanh là bắt buộc";
      if (!formData.businessDescription.trim())
        newErrors.businessDescription = "Mô tả doanh nghiệp là bắt buộc";
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

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      console.log("Partner registration data:", formData);
      alert("Đăng ký thành công! Vui lòng chờ xác thực từ quản trị viên.");
    }
  };

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
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= 1
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-gray-400"
              }`}
            >
              {currentStep > 1 ? <Check className="w-4 h-4" /> : "1"}
            </div>
            <div
              className={`w-8 h-1 ${
                currentStep >= 2 ? "bg-primary" : "bg-gray-200"
              }`}
            ></div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= 2
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-gray-400"
              }`}
            >
              {currentStep > 2 ? <Check className="w-4 h-4" /> : "2"}
            </div>
            {/* <div
              className={`w-8 h-1 ${
                currentStep >= 3 ? "bg-primary" : "bg-gray-200"
              }`}
            ></div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= 3
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-gray-400"
              }`}
            >
              {currentStep > 3 ? <Check className="w-4 h-4" /> : "3"}
            </div> */}
          </div>
        </div>

        {/* Step 1: Personal Information */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Thông tin cá nhân
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Họ và tên
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    handleInputChange("fullName", e.target.value)
                  }
                  placeholder="Nhập họ và tên của bạn"
                  className={`w-full pl-10 pr-4 py-3 border ${
                    errors.fullName ? "border-red-500" : "border-gray-200"
                  } rounded-xl focus:outline-none focus:border-primary transition-colors`}
                />
              </div>
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Nhập email của bạn"
                  className={`w-full pl-10 pr-4 py-3 border ${
                    errors.email ? "border-red-500" : "border-gray-200"
                  } rounded-xl focus:outline-none focus:border-primary transition-colors`}
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
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Nhập số điện thoại"
                  className={`w-full pl-10 pr-4 py-3 border ${
                    errors.phone ? "border-red-500" : "border-gray-200"
                  } rounded-xl focus:outline-none focus:border-primary transition-colors`}
                />
              </div>
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  placeholder="Nhập mật khẩu"
                  className={`w-full pl-10 pr-12 py-3 border ${
                    errors.password ? "border-red-500" : "border-gray-200"
                  } rounded-xl focus:outline-none focus:border-primary transition-colors`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary"
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
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  placeholder="Xác nhận mật khẩu"
                  className={`w-full pl-10 pr-12 py-3 border ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-200"
                  } rounded-xl focus:outline-none focus:border-primary transition-colors`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary"
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

        {/* Step 2: Business Information */}
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
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) =>
                    handleInputChange("businessName", e.target.value)
                  }
                  placeholder="Nhập tên doanh nghiệp"
                  className={`w-full pl-10 pr-4 py-3 border ${
                    errors.businessName ? "border-red-500" : "border-gray-200"
                  } rounded-xl focus:outline-none focus:border-primary transition-colors`}
                />
              </div>
              {errors.businessName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.businessName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loại hình kinh doanh
              </label>
              <select
                value={formData.businessCategory}
                onChange={(e) =>
                  handleInputChange("businessCategory", e.target.value)
                }
                className={`w-full px-4 py-3 border ${
                  errors.businessCategory ? "border-red-500" : "border-gray-200"
                } rounded-xl focus:outline-none focus:border-primary transition-colors`}
              >
                <option value="">Chọn loại hình kinh doanh</option>
                {businessCategories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.businessCategory && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.businessCategory}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Địa chỉ kinh doanh
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={formData.businessAddress}
                  onChange={(e) =>
                    handleInputChange("businessAddress", e.target.value)
                  }
                  placeholder="Nhập địa chỉ kinh doanh"
                  className={`w-full pl-10 pr-4 py-3 border ${
                    errors.businessAddress
                      ? "border-red-500"
                      : "border-gray-200"
                  } rounded-xl focus:outline-none focus:border-primary transition-colors`}
                />
              </div>
              {errors.businessAddress && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.businessAddress}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả doanh nghiệp
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <textarea
                  value={formData.businessDescription}
                  onChange={(e) =>
                    handleInputChange("businessDescription", e.target.value)
                  }
                  placeholder="Mô tả ngắn về doanh nghiệp và dịch vụ của bạn"
                  rows="4"
                  className={`w-full pl-10 pr-4 py-3 border ${
                    errors.businessDescription
                      ? "border-red-500"
                      : "border-gray-200"
                  } rounded-xl focus:outline-none focus:border-primary transition-colors resize-none`}
                />
              </div>
              {errors.businessDescription && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.businessDescription}
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

        {/* Step 3: Document Upload */}
        {/* {currentStep === 3 && (
          <div className="space-y-4">
            <div className="flex items-center mb-4">
              <button
                onClick={handleBack}
                className="mr-3 text-gray-600 hover:text-primary"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-semibold text-gray-800">
                Tài liệu xác thực
              </h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giấy phép kinh doanh
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-primary transition-colors">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  Tải lên giấy phép kinh doanh
                </p>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={(e) =>
                    handleFileUpload("businessLicense", e.target.files[0])
                  }
                  className="hidden"
                  id="businessLicense"
                />
                <label
                  htmlFor="businessLicense"
                  className="inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 hover:bg-primary hover:text-white transition-colors"
                >
                  Chọn tệp
                </label>
                {formData.businessLicense && (
                  <p className="text-sm text-green-600 mt-2">
                    ✓ {formData.businessLicense.name}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chứng chỉ/Bằng cấp (tùy chọn)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-primary transition-colors">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  Tải lên chứng chỉ hoặc bằng cấp liên quan
                </p>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  multiple
                  onChange={(e) =>
                    handleFileUpload(
                      "certifications",
                      Array.from(e.target.files)
                    )
                  }
                  className="hidden"
                  id="certifications"
                />
                <label
                  htmlFor="certifications"
                  className="inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 hover:bg-primary hover:text-white transition-colors"
                >
                  Chọn tệp
                </label>
                {formData.certifications &&
                  formData.certifications.length > 0 && (
                    <p className="text-sm text-green-600 mt-2">
                      ✓ {formData.certifications.length} tệp đã chọn
                    </p>
                  )}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-800">
                <strong>Lưu ý:</strong> Tài liệu sẽ được xem xét và xác thực bởi
                đội ngũ quản trị viên. Quá trình này có thể mất 1-3 ngày làm
                việc.
              </p>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-primary hover:bg-primary-hover text-white font-medium py-3 rounded-xl transition-colors"
            >
              Hoàn tất đăng ký
            </button>
          </div>
        )} */}

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
