import { useState, useEffect } from "react";
import {
  Search,
  RefreshCw,
  CheckCircle,
  XCircle,
  Eye,
  Clock,
  MapPin,
  DollarSign,
  Star,
  Home,
  Car,
  Compass,
  Filter,
  Package,
  Layers,
} from "lucide-react";
import { comboService } from "../../services/comboService";

const fmt = (n) => new Intl.NumberFormat("vi-VN").format(n) + " ₫";
const fmtDate = (d) => (d ? new Date(d).toLocaleDateString("vi-VN") : "—");

const services = [
  {
    id: "SVC-001",
    partner: "Hanoi Heritage Hotel",
    partnerId: "P001",
    name: "Villa 4 phòng ngủ hướng biển",
    type: "rental",
    location: "Đà Nẵng",
    price: 3500000,
    submitted: "16/05/2026",
    status: "pending",
    description:
      "Villa cao cấp 4 phòng ngủ, view biển trực tiếp, hồ bơi riêng, bãi đỗ xe.",
    images: 8,
    rating: null,
  },
  {
    id: "SVC-002",
    partner: "Mekong Delta Tours",
    partnerId: "P002",
    name: "Tour sông Mekong 2N1Đ",
    type: "tour",
    location: "Cần Thơ",
    price: 1800000,
    submitted: "15/05/2026",
    status: "pending",
    description:
      "Tour khám phá sông Mekong, thăm chợ nổi Cái Răng, homestay vườn cây ăn quả.",
    images: 12,
    rating: null,
  },
  {
    id: "SVC-003",
    partner: "Phu Quoc Car Rental",
    partnerId: "P003",
    name: "Thuê xe 7 chỗ có lái",
    type: "car",
    location: "Phú Quốc",
    price: 1200000,
    submitted: "15/05/2026",
    status: "pending",
    description: "Toyota Innova 7 chỗ, tài xế kinh nghiệm, đón tại sân bay.",
    images: 5,
    rating: null,
  },
  {
    id: "SVC-004",
    partner: "Sapa Adventure",
    partnerId: "P004",
    name: "Trekking Fansipan 3N2Đ",
    type: "tour",
    location: "Sapa",
    price: 4500000,
    submitted: "14/05/2026",
    status: "approved",
    description:
      "Chinh phục đỉnh Fansipan 3143m, hướng dẫn viên bản địa, cắm trại.",
    images: 15,
    rating: 4.8,
  },
  {
    id: "SVC-005",
    partner: "Hoi An Boutique",
    partnerId: "P005",
    name: "Nhà phố cổ Hội An",
    type: "rental",
    location: "Hội An",
    price: 2200000,
    submitted: "13/05/2026",
    status: "rejected",
    description: "Nhà phố cổ 3 phòng ngủ, nằm trong khu phố cổ UNESCO.",
    images: 10,
    rating: null,
    rejectReason: "Ảnh chất lượng thấp, thiếu giấy phép kinh doanh",
  },
];

const typeConfig = {
  rental: { label: "Lưu trú", icon: Home, color: "bg-blue-100 text-blue-700" },
  tour: { label: "Tour", icon: Compass, color: "bg-green-100 text-green-700" },
  car: { label: "Thuê xe", icon: Car, color: "bg-orange-100 text-orange-700" },
};

const statusConfig = {
  pending: {
    label: "Chờ duyệt",
    color: "bg-yellow-100 text-yellow-800",
    icon: Clock,
  },
  approved: {
    label: "Đã duyệt",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
  },
  rejected: {
    label: "Từ chối",
    color: "bg-red-100 text-red-800",
    icon: XCircle,
  },
};

// ─── Combo Tab ────────────────────────────────────────────────────────────────

function ComboApprovalTab() {
  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await comboService.listPendingCombos();
      setCombos(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const approve = async (comboId) => {
    setActionLoading(true);
    try {
      await comboService.approveCombo(comboId);
      setCombos((prev) => prev.filter((c) => c.comboId !== comboId));
      if (selected?.comboId === comboId) setSelected(null);
    } catch (e) {
      alert(e.message);
    } finally {
      setActionLoading(false);
    }
  };

  const reject = async (comboId, reason) => {
    setActionLoading(true);
    try {
      await comboService.rejectCombo(comboId, reason);
      setCombos((prev) => prev.filter((c) => c.comboId !== comboId));
      if (selected?.comboId === comboId) setSelected(null);
      setShowRejectModal(false);
      setRejectReason("");
    } catch (e) {
      alert(e.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400 text-sm">
        <RefreshCw className="w-5 h-5 animate-spin mr-2" /> Đang tải combo...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-600 text-sm mb-3">{error}</p>
        <button
          onClick={load}
          className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">{combos.length} combo chờ duyệt</p>
        <button
          onClick={load}
          className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <RefreshCw className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {combos.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">
          Không có combo nào đang chờ duyệt
        </div>
      )}

      <div
        className={`grid gap-6 ${selected ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"}`}
      >
        {/* List */}
        <div className="space-y-3">
          {combos.map((combo) => {
            const discount = Math.round(
              ((combo.originalPrice - combo.discountedPrice) /
                combo.originalPrice) *
                100,
            );
            return (
              <div
                key={combo.comboId}
                onClick={() => setSelected(combo)}
                className={`bg-white rounded-xl border p-4 cursor-pointer hover:shadow-md transition-all ${
                  selected?.comboId === combo.comboId
                    ? "border-primary ring-1 ring-primary"
                    : "border-gray-200"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                        <Layers className="w-3 h-3" /> Combo
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Clock className="w-3 h-3" /> Chờ duyệt
                      </span>
                      {discount > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-700">
                          -{discount}%
                        </span>
                      )}
                    </div>
                    <p className="font-semibold text-gray-900 truncate">
                      {combo.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {combo.businessName}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400 flex-wrap">
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        <span className="line-through">
                          {fmt(combo.originalPrice)}
                        </span>
                        <span className="text-primary font-medium ml-1">
                          {fmt(combo.discountedPrice)}
                        </span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Package className="w-3 h-3" /> {combo.serviceCount}{" "}
                        dịch vụ
                      </span>
                      {combo.validFrom && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />{" "}
                          {fmtDate(combo.validFrom)} – {fmtDate(combo.validTo)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        approve(combo.comboId);
                      }}
                      disabled={actionLoading}
                      className="px-3 py-1.5 bg-green-100 text-green-700 text-xs font-medium rounded-lg hover:bg-green-200 disabled:opacity-50"
                    >
                      Duyệt
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setRejectTarget(combo);
                        setShowRejectModal(true);
                      }}
                      disabled={actionLoading}
                      className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-medium rounded-lg hover:bg-red-100 disabled:opacity-50"
                    >
                      Từ chối
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5 h-fit sticky top-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Chi tiết combo</h3>
              <button
                onClick={() => setSelected(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div>
              <p className="text-xs text-gray-400 uppercase font-medium mb-1">
                Tên combo
              </p>
              <p className="font-semibold text-gray-900">{selected.title}</p>
            </div>
            {selected.description && (
              <div>
                <p className="text-xs text-gray-400 uppercase font-medium mb-1">
                  Mô tả
                </p>
                <p className="text-sm text-gray-600">{selected.description}</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-gray-400 uppercase font-medium mb-1">
                  Đối tác
                </p>
                <p className="font-medium text-gray-800">
                  {selected.businessName}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-medium mb-1">
                  Số dịch vụ
                </p>
                <p className="font-medium text-gray-800">
                  {selected.serviceCount} dịch vụ
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-medium mb-1">
                  Giá gốc
                </p>
                <p className="font-medium text-gray-500 line-through">
                  {fmt(selected.originalPrice)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-medium mb-1">
                  Giá combo
                </p>
                <p className="font-medium text-primary">
                  {fmt(selected.discountedPrice)}
                </p>
              </div>
              {selected.validFrom && (
                <div className="col-span-2">
                  <p className="text-xs text-gray-400 uppercase font-medium mb-1">
                    Thời hạn
                  </p>
                  <p className="font-medium text-gray-800">
                    {fmtDate(selected.validFrom)} – {fmtDate(selected.validTo)}
                  </p>
                </div>
              )}
              {selected.maxBookings && (
                <div>
                  <p className="text-xs text-gray-400 uppercase font-medium mb-1">
                    Giới hạn
                  </p>
                  <p className="font-medium text-gray-800">
                    {selected.maxBookings} lượt
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => approve(selected.comboId)}
                disabled={actionLoading}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm disabled:opacity-50"
              >
                <CheckCircle className="w-4 h-4" /> Phê duyệt
              </button>
              <button
                onClick={() => {
                  setRejectTarget(selected);
                  setShowRejectModal(true);
                }}
                disabled={actionLoading}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium text-sm disabled:opacity-50"
              >
                <XCircle className="w-4 h-4" /> Từ chối
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && rejectTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Từ chối combo
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Combo:{" "}
              <span className="font-medium text-gray-700">
                {rejectTarget.title}
              </span>
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lý do từ chối <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Nhập lý do từ chối để đối tác biết cần điều chỉnh..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none text-sm"
              />
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={() =>
                  rejectReason.trim() &&
                  reject(rejectTarget.comboId, rejectReason)
                }
                disabled={!rejectReason.trim() || actionLoading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Xác nhận từ chối
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const ManagerServiceApproval = () => {
  const [activeTab, setActiveTab] = useState("services");
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("pending");
  const [selected, setSelected] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [list, setList] = useState(services);

  const filtered = list.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.partner.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "all" || s.type === filterType;
    const matchStatus = filterStatus === "all" || s.status === filterStatus;
    return matchSearch && matchType && matchStatus;
  });

  const approve = (id) => {
    setList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: "approved" } : s)),
    );
    if (selected?.id === id) setSelected((s) => ({ ...s, status: "approved" }));
  };

  const reject = (id, reason) => {
    setList((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: "rejected", rejectReason: reason } : s,
      ),
    );
    if (selected?.id === id)
      setSelected((s) => ({ ...s, status: "rejected", rejectReason: reason }));
    setShowRejectModal(false);
    setRejectReason("");
  };

  const counts = {
    pending: list.filter((s) => s.status === "pending").length,
    approved: list.filter((s) => s.status === "approved").length,
    rejected: list.filter((s) => s.status === "rejected").length,
  };

  return (
    <div className="min-h-screen bg-bg-light p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Duyệt nội dung
          </h1>
          <p className="text-gray-500 text-sm">
            Xem xét và phê duyệt dịch vụ, combo đối tác đăng ký
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-gray-100 rounded-xl p-1 w-fit">
          <button
            onClick={() => setActiveTab("services")}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "services"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Package className="w-4 h-4" /> Dịch vụ
          </button>
          <button
            onClick={() => setActiveTab("combos")}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "combos"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Layers className="w-4 h-4" /> Combo
          </button>
        </div>

        {/* ── Services Tab ── */}
        {activeTab === "services" && (
          <>
            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6 flex flex-wrap gap-3">
              <div className="relative flex-1 min-w-48">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm theo tên dịch vụ, đối tác..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary bg-white"
              >
                <option value="all">Tất cả loại</option>
                <option value="rental">Lưu trú</option>
                <option value="tour">Tour</option>
                <option value="car">Thuê xe</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary bg-white"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="pending">Chờ duyệt</option>
                <option value="approved">Đã duyệt</option>
                <option value="rejected">Từ chối</option>
              </select>
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <RefreshCw className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <div
              className={`grid gap-6 ${selected ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"}`}
            >
              {/* List */}
              <div className="space-y-3">
                {filtered.length === 0 && (
                  <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">
                    Không tìm thấy dịch vụ nào
                  </div>
                )}
                {filtered.map((svc) => {
                  const tc = typeConfig[svc.type];
                  const sc = statusConfig[svc.status];
                  const TypeIcon = tc.icon;
                  const StatusIcon = sc.icon;
                  return (
                    <div
                      key={svc.id}
                      onClick={() => setSelected(svc)}
                      className={`bg-white rounded-xl border p-4 cursor-pointer hover:shadow-md transition-all ${
                        selected?.id === svc.id
                          ? "border-primary ring-1 ring-primary"
                          : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${tc.color}`}
                            >
                              <TypeIcon className="w-3 h-3" /> {tc.label}
                            </span>
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${sc.color}`}
                            >
                              <StatusIcon className="w-3 h-3" /> {sc.label}
                            </span>
                          </div>
                          <p className="font-semibold text-gray-900 truncate">
                            {svc.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {svc.partner}
                          </p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {svc.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-3 h-3" />
                              {fmt(svc.price)}/đêm
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {svc.submitted}
                            </span>
                          </div>
                        </div>
                        {svc.status === "pending" && (
                          <div className="flex gap-2 flex-shrink-0">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                approve(svc.id);
                              }}
                              className="px-3 py-1.5 bg-green-100 text-green-700 text-xs font-medium rounded-lg hover:bg-green-200"
                            >
                              Duyệt
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setRejectTarget(svc);
                                setShowRejectModal(true);
                              }}
                              className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-medium rounded-lg hover:bg-red-100"
                            >
                              Từ chối
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Detail panel */}
              {selected && (
                <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5 h-fit sticky top-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">
                      Chi tiết dịch vụ
                    </h3>
                    <button
                      onClick={() => setSelected(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 uppercase font-medium mb-1">
                      Tên dịch vụ
                    </p>
                    <p className="font-semibold text-gray-900">
                      {selected.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-medium mb-1">
                      Mô tả
                    </p>
                    <p className="text-sm text-gray-600">
                      {selected.description}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-medium mb-1">
                        Đối tác
                      </p>
                      <p className="font-medium text-gray-800">
                        {selected.partner}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-medium mb-1">
                        Địa điểm
                      </p>
                      <p className="font-medium text-gray-800">
                        {selected.location}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-medium mb-1">
                        Giá
                      </p>
                      <p className="font-medium text-primary">
                        {fmt(selected.price)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-medium mb-1">
                        Số ảnh
                      </p>
                      <p className="font-medium text-gray-800">
                        {selected.images} ảnh
                      </p>
                    </div>
                  </div>

                  {selected.rejectReason && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-xs font-medium text-red-700 mb-1">
                        Lý do từ chối:
                      </p>
                      <p className="text-xs text-red-600">
                        {selected.rejectReason}
                      </p>
                    </div>
                  )}

                  {selected.status === "pending" && (
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => approve(selected.id)}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm"
                      >
                        <CheckCircle className="w-4 h-4" /> Phê duyệt
                      </button>
                      <button
                        onClick={() => {
                          setRejectTarget(selected);
                          setShowRejectModal(true);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium text-sm"
                      >
                        <XCircle className="w-4 h-4" /> Từ chối
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {/* ── Combos Tab ── */}
        {activeTab === "combos" && <ComboApprovalTab />}
      </div>

      {/* Reject Modal (services tab) */}
      {activeTab === "services" && showRejectModal && rejectTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Từ chối dịch vụ
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Dịch vụ:{" "}
              <span className="font-medium text-gray-700">
                {rejectTarget.name}
              </span>
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lý do từ chối <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Nhập lý do từ chối để đối tác biết cần điều chỉnh..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none text-sm"
              />
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={() =>
                  rejectReason.trim() && reject(rejectTarget.id, rejectReason)
                }
                disabled={!rejectReason.trim()}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Xác nhận từ chối
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerServiceApproval;
