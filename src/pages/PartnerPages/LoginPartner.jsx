import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, User, Building } from "lucide-react";

const LoginPartner = () => {
  const [activeTab, setActiveTab] = useState("partner");
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

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

    // Mock login - replace with actual API call
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (activeTab === "partner") {
        navigate("/PartnerDashboard");
      } else {
        navigate("/ManagerDashboard");
      }
    } catch (err) {
      setError("Thông tin đăng nhập không hợp lệ hoặc lỗi máy chủ.");
    }
  };

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
          <div className="flex mb-6 bg-gray-100 rounded-xl p-1">
            <button
              type="button"
              onClick={() => setActiveTab("partner")}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                activeTab === "partner"
                  ? "bg-white shadow-sm text-primary"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <User className="w-4 h-4" />
              Đối tác
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("manager")}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                activeTab === "manager"
                  ? "bg-white shadow-sm text-primary"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Building className="w-4 h-4" />
              Quản lý
            </button>
          </div>

          {/* Tab Content */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 text-center">
              {activeTab === "partner"
                ? "Đăng nhập Đối tác"
                : "Đăng nhập Quản lý"}
            </h3>
          </div>

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
              className="bg-primary hover:bg-primary-hover w-full py-3 px-4 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-3 focus:ring-primary/50 focus:ring-offset-2 text-center"
            >
              Đăng nhập
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
