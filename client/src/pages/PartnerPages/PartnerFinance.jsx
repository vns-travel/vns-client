import { useState, useEffect } from "react";
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  RefreshCw,
  Filter,
  Download,
  ArrowDownLeft,
  ArrowUpRight,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Banknote,
} from "lucide-react";
import { paymentService } from "../../services/paymentService";

const fmt = (n) => new Intl.NumberFormat("vi-VN").format(n) + " ₫";

const statusConfig = {
  paid: {
    label: "Hoàn thành",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
  },
  pending: {
    label: "Đang chờ",
    color: "bg-yellow-100 text-yellow-800",
    icon: Clock,
  },
  failed: {
    label: "Thất bại",
    color: "bg-red-100 text-red-800",
    icon: AlertCircle,
  },
};

const PartnerFinance = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const result = await paymentService.getPartnerEarnings();
      setData(result);
    } catch (err) {
      setError(err.message || "Không thể tải dữ liệu tài chính.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const summary = data?.summary ?? {};
  const transactions = data?.transactions ?? [];

  return (
    <div className="min-h-screen bg-bg-light p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Tài chính</h1>
            <p className="text-gray-500 text-sm">
              Theo dõi thu nhập và hiệu suất tài chính của bạn
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={load}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              title="Làm mới"
            >
              <RefreshCw className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={() => setShowWithdrawModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover"
            >
              <Banknote className="w-4 h-4" />
              Yêu cầu rút tiền
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: "overview", label: "Tổng quan doanh thu" },
              { id: "reports", label: "Báo cáo tài chính" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === t.id
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-6">
            {error}
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Tổng thu nhập",
                  value: loading ? "—" : fmt(summary.totalGross ?? 0),
                  icon: DollarSign,
                  iconBg: "bg-green-100 text-green-600",
                },
                {
                  title: "Tháng này",
                  value: loading ? "—" : fmt(summary.monthlyGross ?? 0),
                  icon: TrendingUp,
                  iconBg: "bg-blue-100 text-blue-600",
                },
                {
                  title: "Chờ thanh toán",
                  value: loading ? "—" : fmt(summary.pendingAmount ?? 0),
                  icon: Clock,
                  iconBg: "bg-yellow-100 text-yellow-600",
                },
                {
                  title: `Phí nền tảng (${summary.feeRatePercent ?? 10}%)`,
                  value: loading ? "—" : fmt(summary.totalFees ?? 0),
                  icon: CreditCard,
                  iconBg: "bg-purple-100 text-purple-600",
                },
              ].map((card) => {
                const Icon = card.icon;
                return (
                  <div
                    key={card.title}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-2 rounded-lg ${card.iconBg}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mb-1">{card.title}</p>
                    <p className="text-xl font-bold text-gray-900">{card.value}</p>
                  </div>
                );
              })}
            </div>

            {/* Revenue breakdown */}
            {!loading && data && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 border border-green-100 rounded-xl p-5">
                  <p className="text-sm font-medium text-green-800 mb-2">Doanh thu gộp</p>
                  <p className="text-2xl font-bold text-green-900">
                    {fmt(summary.totalGross ?? 0)}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    {summary.totalTransactions ?? 0} giao dịch
                  </p>
                </div>
                <div className="bg-red-50 border border-red-100 rounded-xl p-5">
                  <p className="text-sm font-medium text-red-800 mb-2">
                    Phí nền tảng ({summary.feeRatePercent ?? 10}%)
                  </p>
                  <p className="text-2xl font-bold text-red-900">
                    - {fmt(summary.totalFees ?? 0)}
                  </p>
                  <p className="text-xs text-red-600 mt-1">Được khấu trừ tự động</p>
                </div>
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
                  <p className="text-sm font-medium text-blue-800 mb-2">Thu nhập thực</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {fmt(summary.totalNet ?? 0)}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">Sau khi trừ phí</p>
                </div>
              </div>
            )}

            {/* Transactions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900">Giao dịch gần đây</h3>
                <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                  <Filter className="w-4 h-4" />
                  Lọc
                </button>
              </div>
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="text-center py-12 text-gray-400 text-sm">Đang tải...</div>
                ) : transactions.length === 0 ? (
                  <div className="text-center py-12 text-gray-400 text-sm">
                    Chưa có giao dịch nào
                  </div>
                ) : (
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        {["Ngày", "Dịch vụ", "Trạng thái", "Phí NT", "Thực nhận"].map((h) => (
                          <th
                            key={h}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {transactions.map((t) => {
                        const sc = statusConfig[t.status] ?? statusConfig.pending;
                        const SIcon = sc.icon;
                        return (
                          <tr key={t.paymentId} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                              {t.paidAt
                                ? new Date(t.paidAt).toLocaleDateString("vi-VN")
                                : new Date(t.createdAt).toLocaleDateString("vi-VN")}
                            </td>
                            <td className="px-6 py-4 text-gray-700 max-w-xs truncate">
                              {t.serviceTitle}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${sc.color}`}
                              >
                                <SIcon className="w-3 h-3" />
                                {sc.label}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-red-500 text-sm">
                              {t.platformFeeAmount != null
                                ? `- ${fmt(t.platformFeeAmount)}`
                                : "—"}
                            </td>
                            <td className="px-6 py-4 font-semibold text-green-600">
                              {t.partnerPayoutAmount != null
                                ? fmt(t.partnerPayoutAmount)
                                : fmt(t.amount)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Reports Tab — static list, no API yet */}
        {activeTab === "reports" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-gray-700">Tổng kết tháng</p>
                  <div className="p-1.5 bg-green-100 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? "—" : fmt(summary.monthlyGross ?? 0)}
                </p>
                <p className="text-xs text-gray-500 mt-1">Tổng thu nhập tháng này</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-gray-700">Thu nhập thực tháng này</p>
                  <div className="p-1.5 bg-blue-100 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? "—" : fmt(summary.monthlyNet ?? 0)}
                </p>
                <p className="text-xs text-gray-500 mt-1">Sau khi trừ phí nền tảng</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-gray-700">Tổng giao dịch</p>
                  <div className="p-1.5 bg-orange-100 rounded-lg">
                    <FileText className="w-4 h-4 text-orange-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? "—" : (summary.totalTransactions ?? 0)}
                </p>
                <p className="text-xs text-gray-500 mt-1">Toàn bộ lịch sử</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Yêu cầu rút tiền</h3>
            <p className="text-sm text-gray-500 mb-5">
              Số dư khả dụng:{" "}
              <span className="font-semibold text-green-600">
                {fmt(summary.totalNet ?? 0)}
              </span>
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số tiền muốn rút (₫)
                </label>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="VD: 5000000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tài khoản ngân hàng
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary bg-white">
                  <option>Vietcombank - **** 4521</option>
                  <option>Techcombank - **** 8832</option>
                </select>
              </div>
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-700">
                  Thời gian xử lý 3–5 ngày làm việc. Phí giao dịch: miễn phí.
                </p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover font-medium"
              >
                Xác nhận rút tiền
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnerFinance;
