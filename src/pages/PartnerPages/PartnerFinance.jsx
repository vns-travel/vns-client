import { useState } from "react";
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  RefreshCw,
  Filter,
  Download,
  ArrowUpRight,
  ArrowDownLeft,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Banknote,
} from "lucide-react";

const fmt = (n) => new Intl.NumberFormat("vi-VN").format(n) + " ₫";

const revenueData = {
  totalEarnings: 45670000,
  monthlyEarnings: 8450000,
  monthlyGrowth: 12.5,
  totalTransactions: 124,
  pendingAmount: 2350000,
  platformFeeRate: 10,
  platformFee: 4567000,
  netEarnings: 41103000,
};

const transactions = [
  {
    id: "TXN-001",
    date: "15/06/2026",
    amount: 2500000,
    type: "booking",
    service: "Phòng Deluxe - Nguyễn Văn A",
    status: "completed",
  },
  {
    id: "TXN-002",
    date: "14/06/2026",
    amount: 1200000,
    type: "booking",
    service: "City Tour - Trần Thị B",
    status: "completed",
  },
  {
    id: "TXN-003",
    date: "13/06/2026",
    amount: 800000,
    type: "refund",
    service: "Hoàn tiền - Lê Văn C",
    status: "pending",
  },
  {
    id: "TXN-004",
    date: "12/06/2026",
    amount: 4500000,
    type: "booking",
    service: "Phòng Suite - Phạm Thị D",
    status: "completed",
  },
  {
    id: "TXN-005",
    date: "11/06/2026",
    amount: 1800000,
    type: "booking",
    service: "Gói Spa - Hoàng Văn E",
    status: "completed",
  },
  {
    id: "TXN-006",
    date: "10/06/2026",
    amount: 3200000,
    type: "withdrawal",
    service: "Rút tiền về tài khoản ngân hàng",
    status: "completed",
  },
];

const reports = [
  {
    id: 1,
    name: "Báo cáo thu nhập tháng 5/2026",
    type: "earnings",
    date: "01/06/2026",
    size: "2.4 MB",
  },
  {
    id: 2,
    name: "Báo cáo hiệu suất Q1 2026",
    type: "performance",
    date: "01/04/2026",
    size: "5.1 MB",
  },
  {
    id: 3,
    name: "Tổng hợp chi phí tháng 5/2026",
    type: "expenses",
    date: "01/06/2026",
    size: "1.8 MB",
  },
  {
    id: 4,
    name: "Phân tích hoàn tiền Q1 2026",
    type: "refunds",
    date: "01/04/2026",
    size: "3.2 MB",
  },
];

const typeConfig = {
  booking: {
    label: "Đặt chỗ",
    color: "bg-green-100 text-green-800",
    icon: ArrowDownLeft,
    iconColor: "text-green-500",
  },
  refund: {
    label: "Hoàn tiền",
    color: "bg-orange-100 text-orange-800",
    icon: ArrowUpRight,
    iconColor: "text-orange-500",
  },
  withdrawal: {
    label: "Rút tiền",
    color: "bg-blue-100 text-blue-800",
    icon: ArrowUpRight,
    iconColor: "text-blue-500",
  },
};

const reportTypeConfig = {
  earnings: { label: "Thu nhập", color: "bg-green-100 text-green-800" },
  performance: { label: "Hiệu suất", color: "bg-blue-100 text-blue-800" },
  expenses: { label: "Chi phí", color: "bg-red-100 text-red-800" },
  refunds: { label: "Hoàn tiền", color: "bg-orange-100 text-orange-800" },
};

const PartnerFinance = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [selectedReport, setSelectedReport] = useState("earnings");
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");

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
          <button
            onClick={() => setShowWithdrawModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover"
          >
            <Banknote className="w-4 h-4" />
            Yêu cầu rút tiền
          </button>
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

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Tổng thu nhập",
                  value: fmt(revenueData.totalEarnings),
                  sub: `Sau phí: ${fmt(revenueData.netEarnings)}`,
                  icon: DollarSign,
                  trend: "+12.5%",
                  trendUp: true,
                  iconBg: "bg-green-100 text-green-600",
                },
                {
                  title: "Tháng này",
                  value: fmt(revenueData.monthlyEarnings),
                  sub: `Tăng ${revenueData.monthlyGrowth}% tháng trước`,
                  icon: TrendingUp,
                  trend: "+12.5%",
                  trendUp: true,
                  iconBg: "bg-blue-100 text-blue-600",
                },
                {
                  title: "Chờ thanh toán",
                  value: fmt(revenueData.pendingAmount),
                  sub: "Sẽ giải ngân trong 3-5 ngày",
                  icon: Clock,
                  iconBg: "bg-yellow-100 text-yellow-600",
                },
                {
                  title: "Phí nền tảng",
                  value: fmt(revenueData.platformFee),
                  sub: `${revenueData.platformFeeRate}% trên tổng doanh thu`,
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
                      {card.trend && (
                        <span
                          className={`text-xs font-medium flex items-center gap-1 ${card.trendUp ? "text-green-600" : "text-red-600"}`}
                        >
                          <TrendingUp className="w-3 h-3" />
                          {card.trend}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mb-1">{card.title}</p>
                    <p className="text-xl font-bold text-gray-900">
                      {card.value}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
                  </div>
                );
              })}
            </div>

            {/* Revenue breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 border border-green-100 rounded-xl p-5">
                <p className="text-sm font-medium text-green-800 mb-2">
                  Doanh thu gộp
                </p>
                <p className="text-2xl font-bold text-green-900">
                  {fmt(revenueData.totalEarnings)}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  {revenueData.totalTransactions} giao dịch
                </p>
              </div>
              <div className="bg-red-50 border border-red-100 rounded-xl p-5">
                <p className="text-sm font-medium text-red-800 mb-2">
                  Phí nền tảng ({revenueData.platformFeeRate}%)
                </p>
                <p className="text-2xl font-bold text-red-900">
                  - {fmt(revenueData.platformFee)}
                </p>
                <p className="text-xs text-red-600 mt-1">
                  Được khấu trừ tự động
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
                <p className="text-sm font-medium text-blue-800 mb-2">
                  Thu nhập thực
                </p>
                <p className="text-2xl font-bold text-blue-900">
                  {fmt(revenueData.netEarnings)}
                </p>
                <p className="text-xs text-blue-600 mt-1">Sau khi trừ phí</p>
              </div>
            </div>

            {/* Transactions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900">
                  Giao dịch gần đây
                </h3>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                    <Filter className="w-4 h-4" />
                    Lọc
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      {[
                        "Mã GD",
                        "Ngày",
                        "Mô tả",
                        "Loại",
                        "Trạng thái",
                        "Số tiền",
                      ].map((h) => (
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
                      const tc = typeConfig[t.type];
                      const TIcon = tc.icon;
                      return (
                        <tr key={t.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-mono text-xs text-gray-600">
                            {t.id}
                          </td>
                          <td className="px-6 py-4 text-gray-600">{t.date}</td>
                          <td className="px-6 py-4 text-gray-700 max-w-xs truncate">
                            {t.service}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${tc.color}`}
                            >
                              <TIcon className="w-3 h-3" />
                              {tc.label}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                                t.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {t.status === "completed" ? (
                                <>
                                  <CheckCircle className="w-3 h-3" /> Hoàn thành
                                </>
                              ) : (
                                <>
                                  <Clock className="w-3 h-3" /> Đang chờ
                                </>
                              )}
                            </span>
                          </td>
                          <td
                            className={`px-6 py-4 font-semibold ${t.type === "booking" ? "text-green-600" : "text-red-500"}`}
                          >
                            {t.type === "booking" ? "+" : "-"}
                            {fmt(t.amount)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === "reports" && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4">
                Bộ lọc báo cáo
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Loại báo cáo
                  </label>
                  <select
                    value={selectedReport}
                    onChange={(e) => setSelectedReport(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white"
                  >
                    <option value="earnings">Thu nhập</option>
                    <option value="expenses">Chi phí</option>
                    <option value="refunds">Hoàn tiền</option>
                    <option value="performance">Hiệu suất</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kỳ báo cáo
                  </label>
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white"
                  >
                    <option value="monthly">Hàng tháng</option>
                    <option value="quarterly">Hàng quý</option>
                    <option value="yearly">Hàng năm</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover">
                    <Filter className="w-4 h-4" />
                    Áp dụng
                  </button>
                </div>
              </div>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-gray-700">
                    Tổng kết tháng
                  </p>
                  <div className="p-1.5 bg-green-100 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {fmt(revenueData.monthlyEarnings)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Tổng thu nhập tháng này
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-gray-700">
                    Tăng trưởng quý
                  </p>
                  <div className="p-1.5 bg-blue-100 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">+18.2%</p>
                <p className="text-xs text-gray-500 mt-1">So với quý trước</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-gray-700">
                    Tỷ lệ hoàn tiền
                  </p>
                  <div className="p-1.5 bg-orange-100 rounded-lg">
                    <RefreshCw className="w-4 h-4 text-orange-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">2.3%</p>
                <p className="text-xs text-gray-500 mt-1">
                  Trên tổng giao dịch
                </p>
              </div>
            </div>

            {/* Reports list */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-base font-semibold text-gray-900">
                  Báo cáo khả dụng
                </h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  Truy cập và tải xuống báo cáo tài chính
                </p>
              </div>
              <div className="divide-y divide-gray-50">
                {reports.map((r) => {
                  const rc = reportTypeConfig[r.type];
                  return (
                    <div
                      key={r.id}
                      className="flex items-center justify-between px-6 py-4 hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <FileText className="w-4 h-4 text-gray-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {r.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {r.size} · {r.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${rc.color}`}
                        >
                          {rc.label}
                        </span>
                        <button
                          className="p-1.5 text-gray-400 hover:text-primary hover:bg-gray-100 rounded"
                          title="Tải xuống"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Yêu cầu rút tiền
            </h3>
            <p className="text-sm text-gray-500 mb-5">
              Số dư khả dụng:{" "}
              <span className="font-semibold text-green-600">
                {fmt(revenueData.netEarnings)}
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
