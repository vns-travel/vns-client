import { useState, useEffect } from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Download,
  RefreshCw,
  CheckCircle,
  Clock,
  Filter,
  CreditCard,
  Banknote,
  ArrowDownLeft,
} from "lucide-react";
import { paymentService } from "../../services/paymentService";

const fmt = (n) => new Intl.NumberFormat("vi-VN").format(n) + " ₫";

const ManagerFinance = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [filterStatus, setFilterStatus] = useState("all");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const result = await paymentService.getPlatformRevenue();
      setData(result);
    } catch (err) {
      setError(err.message || "Không thể tải dữ liệu tài chính.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const summary = data?.summary ?? {};
  const partnerBreakdown = data?.partnerBreakdown ?? [];
  const transactions = data?.transactions ?? [];

  // The "payouts" tab reuses partnerBreakdown filtered by a mock status since
  // we don't yet have a payout workflow — show all partners.
  const filteredPartners = filterStatus === "all"
    ? partnerBreakdown
    : partnerBreakdown; // future: filter by payout status

  return (
    <div className="min-h-screen bg-bg-light p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Tài chính nền tảng</h1>
            <p className="text-gray-500 text-sm">
              Theo dõi doanh thu, phí nền tảng và thanh toán đối tác
            </p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm">
              <Download className="w-4 h-4" />
              Xuất báo cáo
            </button>
            <button
              onClick={load}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <RefreshCw className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: "overview", label: "Tổng quan" },
              { id: "payouts", label: "Thanh toán đối tác" },
              { id: "transactions", label: "Giao dịch" },
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
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  label: "Tổng doanh thu",
                  value: loading ? "—" : fmt(summary.totalGross ?? 0),
                  sub: `${summary.totalTransactions ?? 0} giao dịch`,
                  icon: DollarSign,
                  bg: "bg-green-100 text-green-600",
                },
                {
                  label: `Phí nền tảng (${summary.feeRatePercent ?? 10}%)`,
                  value: loading ? "—" : fmt(summary.totalFees ?? 0),
                  sub: "Thu về cho nền tảng",
                  icon: CreditCard,
                  bg: "bg-blue-100 text-blue-600",
                },
                {
                  label: "Đã trả đối tác",
                  value: loading ? "—" : fmt(summary.totalPayouts ?? 0),
                  sub: `${100 - (summary.feeRatePercent ?? 10)}% doanh thu`,
                  icon: Banknote,
                  bg: "bg-purple-100 text-purple-600",
                },
                {
                  label: "Hoàn tiền",
                  value: "—",
                  sub: "Tổng đã hoàn",
                  icon: TrendingDown,
                  bg: "bg-orange-100 text-orange-600",
                },
              ].map((card) => {
                const Icon = card.icon;
                return (
                  <div
                    key={card.label}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-5"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-2 rounded-lg ${card.bg}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mb-1">{card.label}</p>
                    <p className="text-xl font-bold text-gray-900">{card.value}</p>
                    <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
                  </div>
                );
              })}
            </div>

            {/* Revenue breakdown */}
            {!loading && data && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-5">Phân bổ doanh thu</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-green-50 border border-green-100 rounded-xl">
                    <p className="text-sm font-medium text-green-800">Tổng doanh thu gộp</p>
                    <p className="text-2xl font-bold text-green-900 mt-1">
                      {fmt(summary.totalGross ?? 0)}
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      Từ {summary.totalTransactions ?? 0} giao dịch
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                    <p className="text-sm font-medium text-blue-800">
                      Phí nền tảng ({summary.feeRatePercent ?? 10}%)
                    </p>
                    <p className="text-2xl font-bold text-blue-900 mt-1">
                      {fmt(summary.totalFees ?? 0)}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">Lợi nhuận ròng của nền tảng</p>
                  </div>
                  <div className="p-4 bg-purple-50 border border-purple-100 rounded-xl">
                    <p className="text-sm font-medium text-purple-800">Thanh toán cho đối tác</p>
                    <p className="text-2xl font-bold text-purple-900 mt-1">
                      {fmt(summary.totalPayouts ?? 0)}
                    </p>
                    <p className="text-xs text-purple-600 mt-1">
                      {100 - (summary.feeRatePercent ?? 10)}% doanh thu trả về đối tác
                    </p>
                  </div>
                </div>

                {/* Visual bar */}
                {summary.totalGross > 0 && (
                  <div className="mt-5">
                    <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden flex">
                      <div
                        className="h-full bg-blue-400"
                        style={{ width: `${summary.feeRatePercent ?? 10}%` }}
                        title={`Phí nền tảng ${summary.feeRatePercent ?? 10}%`}
                      />
                      <div
                        className="h-full bg-purple-400"
                        style={{ width: `${100 - (summary.feeRatePercent ?? 10)}%` }}
                        title="Đối tác"
                      />
                    </div>
                    <div className="flex gap-4 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                        Phí NT {summary.feeRatePercent ?? 10}%
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                        Đối tác {100 - (summary.feeRatePercent ?? 10)}%
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Top partners */}
            {!loading && partnerBreakdown.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Top đối tác doanh thu cao nhất
                </h3>
                <div className="space-y-3">
                  {partnerBreakdown.slice(0, 5).map((p, i) => (
                    <div key={p.partnerId} className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-gray-100 rounded-full text-xs font-bold text-gray-600 flex items-center justify-center flex-shrink-0">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700 truncate">
                            {p.businessName || "—"}
                          </span>
                          <span className="text-sm font-semibold text-gray-900 ml-2">
                            {fmt(p.totalGross)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                          <div
                            className="bg-primary h-1.5 rounded-full"
                            style={{
                              width: `${partnerBreakdown[0].totalGross > 0
                                ? (p.totalGross / partnerBreakdown[0].totalGross) * 100
                                : 0}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Payouts Tab */}
        {activeTab === "payouts" && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3 items-center justify-between">
              <div className="flex gap-2">
                {["all"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setFilterStatus(s)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                      filterStatus === s
                        ? "bg-primary text-white"
                        : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    Tất cả
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {loading ? (
                <div className="text-center py-12 text-gray-400 text-sm">Đang tải...</div>
              ) : filteredPartners.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-sm">
                  Chưa có dữ liệu đối tác
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      {["Đối tác", "Doanh thu gộp", `Phí NT (${summary.feeRatePercent ?? 10}%)`, "Thực nhận", "Giao dịch"].map(
                        (h) => (
                          <th
                            key={h}
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                          >
                            {h}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredPartners.map((p) => (
                      <tr key={p.partnerId} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {p.businessName || "—"}
                        </td>
                        <td className="px-4 py-3 text-gray-700">{fmt(p.totalGross)}</td>
                        <td className="px-4 py-3 text-blue-600 font-medium">
                          - {fmt(p.totalFees)}
                        </td>
                        <td className="px-4 py-3 text-green-600 font-semibold">
                          {fmt(p.totalNet)}
                        </td>
                        <td className="px-4 py-3 text-gray-500">{p.transactions}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === "transactions" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Lịch sử giao dịch</h3>
              <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                <Filter className="w-4 h-4" />
                Lọc
              </button>
            </div>
            {loading ? (
              <div className="text-center py-12 text-gray-400 text-sm">Đang tải...</div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-sm">Chưa có giao dịch</div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {["Đối tác", "Dịch vụ", "Doanh thu", "Phí NT", "Thực nhận", "Ngày TT"].map(
                      (h) => (
                        <th
                          key={h}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {transactions.map((t) => (
                    <tr key={t.paymentId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-700">{t.partnerName ?? "—"}</td>
                      <td className="px-6 py-4 text-gray-700 max-w-xs truncate">
                        {t.serviceTitle ?? "—"}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        <span className="inline-flex items-center gap-1 text-green-600">
                          <ArrowDownLeft className="w-3 h-3" />
                          {fmt(t.amount)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-blue-600">
                        {t.platformFeeAmount != null ? fmt(t.platformFeeAmount) : "—"}
                      </td>
                      <td className="px-6 py-4 text-purple-600 font-medium">
                        {t.partnerPayoutAmount != null ? fmt(t.partnerPayoutAmount) : "—"}
                      </td>
                      <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                        {t.paidAt
                          ? new Date(t.paidAt).toLocaleDateString("vi-VN")
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerFinance;
