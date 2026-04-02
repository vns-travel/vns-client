const BASE_URL = "";

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

export const paymentService = {
  // POST /api/payments/initiate
  // Returns { checkoutUrl, paymentId }
  async initiatePayment(bookingId) {
    const res = await fetch(`${BASE_URL}/api/payments/initiate`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ bookingId }),
    });
    return handleResponse(res);
  },

  // GET /api/payments/:bookingId
  async getPaymentsByBooking(bookingId) {
    const res = await fetch(`${BASE_URL}/api/payments/${bookingId}`, {
      headers: { ...authHeaders() },
    });
    return handleResponse(res);
  },

  // GET /api/payments/earnings/partner
  async getPartnerEarnings() {
    const res = await fetch(`${BASE_URL}/api/payments/earnings/partner`, {
      headers: { ...authHeaders() },
    });
    return handleResponse(res);
  },

  // GET /api/payments/earnings/platform
  async getPlatformRevenue() {
    const res = await fetch(`${BASE_URL}/api/payments/earnings/platform`, {
      headers: { ...authHeaders() },
    });
    return handleResponse(res);
  },
};
