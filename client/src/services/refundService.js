const BASE_URL = "http://localhost:3000";

function authHeaders() {
  const token = localStorage.getItem("vns_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse(res) {
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) {
    throw new Error(data.message || data.title || `Lỗi ${res.status}`);
  }
  return data.data !== undefined ? data.data : data;
}

export const refundService = {
  // GET /api/refunds/partner?status=&page=&limit=
  async listPartnerRefunds({ status, page = 1, limit = 20 } = {}) {
    const params = new URLSearchParams({ page, limit });
    if (status) params.set("status", status);
    const res = await fetch(`${BASE_URL}/api/refunds/partner?${params}`, {
      headers: { ...authHeaders() },
    });
    return handleResponse(res);
  },

  // GET /api/refunds/:id
  async getRefundDetail(refundId) {
    const res = await fetch(`${BASE_URL}/api/refunds/${refundId}`, {
      headers: { ...authHeaders() },
    });
    return handleResponse(res);
  },

  // PATCH /api/refunds/:id/process  { action: 'approve', approvedAmount }
  async approveRefund(refundId, approvedAmount) {
    const res = await fetch(`${BASE_URL}/api/refunds/${refundId}/process`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ action: "approve", approvedAmount }),
    });
    return handleResponse(res);
  },

  // PATCH /api/refunds/:id/process  { action: 'reject', rejectionReason }
  async rejectRefund(refundId, rejectionReason) {
    const res = await fetch(`${BASE_URL}/api/refunds/${refundId}/process`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ action: "reject", rejectionReason }),
    });
    return handleResponse(res);
  },
};
