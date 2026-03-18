import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  Users,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Home,
  Car,
  Camera,
  MessageSquare,
  CreditCard,
  Pencil,
  Save,
  X,
  Navigation,
  UserCheck,
  Globe,
  Package,
  Banknote,
  ThumbsUp,
  ThumbsDown,
  ImageIcon,
} from "lucide-react";

// Default mock shown when navigating directly (no state)
const DEFAULT_BOOKING = {
  id: "VNS-HB-20241501",
  bookingId: "uuid-hb-001",
  customerName: "Nguyễn Văn Minh",
  email: "nguyen.minh@gmail.com",
  phone: "+84 901 234 567",
  customerAvatar: "NVM",
  serviceType: "Homestay",
  serviceName: "Oceanview Deluxe Homestay",
  address: "123 Trần Phú, Quận 1, TP. Hồ Chí Minh",
  checkInDate: "2026-06-10",
  checkOutDate: "2026-06-15",
  nights: 5,
  guests: "2 người lớn, 1 trẻ em",
  roomName: "Phòng Deluxe Ocean View",
  roomRate: 1500000,
  numberOfRooms: 1,
  status: "confirmed",
  amount: 7500000,
  paidAmount: 7500000,
  paymentMethod: "ZaloPay",
  paymentStatus: "paid",
  specialRequests: "Yêu cầu phòng tầng cao. Đến muộn khoảng 22:00.",
  bookingDate: "2026-05-20",
  lastUpdated: "2026-05-22",
  bookingSource: "Website",
  refundRequest: {
    requestId: "RF-001",
    requestDate: "2026-05-25",
    reason:
      "Kế hoạch thay đổi đột ngột, gia đình có việc bận không thể đến check-in đúng hạn. Xin hoàn lại tiền đặt cọc.",
    requestedAmount: 5000000,
    images: ["cancellation-proof-1.jpg", "cancellation-proof-2.jpg"],
    status: "pending",
    approvedAmount: null,
    rejectionReason: null,
    processedDate: null,
  },
};

const PartnerBookingDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(
    location.state?.booking || DEFAULT_BOOKING,
  );
  const [activeTab, setActiveTab] = useState("details");
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(null);
  const [refund, setRefund] = useState(
    (location.state?.booking || DEFAULT_BOOKING).refundRequest || null,
  );
  const [refundAction, setRefundAction] = useState(null); // "approve" | "reject"
  const [refundDraft, setRefundDraft] = useState({ amount: "", reason: "" });

  const handleEdit = () => {
    if (booking.serviceType === "Homestay") {
      setDraft({
        specialRequests: booking.specialRequests || "",
        checkInDate: booking.checkInDate,
        checkOutDate: booking.checkOutDate,
        guests: booking.guests,
      });
    } else if (booking.serviceType === "Tour") {
      setDraft({
        specialRequests: booking.specialRequests || "",
        tourDate: booking.tourDate,
        participants: booking.participants,
      });
    } else if (booking.serviceType === "Car Rental") {
      setDraft({
        specialRequests: booking.specialRequests || "",
        rentalStartTime: booking.rentalStartTime?.split("T")[0] || "",
        rentalEndTime: booking.rentalEndTime?.split("T")[0] || "",
      });
    }
    setIsEditing(true);
  };

  const handleSave = () => {
    if (booking.serviceType === "Homestay") {
      setBooking((prev) => ({
        ...prev,
        specialRequests: draft.specialRequests,
        checkInDate: draft.checkInDate,
        checkOutDate: draft.checkOutDate,
        guests: draft.guests,
      }));
    } else if (booking.serviceType === "Tour") {
      setBooking((prev) => ({
        ...prev,
        specialRequests: draft.specialRequests,
        tourDate: draft.tourDate,
        participants: Number(draft.participants),
      }));
    } else if (booking.serviceType === "Car Rental") {
      setBooking((prev) => ({
        ...prev,
        specialRequests: draft.specialRequests,
        rentalStartTime: draft.rentalStartTime + "T08:00:00",
        rentalEndTime: draft.rentalEndTime + "T18:00:00",
      }));
    }
    setIsEditing(false);
    setDraft(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setDraft(null);
  };

  const handleApproveRefund = () => {
    const amount = Number(refundDraft.amount);
    if (!amount || amount <= 0) return;
    setRefund((r) => ({
      ...r,
      status: "approved",
      approvedAmount: amount,
      processedDate: new Date().toISOString().split("T")[0],
    }));
    setRefundAction(null);
    setRefundDraft({ amount: "", reason: "" });
  };

  const handleRejectRefund = () => {
    if (!refundDraft.reason.trim()) return;
    setRefund((r) => ({
      ...r,
      status: "rejected",
      rejectionReason: refundDraft.reason,
      processedDate: new Date().toISOString().split("T")[0],
    }));
    setRefundAction(null);
    setRefundDraft({ amount: "", reason: "" });
  };

  // ── Helpers ──────────────────────────────────────────────────────────────

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "confirmed":
        return "Đã xác nhận";
      case "pending":
        return "Đang chờ";
      case "completed":
        return "Đã hoàn thành";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatDateOnly = (dateString) =>
    new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const ServiceIcon =
    booking.serviceType === "Tour"
      ? Camera
      : booking.serviceType === "Car Rental"
        ? Car
        : Home;

  const serviceTypeLabel =
    booking.serviceType === "Tour"
      ? "Tour"
      : booking.serviceType === "Car Rental"
        ? "Thuê xe"
        : "Lưu trú";

  // Synthetic payments if none exist
  const payments =
    booking.payments ||
    [
      booking.paidAmount > 0 && {
        paymentId: "PAY-001",
        amount: booking.paidAmount,
        paymentType: booking.paidAmount < booking.amount ? "deposit" : "full",
        paymentTime: booking.bookingDate + "T10:00:00",
        transactionId: "TXN-AUTO-001",
        paymentMethod: booking.paymentMethod,
        paymentStatus: "completed",
      },
      booking.paidAmount < booking.amount &&
        booking.paymentStatus !== "cancelled" && {
          paymentId: "PAY-002",
          amount: booking.amount - booking.paidAmount,
          paymentType: "balance",
          paymentTime: booking.checkInDate
            ? booking.checkInDate + "T10:00:00"
            : booking.tourDate
              ? booking.tourDate + "T10:00:00"
              : booking.rentalStartTime || "",
          transactionId: "TXN-AUTO-002",
          paymentMethod: booking.paymentMethod,
          paymentStatus: "pending",
        },
    ].filter(Boolean);

  // ── Edit input helper ────────────────────────────────────────────────────

  const EditField = ({ label, field, type = "text", min }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {isEditing ? (
        <input
          type={type}
          min={min}
          value={draft[field]}
          onChange={(e) => setDraft({ ...draft, [field]: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#008fa0]"
        />
      ) : null}
    </div>
  );

  // ── Type-specific detail sections ────────────────────────────────────────

  const HomestaySection = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-4">
        <Calendar className="h-5 w-5 text-[#008fa0] mr-2" />
        <h3 className="text-lg font-medium text-gray-900">Chi tiết lưu trú</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Ngày nhận phòng
          </label>
          {isEditing ? (
            <input
              type="date"
              value={draft.checkInDate}
              onChange={(e) =>
                setDraft({ ...draft, checkInDate: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#008fa0]"
            />
          ) : (
            <p className="mt-1 text-sm text-gray-900">
              {formatDateOnly(booking.checkInDate)}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Ngày trả phòng
          </label>
          {isEditing ? (
            <input
              type="date"
              value={draft.checkOutDate}
              onChange={(e) =>
                setDraft({ ...draft, checkOutDate: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#008fa0]"
            />
          ) : (
            <p className="mt-1 text-sm text-gray-900">
              {formatDateOnly(booking.checkOutDate)}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Số đêm
          </label>
          <p className="mt-1 text-sm text-gray-900">{booking.nights} đêm</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Số khách
          </label>
          {isEditing ? (
            <input
              type="text"
              value={draft.guests}
              onChange={(e) => setDraft({ ...draft, guests: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#008fa0]"
            />
          ) : (
            <p className="mt-1 text-sm text-gray-900">{booking.guests}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tên phòng
          </label>
          <p className="mt-1 text-sm text-gray-900">{booking.roomName}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Giá phòng/đêm
          </label>
          <p className="mt-1 text-sm text-gray-900">
            {formatCurrency(booking.roomRate)}
          </p>
        </div>
      </div>
    </div>
  );

  const TourSection = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-4">
        <Camera className="h-5 w-5 text-[#008fa0] mr-2" />
        <h3 className="text-lg font-medium text-gray-900">Chi tiết tour</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Ngày tour
          </label>
          {isEditing ? (
            <input
              type="date"
              value={draft.tourDate}
              onChange={(e) => setDraft({ ...draft, tourDate: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#008fa0]"
            />
          ) : (
            <p className="mt-1 text-sm text-gray-900">
              {formatDateOnly(booking.tourDate)}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Khung giờ
          </label>
          <p className="mt-1 text-sm text-gray-900">{booking.timeSlot}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Số người tham gia
          </label>
          {isEditing ? (
            <input
              type="number"
              min="1"
              value={draft.participants}
              onChange={(e) =>
                setDraft({ ...draft, participants: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#008fa0]"
            />
          ) : (
            <p className="mt-1 text-sm text-gray-900">
              {booking.participants} người
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Thời lượng
          </label>
          <p className="mt-1 text-sm text-gray-900">{booking.duration}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Hướng dẫn viên
          </label>
          <div className="mt-1 flex items-center">
            <UserCheck className="h-4 w-4 text-gray-400 mr-1" />
            <p className="text-sm text-gray-900">{booking.guideName}</p>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Ngôn ngữ
          </label>
          <div className="mt-1 flex items-center">
            <Globe className="h-4 w-4 text-gray-400 mr-1" />
            <p className="text-sm text-gray-900">{booking.language}</p>
          </div>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Điểm hẹn
          </label>
          <div className="mt-1 flex items-start">
            <Navigation className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
            <p className="text-sm text-gray-900">{booking.pickupLocation}</p>
          </div>
        </div>
        {booking.included?.length > 0 && (
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Bao gồm
            </label>
            <div className="mt-1 flex flex-wrap gap-2">
              {booking.included.map((item, i) => (
                <span
                  key={i}
                  className="inline-flex items-center px-2 py-1 text-xs bg-green-50 text-green-700 rounded"
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}
        {booking.rating && (
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Đánh giá sau tour
            </label>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-yellow-500">
                {"★".repeat(booking.rating)}
              </span>
              {booking.review && (
                <p className="text-sm text-gray-700 italic">
                  "{booking.review}"
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const CarRentalSection = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-4">
        <Car className="h-5 w-5 text-[#008fa0] mr-2" />
        <h3 className="text-lg font-medium text-gray-900">Chi tiết thuê xe</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Thời gian nhận xe
          </label>
          {isEditing ? (
            <input
              type="date"
              value={draft.rentalStartTime}
              onChange={(e) =>
                setDraft({ ...draft, rentalStartTime: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#008fa0]"
            />
          ) : (
            <p className="mt-1 text-sm text-gray-900">
              {formatDate(booking.rentalStartTime)}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Thời gian trả xe
          </label>
          {isEditing ? (
            <input
              type="date"
              value={draft.rentalEndTime}
              onChange={(e) =>
                setDraft({ ...draft, rentalEndTime: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#008fa0]"
            />
          ) : (
            <p className="mt-1 text-sm text-gray-900">
              {formatDate(booking.rentalEndTime)}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Số ngày thuê
          </label>
          <p className="mt-1 text-sm text-gray-900">
            {booking.rentalDays} ngày
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tên xe
          </label>
          <p className="mt-1 text-sm text-gray-900">{booking.vehicleName}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Loại xe
          </label>
          <p className="mt-1 text-sm text-gray-900">{booking.vehicleType}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Hộp số / Nhiên liệu
          </label>
          <p className="mt-1 text-sm text-gray-900">
            {booking.transmission} · {booking.fuelType}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tài xế
          </label>
          <p className="mt-1 text-sm text-gray-900">
            {booking.driverIncluded
              ? `Có tài xế — ${booking.driverName}`
              : "Tự lái"}
          </p>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Địa điểm nhận xe
          </label>
          <div className="mt-1 flex items-start">
            <Navigation className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
            <p className="text-sm text-gray-900">{booking.pickupLocation}</p>
          </div>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Địa điểm trả xe
          </label>
          <div className="mt-1 flex items-start">
            <MapPin className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
            <p className="text-sm text-gray-900">{booking.returnLocation}</p>
          </div>
        </div>
        {booking.included?.length > 0 && (
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Bao gồm
            </label>
            <div className="mt-1 flex flex-wrap gap-2">
              {booking.included.map((item, i) => (
                <span
                  key={i}
                  className="inline-flex items-center px-2 py-1 text-xs bg-green-50 text-green-700 rounded"
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // ── Sidebar summary by type ──────────────────────────────────────────────

  const BookingSummary = () => {
    if (booking.serviceType === "Homestay") {
      return (
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              {booking.roomName} ({booking.nights} đêm)
            </span>
            <span className="text-gray-900">
              {formatCurrency(booking.roomRate * booking.nights)}
            </span>
          </div>
          <hr className="border-gray-200" />
          <div className="flex justify-between font-medium">
            <span>Tổng cộng</span>
            <span>{formatCurrency(booking.amount)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Đã thanh toán</span>
            <span className="text-green-600">
              {formatCurrency(booking.paidAmount)}
            </span>
          </div>
          {booking.amount - booking.paidAmount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Còn lại</span>
              <span className="text-gray-900">
                {formatCurrency(booking.amount - booking.paidAmount)}
              </span>
            </div>
          )}
        </div>
      );
    }
    if (booking.serviceType === "Tour") {
      const perPerson =
        booking.participants > 0
          ? booking.amount / booking.participants
          : booking.amount;
      return (
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              {formatCurrency(perPerson)} × {booking.participants} người
            </span>
            <span className="text-gray-900">
              {formatCurrency(booking.amount)}
            </span>
          </div>
          <hr className="border-gray-200" />
          <div className="flex justify-between font-medium">
            <span>Tổng cộng</span>
            <span>{formatCurrency(booking.amount)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Đã thanh toán</span>
            <span className="text-green-600">
              {formatCurrency(booking.paidAmount)}
            </span>
          </div>
        </div>
      );
    }
    // Car Rental
    const dailyRate =
      booking.rentalDays > 0
        ? booking.amount / booking.rentalDays
        : booking.amount;
    return (
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">
            {formatCurrency(dailyRate)}/ngày × {booking.rentalDays} ngày
          </span>
          <span className="text-gray-900">
            {formatCurrency(booking.amount)}
          </span>
        </div>
        {booking.deposit > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tiền cọc xe</span>
            <span className="text-gray-900">
              {formatCurrency(booking.deposit)}
            </span>
          </div>
        )}
        <hr className="border-gray-200" />
        <div className="flex justify-between font-medium">
          <span>Tổng cộng</span>
          <span>{formatCurrency(booking.amount)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Đã thanh toán</span>
          <span className="text-green-600">
            {formatCurrency(booking.paidAmount)}
          </span>
        </div>
        {booking.amount - booking.paidAmount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Còn lại</span>
            <span className="text-gray-900">
              {formatCurrency(booking.amount - booking.paidAmount)}
            </span>
          </div>
        )}
      </div>
    );
  };

  // ── Timeline events by type ──────────────────────────────────────────────

  const TimelineEvents = () => {
    const events = [
      {
        icon: CheckCircle,
        color: "text-green-500",
        label: "Đặt chỗ được tạo",
        date: booking.bookingDate,
      },
    ];
    if (booking.status === "confirmed" || booking.status === "completed") {
      events.push({
        icon: CheckCircle,
        color: "text-green-500",
        label: "Đã xác nhận",
        date: booking.lastUpdated,
      });
    }
    if (booking.serviceType === "Homestay") {
      events.push({
        icon: AlertCircle,
        color: "text-blue-500",
        label: "Ngày nhận phòng",
        date: booking.checkInDate,
      });
    } else if (booking.serviceType === "Tour") {
      events.push({
        icon: AlertCircle,
        color: "text-blue-500",
        label: "Ngày diễn ra tour",
        date: booking.tourDate,
      });
    } else if (booking.serviceType === "Car Rental") {
      events.push({
        icon: AlertCircle,
        color: "text-blue-500",
        label: "Ngày nhận xe",
        date: booking.rentalStartTime?.split("T")[0],
      });
    }
    if (booking.status === "completed") {
      events.push({
        icon: CheckCircle,
        color: "text-purple-500",
        label: "Hoàn thành",
        date: booking.lastUpdated,
      });
    }
    if (booking.status === "cancelled") {
      events.push({
        icon: XCircle,
        color: "text-red-500",
        label: "Đã hủy",
        date: booking.cancelledAt || booking.lastUpdated,
      });
    }
    return (
      <div className="space-y-4">
        {events.map((ev, i) => {
          const Icon = ev.icon;
          return (
            <div key={i} className="flex items-start">
              <Icon className={`h-5 w-5 flex-shrink-0 ${ev.color}`} />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{ev.label}</p>
                <p className="text-xs text-gray-500">
                  {ev.date ? formatDateOnly(ev.date) : ""}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#e9e9e9] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-[#008fa0] hover:text-[#007a8a] mb-4 text-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Quay lại
          </button>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <ServiceIcon className="h-5 w-5 text-[#008fa0]" />
                <span className="text-sm font-medium text-[#008fa0]">
                  {serviceTypeLabel}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">
                Chi tiết đặt chỗ
              </h1>
              <p className="text-gray-600 mt-1">Mã đặt chỗ: {booking.id}</p>
            </div>
            <div className="flex items-center flex-wrap gap-3">
              <span
                className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(booking.status)}`}
              >
                {getStatusText(booking.status)}
              </span>
              <span className="text-2xl font-bold text-gray-900">
                {formatCurrency(booking.amount)}
              </span>
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Lưu
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm font-medium"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Hủy
                  </button>
                </>
              ) : (
                booking.status !== "cancelled" &&
                booking.status !== "completed" && (
                  <button
                    onClick={handleEdit}
                    className="flex items-center px-4 py-2 bg-[#008fa0] text-white rounded-md hover:bg-[#007a8a] text-sm font-medium"
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Chỉnh sửa
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: "details", label: "Chi tiết đặt chỗ", icon: FileText },
                { key: "customer", label: "Thông tin khách hàng", icon: User },
                {
                  key: "payments",
                  label: "Lịch sử thanh toán",
                  icon: CreditCard,
                },
                ...(refund
                  ? [{ key: "refund", label: "Hoàn tiền", icon: Banknote, badge: refund.status === "pending" }]
                  : []),
              ].map(({ key, label, icon: Icon, badge }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === key
                      ? "border-[#008fa0] text-[#008fa0]"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                  {badge && (
                    <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Details Tab */}
            {activeTab === "details" && (
              <div className="space-y-6">
                {/* Service Info — common */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center mb-4">
                    <ServiceIcon className="h-5 w-5 text-[#008fa0] mr-2" />
                    <h3 className="text-lg font-medium text-gray-900">
                      Thông tin dịch vụ
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Tên dịch vụ
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {booking.serviceName}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Loại dịch vụ
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {serviceTypeLabel}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Địa chỉ
                      </label>
                      <div className="mt-1 flex items-start">
                        <MapPin className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                        <p className="text-sm text-gray-900">
                          {booking.address}
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Nguồn đặt chỗ
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {booking.bookingSource}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Ngày đặt
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {formatDateOnly(booking.bookingDate)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Type-specific section */}
                {booking.serviceType === "Homestay" && <HomestaySection />}
                {booking.serviceType === "Tour" && <TourSection />}
                {booking.serviceType === "Car Rental" && <CarRentalSection />}

                {/* Special Requests — common */}
                {(booking.specialRequests || isEditing) && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center mb-4">
                      <MessageSquare className="h-5 w-5 text-[#008fa0] mr-2" />
                      <h3 className="text-lg font-medium text-gray-900">
                        Yêu cầu đặc biệt
                      </h3>
                    </div>
                    {isEditing ? (
                      <textarea
                        rows={3}
                        value={draft.specialRequests}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            specialRequests: e.target.value,
                          })
                        }
                        className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#008fa0]"
                        placeholder="Nhập yêu cầu đặc biệt..."
                      />
                    ) : (
                      <p className="text-sm text-gray-900">
                        {booking.specialRequests}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Customer Tab */}
            {activeTab === "customer" && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center mb-6">
                  <User className="h-5 w-5 text-[#008fa0] mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">
                    Thông tin khách hàng
                  </h3>
                </div>
                <div className="flex items-start space-x-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                    {booking.customerAvatar}
                  </div>
                  <div>
                    <h4 className="text-xl font-medium text-gray-900">
                      {booking.customerName}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Nguồn: {booking.bookingSource}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-gray-400 mr-3" />
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <p className="text-sm text-gray-900">{booking.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-gray-400 mr-3" />
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Số điện thoại
                        </label>
                        <p className="text-sm text-gray-900">{booking.phone}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {booking.notes && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Ghi chú
                        </label>
                        <p className="text-sm text-gray-900 mt-1">
                          {booking.notes}
                        </p>
                      </div>
                    )}
                    {booking.cancellationReason && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Lý do hủy
                        </label>
                        <p className="text-sm text-red-600 mt-1">
                          {booking.cancellationReason}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Payments Tab */}
            {activeTab === "payments" && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center">
                  <CreditCard className="h-5 w-5 text-[#008fa0] mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">
                    Lịch sử thanh toán
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {[
                          "Mã thanh toán",
                          "Loại",
                          "Số tiền",
                          "Phương thức",
                          "Ngày",
                          "Trạng thái",
                        ].map((h) => (
                          <th
                            key={h}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {payments.map((p) => (
                        <tr key={p.paymentId}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {p.paymentId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {p.paymentType === "deposit"
                              ? "Đặt cọc"
                              : p.paymentType === "full"
                                ? "Toàn bộ"
                                : "Số dư"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(p.amount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {p.paymentMethod}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(p.paymentTime)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(p.paymentStatus)}`}
                            >
                              {getStatusText(p.paymentStatus)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Refund Tab */}
            {activeTab === "refund" && (
              <div className="space-y-6">
                {!refund ? (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                    <Banknote className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Không có yêu cầu hoàn tiền nào</p>
                  </div>
                ) : (
                  <>
                    {/* Request info */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Banknote className="h-5 w-5 text-[#008fa0]" />
                          <h3 className="text-lg font-medium text-gray-900">
                            Yêu cầu hoàn tiền
                          </h3>
                        </div>
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                            refund.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : refund.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : refund.status === "rejected"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {refund.status === "pending"
                            ? "Chờ xử lý"
                            : refund.status === "approved"
                              ? "Đã duyệt"
                              : refund.status === "rejected"
                                ? "Từ chối"
                                : "Hoàn thành"}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Mã yêu cầu
                          </label>
                          <p className="mt-1 text-sm text-gray-900">{refund.requestId}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Ngày yêu cầu
                          </label>
                          <p className="mt-1 text-sm text-gray-900">
                            {formatDateOnly(refund.requestDate)}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Số tiền yêu cầu hoàn
                          </label>
                          <p className="mt-1 text-sm font-semibold text-gray-900">
                            {formatCurrency(refund.requestedAmount)}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Số tiền đã thanh toán
                          </label>
                          <p className="mt-1 text-sm text-gray-900">
                            {formatCurrency(booking.paidAmount)}
                          </p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Lý do hủy của khách
                        </label>
                        <p className="text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-md p-3">
                          {refund.reason}
                        </p>
                      </div>

                      {refund.images?.length > 0 && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tài liệu đính kèm
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {refund.images.map((img) => (
                              <div
                                key={img}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 border border-gray-200 rounded-md text-sm text-gray-700"
                              >
                                <ImageIcon className="h-4 w-4 text-gray-400" />
                                {img}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Result card for approved/rejected */}
                    {(refund.status === "approved" || refund.status === "rejected") && (
                      <div
                        className={`bg-white rounded-lg shadow-sm border p-6 ${
                          refund.status === "approved"
                            ? "border-green-200"
                            : "border-red-200"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-4">
                          {refund.status === "approved" ? (
                            <ThumbsUp className="h-5 w-5 text-green-600" />
                          ) : (
                            <ThumbsDown className="h-5 w-5 text-red-600" />
                          )}
                          <h3 className="text-lg font-medium text-gray-900">
                            {refund.status === "approved"
                              ? "Kết quả: Đã duyệt hoàn tiền"
                              : "Kết quả: Từ chối hoàn tiền"}
                          </h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Ngày xử lý
                            </label>
                            <p className="mt-1 text-sm text-gray-900">
                              {formatDateOnly(refund.processedDate)}
                            </p>
                          </div>
                          {refund.status === "approved" && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Số tiền được hoàn
                              </label>
                              <p className="mt-1 text-sm font-semibold text-green-600">
                                {formatCurrency(refund.approvedAmount)}
                              </p>
                            </div>
                          )}
                          {refund.status === "rejected" && refund.rejectionReason && (
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700">
                                Lý do từ chối
                              </label>
                              <p className="mt-1 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
                                {refund.rejectionReason}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action forms — only when pending */}
                    {refund.status === "pending" && (
                      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                          Xử lý yêu cầu
                        </h3>

                        {refundAction === null && (
                          <div className="flex gap-3">
                            <button
                              onClick={() => {
                                setRefundAction("approve");
                                setRefundDraft({
                                  amount: String(refund.requestedAmount),
                                  reason: "",
                                });
                              }}
                              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium"
                            >
                              <ThumbsUp className="h-4 w-4 mr-2" />
                              Duyệt hoàn tiền
                            </button>
                            <button
                              onClick={() => {
                                setRefundAction("reject");
                                setRefundDraft({ amount: "", reason: "" });
                              }}
                              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium"
                            >
                              <ThumbsDown className="h-4 w-4 mr-2" />
                              Từ chối
                            </button>
                          </div>
                        )}

                        {refundAction === "approve" && (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Số tiền hoàn lại (tối đa{" "}
                                {formatCurrency(booking.paidAmount)})
                              </label>
                              <input
                                type="number"
                                min={0}
                                max={booking.paidAmount}
                                value={refundDraft.amount}
                                onChange={(e) =>
                                  setRefundDraft((d) => ({
                                    ...d,
                                    amount: e.target.value,
                                  }))
                                }
                                className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#008fa0]"
                                placeholder="Nhập số tiền hoàn..."
                              />
                              {refundDraft.amount &&
                                Number(refundDraft.amount) < refund.requestedAmount && (
                                  <p className="text-xs text-yellow-600 mt-1">
                                    Thấp hơn số tiền khách yêu cầu (
                                    {formatCurrency(refund.requestedAmount)})
                                  </p>
                                )}
                            </div>
                            <div className="flex gap-3">
                              <button
                                onClick={handleApproveRefund}
                                disabled={!refundDraft.amount || Number(refundDraft.amount) <= 0}
                                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Xác nhận duyệt
                              </button>
                              <button
                                onClick={() => setRefundAction(null)}
                                className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm font-medium"
                              >
                                <X className="h-4 w-4 mr-2" />
                                Hủy
                              </button>
                            </div>
                          </div>
                        )}

                        {refundAction === "reject" && (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Lý do từ chối
                              </label>
                              <textarea
                                rows={3}
                                value={refundDraft.reason}
                                onChange={(e) =>
                                  setRefundDraft((d) => ({
                                    ...d,
                                    reason: e.target.value,
                                  }))
                                }
                                className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#008fa0]"
                                placeholder="Nhập lý do từ chối hoàn tiền..."
                              />
                            </div>
                            <div className="flex gap-3">
                              <button
                                onClick={handleRejectRefund}
                                disabled={!refundDraft.reason.trim()}
                                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Xác nhận từ chối
                              </button>
                              <button
                                onClick={() => setRefundAction(null)}
                                className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm font-medium"
                              >
                                <X className="h-4 w-4 mr-2" />
                                Hủy
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Hành động nhanh
              </h3>
              <div className="space-y-3">
                {booking.status === "pending" && (
                  <button
                    onClick={() =>
                      setBooking((b) => ({ ...b, status: "confirmed" }))
                    }
                    className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Xác nhận đặt chỗ
                  </button>
                )}
                {booking.status !== "cancelled" &&
                  booking.status !== "completed" && (
                    <button
                      onClick={() =>
                        setBooking((b) => ({ ...b, status: "cancelled" }))
                      }
                      className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Hủy đặt chỗ
                    </button>
                  )}
                <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Nhắn tin khách hàng
                </button>
              </div>
            </div>

            {/* Booking Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Tổng kết đặt chỗ
              </h3>
              <BookingSummary />
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Dòng thời gian
              </h3>
              <TimelineEvents />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerBookingDetails;
