const BASE_URL = "http://localhost:3000";

function authHeaders() {
  const token = localStorage.getItem("vns_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse(res) {
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) {
    throw new Error(data.message || `Lỗi ${res.status}`);
  }
  return data.data !== undefined ? data.data : data;
}

export const comboService = {
  // POST /api/combos
  // Body: { title, description, originalPrice, discountedPrice, maxBookings, validFrom, validTo, services }
  async createCombo(payload) {
    const res = await fetch(`${BASE_URL}/api/combos`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  // GET /api/combos/partner
  async listPartnerCombos() {
    const res = await fetch(`${BASE_URL}/api/combos/partner`, {
      headers: { ...authHeaders() },
    });
    return handleResponse(res);
  },

  // GET /api/combos/pending
  async listPendingCombos() {
    const res = await fetch(`${BASE_URL}/api/combos/pending`, {
      headers: { ...authHeaders() },
    });
    return handleResponse(res);
  },

  // POST /api/combos/:comboId/approve
  async approveCombo(comboId) {
    const res = await fetch(`${BASE_URL}/api/combos/${comboId}/approve`, {
      method: "POST",
      headers: { ...authHeaders() },
    });
    return handleResponse(res);
  },

  // POST /api/combos/:comboId/reject
  // Body: { reason }
  async rejectCombo(comboId, reason) {
    const res = await fetch(`${BASE_URL}/api/combos/${comboId}/reject`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ reason }),
    });
    return handleResponse(res);
  },
};
