import React, { useState, useEffect, useCallback } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Eye,
  RefreshCw,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { refundService } from "../../services/refundService";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const STATUS_LABELS = {
  pending:   { label: "Chờ duyệt",    color: "bg-yellow-100 text-yellow-800" },
  approved:  { label: "Đã duyệt",     color: "bg-green-100  text-green-800"  },
  rejected:  { label: "Từ chối",      color: "bg-red-100    text-red-800"    },
  processed: { label: "Đã xử lý",     color: "bg-blue-100   text-blue-800"   },
};

function formatVND(amount) {
  if (amount === null || amount === undefined) return "—";
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
}

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

// ---------------------------------------------------------------------------
// Approve modal
// ---------------------------------------------------------------------------

function ApproveModal({ refund, onConfirm, onClose, loading }) {
  const [amount, setAmount] = useState(
    refund.requestedAmount !== undefined ? String(refund.requestedAmount) : ""
  );
  const [error, setError] = useState("");

  function handleSubmit() {
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) {
      setError("Vui lòng nhập số tiền hợp lệ");
      return;
    }
    if (parsed > refund.requestedAmount) {
      setError(`Không được vượt quá số tiền yêu cầu (${formatVND(refund.requestedAmount)})`);
      return;
    }
    onConfirm(parsed);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Duyệt hoàn tiền</h3>

        <div className="mb-4 text-sm text-gray-600 space-y-1">
          <p><span className="font-medium">Yêu cầu:</span> {formatVND(refund.requestedAmount)}</p>
          <p><span className="font-medium">Lý do khách hàng:</span> {refund.reason || "—"}</p>
        </div>

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Số tiền duyệt (VND)
        </label>
        <input
          type="number"
          min="0"
          max={refund.requestedAmount}
          value={amount}
          onChange={(e) => { setAmount(e.target.value); setError(""); }}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        {error && <p className="text-xs text-red-600 mt-1">{error}</p>}

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Huỷ
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
          >
            {loading && <RefreshCw size={14} className="animate-spin" />}
            Xác nhận duyệt
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Reject modal
// ---------------------------------------------------------------------------

function RejectModal({ refund, onConfirm, onClose, loading }) {
  const [reason, setReason] = useState("");
  const [error, setError]   = useState("");

  function handleSubmit() {
    if (!reason.trim()) {
      setError("Vui lòng nhập lý do từ chối");
      return;
    }
    onConfirm(reason.trim());
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Từ chối hoàn tiền</h3>

        <div className="mb-4 text-sm text-gray-600 space-y-1">
          <p><span className="font-medium">Yêu cầu:</span> {formatVND(refund.requestedAmount)}</p>
          <p><span className="font-medium">Lý do khách hàng:</span> {refund.reason || "—"}</p>
        </div>

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Lý do từ chối <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={3}
          value={reason}
          onChange={(e) => { setReason(e.target.value); setError(""); }}
          placeholder="Giải thích lý do không thể hoàn tiền cho khách hàng..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
        />
        {error && <p className="text-xs text-red-600 mt-1">{error}</p>}

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Huỷ
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
          >
            {loading && <RefreshCw size={14} className="animate-spin" />}
            Xác nhận từ chối
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Detail drawer
// ---------------------------------------------------------------------------

function RefundDetailDrawer({ refundId, onClose }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState("");

  useEffect(() => {
    setLoading(true);
    refundService.getRefundDetail(refundId)
      .then(setDetail)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [refundId]);

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/30" onClick={onClose}>
      <div
        className="bg-white w-full max-w-lg h-full overflow-y-auto shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="mb-4 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800">
          <ChevronLeft size={16} /> Đóng
        </button>

        {loading && <p className="text-sm text-gray-500">Đang tải...</p>}
        {error   && <p className="text-sm text-red-600">{error}</p>}

        {detail && (
          <div className="space-y-4 text-sm">
            <h3 className="text-base font-semibold text-gray-800">Chi tiết yêu cầu hoàn tiền</h3>

            <div className="grid grid-cols-2 gap-3">
              {[
                ["Dịch vụ",           detail.service?.title],
                ["Trạng thái",        STATUS_LABELS[detail.status]?.label ?? detail.status],
                ["Số tiền yêu cầu",   formatVND(detail.requestedAmount)],
                ["Số tiền duyệt",     formatVND(detail.approvedAmount)],
                ["Lý do khách hàng",  detail.reason],
                ["Lý do từ chối",     detail.rejectionReason],
                ["Ngày yêu cầu",      formatDate(detail.requestedAt)],
                ["Ngày xử lý",        formatDate(detail.processedAt)],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs text-gray-400">{label}</p>
                  <p className="text-gray-800 font-medium break-words">{value || "—"}</p>
                </div>
              ))}
            </div>

            {detail.evidenceUrls?.length > 0 && (
              <div>
                <p className="text-xs text-gray-400 mb-1">Bằng chứng đính kèm</p>
                <div className="flex flex-wrap gap-2">
                  {detail.evidenceUrls.map((url, i) => (
                    <a key={i} href={url} target="_blank" rel="noreferrer"
                      className="text-blue-600 underline text-xs">
                      Ảnh {i + 1}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

const STATUS_TABS = [
  { value: "",          label: "Tất cả"    },
  { value: "pending",   label: "Chờ duyệt" },
  { value: "approved",  label: "Đã duyệt"  },
  { value: "rejected",  label: "Từ chối"   },
  { value: "processed", label: "Đã xử lý"  },
];

export default function PartnerRefund() {
  const [refunds, setRefunds]     = useState([]);
  const [meta, setMeta]           = useState({ page: 1, limit: 20, total: 0 });
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading]     = useState(false);
  const [fetchError, setFetchError] = useState("");

  // Modal state
  const [approveTarget, setApproveTarget] = useState(null);
  const [rejectTarget, setRejectTarget]   = useState(null);
  const [detailId, setDetailId]           = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError]     = useState("");

  const fetchRefunds = useCallback(async (page = 1) => {
    setLoading(true);
    setFetchError("");
    try {
      const res = await refundService.listPartnerRefunds({
        status: statusFilter || undefined,
        page,
        limit: meta.limit,
      });
      // API returns { data, meta } wrapped by handleResponse
      setRefunds(res.data ?? res);
      if (res.meta) setMeta(res.meta);
    } catch (e) {
      setFetchError(e.message);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, meta.limit]);

  useEffect(() => { fetchRefunds(1); }, [statusFilter]);

  async function handleApprove(approvedAmount) {
    setActionLoading(true);
    setActionError("");
    try {
      await refundService.approveRefund(approveTarget.refundId, approvedAmount);
      setApproveTarget(null);
      fetchRefunds(meta.page);
    } catch (e) {
      setActionError(e.message);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleReject(rejectionReason) {
    setActionLoading(true);
    setActionError("");
    try {
      await refundService.rejectRefund(rejectTarget.refundId, rejectionReason);
      setRejectTarget(null);
      fetchRefunds(meta.page);
    } catch (e) {
      setActionError(e.message);
    } finally {
      setActionLoading(false);
    }
  }

  const totalPages = Math.ceil(meta.total / meta.limit) || 1;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý hoàn tiền</h1>
        <p className="text-sm text-gray-500 mt-1">Duyệt hoặc từ chối các yêu cầu hoàn tiền từ khách hàng</p>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 border-b border-gray-200 mb-6 overflow-x-auto">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              statusFilter === tab.value
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Action error banner */}
      {actionError && (
        <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          <AlertCircle size={16} />
          {actionError}
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-16 text-gray-400">
          <RefreshCw size={24} className="animate-spin" />
        </div>
      ) : fetchError ? (
        <div className="text-center py-16 text-red-600 text-sm">{fetchError}</div>
      ) : refunds.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm">Không có yêu cầu hoàn tiền nào</div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                <tr>
                  <th className="px-4 py-3 text-left">Dịch vụ</th>
                  <th className="px-4 py-3 text-left">Ngày yêu cầu</th>
                  <th className="px-4 py-3 text-right">Số tiền YC</th>
                  <th className="px-4 py-3 text-right">Số tiền duyệt</th>
                  <th className="px-4 py-3 text-center">Trạng thái</th>
                  <th className="px-4 py-3 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {refunds.map((r) => {
                  const s = STATUS_LABELS[r.status] || { label: r.status, color: "bg-gray-100 text-gray-700" };
                  return (
                    <tr key={r.refundId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-800 truncate max-w-[180px]">{r.serviceTitle}</p>
                        <p className="text-xs text-gray-400 truncate max-w-[180px]">{r.bookingId}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{formatDate(r.requestedAt)}</td>
                      <td className="px-4 py-3 text-right font-medium text-gray-800">
                        {formatVND(r.requestedAmount)}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-600">
                        {formatVND(r.approvedAmount)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${s.color}`}>
                          {s.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            title="Xem chi tiết"
                            onClick={() => setDetailId(r.refundId)}
                            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                          >
                            <Eye size={15} />
                          </button>
                          {r.status === "pending" && (
                            <>
                              <button
                                title="Duyệt"
                                onClick={() => { setActionError(""); setApproveTarget(r); }}
                                className="p-1.5 rounded-lg text-green-600 hover:bg-green-50"
                              >
                                <CheckCircle size={15} />
                              </button>
                              <button
                                title="Từ chối"
                                onClick={() => { setActionError(""); setRejectTarget(r); }}
                                className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                              >
                                <XCircle size={15} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
              <p>Hiển thị {refunds.length} / {meta.total} kết quả</p>
              <div className="flex items-center gap-2">
                <button
                  disabled={meta.page <= 1}
                  onClick={() => fetchRefunds(meta.page - 1)}
                  className="p-1.5 rounded-lg border border-gray-300 disabled:opacity-40 hover:bg-gray-50"
                >
                  <ChevronLeft size={16} />
                </button>
                <span>Trang {meta.page} / {totalPages}</span>
                <button
                  disabled={meta.page >= totalPages}
                  onClick={() => fetchRefunds(meta.page + 1)}
                  className="p-1.5 rounded-lg border border-gray-300 disabled:opacity-40 hover:bg-gray-50"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      {approveTarget && (
        <ApproveModal
          refund={approveTarget}
          onConfirm={handleApprove}
          onClose={() => setApproveTarget(null)}
          loading={actionLoading}
        />
      )}
      {rejectTarget && (
        <RejectModal
          refund={rejectTarget}
          onConfirm={handleReject}
          onClose={() => setRejectTarget(null)}
          loading={actionLoading}
        />
      )}
      {detailId && (
        <RefundDetailDrawer refundId={detailId} onClose={() => setDetailId(null)} />
      )}
    </div>
  );
}
