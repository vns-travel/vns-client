import React, { useState } from "react";

const PartnerFinance = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [selectedReport, setSelectedReport] = useState("earnings");

  const revenueData = {
    totalEarnings: 45250.75,
    monthlyGrowth: 12.5,
    totalTransactions: 1247,
    pendingAmount: 2350.5,
  };

  const recentTransactions = [
    {
      id: "01",
      date: "2025-06-15",
      amount: 125.5,
      type: "Phí dịch vụ",
      status: "Đã hoàn thành",
    },
    {
      id: "02",
      date: "2025-06-14",
      amount: 89.25,
      type: "Phí dịch vụ",
      status: "Đã hoàn thành",
    },
    {
      id: "03",
      date: "2025-06-13",
      amount: 250.0,
      type: "Hoàn tiền",
      status: "Đang chờ",
    },
    {
      id: "04",
      date: "2025-06-12",
      amount: 67.8,
      type: "Phí dịch vụ",
      status: "Đã hoàn thành",
    },
    {
      id: "05",
      date: "2025-06-11",
      amount: 180.45,
      type: "Phí dịch vụ",
      status: "Đã hoàn thành",
    },
  ];

  const reports = [
    {
      id: 1,
      name: "Báo cáo thu nhập tháng 5/2025",
      type: "earnings",
      period: "monthly",
      date: "2025-06-01",
      size: "2.4 MB",
    },
    {
      id: 2,
      name: "Báo cáo hiệu suất Q1 2025",
      type: "performance",
      period: "quarterly",
      date: "2025-04-01",
      size: "5.1 MB",
    },
    {
      id: 3,
      name: "Tổng hợp chi phí tháng 5/2025",
      type: "expenses",
      period: "monthly",
      date: "2025-06-01",
      size: "1.8 MB",
    },
    {
      id: 4,
      name: "Phân tích hoàn tiền Q1 2025",
      type: "refunds",
      period: "quarterly",
      date: "2025-04-01",
      size: "3.2 MB",
    },
  ];

  const StatCard = ({ title, value, change, icon: Icon, trend }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className="h-12 w-12 bg-gray-50 rounded-lg flex items-center justify-center">
          <Icon className="h-6 w-6 text-gray-600" />
        </div>
      </div>
      {change && (
        <div className="mt-4 flex items-center">
          {trend === "up" ? (
            <svg
              className="h-4 w-4 text-green-500 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          ) : (
            <svg
              className="h-4 w-4 text-red-500 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          )}
          <span
            className={`text-sm font-medium ${
              trend === "up" ? "text-green-600" : "text-red-600"
            }`}
          >
            {change}% so với tháng trước
          </span>
        </div>
      )}
    </div>
  );

  const TransactionRow = ({ transaction }) => (
    <tr className="border-b border-gray-100 hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {transaction.id}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        {transaction.date}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(transaction.amount)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        {transaction.type}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            transaction.status === "Đã hoàn thành"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {transaction.status}
        </span>
      </td>
    </tr>
  );

  const ReportRow = ({ report }) => (
    <tr className="border-b border-gray-100 hover:bg-gray-50">
      <td className="px-6 py-4">
        <div className="flex items-center">
          <svg
            className="h-5 w-5 text-gray-400 mr-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <div>
            <p className="text-sm font-medium text-gray-900">{report.name}</p>
            <p className="text-xs text-gray-500">{report.size}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            report.type === "earnings"
              ? "bg-green-100 text-green-800"
              : report.type === "expenses"
                ? "bg-red-100 text-red-800"
                : report.type === "refunds"
                  ? "bg-orange-100 text-orange-800"
                  : "bg-blue-100 text-blue-800"
          }`}
        >
          {report.type === "earnings"
            ? "Thu nhập"
            : report.type === "expenses"
              ? "Chi phí"
              : report.type === "refunds"
                ? "Hoàn tiền"
                : "Hiệu suất"}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        {report.date}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button className="text-[#008fa0] hover:text-[#007a8a] mr-3">
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        </button>
        <button className="text-[#008fa0] hover:text-[#007a8a]">
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
        </button>
      </td>
    </tr>
  );

  // Icon components using Tailwind CSS (Heroicons)
  const DollarSign = ({ className }) => (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );

  const TrendingUp = ({ className }) => (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
      />
    </svg>
  );

  const Calendar = ({ className }) => (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  );

  const CreditCard = ({ className }) => (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
      />
    </svg>
  );

  const RefreshCw = ({ className }) => (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  );

  const Filter = ({ className }) => (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
      />
    </svg>
  );

  return (
    <div className="min-h-screen bg-[#e9e9e9] p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto ">
        <div className="flex justify-between items-center pt-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Báo cáo tài chính
            </h1>
            <p className="text-gray-600">
              Theo dõi thu nhập và hiệu suất tài chính của bạn{" "}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("overview")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "overview"
                    ? "border-[#008fa0] text-[#008fa0]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Tổng quan doanh thu
              </button>
              <button
                onClick={() => setActiveTab("reports")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "reports"
                    ? "border-[#008fa0] text-[#008fa0]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Báo cáo tài chính
              </button>
            </nav>
          </div>
        </div>

        {/* Revenue Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Tổng thu nhập"
                value={new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(revenueData.totalEarnings)}
                change={revenueData.monthlyGrowth}
                icon={DollarSign}
                trend="up"
              />
              <StatCard
                title="Tổng giao dịch"
                value={revenueData.totalTransactions.toLocaleString()}
                change={8.2}
                icon={CreditCard}
                trend="up"
              />
              <StatCard
                title="Số tiền đang chờ"
                value={new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(revenueData.pendingAmount)}
                icon={TrendingUp}
              />
              <StatCard
                title="Tháng này"
                value={new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(3450.75)}
                change={15.3}
                icon={Calendar}
                trend="up"
              />
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">
                    Giao dịch gần đây
                  </h3>
                  <div className="flex items-center space-x-3">
                    <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                      <Filter className="h-4 w-4 mr-2" />
                      Bộ lọc
                    </button>
                    <button className="text-[#008fa0] hover:text-[#007a8a] text-sm font-medium">
                      Xem tất cả
                    </button>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mã giao dịch
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ngày
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Số tiền
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Loại
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentTransactions.map((transaction) => (
                      <TransactionRow
                        key={transaction.id}
                        transaction={transaction}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Financial Reports Tab */}
        {activeTab === "reports" && (
          <div className="space-y-8">
            {/* Report Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Bộ lọc báo cáo
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loại báo cáo
                  </label>
                  <select
                    value={selectedReport}
                    onChange={(e) => setSelectedReport(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#008fa0] focus:border-[#008fa0] outline-none"
                  >
                    <option value="earnings">Thu nhập</option>
                    <option value="expenses">Chi phí</option>
                    <option value="refunds">Hoàn tiền</option>
                    <option value="performance">Hiệu suất</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kỳ báo cáo
                  </label>
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#008fa0] focus:border-[#008fa0] outline-none"
                  >
                    <option value="monthly">Hàng tháng</option>
                    <option value="quarterly">Hàng quý</option>
                    <option value="yearly">Hàng năm</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Available Reports */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Báo cáo khả dụng
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Truy cập và tải xuống báo cáo tài chính của bạn
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tên báo cáo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Loại
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ngày tạo
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hành động
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reports.map((report) => (
                      <ReportRow key={report.id} report={report} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Report Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium text-gray-900">
                    Tổng kết tháng
                  </h4>
                  <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-2">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(3450.75)}
                </p>
                <p className="text-sm text-gray-600">Tổng thu nhập tháng này</p>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium text-gray-900">
                    Tăng trưởng quý
                  </h4>
                  <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="h-4 w-4 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 10l7-7m0 0l7 7m-7-7v18"
                      />
                    </svg>
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-2">+18.2%</p>
                <p className="text-sm text-gray-600">So với quý trước</p>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium text-gray-900">
                    Tỷ lệ hoàn tiền
                  </h4>
                  <div className="h-8 w-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <RefreshCw className="h-4 w-4 text-orange-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-2">2.3%</p>
                <p className="text-sm text-gray-600">Trên tổng giao dịch</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PartnerFinance;
