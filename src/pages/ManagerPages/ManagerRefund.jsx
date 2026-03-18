import { useState } from "react";
import {
  RefreshCw,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  ShieldCheck,
  ShieldX,
  User,
  Building,
  Home,
  Car,
  Compass,
  CreditCard,
  MessageSquare,
  ArrowRight,
  Banknote,
  ThumbsUp,
  ThumbsDown,
  X,
  ImageIcon,
  Scale,
  Flag,
} from "lucide-react";

const fmt = (n) => new Intl.NumberFormat("vi-VN").format(n) + " ₫";
const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "—";

// ─── Mock Data ──────────────────────────────────────────────────────────────

const MOCK_REFUNDS = [
  {
    id: "RF-001",
    bookingId: "VNS-HB-20241501",
    serviceType: "Homestay",
    serviceName: "Oceanview Deluxe Homestay",
    partnerName: "Hanoi Heritage Hotel",
    customerName: "Nguyễn Văn Minh",
    customerEmail: "nguyen.minh@gmail.com",
    bookingAmount: 7500000,
    paidAmount: 7500000,
    paymentMethod: "ZaloPay",
    requestDate: "2026-05-25",
    requestedAmount: 5000000,
    cancellationReason:
      "Kế hoạch thay đổi đột ngột, gia đình có việc bận không thể đến check-in đúng hạn.",
    images: ["cancellation-proof-1.jpg", "cancellation-proof-2.jpg"],
    partnerDecision: "approved",
    partnerApprovedAmount: 4500000,
    partnerDecisionDate: "2026-05-26",
    partnerNote: "Đồng ý hoàn 60% do hủy trước 7 ngày theo chính sách.",
    managerStatus: "pending_review",
    policyCompliant: null,
    managerNote: null,
    finalAmount: null,
    managerDecisionDate: null,
    daysBeforeService: 16,
    bookingDate: "2026-05-20",
  },
  {
    id: "RF-002",
    bookingId: "VNS-TB-20241508",
    serviceType: "Tour",
    serviceName: "Tour Phú Quốc 3N2Đ Trọn Gói",
    partnerName: "Mekong Delta Tours",
    customerName: "Hoàng Thị Lan",
    customerEmail: "hoang.lan@email.com",
    bookingAmount: 6400000,
    paidAmount: 6400000,
    paymentMethod: "PayOS",
    requestDate: "2026-06-13",
    requestedAmount: 6400000,
    cancellationReason:
      "Người thân trong gia đình bị ốm đột xuất nên không thể tham gia tour.",
    images: ["benh-vien-giay-xac-nhan.jpg", "don-thuoc-bac-si.jpg"],
    partnerDecision: "pending",
    partnerApprovedAmount: null,
    partnerDecisionDate: null,
    partnerNote: null,
    managerStatus: "waiting_partner",
    policyCompliant: null,
    managerNote: null,
    finalAmount: null,
    managerDecisionDate: null,
    daysBeforeService: 7,
    bookingDate: "2026-06-01",
  },
  {
    id: "RF-003",
    bookingId: "VNS-VB-20241509",
    serviceType: "Car Rental",
    serviceName: "Thuê Xe SUV Toyota Fortuner 7 Chỗ",
    partnerName: "Cho Thuê Xe Đức Anh",
    customerName: "Lê Quang Huy",
    customerEmail: "huy.le@email.com",
    bookingAmount: 3600000,
    paidAmount: 3600000,
    paymentMethod: "Chuyển khoản",
    requestDate: "2026-06-05",
    requestedAmount: 3600000,
    cancellationReason:
      "Đặt nhầm ngày, muốn đổi lịch nhưng đối tác không hỗ trợ đổi ngày.",
    images: ["screenshot-booking.jpg"],
    partnerDecision: "rejected",
    partnerApprovedAmount: null,
    partnerDecisionDate: "2026-06-06",
    partnerNote:
      "Theo chính sách, hủy trong vòng 48 giờ trước khi nhận xe không được hoàn tiền.",
    managerStatus: "disputed",
    policyCompliant: null,
    managerNote: null,
    finalAmount: null,
    managerDecisionDate: null,
    daysBeforeService: 2,
    bookingDate: "2026-06-03",
    disputeReason:
      "Khách hàng khiếu nại rằng đã gọi điện yêu cầu đổi lịch trước 72 giờ nhưng nhân viên đối tác từ chối và không ghi nhận.",
  },
  {
    id: "RF-004",
    bookingId: "VNS-HB-20241510",
    serviceType: "Homestay",
    serviceName: "Biệt Thự Mountain View Đà Lạt",
    partnerName: "Dalat Riverside Resort",
    customerName: "Trần Thị Bích",
    customerEmail: "bich.tran@email.com",
    bookingAmount: 9000000,
    paidAmount: 9000000,
    paymentMethod: "ZaloPay",
    requestDate: "2026-06-02",
    requestedAmount: 9000000,
    cancellationReason:
      "Dịch vụ không đúng như mô tả: phòng không có view núi, thiếu các tiện ích đã quảng cáo.",
    images: [
      "anh-phong-thuc-te-1.jpg",
      "anh-phong-thuc-te-2.jpg",
      "anh-quang-cao.jpg",
    ],
    partnerDecision: "rejected",
    partnerApprovedAmount: null,
    partnerDecisionDate: "2026-06-03",
    partnerNote: "Phòng đúng tiêu chuẩn, khách hàng đổi ý.",
    managerStatus: "disputed",
    policyCompliant: null,
    managerNote: null,
    finalAmount: null,
    managerDecisionDate: null,
    daysBeforeService: 18,
    bookingDate: "2026-05-15",
    disputeReason:
      "Khách hàng cung cấp ảnh chụp thực tế khác hoàn toàn ảnh quảng cáo. Vi phạm chính sách mô tả dịch vụ trung thực.",
  },
  {
    id: "RF-005",
    bookingId: "VNS-TB-20241511",
    serviceType: "Tour",
    serviceName: "Hội An Cultural Heritage Walk",
    partnerName: "Mekong Delta Tours",
    customerName: "Phạm Thu Hà",
    customerEmail: "ha.pham@email.com",
    bookingAmount: 1400000,
    paidAmount: 1400000,
    paymentMethod: "PayOS",
    requestDate: "2026-06-08",
    requestedAmount: 1400000,
    cancellationReason: "Tour bị hủy do thời tiết xấu, đơn vị tổ chức thông báo hủy.",
    images: ["thong-bao-huy-tour.jpg"],
    partnerDecision: "approved",
    partnerApprovedAmount: 1400000,
    partnerDecisionDate: "2026-06-08",
    partnerNote: "Tour hủy do bất khả kháng, hoàn toàn bộ tiền.",
    managerStatus: "approved",
    policyCompliant: true,
    managerNote: "Hủy do thiên tai/thời tiết, chính sách hoàn 100%. Duyệt.",
    finalAmount: 1400000,
    managerDecisionDate: "2026-06-09",
    daysBeforeService: 2,
    bookingDate: "2026-06-01",
  },
  {
    id: "RF-006",
    bookingId: "VNS-VB-20241512",
    serviceType: "Car Rental",
    serviceName: "Thuê Xe Sedan Mercedes C-Class",
    partnerName: "Cho Thuê Xe Đức Anh",
    customerName: "Đặng Thị Mai",
    customerEmail: "dang.mai@email.com",
    bookingAmount: 1800000,
    paidAmount: 1800000,
    paymentMethod: "Chuyển khoản",
    requestDate: "2026-06-28",
    requestedAmount: 1800000,
    cancellationReason: "Thay đổi lịch trình cá nhân, không cần thuê xe nữa.",
    images: [],
    partnerDecision: "rejected",
    partnerApprovedAmount: null,
    partnerDecisionDate: "2026-06-29",
    partnerNote: "Hủy cùng ngày dịch vụ, không đủ điều kiện hoàn tiền.",
    managerStatus: "rejected",
    policyCompliant: true,
    managerNote:
      "Hủy cùng ngày, đúng chính sách không hoàn tiền. Đồng ý với quyết định của đối tác.",
    finalAmount: 0,
    managerDecisionDate: "2026-06-30",
    daysBeforeService: 0,
    bookingDate: "2026-06-25",
  },
];

const MANAGER_STATUS_CONFIG = {
  waiting_partner: {
    label: "Chờ đối tác",
    color: "bg-gray-100 text-gray-700 border-gray-200",
    icon: Clock,
  },
  pending_review: {
    label: "Chờ duyệt",
    color: "bg-blue-100 text-blue-700 border-blue-200",
    icon: Clock,
  },
  disputed: {
    label: "Tranh chấp",
    color: "bg-orange-100 text-orange-700 border-orange-200",
    icon: Flag,
  },
  approved: {
    label: "Đã duyệt",
    color: "bg-green-100 text-green-700 border-green-200",
    icon: CheckCircle,
  },
  rejected: {
    label: "Đã từ chối",
    color: "bg-red-100 text-red-700 border-red-200",
    icon: XCircle,
  },
};

const PARTNER_DECISION_CONFIG = {
  pending: { label: "Chưa xử lý", color: "text-gray-500" },
  approved: { label: "Đồng ý hoàn", color: "text-green-600" },
  rejected: { label: "Từ chối hoàn", color: "text-red-600" },
};

const SERVICE_ICON = { Homestay: Home, Tour: Compass, "Car Rental": Car };

// ─── Sub-components ─────────────────────────────────────────────────────────

function SummaryCard({ label, value, sub, icon: Icon, color, alert }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 relative">
      {alert && (
        <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full" />
      )}
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-xl font-bold text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function ManagerRefund() {
  const [refunds, setRefunds] = useState(MOCK_REFUNDS);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPartner, setFilterPartner] = useState("all");
  const [filterService, setFilterService] = useState("all");
  const [viewItem, setViewItem] = useState(null);
  const [actionMode, setActionMode] = useState(null); // "approve" | "reject"
  const [actionDraft, setActionDraft] = useState({ amount: "", note: "", compliant: "" });

  // ── Stats ────────────────────────────────────────────────────────────────

  const pendingReview = refunds.filter((r) => r.managerStatus === "pending_review").length;
  const disputed = refunds.filter((r) => r.managerStatus === "disputed").length;
  const approved = refunds.filter((r) => r.managerStatus === "approved").length;
  const totalRefunded = refunds
    .filter((r) => r.managerStatus === "approved")
    .reduce((s, r) => s + (r.finalAmount || 0), 0);

  const metrics = [
    {
      label: "Chờ duyệt",
      value: pendingReview,
      sub: "Đối tác đã xử lý xong",
      color: "bg-blue-100 text-blue-600",
      icon: Clock,
      alert: pendingReview > 0,
    },
    {
      label: "Tranh chấp",
      value: disputed,
      sub: "Cần điều tra thêm",
      color: "bg-orange-100 text-orange-600",
      icon: Flag,
      alert: disputed > 0,
    },
    {
      label: "Đã duyệt hoàn tiền",
      value: approved,
      sub: "Trong kỳ này",
      color: "bg-green-100 text-green-600",
      icon: CheckCircle,
    },
    {
      label: "Tổng tiền đã hoàn",
      value: fmt(totalRefunded),
      sub: "Đã được duyệt",
      color: "bg-purple-100 text-purple-600",
      icon: Banknote,
    },
  ];

  // ── Filter ───────────────────────────────────────────────────────────────

  const partners = [...new Set(refunds.map((r) => r.partnerName))];

  const filtered = refunds.filter((r) => {
    if (search) {
      const q = search.toLowerCase();
      if (
        !r.customerName.toLowerCase().includes(q) &&
        !r.id.toLowerCase().includes(q) &&
        !r.bookingId.toLowerCase().includes(q) &&
        !r.serviceName.toLowerCase().includes(q)
      )
        return false;
    }
    if (filterStatus !== "all" && r.managerStatus !== filterStatus) return false;
    if (filterPartner !== "all" && r.partnerName !== filterPartner) return false;
    if (filterService !== "all" && r.serviceType !== filterService) return false;
    return true;
  });

  // ── Actions ──────────────────────────────────────────────────────────────

  const openAction = (mode) => {
    setActionMode(mode);
    setActionDraft({
      amount: mode === "approve" ? String(viewItem.partnerApprovedAmount ?? viewItem.requestedAmount) : "",
      note: "",
      compliant: "yes",
    });
  };

  const handleApprove = () => {
    const amount = Number(actionDraft.amount);
    if (!amount || amount <= 0) return;
    const updated = {
      ...viewItem,
      managerStatus: "approved",
      finalAmount: amount,
      policyCompliant: actionDraft.compliant === "yes",
      managerNote: actionDraft.note || null,
      managerDecisionDate: new Date().toISOString().split("T")[0],
    };
    setRefunds((prev) => prev.map((r) => (r.id === viewItem.id ? updated : r)));
    setViewItem(updated);
    setActionMode(null);
  };

  const handleReject = () => {
    if (!actionDraft.note.trim()) return;
    const updated = {
      ...viewItem,
      managerStatus: "rejected",
      finalAmount: 0,
      policyCompliant: actionDraft.compliant === "yes",
      managerNote: actionDraft.note,
      managerDecisionDate: new Date().toISOString().split("T")[0],
    };
    setRefunds((prev) => prev.map((r) => (r.id === viewItem.id ? updated : r)));
    setViewItem(updated);
    setActionMode(null);
  };

  const canAct = (r) =>
    r.managerStatus === "pending_review" || r.managerStatus === "disputed";

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-bg-light p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Quản Lý Hoàn Tiền</h1>
          <p className="text-gray-500 text-sm">
            Xem xét quyết định của đối tác, đảm bảo tuân thủ chính sách và phê duyệt thanh toán hoàn tiền
          </p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((m) => (
            <SummaryCard key={m.label} {...m} />
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Bộ lọc</h3>
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Tìm mã, tên khách, dịch vụ..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="waiting_partner">Chờ đối tác</option>
              <option value="pending_review">Chờ duyệt</option>
              <option value="disputed">Tranh chấp</option>
              <option value="approved">Đã duyệt</option>
              <option value="rejected">Đã từ chối</option>
            </select>
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={filterService}
              onChange={(e) => setFilterService(e.target.value)}
            >
              <option value="all">Tất cả dịch vụ</option>
              <option value="Homestay">Homestay</option>
              <option value="Tour">Tour</option>
              <option value="Car Rental">Cho thuê xe</option>
            </select>
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={filterPartner}
              onChange={(e) => setFilterPartner(e.target.value)}
            >
              <option value="all">Tất cả đối tác</option>
              {partners.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">Danh sách yêu cầu hoàn tiền</h3>
              <span className="w-5 h-5 bg-blue-100 text-blue-800 text-xs rounded-full flex items-center justify-center font-bold">
                {filtered.length}
              </span>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="py-12 text-center">
              <RefreshCw className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Không có yêu cầu nào phù hợp</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr>
                    {["Mã / Đặt chỗ", "Khách hàng", "Đối tác & Dịch vụ", "Số tiền", "Quyết định đối tác", "Trạng thái", ""].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((r) => {
                    const StatusCfg = MANAGER_STATUS_CONFIG[r.managerStatus];
                    const StatusIcon = StatusCfg.icon;
                    const SvcIcon = SERVICE_ICON[r.serviceType];
                    return (
                      <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-4 whitespace-nowrap">
                          <p className="text-sm font-semibold text-gray-900">{r.id}</p>
                          <p className="text-xs text-gray-400">{r.bookingId}</p>
                          <p className="text-xs text-gray-400">{fmtDate(r.requestDate)}</p>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                              {r.customerName.split(" ").pop()[0]}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{r.customerName}</p>
                              <p className="text-xs text-gray-400">{r.customerEmail}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-sm font-medium text-gray-900 truncate max-w-[180px]">{r.serviceName}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Building className="w-3 h-3 text-gray-400" />
                            <p className="text-xs text-gray-500">{r.partnerName}</p>
                          </div>
                          <span className="inline-flex items-center gap-1 text-xs px-1.5 py-0.5 mt-1 bg-gray-100 text-gray-600 rounded">
                            <SvcIcon className="w-3 h-3" />{r.serviceType}
                          </span>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <p className="text-sm font-semibold text-gray-900">{fmt(r.requestedAmount)}</p>
                          <p className="text-xs text-gray-400">/ {fmt(r.paidAmount)} đã trả</p>
                          {r.partnerApprovedAmount != null && (
                            <p className="text-xs text-green-600 mt-0.5">
                              ĐT duyệt: {fmt(r.partnerApprovedAmount)}
                            </p>
                          )}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className={`text-xs font-medium ${PARTNER_DECISION_CONFIG[r.partnerDecision].color}`}>
                            {PARTNER_DECISION_CONFIG[r.partnerDecision].label}
                          </span>
                          {r.partnerDecisionDate && (
                            <p className="text-xs text-gray-400 mt-0.5">{fmtDate(r.partnerDecisionDate)}</p>
                          )}
                          {r.managerStatus === "disputed" && (
                            <span className="inline-flex items-center gap-0.5 text-xs text-orange-600 mt-1">
                              <Flag className="w-3 h-3" /> Khiếu nại
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full border ${StatusCfg.color}`}>
                            <StatusIcon className="w-3 h-3" />
                            {StatusCfg.label}
                          </span>
                          {r.managerStatus === "approved" && r.finalAmount != null && (
                            <p className="text-xs text-green-600 mt-1 font-medium">{fmt(r.finalAmount)}</p>
                          )}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-right">
                          <button
                            onClick={() => { setViewItem(r); setActionMode(null); }}
                            className="text-xs text-primary font-medium hover:underline flex items-center gap-1 ml-auto"
                          >
                            <Eye className="w-3.5 h-3.5" /> Xem
                          </button>
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

      {/* ── Detail Modal ─────────────────────────────────────────────────── */}
      {viewItem && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => { setViewItem(null); setActionMode(null); }}
        >
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              {/* Modal header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-bold text-gray-900">
                    Chi tiết yêu cầu hoàn tiền — {viewItem.id}
                  </h2>
                </div>
                <button onClick={() => { setViewItem(null); setActionMode(null); }} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status bar */}
              <div className="flex flex-wrap gap-2 mb-5">
                {(() => {
                  const cfg = MANAGER_STATUS_CONFIG[viewItem.managerStatus];
                  const Icon = cfg.icon;
                  return (
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${cfg.color}`}>
                      <Icon className="w-4 h-4" /> {cfg.label}
                    </span>
                  );
                })()}
                {viewItem.policyCompliant === true && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-green-50 text-green-700 border border-green-200">
                    <ShieldCheck className="w-4 h-4" /> Tuân thủ chính sách
                  </span>
                )}
                {viewItem.policyCompliant === false && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-red-50 text-red-700 border border-red-200">
                    <ShieldX className="w-4 h-4" /> Vi phạm chính sách
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                {/* Customer */}
                <div className="p-4 border border-gray-100 rounded-lg bg-gray-50">
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Khách hàng</p>
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">
                      {viewItem.customerName.split(" ").pop()[0]}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{viewItem.customerName}</p>
                      <p className="text-xs text-gray-500">{viewItem.customerEmail}</p>
                    </div>
                  </div>
                </div>

                {/* Partner */}
                <div className="p-4 border border-gray-100 rounded-lg bg-gray-50">
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Đối tác</p>
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                      <Building className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{viewItem.partnerName}</p>
                      <p className="text-xs text-gray-500">{viewItem.serviceName}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking & payment info */}
              <div className="p-4 border border-gray-100 rounded-lg mb-4">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Thông tin đặt chỗ & thanh toán</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500 text-xs">Mã đặt chỗ</p>
                    <p className="font-medium text-gray-900">{viewItem.bookingId}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Ngày đặt</p>
                    <p className="font-medium text-gray-900">{fmtDate(viewItem.bookingDate)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Đã thanh toán</p>
                    <p className="font-medium text-gray-900">{fmt(viewItem.paidAmount)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Phương thức</p>
                    <p className="font-medium text-gray-900">{viewItem.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Ngày yêu cầu hoàn</p>
                    <p className="font-medium text-gray-900">{fmtDate(viewItem.requestDate)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Số tiền yêu cầu</p>
                    <p className="font-semibold text-gray-900">{fmt(viewItem.requestedAmount)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Trước dịch vụ</p>
                    <p className={`font-medium ${viewItem.daysBeforeService <= 1 ? "text-red-600" : viewItem.daysBeforeService <= 3 ? "text-orange-600" : "text-gray-900"}`}>
                      {viewItem.daysBeforeService} ngày
                    </p>
                  </div>
                </div>
              </div>

              {/* Cancellation reason */}
              <div className="mb-4">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1.5">Lý do hủy của khách</p>
                <p className="text-sm text-gray-700 p-3 bg-gray-50 border border-gray-100 rounded-lg leading-relaxed">
                  {viewItem.cancellationReason}
                </p>
              </div>

              {/* Attached files */}
              {viewItem.images?.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1.5">Tài liệu đính kèm</p>
                  <div className="flex flex-wrap gap-2">
                    {viewItem.images.map((img) => (
                      <span key={img} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 border border-gray-200 rounded-md text-xs text-gray-700">
                        <ImageIcon className="w-3.5 h-3.5 text-gray-400" />{img}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Dispute info */}
              {viewItem.disputeReason && (
                <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Flag className="w-4 h-4 text-orange-600" />
                    <p className="text-sm font-medium text-orange-800">Nội dung khiếu nại</p>
                  </div>
                  <p className="text-sm text-orange-700 leading-relaxed">{viewItem.disputeReason}</p>
                </div>
              )}

              {/* Partner decision */}
              <div className="mb-5 p-4 border border-gray-100 rounded-lg">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Quyết định của đối tác</p>
                <div className="flex items-center gap-2 mb-2">
                  {viewItem.partnerDecision === "approved" && <ThumbsUp className="w-4 h-4 text-green-600" />}
                  {viewItem.partnerDecision === "rejected" && <ThumbsDown className="w-4 h-4 text-red-600" />}
                  {viewItem.partnerDecision === "pending" && <Clock className="w-4 h-4 text-gray-400" />}
                  <span className={`text-sm font-medium ${PARTNER_DECISION_CONFIG[viewItem.partnerDecision].color}`}>
                    {PARTNER_DECISION_CONFIG[viewItem.partnerDecision].label}
                  </span>
                  {viewItem.partnerApprovedAmount != null && (
                    <span className="text-sm text-green-600 font-semibold ml-2">
                      → {fmt(viewItem.partnerApprovedAmount)}
                    </span>
                  )}
                  {viewItem.partnerDecisionDate && (
                    <span className="text-xs text-gray-400 ml-auto">{fmtDate(viewItem.partnerDecisionDate)}</span>
                  )}
                </div>
                {viewItem.partnerNote && (
                  <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded border border-gray-100">
                    {viewItem.partnerNote}
                  </p>
                )}
              </div>

              {/* Manager decision result (if already decided) */}
              {(viewItem.managerStatus === "approved" || viewItem.managerStatus === "rejected") && (
                <div className={`mb-5 p-4 rounded-lg border ${viewItem.managerStatus === "approved" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {viewItem.managerStatus === "approved"
                      ? <ShieldCheck className="w-4 h-4 text-green-600" />
                      : <ShieldX className="w-4 h-4 text-red-600" />}
                    <p className={`text-sm font-semibold ${viewItem.managerStatus === "approved" ? "text-green-800" : "text-red-800"}`}>
                      Quyết định của Manager — {fmtDate(viewItem.managerDecisionDate)}
                    </p>
                  </div>
                  {viewItem.managerStatus === "approved" && (
                    <p className="text-sm font-bold text-green-700 mb-1">Hoàn: {fmt(viewItem.finalAmount)}</p>
                  )}
                  {viewItem.managerNote && (
                    <p className="text-sm text-gray-700">{viewItem.managerNote}</p>
                  )}
                </div>
              )}

              {/* Action forms */}
              {canAct(viewItem) && (
                <div className="border-t border-gray-100 pt-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Scale className="w-4 h-4 text-primary" />
                    <p className="font-semibold text-gray-900">Phán quyết của Manager</p>
                  </div>

                  {actionMode === null && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => openAction("approve")}
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                      >
                        <ThumbsUp className="w-4 h-4 mr-2" /> Duyệt hoàn tiền
                      </button>
                      <button
                        onClick={() => openAction("reject")}
                        className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
                      >
                        <ThumbsDown className="w-4 h-4 mr-2" /> Từ chối hoàn
                      </button>
                    </div>
                  )}

                  {actionMode === "approve" && (
                    <div className="space-y-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Số tiền hoàn (tối đa {fmt(viewItem.paidAmount)})
                          </label>
                          <input
                            type="number"
                            min={0}
                            max={viewItem.paidAmount}
                            value={actionDraft.amount}
                            onChange={(e) => setActionDraft((d) => ({ ...d, amount: e.target.value }))}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                          {actionDraft.amount && Number(actionDraft.amount) < viewItem.requestedAmount && (
                            <p className="text-xs text-yellow-600 mt-1">Thấp hơn yêu cầu ({fmt(viewItem.requestedAmount)})</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Tuân thủ chính sách</label>
                          <select
                            value={actionDraft.compliant}
                            onChange={(e) => setActionDraft((d) => ({ ...d, compliant: e.target.value }))}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                          >
                            <option value="yes">Có — đúng chính sách</option>
                            <option value="no">Không — ngoại lệ đặc biệt</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú nội bộ</label>
                        <textarea
                          rows={2}
                          value={actionDraft.note}
                          onChange={(e) => setActionDraft((d) => ({ ...d, note: e.target.value }))}
                          placeholder="Lý do phê duyệt, căn cứ chính sách..."
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={handleApprove}
                          disabled={!actionDraft.amount || Number(actionDraft.amount) <= 0}
                          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" /> Xác nhận duyệt
                        </button>
                        <button onClick={() => setActionMode(null)} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm">
                          Hủy
                        </button>
                      </div>
                    </div>
                  )}

                  {actionMode === "reject" && (
                    <div className="space-y-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tuân thủ chính sách</label>
                        <select
                          value={actionDraft.compliant}
                          onChange={(e) => setActionDraft((d) => ({ ...d, compliant: e.target.value }))}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="yes">Có — từ chối đúng chính sách</option>
                          <option value="no">Không — vi phạm chính sách</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Lý do từ chối <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          rows={3}
                          value={actionDraft.note}
                          onChange={(e) => setActionDraft((d) => ({ ...d, note: e.target.value }))}
                          placeholder="Nêu rõ lý do từ chối và căn cứ chính sách..."
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={handleReject}
                          disabled={!actionDraft.note.trim()}
                          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <XCircle className="w-4 h-4 mr-2" /> Xác nhận từ chối
                        </button>
                        <button onClick={() => setActionMode(null)} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm">
                          Hủy
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
