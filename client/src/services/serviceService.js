const BASE_URL = "";

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
  // Unwrap { success, data } envelope if present, else return whole object/array
  return data.data !== undefined ? data.data : data;
}

export const serviceService = {
  // GET /api/services/partner/services — returns the authenticated partner's services
  async getPartnerServices(_partnerId) {
    const res = await fetch(`${BASE_URL}/api/services/partner/services`, {
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

  // GET /api/services/partner/services/:id
  async getServiceById(id) {
    const res = await fetch(`${BASE_URL}/api/services/partner/services/${id}`, {
      headers: { ...authHeaders() },
    });
    return handleResponse(res);
  },

  // DELETE /api/services/partner/services/{serviceId}
  async deleteService(serviceId) {
    const res = await fetch(`${BASE_URL}/api/services/partner/services/${serviceId}`, {
      method: "DELETE",
      headers: { ...authHeaders() },
    });
    return handleResponse(res);
  },

  // POST /api/services/partner/services (Tour serviceType=1 or Car Rental serviceType=2)
  async createPartnerService(data) {
    const res = await fetch(`${BASE_URL}/api/services/partner/services`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  // PUT /api/services/partner/services/{serviceId}
  async updatePartnerService(serviceId, data) {
    const res = await fetch(`${BASE_URL}/api/services/partner/services/${serviceId}`, {
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

  // POST /api/services/partner/services (car rental service record, status=draft)
  async createService(data) {
    const res = await fetch(`${BASE_URL}/api/services/partner/services`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  // POST /api/partner/vehicles (add one vehicle to a fleet)
  async createVehicle(data) {
    const res = await fetch(`${BASE_URL}/api/partner/vehicles`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  // POST /api/partner/vehicles/:vehicleId/availability/bulk
  async bulkVehicleAvailability(vehicleId, data) {
    const res = await fetch(`${BASE_URL}/api/partner/vehicles/${vehicleId}/availability/bulk`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  // POST /api/services/partner/services/:serviceId/images
  async addServiceImages(serviceId, urls) {
    const res = await fetch(`${BASE_URL}/api/services/partner/services/${serviceId}/images`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ urls }),
    });
    return handleResponse(res);
  },

  // POST /api/services/partner/services/:serviceId/submit (draft → pending)
  async submitCarRentalService(serviceId) {
    const res = await fetch(`${BASE_URL}/api/services/partner/services/${serviceId}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({}),
    });
    return handleResponse(res);
  },
};

// ServiceType enum mapping — 0=Homestay, 1=Tour, 2=Car Rental ('other' removed)
export const SERVICE_TYPE = {
  0: { label: "Homestay", filterKey: "homestay", priceUnit: "/đêm" },
  1: { label: "Tour", filterKey: "tour", priceUnit: "/người" },
  2: { label: "Cho thuê xe", filterKey: "car_rental", priceUnit: "/ngày" },
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
