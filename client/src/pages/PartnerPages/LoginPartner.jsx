import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Lock, User, Building, Shield } from "lucide-react";
import { authService } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

const ROLE_ROUTES = {
  Partner: "/PartnerDashboard",
  Manager: "/ManagerDashboard",
  SuperAdmin: "/AdminDashboard",
};

const LoginPartner = () => {
  const [activeTab, setActiveTab] = useState("partner");
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const successMessage = location.state?.message;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setError("Vui lòng nhập cả email và mật khẩu.");
      return;
    }

    setLoading(true);
    try {
      const data = await authService.login(form.email, form.password);
      login(data);

      const role = data.role || data.Role || data.userRole;
      const route = ROLE_ROUTES[role] || ROLE_ROUTES["Partner"];
      navigate(route);
    } catch (err) {
      setError(err.message || "Thông tin đăng nhập không hợp lệ hoặc lỗi máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "partner", label: "Đối tác", icon: <User className="w-4 h-4" /> },
    { id: "manager", label: "Quản lý", icon: <Building className="w-4 h-4" /> },
    { id: "admin", label: "Super Admin", icon: <Shield className="w-4 h-4" /> },
  ];

  return (
    <div className="bg-bg-light min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <div className="bg-primary w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">VNS Login</h2>
            <p className="text-gray-600">Đăng nhập vào tài khoản của bạn</p>
          </div>

          {/* Tab Switcher */}
          <div className="flex mb-6 bg-gray-100 rounded-xl p-1 gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2.5 px-2 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 ${
                  activeTab === tab.id
                    ? "bg-white shadow-sm text-primary"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 text-center">
              {tabs.find((t) => t.id === activeTab)?.label} — Đăng nhập
            </h3>
          </div>

          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm mb-4">
              {successMessage}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-3 focus:ring-primary/20 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                autoComplete="email"
                placeholder="Nhập email của bạn"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mật khẩu
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-3 focus:ring-primary/20 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                autoComplete="current-password"
                placeholder="Nhập mật khẩu của bạn"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-primary hover:bg-primary-hover w-full py-3 px-4 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-3 focus:ring-primary/50 focus:ring-offset-2 text-center disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>

          <div className="mt-8 space-y-4">
            {activeTab === "partner" && (
              <div className="flex items-center">
                <div className="flex-1 border-t border-gray-200"></div>
                <a
                  href="/RegisterPartner"
                  className="text-black text-sm font-medium hover:underline transition-colors duration-200 mx-4"
                >
                  Tạo tài khoản
                </a>
                <div className="flex-1 border-t border-gray-200"></div>
              </div>
            )}

            <div className="text-center">
              <a
                href="/ForgotPassword"
                className="text-primary text-sm font-medium hover:underline transition-colors duration-200"
              >
                Quên mật khẩu?
              </a>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                Cần trợ giúp? Liên hệ với quản trị viên của bạn
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPartner;
