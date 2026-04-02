const BASE_URL = "";

function authHeaders() {
  const token = localStorage.getItem("vns_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse(res) {
  const text = await res.text();
  const json = text ? JSON.parse(text) : {};
  if (!res.ok) {
    throw new Error(json.message || `Lỗi ${res.status}`);
  }
  return json;
}

export const bookingService = {
  // GET /api/bookings/partner — lists the authenticated partner's bookings.
  // Returns { data: [...], meta: { page, limit, total } } so callers can use
  // both the booking rows and the accurate total count.
  async getPartnerBookings(filters = {}) {
    const params = new URLSearchParams();
    if (filters.status) params.set("status", filters.status);
    if (filters.serviceId) params.set("serviceId", filters.serviceId);
    if (filters.page) params.set("page", filters.page);
    if (filters.limit) params.set("limit", filters.limit);

    const res = await fetch(`${BASE_URL}/api/bookings/partner?${params}`, {
      headers: { ...authHeaders() },
    });
    const json = await handleResponse(res);
    return { data: json.data ?? [], meta: json.meta ?? {} };
  },
};
