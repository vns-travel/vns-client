import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  User,
  Building,
  Mail,
  Phone,
  Lock,
  Shield,
  Upload,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { uploadImage } from "../../utils/uploadImage";
import { userService } from "../../services/userService";
import { useAuth } from "../../context/AuthContext";

function DocUploadZone({ docKey, label, doc, inputRef, onUpload, onDrop }) {
  return (
    <div
      className="border-2 border-dashed border-gray-300 rounded-lg p-5 text-center hover:border-primary-hover transition-colors cursor-pointer"
      onClick={() => !doc.uploading && inputRef.current?.click()}
      onDrop={(e) => onDrop(docKey, e)}
      onDragOver={(e) => e.preventDefault()}
    >
      {doc.uploading ? (
        <>
          <Loader2 className="w-7 h-7 text-primary animate-spin mx-auto mb-2" />
          <p className="text-sm text-gray-500">Đang tải lên...</p>
        </>
      ) : doc.url ? (
        <>
          <CheckCircle className="w-7 h-7 text-green-500 mx-auto mb-2" />
          <img
            src={doc.url}
            alt="Tài liệu đã tải"
            className="h-20 object-contain mx-auto rounded mb-2"
          />
          <p className="text-xs text-gray-500">Nhấn để thay thế</p>
        </>
      ) : (
        <>
          <Upload className="w-7 h-7 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <span className="text-primary hover:text-primary-hover font-medium text-xs">
            Chọn tệp hoặc kéo thả
          </span>
        </>
      )}
      {doc.error && (
        <p className="text-xs text-red-500 mt-2 flex items-center justify-center gap-1">
          <AlertCircle className="w-3 h-3" /> {doc.error}
        </p>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onUpload(docKey, e.target.files?.[0])}
      />
    </div>
  );
}

const EMPTY_FORM = {
  fullName: "",
  businessName: "",
  email: "",
  phone: "",
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export default function PartnerProfileEdit() {
  const { user, login } = useAuth();

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [savedProfile, setSavedProfile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);

  // Each doc tracks its own status loaded from partner_documents.status.
  // status is null when not yet uploaded (badge hidden), 'pending' after upload,
  // 'approved'/'rejected' after manager action.
  const [docs, setDocs] = useState({
    houseRental: { url: null, status: null, uploading: false, error: null },
    tours:       { url: null, status: null, uploading: false, error: null },
    carRentals:  { url: null, status: null, uploading: false, error: null },
  });

  const houseRentalRef = useRef(null);
  const toursRef = useRef(null);
  const carRentalsRef = useRef(null);

  const docRefs = {
    houseRental: houseRentalRef,
    tours: toursRef,
    carRentals: carRentalsRef,
  };

  // Map DB doc_type strings → component doc keys
  const DOC_TYPE_MAP = {
    house_rental: "houseRental",
    tours: "tours",
    car_rentals: "carRentals",
  };

  // Map component doc keys → DB doc_type strings
  const DOC_KEY_TO_TYPE = {
    houseRental: "house_rental",
    tours: "tours",
    carRentals: "car_rentals",
  };

  // Map partner verify_status enum → badge variant
  const mapVerifyStatus = (status) => {
    if (status === "approved") return "verified";
    if (status === "pending" || status === "reviewing") return "pending";
    return "not_verified";
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const profile = await userService.getMe();
        const values = {
          ...EMPTY_FORM,
          fullName:     profile.fullName     || "",
          businessName: profile.businessName || "",
          email:        profile.email        || "",
          phone:        profile.phone        || "",
        };
        setFormData(values);
        setSavedProfile(values);

        // Restore uploaded document URLs + per-doc status from DB
        if (Array.isArray(profile.documents)) {
          const docUpdates = {};
          for (const { docType, fileUrl, status } of profile.documents) {
            const key = DOC_TYPE_MAP[docType];
            if (key) docUpdates[key] = { url: fileUrl, status: status || 'pending', uploading: false, error: null };
          }
          if (Object.keys(docUpdates).length > 0) {
            setDocs((prev) => ({ ...prev, ...docUpdates }));
          }
        }
      } catch (err) {
        setLoadError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Show Save/Cancel only when the user has actually changed something
  const isDirty = useMemo(() => {
    if (!savedProfile) return false;
    const profileChanged =
      formData.fullName     !== savedProfile.fullName     ||
      formData.phone        !== savedProfile.phone        ||
      formData.businessName !== savedProfile.businessName;
    const passwordTouched =
      formData.currentPassword || formData.newPassword || formData.confirmPassword;
    return profileChanged || !!passwordTouched;
  }, [formData, savedProfile]);

  const handleDocUpload = async (key, file) => {
    if (!file) return;
    setDocs((prev) => ({
      ...prev,
      [key]: { url: null, uploading: true, error: null },
    }));
    try {
      const url = await uploadImage(file);
      // Persist to DB so the URL survives a page refresh; new uploads start as 'pending'
      await userService.upsertDocument(DOC_KEY_TO_TYPE[key], url);
      setDocs((prev) => ({
        ...prev,
        [key]: { url, status: 'pending', uploading: false, error: null },
      }));
    } catch (err) {
      setDocs((prev) => ({
        ...prev,
        [key]: { url: null, uploading: false, error: err.message || "Tải lên thất bại" },
      }));
    }
  };

  const handleDocDrop = (key, e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleDocUpload(key, file);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSaveMessage(null);
  };

  const handleCancel = () => {
    if (savedProfile) {
      setFormData({ ...savedProfile, currentPassword: "", newPassword: "", confirmPassword: "" });
    }
    setShowPasswordSection(false);
    setSaveMessage(null);
  };

  const handleSave = async () => {
    setSaveMessage(null);

    if (formData.newPassword || formData.confirmPassword || formData.currentPassword) {
      if (!formData.currentPassword) {
        setSaveMessage({ type: "error", text: "Vui lòng nhập mật khẩu hiện tại" });
        return;
      }
      if (!formData.newPassword) {
        setSaveMessage({ type: "error", text: "Vui lòng nhập mật khẩu mới" });
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        setSaveMessage({ type: "error", text: "Mật khẩu mới không khớp" });
        return;
      }
      if (formData.newPassword.length < 8) {
        setSaveMessage({ type: "error", text: "Mật khẩu mới phải có ít nhất 8 ký tự" });
        return;
      }
    }

    setSaving(true);
    try {
      const tasks = [];

      const profileChanged =
        formData.fullName     !== savedProfile?.fullName     ||
        formData.phone        !== savedProfile?.phone        ||
        formData.businessName !== savedProfile?.businessName;

      if (profileChanged) {
        tasks.push(
          userService.updateMe({
            fullName:     formData.fullName     || undefined,
            phone:        formData.phone        || undefined,
            businessName: formData.businessName !== undefined ? formData.businessName : undefined,
          }),
        );
      }

      const passwordFilled =
        formData.currentPassword && formData.newPassword && formData.confirmPassword;

      if (passwordFilled) {
        tasks.push(
          userService.changePassword({
            currentPassword: formData.currentPassword,
            newPassword:     formData.newPassword,
          }),
        );
      }

      if (tasks.length === 0) {
        setSaveMessage({ type: "error", text: "Không có thay đổi nào để lưu" });
        return;
      }

      const results = await Promise.all(tasks);

      if (profileChanged && results[0]) {
        const updated = results[0];
        const newSnapshot = {
          ...savedProfile,
          fullName:     updated.fullName     || formData.fullName,
          phone:        updated.phone        || formData.phone,
          businessName: updated.businessName !== undefined ? updated.businessName : formData.businessName,
        };
        setSavedProfile(newSnapshot);
        if (user) login({ ...user, fullName: updated.fullName });
      }

      setFormData((prev) => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }));
      setShowPasswordSection(false);
      setSaveMessage({ type: "success", text: "Lưu thay đổi thành công!" });
    } catch (err) {
      setSaveMessage({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "verified":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" /> Đã Xác Minh
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <AlertCircle className="w-3 h-3 mr-1" /> Đang Chờ
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
            <AlertCircle className="w-3 h-3 mr-1" /> Chưa Xác Minh
          </span>
        );
    }
  };

  if (loadError) {
    return (
      <div className="min-h-screen bg-bg-light p-6 flex items-center justify-center">
        <div className="bg-white rounded-xl border border-red-200 p-6 text-center max-w-md">
          <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-3" />
          <p className="text-red-600 font-medium">Không thể tải hồ sơ</p>
          <p className="text-sm text-gray-400 mt-1">{loadError}</p>
          <button onClick={() => window.location.reload()} className="mt-4 text-sm text-primary hover:underline">
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-light pb-20">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="pt-6 px-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Hồ Sơ Đối Tác</h1>
          <p className="text-gray-500 text-sm">Quản lý thông tin tài khoản và xác minh tài liệu</p>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="max-w-7xl mx-auto p-6 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

          {/* LEFT — partner info + password */}
          <div className="lg:col-span-2 space-y-5">

            {/* Account Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                <h2 className="text-base font-semibold text-gray-900">Thông Tin Tài Khoản</h2>
              </div>
              <div className="p-6">
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="space-y-2">
                        <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
                        <div className="h-10 bg-gray-100 rounded animate-pulse" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Tên Doanh Nghiệp
                      </label>
                      <div className="relative">
                        <Building className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          name="businessName"
                          value={formData.businessName}
                          onChange={handleInputChange}
                          placeholder="Tên công ty hoặc cơ sở kinh doanh"
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-hover focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Địa Chỉ Email
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          readOnly
                          className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Số Điện Thoại
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-hover focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Password & Security — collapsible */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <button
                type="button"
                onClick={() => setShowPasswordSection((v) => !v)}
                className="w-full px-6 py-4 flex items-center justify-between border-b border-gray-100"
              >
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-primary" />
                  <h2 className="text-base font-semibold text-gray-900">Đổi Mật Khẩu</h2>
                </div>
                {showPasswordSection
                  ? <ChevronUp className="w-4 h-4 text-gray-400" />
                  : <ChevronDown className="w-4 h-4 text-gray-400" />
                }
              </button>

              {showPasswordSection && (
                <div className="p-6 space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Mật Khẩu Hiện Tại
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        placeholder="••••••••"
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-hover focus:border-transparent"
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShowCurrentPassword((v) => !v)}
                        className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                      >
                        {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Mật Khẩu Mới
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleInputChange}
                          placeholder="••••••••"
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-hover focus:border-transparent"
                        />
                        <button
                          type="button"
                          tabIndex={-1}
                          onClick={() => setShowNewPassword((v) => !v)}
                          className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Xác Nhận Mật Khẩu
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          placeholder="••••••••"
                          className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
                            formData.confirmPassword && formData.newPassword !== formData.confirmPassword
                              ? "border-red-300 focus:ring-red-200"
                              : formData.confirmPassword && formData.newPassword === formData.confirmPassword
                              ? "border-green-300 focus:ring-green-200"
                              : "border-gray-300 focus:ring-primary-hover"
                          }`}
                        />
                        <button
                          type="button"
                          tabIndex={-1}
                          onClick={() => setShowConfirmPassword((v) => !v)}
                          className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                        <p className="text-xs text-red-500 mt-1">Mật khẩu không khớp</p>
                      )}
                      {formData.confirmPassword && formData.newPassword === formData.confirmPassword && (
                        <p className="text-xs text-green-600 mt-1">Mật khẩu khớp</p>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-gray-400">Mật khẩu phải có ít nhất 8 ký tự.</p>
                </div>
              )}
            </div>

            {/* Save feedback */}
            {saveMessage && (
              <div
                className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium ${
                  saveMessage.type === "success"
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {saveMessage.type === "success"
                  ? <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  : <AlertCircle className="w-4 h-4 flex-shrink-0" />
                }
                {saveMessage.text}
                <button className="ml-auto" onClick={() => setSaveMessage(null)}>
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Save / Cancel — only when something has changed */}
            {isDirty && (
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  className="px-5 py-2 border border-gray-300 bg-slate-100 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors disabled:opacity-50"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving || loading}
                  className="px-5 py-2 text-white rounded-lg hover:bg-primary-hover font-medium transition-colors disabled:opacity-60 flex items-center gap-2"
                  style={{ backgroundColor: "var(--color-primary)" }}
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {saving ? "Đang lưu..." : "Lưu Thay Đổi"}
                </button>
              </div>
            )}
          </div>

          {/* RIGHT — document uploads */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                <h2 className="text-base font-semibold text-gray-900">Xác Minh Tài Liệu</h2>
              </div>
              <div className="p-6 space-y-6">

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-800">Giấy Phép Cho Thuê Nhà</h3>
                    {docs.houseRental.url && getStatusBadge(mapVerifyStatus(docs.houseRental.status))}
                  </div>
                  <DocUploadZone
                    docKey="houseRental"
                    label="Tải lên giấy phép"
                    doc={docs.houseRental}
                    inputRef={houseRentalRef}
                    onUpload={handleDocUpload}
                    onDrop={handleDocDrop}
                  />
                </div>

                <div className="border-t border-gray-100" />

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-800">Giấy Phép Đặt Tour</h3>
                    {docs.tours.url && getStatusBadge(mapVerifyStatus(docs.tours.status))}
                  </div>
                  <DocUploadZone
                    docKey="tours"
                    label="Tải lên giấy phép"
                    doc={docs.tours}
                    inputRef={toursRef}
                    onUpload={handleDocUpload}
                    onDrop={handleDocDrop}
                  />
                </div>

                <div className="border-t border-gray-100" />

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-800">Giấy Phép Cho Thuê Xe</h3>
                    {docs.carRentals.url && getStatusBadge(mapVerifyStatus(docs.carRentals.status))}
                  </div>
                  <DocUploadZone
                    docKey="carRentals"
                    label="Tải lên giấy phép"
                    doc={docs.carRentals}
                    inputRef={carRentalsRef}
                    onUpload={handleDocUpload}
                    onDrop={handleDocDrop}
                  />
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
