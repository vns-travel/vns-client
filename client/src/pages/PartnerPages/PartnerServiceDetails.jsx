import { useState, useEffect } from "react";
import {
  Home, MapPin, Camera, Calendar, Bed, List, Clock, Pencil, Save,
  ToggleLeft, ToggleRight, Eye, ArrowLeft, Star, Users, TrendingUp,
  Loader2, AlertCircle, MessageSquare, Plus, Trash2, ChevronUp,
  ChevronDown, X, Power,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { serviceService, SERVICE_TYPE } from "../../services/serviceService";
import { reviewService } from "../../services/reviewService";

const formatPrice = (n) =>
  n != null ? new Intl.NumberFormat("vi-VN").format(n) + " ₫" : "—";
const formatNumber = (n) =>
  n != null ? new Intl.NumberFormat("vi-VN").format(n) : "—";

const InfoItem = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500 mb-0.5">{label}</p>
    <p className="font-semibold text-gray-800">{value ?? "—"}</p>
  </div>
);

const StatCard = ({ label, value, icon: Icon, color }) => (
  <div className="bg-gray-50 rounded-lg p-4 flex items-center gap-3">
    <div className={`p-2 rounded-lg ${color}`}>
      <Icon className="w-4 h-4" />
    </div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-base font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

/* ─── Tag input (amenities) ─── */
const TagInput = ({ label, tags, onChange }) => {
  const [input, setInput] = useState("");
  const add = () => {
    const v = input.trim();
    if (v && !tags.includes(v)) { onChange([...tags, v]); setInput(""); }
  };
  return (
    <div>
      {label && <label className="block text-xs text-gray-500 mb-1">{label}</label>}
      <div className="flex flex-wrap gap-1 mb-1.5 min-h-[28px]">
        {tags.map((tag, i) => (
          <span key={i} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded flex items-center gap-1">
            {tag}
            <button onClick={() => onChange(tags.filter((_, j) => j !== i))}
              className="hover:text-red-600 leading-none">×</button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
          placeholder="Nhập rồi Enter để thêm..."
          className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-primary"
        />
        <button onClick={add}
          className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded border border-gray-200">
          +
        </button>
      </div>
    </div>
  );
};

/* ─── Tour Itinerary Tab (unchanged) ─── */
const ItineraryTab = ({ itinerary }) => {
  if (!itinerary || itinerary.length === 0)
    return <p className="text-sm text-gray-400 italic">Chưa có lịch trình.</p>;
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-800 text-lg">Lịch trình tour</h3>
      <div className="relative">
        {itinerary.map((step, idx) => (
          <div key={step.itineraryId || idx} className="flex gap-4 mb-5">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                {step.stepOrder || idx + 1}
              </div>
              {idx < itinerary.length - 1 && (
                <div className="w-px flex-1 bg-gray-200 mt-1" />
              )}
            </div>
            <div className="pb-4 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-gray-900">{step.activity || step.title}</span>
                {step.durationMinutes && (
                  <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded">
                    {step.durationMinutes} phút
                  </span>
                )}
              </div>
              {step.location && (
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {step.location}
                </p>
              )}
              <p className="text-sm text-gray-600">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Tour Schedules Tab (unchanged) ─── */
const SchedulesTab = ({ schedules }) => {
  if (!schedules || schedules.length === 0)
    return <p className="text-sm text-gray-400 italic">Chưa có lịch khởi hành.</p>;
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-800 text-lg">Lịch khởi hành</h3>
      {schedules.map((s, idx) => (
        <div key={s.scheduleId || idx} className="border border-gray-200 rounded-xl p-5 bg-gray-50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <InfoItem label="Ngày" value={s.tourDate ? new Date(s.tourDate).toLocaleDateString("vi-VN") : "—"} />
            <InfoItem label="Giờ bắt đầu" value={s.startTime} />
            <InfoItem label="Giờ kết thúc" value={s.endTime} />
            <InfoItem label="Slot còn" value={`${s.availableSlots - (s.bookedSlots || 0)}/${s.availableSlots}`} />
            <InfoItem label="Giá" value={formatPrice(s.price)} />
            {s.meetingPoint && <InfoItem label="Điểm hẹn" value={s.meetingPoint} />}
            {s.guideId && <InfoItem label="Hướng dẫn viên" value={s.guideId} />}
            <InfoItem label="Trạng thái" value={s.isActive ? "Hoạt động" : "Tạm ngưng"} />
          </div>
        </div>
      ))}
    </div>
  );
};

/* ─── Star display ─── */
const StarDisplay = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((n) => (
      <Star key={n} className={`w-3.5 h-3.5 ${n <= rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
    ))}
  </div>
);

/* ─── Reviews Tab (unchanged) ─── */
const ReviewsTab = ({ serviceId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    reviewService.getReviewsByService(serviceId)
      .then(setReviews)
      .catch((err) => setError(err.message || "Không thể tải đánh giá."))
      .finally(() => setLoading(false));
  }, [serviceId]);

  if (loading) return <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  if (error) return <p className="text-sm text-red-500 italic">{error}</p>;
  if (reviews.length === 0) return <p className="text-sm text-gray-400 italic">Chưa có đánh giá nào.</p>;

  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <h3 className="font-semibold text-gray-800 text-lg">Đánh giá từ khách</h3>
        <div className="flex items-center gap-1.5 bg-yellow-50 px-3 py-1 rounded-full">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="text-sm font-bold text-gray-800">{avg.toFixed(1)}</span>
          <span className="text-xs text-gray-500">({reviews.length} đánh giá)</span>
        </div>
      </div>
      <div className="space-y-4">
        {reviews.map((r) => (
          <div key={r.id} className="border border-gray-200 rounded-xl p-4 bg-gray-50">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <p className="text-sm font-semibold text-gray-800">{r.reviewer_name || "Khách hàng"}</p>
                <StarDisplay rating={r.rating} />
              </div>
              <p className="text-xs text-gray-400 whitespace-nowrap">
                {new Date(r.created_at).toLocaleDateString("vi-VN")}
              </p>
            </div>
            {r.comment && <p className="text-sm text-gray-600 leading-relaxed">{r.comment}</p>}
            {r.image_urls && r.image_urls.length > 0 && (
              <div className="flex gap-2 mt-3 flex-wrap">
                {r.image_urls.map((url, i) => (
                  <img key={i} src={url} alt="" className="w-20 h-20 object-cover rounded-lg border border-gray-200" />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Homestay Property Editor ─── */
// Lets partners edit operational property details without re-submitting for approval.
const HomestayPropertyEditor = ({ service, homestayId, onSaved }) => {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [warning, setWarning] = useState("");
  const [form, setForm] = useState({
    checkInTime:          service.checkInTime || "",
    checkOutTime:         service.checkOutTime || "",
    houseRules:           service.houseRules || "",
    cancellationPolicy:   service.cancellationPolicy || "",
    amenities:            Array.isArray(service.amenities) ? service.amenities : [],
    hostApprovalRequired: service.hostApprovalRequired || false,
  });

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSave = async () => {
    setSaving(true);
    setWarning("");
    try {
      const result = await serviceService.updateHomestayDetails(homestayId, {
        checkInTime:          form.checkInTime || null,
        checkOutTime:         form.checkOutTime || null,
        houseRules:           form.houseRules || null,
        cancellationPolicy:   form.cancellationPolicy || null,
        amenities:            form.amenities,
        hostApprovalRequired: form.hostApprovalRequired,
      });
      if (result.hasActiveBookings) {
        setWarning(
          `Đã lưu. Lưu ý: ${result.activeBookingCount} đặt phòng đang hoạt động — khách đã đặt trước khi thay đổi giờ nhận/trả phòng.`
        );
      }
      onSaved({ ...form });
      setEditing(false);
    } catch (err) {
      alert(err.message || "Lưu thất bại.");
    } finally {
      setSaving(false);
    }
  };

  if (!editing) {
    return (
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800">Thông tin homestay</h3>
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1 text-xs text-primary border border-primary/30 hover:bg-primary/5 px-2 py-1 rounded"
          >
            <Pencil className="w-3 h-3" /> Chỉnh sửa
          </button>
        </div>
        {warning && (
          <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
            {warning}
          </div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <InfoItem label="Giờ nhận phòng" value={service.checkInTime} />
          <InfoItem label="Giờ trả phòng"  value={service.checkOutTime} />
          <InfoItem label="Yêu cầu duyệt"  value={service.hostApprovalRequired ? "Có" : "Không"} />
          {service.cancellationPolicy && (
            <InfoItem label="Chính sách hủy" value={service.cancellationPolicy} />
          )}
          {service.houseRules && (
            <InfoItem label="Nội quy nhà" value={service.houseRules} />
          )}
        </div>
        {Array.isArray(service.amenities) && service.amenities.length > 0 && (
          <div className="mt-3">
            <p className="text-xs text-gray-500 mb-1">Tiện nghi</p>
            <div className="flex flex-wrap gap-1.5">
              {service.amenities.map((a, i) => (
                <span key={i} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">{a}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">Chỉnh sửa thông tin homestay</h3>
        <div className="flex gap-2">
          <button onClick={() => setEditing(false)} disabled={saving}
            className="text-sm text-gray-600 border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50 disabled:opacity-50">
            Hủy
          </button>
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-1.5 text-sm bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary-hover disabled:opacity-50">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Lưu
          </button>
        </div>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Giờ nhận phòng</label>
            <input type="time" value={form.checkInTime} onChange={(e) => set("checkInTime", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Giờ trả phòng</label>
            <input type="time" value={form.checkOutTime} onChange={(e) => set("checkOutTime", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary" />
          </div>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Nội quy nhà</label>
          <textarea rows={3} value={form.houseRules} onChange={(e) => set("houseRules", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-primary focus:border-primary" />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Chính sách hủy</label>
          <textarea rows={3} value={form.cancellationPolicy} onChange={(e) => set("cancellationPolicy", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-primary focus:border-primary" />
        </div>
        <TagInput label="Tiện nghi" tags={form.amenities} onChange={(v) => set("amenities", v)} />
        <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50">
          <div>
            <p className="text-sm font-medium text-gray-800">Yêu cầu chấp thuận trước</p>
            <p className="text-xs text-gray-500">Đặt phòng cần được xác nhận thủ công</p>
          </div>
          <button onClick={() => set("hostApprovalRequired", !form.hostApprovalRequired)} className="focus:outline-none">
            {form.hostApprovalRequired
              ? <ToggleRight className="w-9 h-9 text-primary" />
              : <ToggleLeft  className="w-9 h-9 text-gray-400" />}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Room Form (shared by add and edit) ─── */
const ROOM_TYPES = ["single", "double", "twin", "suite", "dormitory"];
const BED_TYPES  = ["King", "Queen", "Twin", "Single", "Bunk", "Sofa"];

const emptyRoomForm = {
  roomName: "", roomType: "", description: "", maxOccupancy: "",
  roomSizeSqm: "", bedType: "", bedCount: "", privateBathroom: true,
  basePrice: "", weekendPrice: "", holidayPrice: "", totalUnits: 1, minNights: 1, amenities: [],
};

const roomFormFromRoom = (r) => ({
  roomName:      r.roomName      || "",
  roomType:      r.roomType      || "",
  description:   r.description   || "",
  maxOccupancy:  r.maxOccupancy  ?? "",
  roomSizeSqm:   r.roomSizeSqm   ?? "",
  bedType:       r.bedType       || "",
  bedCount:      r.bedCount      ?? "",
  privateBathroom: r.privateBathroom ?? true,
  basePrice:     r.basePrice     ?? "",
  weekendPrice:  r.weekendPrice  ?? "",
  holidayPrice:  r.holidayPrice  ?? "",
  totalUnits:    r.totalUnits    ?? 1,
  minNights:     r.minNights     ?? 1,
  amenities:     Array.isArray(r.amenities) ? r.amenities : [],
});

const toInt   = (v) => v !== "" && v != null ? parseInt(v, 10)   : undefined;
const toFloat = (v) => v !== "" && v != null ? parseFloat(v)      : undefined;

// Build payload for the UPDATE room API (PUT /:homestayId/rooms/:roomId)
const buildEditPayload = (form) => ({
  roomName:        form.roomName,
  roomType:        form.roomType  || undefined,
  description:     form.description || undefined,
  maxOccupancy:    toInt(form.maxOccupancy),
  roomSizeSqm:     toFloat(form.roomSizeSqm),
  bedType:         form.bedType   || undefined,
  bedCount:        toInt(form.bedCount),
  privateBathroom: form.privateBathroom,
  basePrice:       parseFloat(form.basePrice),
  weekendPrice:    toFloat(form.weekendPrice),
  holidayPrice:    toFloat(form.holidayPrice),
  totalUnits:      toInt(form.totalUnits) || 1,
  minNights:       toInt(form.minNights)  || 1,
  amenities:       form.amenities,
});

// Build payload for the ADD room API (POST /:homestayId/rooms) — uses numberOfRooms
const buildAddPayload = (form) => ({
  roomName:        form.roomName,
  roomType:        form.roomType  || undefined,
  roomDescription: form.description || undefined,
  maxOccupancy:    toInt(form.maxOccupancy),
  roomSizeSqm:     toFloat(form.roomSizeSqm),
  bedType:         form.bedType   || undefined,
  bedCount:        toInt(form.bedCount),
  privateBathroom: form.privateBathroom,
  basePrice:       parseFloat(form.basePrice),
  weekendPrice:    toFloat(form.weekendPrice),
  holidayPrice:    toFloat(form.holidayPrice),
  numberOfRooms:   toInt(form.totalUnits) || 1,
  minNights:       toInt(form.minNights)  || 1,
  roomAmenities:   form.amenities,
});

const RoomFormFields = ({ form, onChange }) => {
  const set = (k, v) => onChange({ ...form, [k]: v });
  const inputClass = "w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:ring-1 focus:ring-primary";
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Tên phòng *</label>
          <input value={form.roomName} onChange={(e) => set("roomName", e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Loại phòng</label>
          <select value={form.roomType} onChange={(e) => set("roomType", e.target.value)} className={inputClass}>
            <option value="">-- Chọn loại --</option>
            {ROOM_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Loại giường</label>
          <select value={form.bedType} onChange={(e) => set("bedType", e.target.value)} className={inputClass}>
            <option value="">-- Chọn --</option>
            {BED_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Số giường</label>
          <input type="number" min={0} value={form.bedCount} onChange={(e) => set("bedCount", e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Khách tối đa</label>
          <input type="number" min={1} value={form.maxOccupancy} onChange={(e) => set("maxOccupancy", e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Diện tích (m²)</label>
          <input type="number" min={0} value={form.roomSizeSqm} onChange={(e) => set("roomSizeSqm", e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Giá ngày thường (₫) *</label>
          <input type="number" min={0} value={form.basePrice} onChange={(e) => set("basePrice", e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Giá cuối tuần (₫)</label>
          <input type="number" min={0} value={form.weekendPrice} onChange={(e) => set("weekendPrice", e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Giá ngày lễ (₫)</label>
          <input type="number" min={0} value={form.holidayPrice} onChange={(e) => set("holidayPrice", e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Số phòng (units)</label>
          <input type="number" min={1} value={form.totalUnits} onChange={(e) => set("totalUnits", e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Số đêm tối thiểu</label>
          <input type="number" min={1} value={form.minNights} onChange={(e) => set("minNights", e.target.value)} className={inputClass} />
        </div>
        <div className="flex items-center gap-2 pt-5">
          <input type="checkbox" id="pBathroom" checked={form.privateBathroom}
            onChange={(e) => set("privateBathroom", e.target.checked)} className="w-4 h-4 accent-primary" />
          <label htmlFor="pBathroom" className="text-sm text-gray-700">Phòng tắm riêng</label>
        </div>
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">Mô tả phòng</label>
        <textarea rows={2} value={form.description} onChange={(e) => set("description", e.target.value)}
          className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm resize-none focus:ring-1 focus:ring-primary" />
      </div>
      <TagInput label="Tiện nghi phòng" tags={form.amenities} onChange={(v) => set("amenities", v)} />
    </div>
  );
};

/* ─── Rooms Manager ─── */
const RoomsManager = ({ rooms: initialRooms, homestayId, onRoomsChanged }) => {
  const [rooms, setRooms]           = useState(initialRooms || []);
  const [editingId, setEditingId]   = useState(null); // roomId being edited
  const [editForm, setEditForm]     = useState(emptyRoomForm);
  const [addingRoom, setAddingRoom] = useState(false);
  const [addForm, setAddForm]       = useState(emptyRoomForm);
  const [saving, setSaving]         = useState(false);
  const [deactivating, setDeactivating] = useState(null); // roomId being toggled

  const startEdit = (room) => {
    setEditingId(room.roomId);
    setEditForm(roomFormFromRoom(room));
    setAddingRoom(false);
  };

  const cancelEdit = () => { setEditingId(null); setEditForm(emptyRoomForm); };

  const handleSaveEdit = async () => {
    if (!editForm.roomName || !editForm.basePrice) {
      alert("Tên phòng và giá cơ bản là bắt buộc."); return;
    }
    setSaving(true);
    try {
      await serviceService.updateRoom(homestayId, editingId, buildEditPayload(editForm));
      const updated = rooms.map((r) =>
        r.roomId === editingId
          ? { ...r, ...editForm, totalUnits: toInt(editForm.totalUnits) || 1, minNights: toInt(editForm.minNights) || 1 }
          : r
      );
      setRooms(updated);
      onRoomsChanged(updated);
      setEditingId(null);
    } catch (err) {
      alert(err.message || "Lưu thất bại.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAdd = async () => {
    if (!addForm.roomName || !addForm.basePrice) {
      alert("Tên phòng và giá cơ bản là bắt buộc."); return;
    }
    setSaving(true);
    try {
      const result = await serviceService.addHomestayRoom(homestayId, buildAddPayload(addForm));
      const newRoom = {
        roomId:          result.roomId,
        roomName:        addForm.roomName,
        roomType:        addForm.roomType || null,
        description:     addForm.description || null,
        maxOccupancy:    toInt(addForm.maxOccupancy),
        roomSizeSqm:     toFloat(addForm.roomSizeSqm),
        bedType:         addForm.bedType || null,
        bedCount:        toInt(addForm.bedCount),
        privateBathroom: addForm.privateBathroom,
        basePrice:       parseFloat(addForm.basePrice),
        weekendPrice:    toFloat(addForm.weekendPrice),
        holidayPrice:    toFloat(addForm.holidayPrice),
        totalUnits:      toInt(addForm.totalUnits) || 1,
        minNights:       toInt(addForm.minNights)  || 1,
        amenities:       addForm.amenities,
        isActive:        true,
      };
      const updated = [...rooms, newRoom];
      setRooms(updated);
      onRoomsChanged(updated);
      setAddingRoom(false);
      setAddForm(emptyRoomForm);
    } catch (err) {
      alert(err.message || "Thêm phòng thất bại.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (room) => {
    setDeactivating(room.roomId);
    try {
      const result = await serviceService.toggleRoomActive(homestayId, room.roomId);
      if (result.hasPendingBookings && !result.isActive) {
        // Warn but don't block — deactivation already happened
        alert(`Phòng đã tạm ngưng. Lưu ý: có đặt phòng đang xử lý cho phòng này — những đặt phòng đó vẫn tiếp tục bình thường.`);
      }
      const updated = rooms.map((r) =>
        r.roomId === room.roomId ? { ...r, isActive: result.isActive } : r
      );
      setRooms(updated);
      onRoomsChanged(updated);
    } catch (err) {
      alert(err.message || "Thao tác thất bại.");
    } finally {
      setDeactivating(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800 text-lg">Danh sách loại phòng</h3>
        <button
          onClick={() => { setAddingRoom(true); setEditingId(null); setAddForm(emptyRoomForm); }}
          disabled={addingRoom}
          className="flex items-center gap-1.5 text-sm bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary-hover disabled:opacity-50"
        >
          <Plus className="w-4 h-4" /> Thêm phòng
        </button>
      </div>

      {rooms.length === 0 && !addingRoom && (
        <p className="text-sm text-gray-400 italic">Chưa có loại phòng nào.</p>
      )}

      {/* Existing rooms */}
      {rooms.map((room) => (
        <div key={room.roomId}
          className={`border rounded-xl overflow-hidden ${room.isActive === false ? "border-gray-200 opacity-70" : "border-gray-200"}`}>
          {/* Room header row */}
          <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">{room.roomName}</span>
              {room.roomType && (
                <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded">{room.roomType}</span>
              )}
              {room.isActive === false && (
                <span className="text-xs text-orange-700 bg-orange-100 px-2 py-0.5 rounded">Tạm ngưng</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {editingId !== room.roomId && (
                <>
                  <button onClick={() => startEdit(room)}
                    className="flex items-center gap-1 text-xs text-gray-600 border border-gray-300 px-2 py-1 rounded hover:bg-gray-100">
                    <Pencil className="w-3 h-3" /> Sửa
                  </button>
                  <button
                    onClick={() => handleToggleActive(room)}
                    disabled={deactivating === room.roomId}
                    title={room.isActive === false ? "Kích hoạt lại" : "Tạm ngưng"}
                    className={`flex items-center gap-1 text-xs border px-2 py-1 rounded disabled:opacity-50 ${
                      room.isActive === false
                        ? "text-green-700 border-green-300 hover:bg-green-50"
                        : "text-orange-700 border-orange-300 hover:bg-orange-50"
                    }`}
                  >
                    {deactivating === room.roomId
                      ? <Loader2 className="w-3 h-3 animate-spin" />
                      : <Power className="w-3 h-3" />}
                    {room.isActive === false ? "Kích hoạt" : "Tạm ngưng"}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Room body — display or edit form */}
          <div className="p-5 bg-white">
            {editingId === room.roomId ? (
              <div>
                <RoomFormFields form={editForm} onChange={setEditForm} />
                <div className="flex gap-2 mt-4 justify-end">
                  <button onClick={cancelEdit} disabled={saving}
                    className="text-sm text-gray-600 border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50 disabled:opacity-50">
                    Hủy
                  </button>
                  <button onClick={handleSaveEdit} disabled={saving}
                    className="flex items-center gap-1.5 text-sm bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary-hover disabled:opacity-50">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Lưu thay đổi
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2 text-right">
                  Thay đổi giá chỉ áp dụng cho đặt phòng mới — đặt phòng hiện tại không bị ảnh hưởng.
                </p>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <InfoItem label="Giá ngày thường" value={formatPrice(room.basePrice)} />
                  <InfoItem label="Giá cuối tuần"   value={formatPrice(room.weekendPrice)} />
                  <InfoItem label="Giá ngày lễ"     value={formatPrice(room.holidayPrice)} />
                  <InfoItem label="Khách tối đa"    value={room.maxOccupancy ? `${room.maxOccupancy} người` : null} />
                  <InfoItem label="Số phòng"        value={room.totalUnits    ? `${room.totalUnits} phòng` : null} />
                  <InfoItem label="Đêm tối thiểu"   value={room.minNights     ? `${room.minNights} đêm`   : null} />
                  {room.bedType  && <InfoItem label="Loại giường" value={room.bedType} />}
                  {room.roomSizeSqm && <InfoItem label="Diện tích" value={`${room.roomSizeSqm} m²`} />}
                </div>
                {Array.isArray(room.amenities) && room.amenities.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-1">Tiện nghi</p>
                    <div className="flex flex-wrap gap-1.5">
                      {room.amenities.map((a, i) => (
                        <span key={i} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">{a}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Add new room form */}
      {addingRoom && (
        <div className="border border-primary/30 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 bg-primary/5 border-b border-primary/20">
            <span className="font-semibold text-primary">Thêm loại phòng mới</span>
            <button onClick={() => setAddingRoom(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-5 bg-white">
            <RoomFormFields form={addForm} onChange={setAddForm} />
            <div className="flex gap-2 mt-4 justify-end">
              <button onClick={() => setAddingRoom(false)} disabled={saving}
                className="text-sm text-gray-600 border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50 disabled:opacity-50">
                Hủy
              </button>
              <button onClick={handleSaveAdd} disabled={saving}
                className="flex items-center gap-1.5 text-sm bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary-hover disabled:opacity-50">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Thêm phòng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── Images Manager ─── */
const ImagesManager = ({ images: initialImages, serviceId, onImagesChanged }) => {
  const [imgs, setImgs]     = useState(
    (Array.isArray(initialImages) ? initialImages : []).map((i) => i.url || i)
  );
  const [newUrl, setNewUrl] = useState("");
  const [saving, setSaving] = useState(false);

  const moveUp   = (i) => { if (i === 0) return; const a = [...imgs]; [a[i-1], a[i]] = [a[i], a[i-1]]; setImgs(a); };
  const moveDown = (i) => { if (i === imgs.length - 1) return; const a = [...imgs]; [a[i+1], a[i]] = [a[i], a[i+1]]; setImgs(a); };
  const remove   = (i) => setImgs(imgs.filter((_, j) => j !== i));

  const addUrl = () => {
    const u = newUrl.trim();
    if (u) { setImgs([...imgs, u]); setNewUrl(""); }
  };

  const handleSave = async () => {
    if (imgs.length === 0) { alert("Cần ít nhất 1 hình ảnh để lưu."); return; }
    setSaving(true);
    try {
      await serviceService.addServiceImages(serviceId, imgs);
      onImagesChanged(imgs);
    } catch (err) {
      alert(err.message || "Lưu thất bại.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800 text-lg">Hình ảnh dịch vụ</h3>
        <button onClick={handleSave} disabled={saving || imgs.length === 0}
          className="flex items-center gap-1.5 text-sm bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary-hover disabled:opacity-50">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Lưu thứ tự
        </button>
      </div>

      {imgs.length === 0
        ? <p className="text-sm text-gray-400 italic mb-4">Chưa có hình ảnh.</p>
        : (
          <div className="space-y-2 mb-4">
            {imgs.map((url, i) => (
              <div key={i} className="flex items-center gap-3 p-2 border border-gray-200 rounded-lg bg-gray-50">
                <img src={url} alt="" className="w-16 h-12 object-cover rounded flex-shrink-0" onError={(e) => { e.target.style.display = "none"; }} />
                <span className="text-xs text-gray-400 flex-shrink-0 w-5 text-center">#{i + 1}</span>
                <span className="text-xs text-gray-600 truncate flex-1">{url}</span>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => moveUp(i)}   disabled={i === 0}             className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"><ChevronUp   className="w-4 h-4" /></button>
                  <button onClick={() => moveDown(i)} disabled={i === imgs.length-1} className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"><ChevronDown className="w-4 h-4" /></button>
                  <button onClick={() => remove(i)}   className="p-1 hover:bg-red-100 rounded text-red-500"><X className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}

      <div className="flex gap-2">
        <input
          type="url"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addUrl())}
          placeholder="Dán URL hình ảnh rồi Enter..."
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
        />
        <button onClick={addUrl}
          className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm hover:bg-gray-200 flex items-center gap-1">
          <Plus className="w-4 h-4" /> Thêm
        </button>
      </div>
      <p className="text-xs text-gray-400 mt-2">Ảnh đầu tiên là ảnh bìa. Nhấn "Lưu thứ tự" để áp dụng thay đổi.</p>
    </div>
  );
};

/* ─── Main Component ─── */
const PartnerServiceDetails = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { serviceId, serviceType } = location.state || {};

  const [service, setService]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving]     = useState(false);
  const [editForm, setEditForm] = useState({ title: "", description: "", city: "", address: "" });

  useEffect(() => {
    if (!serviceId) { setError("Không tìm thấy mã dịch vụ."); setLoading(false); return; }
    serviceService.getServiceById(serviceId)
      .then((data) => {
        setService(data);
        setEditForm({ title: data.title || "", description: data.description || "", city: data.city || "", address: data.address || "" });
      })
      .catch((err) => setError(err.message || "Không thể tải dịch vụ."))
      .finally(() => setLoading(false));
  }, [serviceId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await serviceService.updatePartnerService(serviceId, editForm);
      setService((prev) => ({ ...prev, ...editForm, location: editForm.city || editForm.address || prev.location }));
      setIsEditing(false);
    } catch (err) {
      alert(err.message || "Lưu thất bại.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-bg-light flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );

  if (error || !service)
    return (
      <div className="min-h-screen bg-bg-light flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <p className="text-red-600">{error || "Không tìm thấy dịch vụ."}</p>
          <button onClick={() => navigate("/PartnerService")}
            className="mt-4 text-primary hover:underline text-sm">
            Quay lại danh sách
          </button>
        </div>
      </div>
    );

  const svcType  = service.serviceType ?? serviceType;
  const typeInfo = SERVICE_TYPE[svcType] ?? SERVICE_TYPE[2];

  const tourDetails = service.tourDetails || service.tour || {};
  const rooms       = service.rooms || service.homestayRooms || [];
  const schedules   = tourDetails.schedules   || service.schedules   || [];
  const itinerary   = tourDetails.itineraries || service.itineraries || [];
  const images      = service.serviceImages   || service.images      || [];
  const rating      = service.averageRating   || service.rating;

  const baseTabs   = [{ id: "overview", label: "Tổng quan", icon: Home }];
  const extraTabs  = svcType === 0
    ? [{ id: "rooms", label: "Loại phòng", icon: Bed }, { id: "availability", label: "Lịch trống", icon: Calendar }]
    : svcType === 1
    ? [{ id: "itinerary", label: "Lịch trình", icon: List }, { id: "schedules", label: "Lịch khởi hành", icon: Clock }]
    : [];
  const imagTab    = [{ id: "images",  label: "Hình ảnh",  icon: Camera }];
  const reviewTab  = [{ id: "reviews", label: "Đánh giá",  icon: MessageSquare }];
  const tabs       = [...baseTabs, ...extraTabs, ...imagTab, ...reviewTab];

  return (
    <div className="min-h-screen bg-bg-light p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button onClick={() => navigate("/PartnerService")}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Quay lại dịch vụ
          </button>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button onClick={() => setIsEditing(false)} disabled={saving}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50">
                  Hủy
                </button>
                <button onClick={handleSave} disabled={saving}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary-hover disabled:opacity-50">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Lưu thay đổi
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                disabled={!["draft", "rejected"].includes(service?.status)}
                title={!["draft", "rejected"].includes(service?.status) ? "Chỉ chỉnh sửa tên/địa chỉ ở trạng thái draft hoặc rejected" : ""}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Pencil className="w-4 h-4" /> Chỉnh sửa tên & địa chỉ
              </button>
            )}
          </div>
        </div>

        {/* Title Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  {typeInfo.label}
                </span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  service.status === "approved" ? "bg-green-100 text-green-700"   :
                  service.status === "pending"  ? "bg-yellow-100 text-yellow-700" :
                  service.status === "rejected" ? "bg-orange-100 text-orange-700" :
                  service.status === "draft"    ? "bg-blue-100 text-blue-700"     :
                  "bg-gray-100 text-gray-600"
                }`}>
                  {service.status === "approved" ? "Đang hoạt động" :
                   service.status === "pending"  ? "Chờ duyệt"      :
                   service.status === "rejected" ? "Bị từ chối"     :
                   service.status === "draft"    ? "Bản nháp"       : "Tạm ngưng"}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{service.title}</h1>
              {service.location && (
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {service.location}
                </p>
              )}
            </div>
            {rating > 0 && (
              <div className="text-right flex-shrink-0">
                <div className="flex items-center gap-1 justify-end">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="font-bold text-gray-900">{rating.toFixed(1)}</span>
                </div>
                {service.reviewCount > 0 && (
                  <p className="text-xs text-gray-500">{formatNumber(service.reviewCount)} đánh giá</p>
                )}
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-5">
            <StatCard label="Lượt xem"   value={formatNumber(service.viewCount ?? 0)} icon={Eye}       color="bg-orange-100 text-orange-600" />
            <StatCard label="Còn trống"  value={formatNumber(service.availability)}  icon={TrendingUp} color="bg-green-100 text-green-600"   />
            <StatCard label="Loại dịch vụ" value={typeInfo.label}                    icon={Users}      color="bg-purple-100 text-purple-600" />
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200 px-6">
            <nav className="flex gap-1 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                      activeTab === tab.id
                        ? "border-primary text-primary"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}>
                    <Icon className="w-4 h-4" /> {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* ── Overview ── */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Base service fields — editable only when draft/rejected */}
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Tên dịch vụ</label>
                      <input type="text" value={editForm.title}
                        onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Mô tả</label>
                      <textarea rows={4} value={editForm.description}
                        onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary resize-none" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Thành phố</label>
                        <input type="text" value={editForm.city}
                          onChange={(e) => setEditForm((f) => ({ ...f, city: e.target.value }))}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Địa chỉ</label>
                        <input type="text" value={editForm.address}
                          onChange={(e) => setEditForm((f) => ({ ...f, address: e.target.value }))}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Mô tả</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{service.description || "Chưa có mô tả."}</p>
                  </div>
                )}

                {/* Homestay operational details — always editable */}
                {!isEditing && svcType === 0 && (
                  <HomestayPropertyEditor
                    service={service}
                    homestayId={service.homestayId}
                    onSaved={(updated) => setService((prev) => ({ ...prev, ...updated }))}
                  />
                )}

                {/* Tour overview (read-only) */}
                {!isEditing && svcType === 1 && Object.keys(tourDetails).length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Thông tin tour</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                      <InfoItem label="Thời lượng"    value={tourDetails.durationHours ? `${tourDetails.durationHours} giờ` : null} />
                      <InfoItem label="Số người"       value={tourDetails.minParticipants != null ? `${tourDetails.minParticipants}–${tourDetails.maxParticipants} người` : null} />
                      <InfoItem label="Độ khó"         value={tourDetails.difficultyLevel} />
                      <InfoItem label="Chính sách hủy" value={tourDetails.cancellationPolicy} />
                      <InfoItem label="Giới hạn tuổi"  value={tourDetails.ageRestrictions} />
                      <InfoItem label="Yêu cầu sức khỏe" value={tourDetails.fitnessRequirements} />
                    </div>
                    {tourDetails.includes && tourDetails.includes.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-2">Bao gồm</p>
                          <div className="flex flex-wrap gap-2">
                            {tourDetails.includes.map((x, i) => (
                              <span key={i} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">{x}</span>
                            ))}
                          </div>
                        </div>
                        {tourDetails.excludes && tourDetails.excludes.length > 0 && (
                          <div>
                            <p className="text-xs text-gray-500 mb-2">Không bao gồm</p>
                            <div className="flex flex-wrap gap-2">
                              {tourDetails.excludes.map((x, i) => (
                                <span key={i} className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded">{x}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    {tourDetails.whatToBring && (
                      <div className="mt-3">
                        <p className="text-xs text-gray-500 mb-1">Cần mang theo</p>
                        <p className="text-sm text-gray-700">{tourDetails.whatToBring}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ── Homestay rooms (editable) ── */}
            {activeTab === "rooms" && (
              <RoomsManager
                rooms={rooms}
                homestayId={service.homestayId}
                onRoomsChanged={(newRooms) => setService((prev) => ({ ...prev, rooms: newRooms }))}
              />
            )}

            {/* ── Homestay availability (read-only summary) ── */}
            {activeTab === "availability" && (
              <div>
                <h3 className="font-semibold text-gray-800 text-lg mb-3">Tình trạng phòng trống</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">
                    Còn trống: <span className="font-bold text-gray-900">{formatNumber(service.availability)}</span>
                  </p>
                </div>
              </div>
            )}

            {/* ── Tour tabs ── */}
            {activeTab === "itinerary" && <ItineraryTab itinerary={itinerary} />}
            {activeTab === "schedules"  && <SchedulesTab schedules={schedules}  />}

            {/* ── Images (editable) ── */}
            {activeTab === "images" && (
              <ImagesManager
                images={images}
                serviceId={serviceId}
                onImagesChanged={(newImgs) => setService((prev) => ({ ...prev, images: newImgs }))}
              />
            )}

            {/* ── Reviews ── */}
            {activeTab === "reviews" && <ReviewsTab serviceId={serviceId} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerServiceDetails;
