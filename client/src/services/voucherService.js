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

// Maps the internal service-type array to the display string shown in the UI.
// Empty array = applies to all services.
export function serviceTypesToLabel(types = []) {
  if (!types || types.length === 0) return "Tất cả dịch vụ";
  const key = [...types].sort().join(",");
  const map = {
    homestay:           "Lưu trú (Homestay)",
    tour:               "Tour du lịch",
    car_rental:         "Thuê xe",
    "homestay,tour":    "Tour và Lưu trú",
  };
  return map[key] ?? types.join(", ");
}

// Maps the UI select value to the array stored in the DB.
export const SCOPE_OPTIONS = [
  { value: "all",          label: "Tất cả dịch vụ",       types: [] },
  { value: "tour",         label: "Tour du lịch",          types: ["tour"] },
  { value: "homestay",     label: "Lưu trú (Homestay)",    types: ["homestay"] },
  { value: "car_rental",   label: "Thuê xe",               types: ["car_rental"] },
  { value: "tour_homestay",label: "Tour và Lưu trú",       types: ["tour", "homestay"] },
];

export function scopeValueToTypes(scopeValue) {
  return SCOPE_OPTIONS.find((o) => o.value === scopeValue)?.types ?? [];
}

// Derives a display status from the voucher's is_active flag and date range.
export function deriveStatus(voucher) {
  const now = new Date();
  if (!voucher.isActive) return "paused";
  if (voucher.validTo && new Date(voucher.validTo) < now) return "expired";
  if (voucher.validFrom && new Date(voucher.validFrom) > now) return "upcoming";
  return "active";
}

export const voucherService = {
  // POST /api/vouchers — manager creates a voucher
  // payload: { name, description, code, type, value, minSpend, maxDiscount,
  //            maxUses, validFrom, validTo, applicableServiceTypes }
  async createVoucher(payload) {
    const res = await fetch(`${BASE_URL}/api/vouchers`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  // GET /api/vouchers — manager lists all vouchers
  // opts: { search?: string, status?: 'active'|'expired'|'inactive' }
  async listVouchers(opts = {}) {
    const params = new URLSearchParams();
    if (opts.search) params.set("search", opts.search);
    if (opts.status && opts.status !== "all") params.set("status", opts.status);
    const qs = params.toString();
    const res = await fetch(`${BASE_URL}/api/vouchers${qs ? `?${qs}` : ""}`, {
      headers: { ...authHeaders() },
    });
    return handleResponse(res);
  },

  // PATCH /api/vouchers/:id/toggle — toggle is_active
  async toggleVoucher(id) {
    const res = await fetch(`${BASE_URL}/api/vouchers/${id}/toggle`, {
      method: "PATCH",
      headers: { ...authHeaders() },
    });
    return handleResponse(res);
  },
};
