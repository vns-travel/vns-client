import { useState } from "react";
import {
  Search,
  RefreshCw,
  Users,
  Building,
  Shield,
  CheckCircle,
  Clock,
  XCircle,
  Edit3,
  Trash2,
  Plus,
  Filter,
  UserCheck,
  UserX,
} from "lucide-react";

const allUsers = [
  { id: "USR-001", name: "Nguyễn Văn An", email: "an.nv@gmail.com", role: "user", status: "active", joined: "10/01/2024", bookings: 5 },
  { id: "USR-002", name: "Trần Thị Bình", email: "binh.tt@gmail.com", role: "user", status: "active", joined: "15/01/2024", bookings: 3 },
  { id: "USR-003", name: "Lê Văn Cường", email: "cuong.lv@gmail.com", role: "user", status: "banned", joined: "20/01/2024", bookings: 0 },
  { id: "PTN-001", name: "Hanoi Heritage Hotel", email: "contact@hanoiheritage.vn", role: "partner", status: "active", joined: "05/01/2024", bookings: 124 },
  { id: "PTN-002", name: "Mekong Delta Tours", email: "info@mekongdelta.vn", role: "partner", status: "active", joined: "08/01/2024", bookings: 89 },
  { id: "PTN-003", name: "Phu Quoc Car Rental", email: "rent@phuquoccar.vn", role: "partner", status: "pending", joined: "18/02/2024", bookings: 0 },
  { id: "MGR-001", name: "Nguyễn Thị Manager", email: "manager1@vns.vn", role: "manager", status: "active", joined: "01/12/2023", bookings: null },
  { id: "MGR-002", name: "Trần Văn Quản Lý", email: "manager2@vns.vn", role: "manager", status: "active", joined: "01/12/2023", bookings: null },
];

const roleConfig = {
  user: { label: "Người dùng", color: "bg-blue-100 text-blue-700", icon: Users },
  partner: { label: "Đối tác", color: "bg-green-100 text-green-700", icon: Building },
  manager: { label: "Quản lý", color: "bg-purple-100 text-purple-700", icon: Shield },
};

const statusConfig = {
  active: { label: "Hoạt động", color: "bg-green-100 text-green-800", icon: CheckCircle },
  pending: { label: "Chờ duyệt", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  banned: { label: "Đã khóa", color: "bg-red-100 text-red-800", icon: XCircle },
  inactive: { label: "Ngừng HĐ", color: "bg-gray-100 text-gray-600", icon: Clock },
};

const AdminUserManagement = () => {
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [users, setUsers] = useState(allUsers);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newManager, setNewManager] = useState({ name: "", email: "", region: "" });

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.id.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === "all" || u.role === filterRole;
    const matchStatus = filterStatus === "all" || u.status === filterStatus;
    return matchSearch && matchRole && matchStatus;
  });

  const toggleBan = (id) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: u.status === "banned" ? "active" : "banned" } : u
      )
    );
  };

  const counts = {
    user: users.filter((u) => u.role === "user").length,
    partner: users.filter((u) => u.role === "partner").length,
    manager: users.filter((u) => u.role === "manager").length,
  };

  return (
    <div className="min-h-screen bg-bg-light p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Quản lý người dùng</h1>
            <p className="text-gray-500 text-sm">Quản lý tất cả tài khoản trên nền tảng</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover text-sm"
          >
            <Plus className="w-4 h-4" />
            Tạo tài khoản Quản lý
          </button>
        </div>

        {/* Role summary */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {Object.entries(roleConfig).map(([role, cfg]) => {
            const Icon = cfg.icon;
            return (
              <button
                key={role}
                onClick={() => setFilterRole(role)}
                className={`bg-white rounded-xl border p-4 text-left hover:shadow-sm transition-all ${filterRole === role ? "border-primary ring-1 ring-primary" : "border-gray-200"}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${cfg.color}`}><Icon className="w-4 h-4" /></div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">{counts[role]}</p>
                    <p className="text-xs text-gray-500">{cfg.label}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm theo tên, email, mã..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary bg-white"
          >
            <option value="all">Tất cả vai trò</option>
            <option value="user">Người dùng</option>
            <option value="partner">Đối tác</option>
            <option value="manager">Quản lý</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary bg-white"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="pending">Chờ duyệt</option>
            <option value="banned">Đã khóa</option>
          </select>
          <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <RefreshCw className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-500">Hiển thị <span className="font-medium text-gray-900">{filtered.length}</span> kết quả</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {["Mã", "Tên / Email", "Vai trò", "Trạng thái", "Ngày tham gia", "Đặt chỗ", "Hành động"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((u) => {
                  const rc = roleConfig[u.role];
                  const sc = statusConfig[u.status];
                  const RIcon = rc.icon;
                  const SIcon = sc.icon;
                  return (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="px-5 py-4 font-mono text-xs text-gray-400">{u.id}</td>
                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-900">{u.name}</p>
                        <p className="text-xs text-gray-400">{u.email}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${rc.color}`}>
                          <RIcon className="w-3 h-3" /> {rc.label}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${sc.color}`}>
                          <SIcon className="w-3 h-3" /> {sc.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-500">{u.joined}</td>
                      <td className="px-5 py-4 text-gray-700 font-medium">
                        {u.bookings !== null ? u.bookings : "—"}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => toggleBan(u.id)}
                            className={`p-1.5 rounded hover:bg-gray-100 ${u.status === "banned" ? "text-green-500" : "text-orange-500"}`}
                            title={u.status === "banned" ? "Mở khóa" : "Khóa tài khoản"}
                          >
                            {u.status === "banned" ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-primary hover:bg-gray-100 rounded" title="Chỉnh sửa">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded" title="Xóa">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Manager Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-5">Tạo tài khoản Quản lý mới</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={newManager.name}
                  onChange={(e) => setNewManager({ ...newManager, name: e.target.value })}
                  placeholder="Nguyễn Văn A"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  value={newManager.email}
                  onChange={(e) => setNewManager({ ...newManager, email: e.target.value })}
                  placeholder="manager@vns.vn"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Khu vực phụ trách</label>
                <select
                  value={newManager.region}
                  onChange={(e) => setNewManager({ ...newManager, region: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary bg-white"
                >
                  <option value="">Chọn khu vực</option>
                  <option>Hà Nội</option>
                  <option>TP.HCM</option>
                  <option>Đà Nẵng</option>
                  <option>Toàn quốc</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setShowAddModal(false); setNewManager({ name: "", email: "", region: "" }); }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover font-medium"
              >
                Tạo tài khoản
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserManagement;
