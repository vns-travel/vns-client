const BASE_URL = "";

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

export const userService = {
  // GET /api/users/me — returns { id, email, fullName, phone, avatarUrl, role, status }
  async getMe() {
    const res = await fetch(`${BASE_URL}/api/users/me`, {
      headers: { ...authHeaders() },
    });
    return handleResponse(res);
  },

  // PATCH /api/users/me — accepts { fullName?, phone?, avatarUrl?, businessName? }
  async updateMe({ fullName, phone, avatarUrl, businessName } = {}) {
    const body = {};
    if (fullName      !== undefined) body.fullName      = fullName;
    if (phone         !== undefined) body.phone         = phone;
    if (avatarUrl     !== undefined) body.avatarUrl     = avatarUrl;
    if (businessName  !== undefined) body.businessName  = businessName;

    const res = await fetch(`${BASE_URL}/api/users/me`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(body),
    });
    return handleResponse(res);
  },

  // POST /api/users/me/change-password — accepts { currentPassword, newPassword }
  async changePassword({ currentPassword, newPassword }) {
    const res = await fetch(`${BASE_URL}/api/users/me/change-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    return handleResponse(res);
  },

  // PUT /api/users/me/documents/:docType — save uploaded doc URL to DB
  async upsertDocument(docType, fileUrl) {
    const res = await fetch(`${BASE_URL}/api/users/me/documents/${docType}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ fileUrl }),
    });
    return handleResponse(res);
  },
};
