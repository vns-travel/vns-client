import { useState } from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  Building,
  Download,
  RefreshCw,
  CheckCircle,
  Clock,
  XCircle,
  Filter,
  CreditCard,
  Banknote,
  ArrowDownLeft,
  ArrowUpRight,
} from "lucide-react";

const fmt = (n) => new Intl.NumberFormat("vi-VN").format(n) + " ₫";

const platformStats = {
  totalRevenue: 785000000,
  platformFees: 78500000,
  partnerPayouts: 706500000,
  pendingPayouts: 45200000,
  monthlyGrowth: 12.5,
  totalTransactions: 1240,
  refundAmount: 12300000,
  netProfit: 78500000,
};

const partnerPayouts = [
  { id: "PAY-001", partner: "Hanoi Heritage Hotel", amount: 45670000, fee: 4567000, net: 41103000, period: "T5/2024", status: "completed", date: "01/06/2024" },
  { id: "PAY-002", partner: "Mekong Delta Tours", amount: 28900000, fee: 2890000, net: 26010000, period: "T5/2024", status: "completed", date: "01/06/2024" },
  { id: "PAY-003", partner: "Phu Quoc Car Rental", amount: 19500000, fee: 1950000, net: 17550000, period: "T5/2024", status: "pending", date: "—" },
  { id: "PAY-004", partner: "Sapa Adventure Tours", amount: 35200000, fee: 3520000, net: 31680000, period: "T5/2024", status: "pending", date: "—" },
  { id: "PAY-005", partner: "Hoi An Boutique", amount: 22100000, fee: 2210000, net: 19890000, period: "T4/2024", status: "completed", date: "01/05/2024" },
];

const transactions = [
  { id: "TXN-001", type: "booking_fee", partner: "Hanoi Heritage Hotel", amount: 250000, date: "16/05/2024", status: "completed" },
  { id: "TXN-002", type: "booking_fee", partner: "Mekong Delta Tours", amount: 180000, date: "16/05/2024", status: "completed" },
  { id: "TXN-003", type: "refund", partner: "Phu Quoc Car Rental", amount: 120000, date: "15/05/2024", status: "completed" },
  { id: "TXN-004", type: "booking_fee", partner: "Sapa Adventure Tours", amount: 450000, date: "15/05/2024", status: "completed" },
  { id: "TXN-005", type: "payout", partner: "Hoi An Boutique", amount: 19890000, date: "14/05/2024", status: "pending" },
];

const txTypeConfig = {
  booking_fee: { label: "Phí đặt chỗ", color: "bg-green-100 text-green-800", icon: ArrowDownLeft, amountColor: "text-green-600" },
  refund: { label: "Hoàn tiền", color: "bg-orange-100 text-orange-800", icon: ArrowUpRight, amountColor: "text-orange-600" },
  payout: { label: "Thanh toán đối tác", color: "bg-blue-100 text-blue-800", icon: ArrowUpRight, amountColor: "text-blue-600" },
};

const ManagerFinance = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredPayouts = partnerPayouts.filter(
    (p) => filterStatus === "all" || p.status === filterStatus
  );

  return (
    <div className="min-h-screen bg-bg-light p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Tài chính nền tảng</h1>
            <p className="text-gray-500 text-sm">Theo dõi doanh thu, phí nền tảng và thanh toán đối tác</p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm">
              <Download className="w-4 h-4" />
              Xuất báo cáo
            </button>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
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

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  label: "Tổng doanh thu",
                  value: fmt(platformStats.totalRevenue),
                  sub: `+${platformStats.monthlyGrowth}% tháng trước`,
                  icon: DollarSign,
                  bg: "bg-green-100 text-green-600",
                  trend: true,
                },
                {
                  label: "Phí nền tảng (10%)",
                  value: fmt(platformStats.platformFees),
                  sub: `${platformStats.totalTransactions} giao dịch`,
                  icon: CreditCard,
                  bg: "bg-blue-100 text-blue-600",
                },
                {
                  label: "Đã thanh toán ĐT",
                  value: fmt(platformStats.partnerPayouts),
                  sub: `Chờ: ${fmt(platformStats.pendingPayouts)}`,
                  icon: Banknote,
                  bg: "bg-purple-100 text-purple-600",
                },
                {
                  label: "Hoàn tiền",
                  value: fmt(platformStats.refundAmount),
                  sub: "Tổng đã hoàn",
                  icon: TrendingDown,
                  bg: "bg-orange-100 text-orange-600",
                },
              ].map((card) => {
                const Icon = card.icon;
                return (
                  <div key={card.label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-2 rounded-lg ${card.bg}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      {card.trend && (
                        <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />+{platformStats.monthlyGrowth}%
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mb-1">{card.label}</p>
                    <p className="text-xl font-bold text-gray-900">{card.value}</p>
                    <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
                  </div>
                );
              })}
            </div>

            {/* Revenue breakdown */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-5">Phân bổ doanh thu tháng này</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 border border-green-100 rounded-xl">
                  <p className="text-sm font-medium text-green-800">Tổng doanh thu gộp</p>
                  <p className="text-2xl font-bold text-green-900 mt-1">{fmt(platformStats.totalRevenue)}</p>
                  <p className="text-xs text-green-600 mt-1">Từ {platformStats.totalTransactions} giao dịch</p>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                  <p className="text-sm font-medium text-blue-800">Phí nền tảng (10%)</p>
                  <p className="text-2xl font-bold text-blue-900 mt-1">{fmt(platformStats.platformFees)}</p>
                  <p className="text-xs text-blue-600 mt-1">Lợi nhuận ròng của nền tảng</p>
                </div>
                <div className="p-4 bg-purple-50 border border-purple-100 rounded-xl">
                  <p className="text-sm font-medium text-purple-800">Thanh toán cho đối tác</p>
                  <p className="text-2xl font-bold text-purple-900 mt-1">{fmt(platformStats.partnerPayouts)}</p>
                  <p className="text-xs text-purple-600 mt-1">90% doanh thu trả về đối tác</p>
                </div>
              </div>

              {/* Visual bar */}
              <div className="mt-5">
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                  <span>Phân bổ doanh thu</span>
                </div>
                <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden flex">
                  <div className="h-full bg-blue-400" style={{ width: "10%" }} title="Phí nền tảng 10%" />
                  <div className="h-full bg-purple-400" style={{ width: "84%" }} title="Đối tác 84%" />
                  <div className="h-full bg-orange-400" style={{ width: "6%" }} title="Hoàn tiền" />
                </div>
                <div className="flex gap-4 mt-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-400" />Phí NTảng 10%</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-purple-400" />Đối tác 84%</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-orange-400" />Hoàn tiền</span>
                </div>
              </div>
            </div>

            {/* Top partners by revenue */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Top đối tác doanh thu cao nhất</h3>
              <div className="space-y-3">
                {partnerPayouts.slice(0, 4).map((p, i) => (
                  <div key={p.id} className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-gray-100 rounded-full text-xs font-bold text-gray-600 flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700 truncate">{p.partner}</span>
                        <span className="text-sm font-semibold text-gray-900 ml-2">{fmt(p.amount)}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div
                          className="bg-primary h-1.5 rounded-full"
                          style={{ width: `${(p.amount / partnerPayouts[0].amount) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Payouts Tab */}
        {activeTab === "payouts" && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3 items-center justify-between">
              <div className="flex gap-2">
                {["all", "pending", "completed"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setFilterStatus(s)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                      filterStatus === s ? "bg-primary text-white" : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {s === "all" ? "Tất cả" : s === "pending" ? "Chờ xử lý" : "Đã thanh toán"}
                  </button>
                ))}
              </div>
              <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                <Download className="w-4 h-4" />
                Xuất danh sách
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {["Mã", "Đối tác", "Doanh thu gộp", "Phí NT (10%)", "Thực nhận", "Kỳ", "Trạng thái", "Ngày TT"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredPayouts.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-xs text-gray-500">{p.id}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{p.partner}</td>
                      <td className="px-4 py-3 text-gray-700">{fmt(p.amount)}</td>
                      <td className="px-4 py-3 text-blue-600 font-medium">- {fmt(p.fee)}</td>
                      <td className="px-4 py-3 text-green-600 font-semibold">{fmt(p.net)}</td>
                      <td className="px-4 py-3 text-gray-500">{p.period}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                          p.status === "completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {p.status === "completed"
                            ? <><CheckCircle className="w-3 h-3" /> Đã TT</>
                            : <><Clock className="w-3 h-3" /> Chờ xử lý</>}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{p.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {["Mã GD", "Loại", "Đối tác", "Số tiền", "Ngày", "Trạng thái"].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {transactions.map((t) => {
                  const tc = txTypeConfig[t.type];
                  const TIcon = tc.icon;
                  return (
                    <tr key={t.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-mono text-xs text-gray-500">{t.id}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${tc.color}`}>
                          <TIcon className="w-3 h-3" /> {tc.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{t.partner}</td>
                      <td className={`px-6 py-4 font-semibold ${tc.amountColor}`}>{fmt(t.amount)}</td>
                      <td className="px-6 py-4 text-gray-500">{t.date}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                          t.status === "completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {t.status === "completed"
                            ? <><CheckCircle className="w-3 h-3" /> Hoàn thành</>
                            : <><Clock className="w-3 h-3" /> Đang xử lý</>}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerFinance;
