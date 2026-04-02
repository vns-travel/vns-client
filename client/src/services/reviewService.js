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

export const reviewService = {
  // POST /api/reviews
  async createReview({ bookingId, rating, comment, imageUrls }) {
    const res = await fetch(`${BASE_URL}/api/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ bookingId, rating, comment, imageUrls }),
    });
    return handleResponse(res);
  },

  // GET /api/reviews/service/:serviceId
  async getReviewsByService(serviceId) {
    const res = await fetch(`${BASE_URL}/api/reviews/service/${serviceId}`, {
      headers: { ...authHeaders() },
    });
    return handleResponse(res);
  },

  // GET /api/reviews/booking/:bookingId
  async getReviewByBooking(bookingId) {
    const res = await fetch(`${BASE_URL}/api/reviews/booking/${bookingId}`, {
      headers: { ...authHeaders() },
    });
    return handleResponse(res);
  },
};
