import { useState, useEffect, useCallback } from "react";
import {
  Search,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  Building,
  User,
} from "lucide-react";

const BASE_URL = "http://localhost:3000";

function authHeaders() {
  const token = localStorage.getItem("vns_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse(res) {
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) throw new Error(data.message || `Lỗi ${res.status}`);
  return data.data !== undefined ? data.data : data;
}

// Adapts API shape to the shape the card UI expects.
function toCardShape(p) {
  return {
    id:        p.partnerId,
    partner:   p.businessName || p.fullName || p.email,
    email:     p.email,
    phone:     p.phone || "—",
    submitted: p.createdAt ? new Date(p.createdAt).toLocaleDateString("vi-VN") : "—",
    status:    p.verifyStatus,
    type:      "new_partner",
    docs:      [],
    notes:     p.rejectionReason || "",
  };
}

const statusConfig = {
  pending: {
    label: "Chờ xét duyệt",
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

const typeConfig = {
  new_partner: { label: "Đối tác mới", color: "bg-blue-100 text-blue-700" },
  update: { label: "Cập nhật hồ sơ", color: "bg-purple-100 text-purple-700" },
};

const ManagerDocumentReview = () => {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("pending");
  const [selected, setSelected] = useState(null);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [notes, setNotes] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [actionError, setActionError] = useState("");

  const fetchPartners = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const qs = filterStatus !== "all" ? `?status=${filterStatus}` : "";
      const raw = await handleResponse(
        await fetch(`${BASE_URL}/api/partners${qs}`, { headers: authHeaders() }),
      );
      setList(raw.map(toCardShape));
      // Deselect if selected item no longer in new list
      setSelected((prev) =>
        prev && !raw.find((r) => r.partnerId === prev.id) ? null : prev,
      );
    } catch (err) {
      setLoadError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => { fetchPartners(); }, [fetchPartners]);

  const filtered = list.filter((d) => {
    const matchSearch =
      d.partner.toLowerCase().includes(search.toLowerCase()) ||
      d.email.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  const approve = async (id) => {
    setActionError("");
    try {
      await handleResponse(
        await fetch(`${BASE_URL}/api/partners/${id}/approve`, {
          method: "POST",
          headers: authHeaders(),
        }),
      );
      fetchPartners();
      setSelected(null);
    } catch (err) {
      setActionError(err.message);
    }
  };

  const reject = async (id, reason) => {
    setActionError("");
    try {
      await handleResponse(
        await fetch(`${BASE_URL}/api/partners/${id}/reject`, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...authHeaders() },
          body: JSON.stringify({ reason }),
        }),
      );
      fetchPartners();
      setSelected(null);
      setShowRejectModal(false);
      setRejectReason("");
    } catch (err) {
      setActionError(err.message);
    }
  };

  const counts = {
    pending: list.filter((d) => d.status === "pending").length,
    approved: list.filter((d) => d.status === "approved").length,
    rejected: list.filter((d) => d.status === "rejected").length,
  };

  return (
    <div className="min-h-screen bg-bg-light p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Xét duyệt tài liệu
          </h1>
          <p className="text-gray-500 text-sm">
            Xem xét hồ sơ và tài liệu đăng ký của đối tác
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            {
              label: "Chờ xét duyệt",
              count: counts.pending,
              color: "bg-yellow-50 border-yellow-200 text-yellow-800",
              tab: "pending",
            },
            {
              label: "Đã phê duyệt",
              count: counts.approved,
              color: "bg-green-50 border-green-200 text-green-800",
              tab: "approved",
            },
            {
              label: "Từ chối",
              count: counts.rejected,
              color: "bg-red-50 border-red-200 text-red-800",
              tab: "rejected",
            },
          ].map((c) => (
            <button
              key={c.tab}
              onClick={() => setFilterStatus(c.tab)}
              className={`p-4 rounded-xl border text-left transition-all ${c.color} ${filterStatus === c.tab ? "ring-2 ring-offset-1 ring-current" : ""}`}
            >
              <p className="text-2xl font-bold">{c.count}</p>
              <p className="text-sm font-medium mt-0.5">{c.label}</p>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm theo tên đối tác, mã hồ sơ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary bg-white"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ xét duyệt</option>
            <option value="approved">Đã phê duyệt</option>
            <option value="rejected">Từ chối</option>
          </select>
          <button
            onClick={fetchPartners}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className={`w-4 h-4 text-gray-500 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        <div
          className={`grid gap-6 ${selected ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"}`}
        >
          {/* List */}
          <div className="space-y-3">
            {loadError && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
                {loadError}
              </div>
            )}
            {actionError && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
                {actionError}
              </div>
            )}
            {!loading && filtered.length === 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">
                Không tìm thấy hồ sơ nào
              </div>
            )}
            {filtered.map((doc) => {
              const sc = statusConfig[doc.status];
              const tc = typeConfig[doc.type];
              const StatusIcon = sc.icon;
              return (
                <div
                  key={doc.id}
                  onClick={() => {
                    setSelected(doc);
                    setNotes(doc.notes || "");
                  }}
                  className={`bg-white rounded-xl border p-4 cursor-pointer hover:shadow-md transition-all ${
                    selected?.id === doc.id
                      ? "border-primary ring-1 ring-primary"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${tc.color}`}
                        >
                          {tc.label}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${sc.color}`}
                        >
                          <StatusIcon className="w-3 h-3" /> {sc.label}
                        </span>
                      </div>
                      <p className="font-semibold text-gray-900">
                        {doc.partner}
                      </p>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400 flex-wrap">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {doc.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {doc.submitted}
                        </span>
                      </div>
                    </div>
                    {doc.status === "pending" && (
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelected(doc);
                            setNotes("");
                            approve(doc.id);
                          }}
                          className="px-3 py-1.5 bg-green-100 text-green-700 text-xs font-medium rounded-lg hover:bg-green-200"
                        >
                          Duyệt
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelected(doc);
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
                <h3 className="font-semibold text-gray-900">Chi tiết hồ sơ</h3>
                <button
                  onClick={() => setSelected(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              {/* Partner info */}
              <div className="p-3 bg-gray-50 rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Đối tác</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {selected.partner}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                  <span>{selected.email}</span>
                  <span>{selected.phone}</span>
                </div>
              </div>

              {/* Documents checklist */}
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase mb-3">
                  Tài liệu đính kèm
                </p>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-xs text-gray-400 text-center">
                  Tải lên tài liệu chưa được triển khai
                </div>
              </div>

              {selected.status === "rejected" && selected.notes && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-xs font-medium text-red-700 mb-1">
                    Lý do từ chối:
                  </p>
                  <p className="text-xs text-red-600">{selected.notes}</p>
                </div>
              )}

              {selected.status === "pending" && (
                <div className="flex gap-3">
                  <button
                    onClick={() => approve(selected.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm"
                  >
                    <CheckCircle className="w-4 h-4" /> Phê duyệt
                  </button>
                  <button
                    onClick={() => setShowRejectModal(true)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium text-sm"
                  >
                    <XCircle className="w-4 h-4" /> Từ chối
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Từ chối hồ sơ
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Đối tác:{" "}
              <span className="font-medium text-gray-700">
                {selected?.partner}
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
                placeholder="Nêu rõ tài liệu còn thiếu hoặc sai sót để đối tác bổ sung..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary resize-none"
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
                  rejectReason.trim() && reject(selected?.id, rejectReason)
                }
                disabled={!rejectReason.trim()}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 font-medium"
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

export default ManagerDocumentReview;
