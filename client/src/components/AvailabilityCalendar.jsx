import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { serviceService } from "../services/serviceService";

const WEEKDAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

function toDateStr(date) {
  return date.toISOString().slice(0, 10);
}

function isWeekend(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  const day = d.getDay(); // 0=Sun, 6=Sat
  return day === 0 || day === 6;
}

function effectivePrice(row, room) {
  if (row.priceOverride != null) return row.priceOverride;
  if (isWeekend(row.date) && room.weekendPrice != null) return room.weekendPrice;
  return room.basePrice;
}

function formatPrice(n) {
  if (n == null) return "";
  return new Intl.NumberFormat("vi-VN", { notation: "compact", maximumFractionDigits: 0 }).format(n) + "₫";
}

function getMonthDays(year, month) {
  // Returns array of date strings for the full calendar grid (Mon-start, padded)
  const firstDay = new Date(year, month, 1);
  const lastDay  = new Date(year, month + 1, 0);

  // Monday-based offset (0=Mon … 6=Sun); getDay() returns 0=Sun
  const startOffset = (firstDay.getDay() + 6) % 7;

  const days = [];
  for (let i = 0; i < startOffset; i++) days.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(toDateStr(new Date(year, month, d)));
  }
  // Pad to full weeks
  while (days.length % 7 !== 0) days.push(null);
  return days;
}

function cellStyle(row, room) {
  if (!row) return "bg-white border border-dashed border-gray-300 text-gray-300";
  if (row.isBlocked) return "bg-gray-200 text-gray-500";
  if (row.availableUnits === 0) return "bg-red-100 text-red-700";
  if (row.availableUnits === room.totalUnits) return "bg-green-100 text-green-800";
  return "bg-yellow-100 text-yellow-800";
}

export default function AvailabilityCalendar({ homestayId, rooms }) {
  const [selectedRoomId, setSelectedRoomId] = useState(rooms[0]?.roomId ?? null);
  const [currentMonth, setCurrentMonth]     = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [availabilityMap, setAvailabilityMap] = useState(new Map()); // date → row
  const [loading, setLoading]   = useState(false);
  const [saving, setSaving]     = useState(false);
  const [selectedDates, setSelectedDates] = useState(new Set());
  // actionMode: null | 'open' | 'block'
  const [actionMode, setActionMode] = useState(null);
  const [openForm, setOpenForm] = useState({ priceOverride: "", minNights: "" });

  const selectedRoom = rooms.find(r => r.roomId === selectedRoomId) ?? rooms[0];

  const loadAvailability = useCallback(async () => {
    if (!selectedRoomId) return;
    const year  = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const startDate = toDateStr(new Date(year, month, 1));
    const endDate   = toDateStr(new Date(year, month + 1, 0));
    setLoading(true);
    try {
      const data = await serviceService.getHomestayAvailability(homestayId, startDate, endDate);
      const room = data.find(r => r.roomId === selectedRoomId);
      const map = new Map();
      if (room) {
        for (const row of room.availability) map.set(row.date, row);
      }
      setAvailabilityMap(map);
    } catch (err) {
      console.error("Failed to load availability:", err);
    } finally {
      setLoading(false);
    }
  }, [homestayId, selectedRoomId, currentMonth]);

  useEffect(() => {
    setSelectedDates(new Set());
    setActionMode(null);
    loadAvailability();
  }, [loadAvailability]);

  function prevMonth() {
    setCurrentMonth(m => new Date(m.getFullYear(), m.getMonth() - 1, 1));
  }
  function nextMonth() {
    setCurrentMonth(m => new Date(m.getFullYear(), m.getMonth() + 1, 1));
  }

  function toggleDate(dateStr) {
    setSelectedDates(prev => {
      const next = new Set(prev);
      if (next.has(dateStr)) next.delete(dateStr);
      else next.add(dateStr);
      return next;
    });
    setActionMode(null);
  }

  function clearSelection() {
    setSelectedDates(new Set());
    setActionMode(null);
  }

  // Bulk open the entire displayed month
  async function handleOpenMonth() {
    if (!selectedRoom) return;
    const year  = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    // Only open from today onward — past dates cannot be modified
    const firstOfMonth = toDateStr(new Date(year, month, 1));
    const startDate = firstOfMonth >= today ? firstOfMonth : today;
    const endDate   = toDateStr(new Date(year, month + 1, 0));
    if (startDate > endDate) return; // entire month is in the past
    setSaving(true);
    try {
      await serviceService.bulkHomestayAvailability(homestayId, {
        startDate,
        endDate,
        rooms: [{ roomId: selectedRoom.roomId }],
      });
      await loadAvailability();
    } catch (err) {
      alert(err.message || "Thao tác thất bại.");
    } finally {
      setSaving(false);
    }
  }

  // Open selected dates with optional price override / min nights
  async function handleOpenSelected() {
    if (!selectedRoom || selectedDates.size === 0) return;
    const sorted = Array.from(selectedDates).sort();
    const startDate = sorted[0];
    const endDate   = sorted[sorted.length - 1];
    const payload = {
      startDate,
      endDate,
      rooms: [{
        roomId: selectedRoom.roomId,
        ...(openForm.priceOverride ? { defaultPrice: parseFloat(openForm.priceOverride) } : {}),
        ...(openForm.minNights     ? { minNights: parseInt(openForm.minNights, 10) }      : {}),
      }],
    };
    setSaving(true);
    try {
      await serviceService.bulkHomestayAvailability(homestayId, payload);
      await loadAvailability();
      clearSelection();
    } catch (err) {
      alert(err.message || "Thao tác thất bại.");
    } finally {
      setSaving(false);
    }
  }

  // Block or unblock selected dates
  async function handleBlock(isBlocked) {
    if (!selectedRoom || selectedDates.size === 0) return;
    const sorted = Array.from(selectedDates).sort();
    setSaving(true);
    try {
      await serviceService.blockHomestayAvailability(homestayId, {
        startDate: sorted[0],
        endDate:   sorted[sorted.length - 1],
        roomIds:   [selectedRoom.roomId],
        isBlocked,
      });
      await loadAvailability();
      clearSelection();
    } catch (err) {
      alert(err.message || "Thao tác thất bại.");
    } finally {
      setSaving(false);
    }
  }

  const year  = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const days  = getMonthDays(year, month);
  const monthLabel = currentMonth.toLocaleDateString("vi-VN", { month: "long", year: "numeric" });

  const today = toDateStr(new Date());

  // "Mở cả tháng" is only meaningful if the month has at least one future date
  const lastOfMonth = toDateStr(new Date(year, month + 1, 0));
  const monthIsAllPast = lastOfMonth < today;

  const selectedHasBlocked = Array.from(selectedDates).some(d => availabilityMap.get(d)?.isBlocked);

  if (rooms.length === 0) {
    return (
      <p className="text-sm text-gray-400 italic">Chưa có loại phòng — thêm phòng trước khi quản lý lịch.</p>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header row: room selector + month nav + bulk action */}
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 whitespace-nowrap">Loại phòng:</label>
          <select
            value={selectedRoomId ?? ""}
            onChange={e => setSelectedRoomId(e.target.value)}
            className="text-sm border border-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            {rooms.map(r => (
              <option key={r.roomId} value={r.roomId}>{r.roomName}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={prevMonth} disabled={loading || saving}
            className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-40">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-semibold text-gray-800 min-w-[130px] text-center capitalize">
            {monthLabel}
          </span>
          <button onClick={nextMonth} disabled={loading || saving}
            className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-40">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={handleOpenMonth}
          disabled={saving || loading || monthIsAllPast}
          className="flex items-center gap-1.5 text-sm bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary-hover disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          Mở cả tháng
        </button>
      </div>

      {/* Calendar grid */}
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10 rounded-xl">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        )}

        {/* Weekday headers */}
        <div className="grid grid-cols-7 mb-1">
          {WEEKDAYS.map(d => (
            <div key={d} className="text-center text-xs font-medium text-gray-500 py-1">{d}</div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((dateStr, idx) => {
            if (!dateStr) return <div key={idx} />;
            const row        = availabilityMap.get(dateStr) ?? null;
            const isSelected = selectedDates.has(dateStr);
            const isPast     = dateStr < today;
            const dayNum     = new Date(dateStr + "T00:00:00").getDate();
            const price      = row ? effectivePrice(row, selectedRoom) : null;
            const units      = row ? row.availableUnits : null;

            return (
              <button
                key={dateStr}
                onClick={() => !isPast && toggleDate(dateStr)}
                disabled={saving || isPast}
                className={`
                  relative rounded-lg p-1.5 text-left transition-all min-h-[60px]
                  ${isPast ? "bg-gray-50 text-gray-300 cursor-not-allowed" : cellStyle(row, selectedRoom)}
                  ${isSelected ? "ring-2 ring-blue-500 ring-offset-1" : ""}
                  ${!isPast ? "hover:opacity-80" : ""}
                  disabled:cursor-not-allowed
                `}
              >
                <span className="text-xs font-semibold block">{dayNum}</span>
                {price != null && (
                  <span className="text-[10px] block leading-tight mt-0.5">{formatPrice(price)}</span>
                )}
                {row && (
                  <span className="text-[10px] block leading-tight">
                    {row.isBlocked ? "Chặn" : `${units}/${selectedRoom.totalUnits}`}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-xs text-gray-600">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-200 inline-block" /> Còn trống</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-yellow-200 inline-block" /> Còn ít phòng</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-200 inline-block" /> Hết phòng</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gray-300 inline-block" /> Đã chặn</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded border border-dashed border-gray-400 inline-block" /> Chưa mở</span>
      </div>

      {/* Action panel — visible when dates are selected */}
      {selectedDates.size > 0 && (
        <div className="border border-blue-200 rounded-xl p-4 bg-blue-50 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-blue-800">
              Đã chọn {selectedDates.size} ngày
            </span>
            <button onClick={clearSelection} className="text-xs text-gray-500 hover:text-gray-700 underline">
              Bỏ chọn
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActionMode(actionMode === "open" ? null : "open")}
              disabled={saving}
              className="text-sm bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              Mở ngày
            </button>
            <button
              onClick={() => handleBlock(true)}
              disabled={saving}
              className="flex items-center gap-1 text-sm bg-gray-600 text-white px-3 py-1.5 rounded-lg hover:bg-gray-700 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Chặn ngày
            </button>
            {selectedHasBlocked && (
              <button
                onClick={() => handleBlock(false)}
                disabled={saving}
                className="text-sm border border-green-600 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-50 disabled:opacity-50"
              >
                Bỏ chặn
              </button>
            )}
          </div>

          {/* Open sub-form */}
          {actionMode === "open" && (
            <div className="bg-white rounded-lg border border-gray-200 p-3 space-y-3">
              <p className="text-xs text-gray-500">Tuỳ chọn — để trống để dùng giá gốc và đêm tối thiểu của phòng.</p>
              <div className="flex flex-wrap gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-0.5">Giá riêng (₫)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder={selectedRoom?.basePrice ?? ""}
                    value={openForm.priceOverride}
                    onChange={e => setOpenForm(f => ({ ...f, priceOverride: e.target.value }))}
                    className="w-36 text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-0.5">Đêm tối thiểu</label>
                  <input
                    type="number"
                    min="1"
                    max="365"
                    placeholder={selectedRoom?.minNights ?? "1"}
                    value={openForm.minNights}
                    onChange={e => setOpenForm(f => ({ ...f, minNights: e.target.value }))}
                    className="w-24 text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleOpenSelected}
                  disabled={saving}
                  className="flex items-center gap-1.5 text-sm bg-primary text-white px-4 py-1.5 rounded-lg hover:bg-primary-hover disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Xác nhận mở
                </button>
                <button
                  onClick={() => setActionMode(null)}
                  disabled={saving}
                  className="text-sm text-gray-600 border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Hủy
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
