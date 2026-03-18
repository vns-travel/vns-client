const BASE_URL = "https://vns-server.onrender.com";

function authHeaders() {
  const token = localStorage.getItem("vns_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse(res) {
  const text = await res.text();
  const data = text ? JSON.parse(text) : [];
  if (!res.ok) {
    throw new Error(data.message || data.title || `Lỗi ${res.status}`);
  }
  return data;
}

export const serviceService = {
  // GET /api/Service?partnerId=...&includeInactive=true
  async getPartnerServices(partnerId) {
    const params = new URLSearchParams({ includeInactive: "true" });
    if (partnerId) params.set("partnerId", partnerId);
    const res = await fetch(`${BASE_URL}/api/Service?${params}`, {
      headers: { ...authHeaders() },
    });
    return handleResponse(res);
  },

  // GET /api/Service?serviceType=...&title=...
  async getServices(filters = {}) {
    const params = new URLSearchParams();
    if (filters.serviceType !== undefined) params.set("serviceType", filters.serviceType);
    if (filters.title) params.set("title", filters.title);
    if (filters.locationId) params.set("locationId", filters.locationId);
    if (filters.partnerId) params.set("partnerId", filters.partnerId);
    if (filters.includeInactive !== undefined)
      params.set("includeInactive", filters.includeInactive);
    const res = await fetch(`${BASE_URL}/api/Service?${params}`, {
      headers: { ...authHeaders() },
    });
    return handleResponse(res);
  },

  // GET /api/Service/{id}
  async getServiceById(id) {
    const res = await fetch(`${BASE_URL}/api/Service/${id}`, {
      headers: { ...authHeaders() },
    });
    return handleResponse(res);
  },

  // DELETE /api/partner/services/{serviceId}
  async deleteService(serviceId) {
    const res = await fetch(`${BASE_URL}/api/partner/services/${serviceId}`, {
      method: "DELETE",
      headers: { ...authHeaders() },
    });
    return handleResponse(res);
  },

  // POST /api/partner/services (Tour serviceType=1 or Other serviceType=2)
  async createPartnerService(data) {
    const res = await fetch(`${BASE_URL}/api/partner/services`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  // PUT /api/partner/services/{serviceId}
  async updatePartnerService(serviceId, data) {
    const res = await fetch(`${BASE_URL}/api/partner/services/${serviceId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  // POST /api/partner/tours/{tourId}/schedules
  async addTourSchedule(tourId, data) {
    const res = await fetch(`${BASE_URL}/api/partner/tours/${tourId}/schedules`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  // POST /api/partner/tours/{tourId}/itineraries
  async addTourItinerary(tourId, data) {
    const res = await fetch(`${BASE_URL}/api/partner/tours/${tourId}/itineraries`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  // POST /api/partner/homestays
  async createHomestay(data) {
    const res = await fetch(`${BASE_URL}/api/partner/homestays`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  // POST /api/partner/homestays/{homestayId}/rooms
  async addHomestayRoom(homestayId, data) {
    const res = await fetch(`${BASE_URL}/api/partner/homestays/${homestayId}/rooms`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  // POST /api/partner/homestays/{homestayId}/availability/bulk
  async bulkHomestayAvailability(homestayId, data) {
    const res = await fetch(`${BASE_URL}/api/partner/homestays/${homestayId}/availability/bulk`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  // POST /api/partner/homestays/{homestayId}/create (submit for review)
  async submitHomestay(homestayId) {
    const res = await fetch(`${BASE_URL}/api/partner/homestays/${homestayId}/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ confirmed: true }),
    });
    return handleResponse(res);
  },

  // GET /api/destinations
  async getDestinations() {
    const res = await fetch(`${BASE_URL}/api/destinations`, {
      headers: { ...authHeaders() },
    });
    return handleResponse(res);
  },
};

// ServiceType enum mapping
export const SERVICE_TYPE = {
  0: { label: "Homestay", filterKey: "homestay", priceUnit: "/đêm" },
  1: { label: "Tour", filterKey: "tour", priceUnit: "/người" },
  2: { label: "Khác", filterKey: "other", priceUnit: "" },
};

// BookingStatus mapping
export const BOOKING_STATUS = {
  1: "Chờ xác nhận",
  2: "Đã xác nhận",
  3: "Đang diễn ra",
  4: "Hoàn thành",
  5: "Đã hủy",
  6: "Đã hoàn tiền",
};
