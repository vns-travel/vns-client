import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Send,
  Paperclip,
  MoreVertical,
  Phone,
  Video,
  Image as ImageIcon,
  Calendar,
  AlertCircle,
  User,
  Filter,
} from "lucide-react";

const PartnerMessaging = () => {
  const [activeConversation, setActiveConversation] = useState(1);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterUnread, setFilterUnread] = useState(false);
  const messagesEndRef = useRef(null);

  // Enhanced Vietnamese conversations about real booking scenarios
  const [conversations, setConversations] = useState([
    {
      id: 1,
      customerId: "CUST-001",
      customerName: "Nguyễn Văn Minh",
      avatar: "NVM",
      lastMessage: "Vâng, em cảm ơn anh. Em sẽ đến đúng giờ ạ!",
      timestamp: "14:30",
      unreadCount: 0,
      isOnline: true,
      bookingId: "VNS-HB-20241501",
      serviceName: "Oceanview Deluxe Homestay",
      serviceType: "Homestay",
      bookingStatus: "confirmed",
      checkInDate: "2024-06-10",
      messages: [
        {
          id: 1,
          sender: "customer",
          content:
            "Chào anh, em đã đặt phòng Deluxe cho ngày 10/6. Em muốn hỏi về giờ nhận phòng ạ.",
          timestamp: "14:15",
          status: "read",
          date: "Hôm nay",
        },
        {
          id: 2,
          sender: "partner",
          content:
            "Chào em Minh! Giờ nhận phòng tiêu chuẩn là 14:00 ạ. Nếu em đến sớm, anh sẽ cố gắng sắp xếp early check-in nếu phòng đã sẵn sàng nhé.",
          timestamp: "14:18",
          status: "read",
          date: "Hôm nay",
        },
        {
          id: 3,
          sender: "customer",
          content:
            "Em cảm ơn anh. Em có thể đến khoảng 12:00. Nếu phòng chưa sẵn sàng thì em có thể gửi hành lý được không ạ?",
          timestamp: "14:22",
          status: "read",
          date: "Hôm nay",
        },
        {
          id: 4,
          sender: "partner",
          content:
            "Dạ được em. Em cứ đến, bên anh có chỗ gửi hành lý an toàn. Em có thể nghỉ ngơi ở khu lobby hoặc đi dạo biển trong lúc chờ. Anh sẽ gọi em ngay khi phòng sẵn sàng.",
          timestamp: "14:25",
          status: "read",
          date: "Hôm nay",
        },
        {
          id: 5,
          sender: "customer",
          content:
            "À em còn muốn hỏi, em có thể đặt thêm giường cũi cho con em không ạ? Con em 2 tuổi.",
          timestamp: "14:27",
          status: "read",
          date: "Hôm nay",
        },
        {
          id: 6,
          sender: "partner",
          content:
            "Dạ được em. Anh sẽ sắp xếp giường cũi và thêm 2 bộ chăn gối cho bé. Bên anh có khu vui chơi cho trẻ em và hồ bơi nông, em yên tâm nhé!",
          timestamp: "14:28",
          status: "read",
          date: "Hôm nay",
        },
        {
          id: 7,
          sender: "customer",
          content: "Vâng, em cảm ơn anh. Em sẽ đến đúng giờ ạ!",
          timestamp: "14:30",
          status: "delivered",
          date: "Hôm nay",
        },
      ],
    },
    // {
    //   id: 2,
    //   customerId: "CUST-002",
    //   customerName: "Trần Thị Hương",
    //   avatar: "TTH",
    //   lastMessage: "Anh cho em hỏi về chính sách hủy với ạ?",
    //   timestamp: "13:45",
    //   unreadCount: 2,
    //   isOnline: false,
    //   bookingId: "VNS-HB-20241502",
    //   serviceName: "Biệt Thự Mountain View Đà Lạt",
    //   serviceType: "Homestay",
    //   bookingStatus: "pending",
    //   checkInDate: "2024-06-20",
    //   messages: [
    //     {
    //       id: 1,
    //       sender: "customer",
    //       content:
    //         "Chào anh, em vừa đặt villa 5 phòng cho kỳ nghỉ gia đình. Em muốn xác nhận lại thông tin booking ạ.",
    //       timestamp: "13:20",
    //       status: "read",
    //       date: "Hôm nay",
    //     },
    //     {
    //       id: 2,
    //       sender: "partner",
    //       content:
    //         "Chào chị Hương! Em xin xác nhận: Villa 5 phòng ngủ từ 20-23/6 (3 đêm), tổng 4 người lớn. Tổng tiền 13.5 triệu. Chị cần thêm thông tin gì không ạ?",
    //       timestamp: "13:25",
    //       status: "read",
    //       date: "Hôm nay",
    //     },
    //     {
    //       id: 3,
    //       sender: "customer",
    //       content:
    //         "Dạ cảm ơn em. Villa có BBQ không? Gia đình chị muốn tổ chức tiệc nướng buổi tối.",
    //       timestamp: "13:30",
    //       status: "read",
    //       date: "Hôm nay",
    //     },
    //     {
    //       id: 4,
    //       sender: "partner",
    //       content:
    //         "Dạ có ạ chị. Villa có sân vườn rộng với bộ BBQ đầy đủ. Bên em cũng hỗ trợ đặt thực phẩm tươi sống nếu chị cần. Phí thuê bộ BBQ là 300k/lần sử dụng ạ.",
    //       timestamp: "13:35",
    //       status: "read",
    //       date: "Hôm nay",
    //     },
    //     {
    //       id: 5,
    //       sender: "customer",
    //       content:
    //         "Ok em. Chị sẽ book thêm BBQ. À chị có thể thanh toán phần còn lại khi check-in được không?",
    //       timestamp: "13:40",
    //       status: "read",
    //       date: "Hôm nay",
    //     },
    //     {
    //       id: 6,
    //       sender: "partner",
    //       content:
    //         "Dạ được chị. Hiện tại booking đang chờ thanh toán. Chị có thể thanh toán toàn bộ khi check-in bằng tiền mặt hoặc chuyển khoản. Nếu muốn đảm bảo phòng, chị có thể đặt cọc 50% trước ạ.",
    //       timestamp: "13:42",
    //       status: "read",
    //       date: "Hôm nay",
    //     },
    //     {
    //       id: 7,
    //       sender: "customer",
    //       content: "Anh cho em hỏi về chính sách hủy với ạ?",
    //       timestamp: "13:45",
    //       status: "delivered",
    //       date: "Hôm nay",
    //     },
    //   ],
    // },
    // {
    //   id: 3,
    //   customerId: "CUST-003",
    //   customerName: "Lê Hoàng Nam",
    //   avatar: "LHN",
    //   lastMessage: "Cảm ơn anh nhiều! Tour rất tuyệt vời!",
    //   timestamp: "11:20",
    //   unreadCount: 0,
    //   isOnline: true,
    //   bookingId: "VNS-TB-20241503",
    //   serviceName: "Hanoi Old Quarter Street Food Tour",
    //   serviceType: "Tour",
    //   bookingStatus: "confirmed",
    //   tourDate: "2024-06-18",
    //   messages: [
    //     {
    //       id: 1,
    //       sender: "customer",
    //       content:
    //         "Chào anh, em đặt tour ẩm thực phố cổ cho 3 người. Em muốn biết tour có điểm dừng nào đặc biệt không ạ?",
    //       timestamp: "10:30",
    //       status: "read",
    //       date: "Hôm nay",
    //     },
    //     {
    //       id: 2,
    //       sender: "partner",
    //       content:
    //         "Chào em Nam! Tour của em sẽ đi qua 8 điểm dừng đặc sắc nhất phố cổ: phở, bún chả, bánh cuốn, chè, cà phê trứng... Tất cả đều là quán lâu đời, có tiếng nhất ạ.",
    //       timestamp: "10:35",
    //       status: "read",
    //       date: "Hôm nay",
    //     },
    //     {
    //       id: 3,
    //       sender: "customer",
    //       content:
    //         "Nghe hay quá! Em có 1 người bạn ăn chay, tour có thể điều chỉnh được không ạ?",
    //       timestamp: "10:40",
    //       status: "read",
    //       date: "Hôm nay",
    //     },
    //     {
    //       id: 4,
    //       sender: "partner",
    //       content:
    //         "Dạ được em. Em đã note lại rồi. Bên anh sẽ thay thế các món có thịt bằng đặc sản chay Hà Nội như bún chả chay, bánh cuốn chay, chè thái... Em yên tâm nhé!",
    //       timestamp: "10:42",
    //       status: "read",
    //       date: "Hôm nay",
    //     },
    //     {
    //       id: 5,
    //       sender: "customer",
    //       content:
    //         "Perfect! Tour bắt đầu 9h, em nên đến điểm hẹn lúc mấy giờ ạ?",
    //       timestamp: "10:45",
    //       status: "read",
    //       date: "Hôm nay",
    //     },
    //     {
    //       id: 6,
    //       sender: "partner",
    //       content:
    //         "Em đến trước 15 phút (8:45) để làm thủ tục và gặp hướng dẫn viên nhé. Điểm hẹn là cổng chính Nhà hát Lớn, anh sẽ cầm biển 'Hanoi Food Tour' đứng đợi em.",
    //       timestamp: "10:48",
    //       status: "read",
    //       date: "Hôm nay",
    //     },
    //     {
    //       id: 7,
    //       sender: "customer",
    //       content: "Ok anh, em cảm ơn!",
    //       timestamp: "10:50",
    //       status: "read",
    //       date: "Hôm nay",
    //     },
    //     {
    //       id: 8,
    //       sender: "customer",
    //       content: "Cảm ơn anh nhiều! Tour rất tuyệt vời!",
    //       timestamp: "11:20",
    //       status: "delivered",
    //       date: "Hôm nay",
    //     },
    //   ],
    // },
    // {
    //   id: 4,
    //   customerId: "CUST-004",
    //   customerName: "Võ Thanh Tùng",
    //   avatar: "VTT",
    //   lastMessage: "Anh có thể đổi địa điểm nhận xe được không?",
    //   timestamp: "Hôm qua",
    //   unreadCount: 1,
    //   isOnline: false,
    //   bookingId: "VNS-VB-20241505",
    //   serviceName: "Thuê Xe SUV 7 Chỗ - Toyota Fortuner",
    //   serviceType: "Car Rental",
    //   bookingStatus: "confirmed",
    //   rentalDate: "2024-06-22",
    //   messages: [
    //     {
    //       id: 1,
    //       sender: "customer",
    //       content:
    //         "Chào anh, em đặt xe Fortuner cho chuyến đi Đà Lạt 3 ngày. Em muốn xác nhận thông tin nhận xe ạ.",
    //       timestamp: "15:30",
    //       status: "read",
    //       date: "Hôm qua",
    //     },
    //     {
    //       id: 2,
    //       sender: "partner",
    //       content:
    //         "Chào em Tùng! Xe Fortuner 2022 tự động, có tài xế anh Đức - kinh nghiệm 10 năm. Nhận xe 8h sáng 22/6 tại sân bay Tân Sơn Nhất, trả xe 18h ngày 24/6 tại depot Quận 1.",
    //       timestamp: "15:35",
    //       status: "read",
    //       date: "Hôm qua",
    //     },
    //     {
    //       id: 3,
    //       sender: "customer",
    //       content:
    //         "Em cảm ơn anh. Chi phí đã bao gồm xăng và phí cao tốc chưa ạ?",
    //       timestamp: "15:40",
    //       status: "read",
    //       date: "Hôm qua",
    //     },
    //     {
    //       id: 4,
    //       sender: "partner",
    //       content:
    //         "Dạ rồi em. Giá 2.4 triệu đã bao gồm: tài xế, xăng, phí cao tốc, bảo hiểm. Em chỉ cần lo ăn nghỉ cho tài xế là được. Xe có nước uống, khăn lạnh miễn phí ạ.",
    //       timestamp: "15:45",
    //       status: "read",
    //       date: "Hôm qua",
    //     },
    //     {
    //       id: 5,
    //       sender: "customer",
    //       content: "Tuyệt vời! Em có con nhỏ 3 tuổi, xe có ghế trẻ em không ạ?",
    //       timestamp: "15:50",
    //       status: "read",
    //       date: "Hôm qua",
    //     },
    //     {
    //       id: 6,
    //       sender: "partner",
    //       content:
    //         "Dạ em đã note trong booking rồi. Anh sẽ chuẩn bị ghế an toàn cho bé 3 tuổi. Nếu cần thêm ghế cho bé khác, em báo anh nhé!",
    //       timestamp: "15:55",
    //       status: "read",
    //       date: "Hôm qua",
    //     },
    //     {
    //       id: 7,
    //       sender: "customer",
    //       content: "Anh có thể đổi địa điểm nhận xe được không?",
    //       timestamp: "16:00",
    //       status: "delivered",
    //       date: "Hôm qua",
    //     },
    //   ],
    // },
    // {
    //   id: 5,
    //   customerId: "CUST-005",
    //   customerName: "Phạm Minh Châu",
    //   avatar: "PMC",
    //   lastMessage: "Em đã chuyển khoản rồi ạ!",
    //   timestamp: "09:15",
    //   unreadCount: 0,
    //   isOnline: false,
    //   bookingId: "VNS-TB-20241504",
    //   serviceName: "Hội An Cultural Heritage Walk",
    //   serviceType: "Tour",
    //   bookingStatus: "confirmed",
    //   tourDate: "2024-06-25",
    //   messages: [
    //     {
    //       id: 1,
    //       sender: "customer",
    //       content:
    //         "Hello, I booked the Hoi An walking tour for 2 people. Can the guide speak English?",
    //       timestamp: "08:30",
    //       status: "read",
    //       date: "Hôm nay",
    //     },
    //     {
    //       id: 2,
    //       sender: "partner",
    //       content:
    //         "Hello Ms. Châu! Yes, your tour guide Mr. Hùng speaks fluent English. He has been guiding international tourists for 8 years and knows Hoi An history very well.",
    //       timestamp: "08:35",
    //       status: "read",
    //       date: "Hôm nay",
    //     },
    //     {
    //       id: 3,
    //       sender: "customer",
    //       content: "Great! What time should we arrive at the meeting point?",
    //       timestamp: "08:40",
    //       status: "read",
    //       date: "Hôm nay",
    //     },
    //     {
    //       id: 4,
    //       sender: "partner",
    //       content:
    //         "Please arrive at 7:45 AM at the Japanese Covered Bridge. Mr. Hùng will be wearing a blue VietNamSea shirt and holding a sign with your name. The tour starts at 8:00 AM.",
    //       timestamp: "08:45",
    //       status: "read",
    //       date: "Hôm nay",
    //     },
    //     {
    //       id: 5,
    //       sender: "customer",
    //       content: "Perfect! Is entrance fee to the old houses included?",
    //       timestamp: "08:50",
    //       status: "read",
    //       date: "Hôm nay",
    //     },
    //     {
    //       id: 6,
    //       sender: "partner",
    //       content:
    //         "Yes, all entrance fees are included in your booking. You'll visit 4 ancient houses, 1 assembly hall, and the Japanese Bridge. Bottled water is also provided throughout the tour.",
    //       timestamp: "08:55",
    //       status: "read",
    //       date: "Hôm nay",
    //     },
    //     {
    //       id: 7,
    //       sender: "customer",
    //       content: "Thank you! I'll pay in cash when we meet. Is that okay?",
    //       timestamp: "09:00",
    //       status: "read",
    //       date: "Hôm nay",
    //     },
    //     {
    //       id: 8,
    //       sender: "partner",
    //       content:
    //         "Dạ được em. Em có thể thanh toán bằng tiền mặt hoặc chuyển khoản trước đều được ạ. Số tài khoản em cần thì nhắn anh nhé!",
    //       timestamp: "09:05",
    //       status: "read",
    //       date: "Hôm nay",
    //     },
    //     {
    //       id: 9,
    //       sender: "customer",
    //       content: "Em đã chuyển khoản rồi ạ!",
    //       timestamp: "09:15",
    //       status: "delivered",
    //       date: "Hôm nay",
    //     },
    //   ],
    // },
    // {
    //   id: 6,
    //   customerId: "CUST-006",
    //   customerName: "Đặng Thị Mai",
    //   avatar: "DTM",
    //   lastMessage: "Em muốn hủy booking này ạ",
    //   timestamp: "2 ngày trước",
    //   unreadCount: 0,
    //   isOnline: false,
    //   bookingId: "VNS-VB-20241506",
    //   serviceName: "Thuê Xe Sedan Mercedes C-Class",
    //   serviceType: "Car Rental",
    //   bookingStatus: "cancelled",
    //   rentalDate: "2024-07-01",
    //   messages: [
    //     {
    //       id: 1,
    //       sender: "customer",
    //       content:
    //         "Chào anh, em đặt xe Mercedes cho sự kiện công ty. Em muốn xác nhận lại thông tin xe ạ.",
    //       timestamp: "14:00",
    //       status: "read",
    //       date: "3 ngày trước",
    //     },
    //     {
    //       id: 2,
    //       sender: "partner",
    //       content:
    //         "Chào em Mai! Mercedes C-Class 2023 màu đen, tự lái, nhận xe 9h sáng tại VP Quận 3, trả xe 21h cùng ngày. Giá 1.8 triệu bao gồm bảo hiểm ạ.",
    //       timestamp: "14:10",
    //       status: "read",
    //       date: "3 ngày trước",
    //     },
    //     {
    //       id: 3,
    //       sender: "customer",
    //       content: "Vâng em cảm ơn. Em có cần đặt cọc không ạ?",
    //       timestamp: "14:15",
    //       status: "read",
    //       date: "3 ngày trước",
    //     },
    //     {
    //       id: 4,
    //       sender: "partner",
    //       content:
    //         "Dạ em cần đặt cọc 50% (900k) để giữ xe. Phần còn lại thanh toán khi nhận xe. Em chuyển khoản được không ạ?",
    //       timestamp: "14:20",
    //       status: "read",
    //       date: "3 ngày trước",
    //     },
    //     {
    //       id: 5,
    //       sender: "customer",
    //       content: "Em muốn hủy booking này ạ",
    //       timestamp: "10:00",
    //       status: "read",
    //       date: "2 ngày trước",
    //     },
    //     {
    //       id: 6,
    //       sender: "partner",
    //       content:
    //         "Dạ được em. Do chưa đặt cọc nên em không mất phí hủy ạ. Anh đã hủy booking cho em rồi. Lần sau có nhu cầu em liên hệ lại nhé!",
    //       timestamp: "10:15",
    //       status: "read",
    //       date: "2 ngày trước",
    //     },
    //   ],
    // },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConversation]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const activeConv = conversations.find(
      (conv) => conv.id === activeConversation,
    );
    if (!activeConv) return;

    const newMsg = {
      id: activeConv.messages.length + 1,
      sender: "partner",
      content: newMessage,
      timestamp: new Date().toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "sent",
      date: "Hôm nay",
    };

    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === activeConversation
          ? {
              ...conv,
              messages: [...conv.messages, newMsg],
              lastMessage: newMessage,
              timestamp: newMsg.timestamp,
            }
          : conv,
      ),
    );

    setNewMessage("");
    scrollToBottom();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Filter conversations
  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch =
      conv.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.serviceName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUnread = !filterUnread || conv.unreadCount > 0;
    return matchesSearch && matchesUnread;
  });

  const activeConv = conversations.find(
    (conv) => conv.id === activeConversation,
  );

  const getBookingStatusColor = (status) => {
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

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Conversations List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-gray-900">Tin nhắn</h1>
            <button
              onClick={() => setFilterUnread(!filterUnread)}
              className={`p-2 rounded-lg transition-colors ${filterUnread ? "bg-[#008fa0] text-white" : "text-gray-600 hover:bg-gray-100"}`}
              title="Lọc tin chưa đọc"
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm kiếm khách hàng, dịch vụ..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#008fa0] focus:border-[#008fa0] text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {filterUnread && (
            <div className="mt-2 text-xs text-gray-600 flex items-center">
              <AlertCircle className="w-3 h-3 mr-1" />
              Hiển thị{" "}
              {
                filteredConversations.filter((c) => c.unreadCount > 0).length
              }{" "}
              tin chưa đọc
            </div>
          )}
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-4 text-center">
              <Search className="w-12 h-12 text-gray-300 mb-3" />
              <p className="text-sm text-gray-500">
                {searchTerm
                  ? `Không tìm thấy "${searchTerm}"`
                  : "Chưa có tin nhắn nào"}
              </p>
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-4 border-b border-gray-100 cursor-pointer transition-colors duration-200 hover:bg-gray-50 ${
                  activeConversation === conversation.id
                    ? "bg-[#E6F3F4] border-l-4 border-l-[#008fa0]"
                    : ""
                }`}
                onClick={() => setActiveConversation(conversation.id)}
              >
                <div className="flex items-start space-x-3">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 bg-[#008fa0] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {conversation.avatar}
                    </div>
                    {conversation.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>

                  {/* Conversation Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900 truncate text-sm">
                        {conversation.customerName}
                      </h3>
                      <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                        {conversation.timestamp}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 truncate mb-2">
                      {conversation.lastMessage}
                    </p>

                    {/* Booking Info */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                          {conversation.serviceType === "Homestay"
                            ? "Lưu trú"
                            : conversation.serviceType === "Tour"
                              ? "Tour"
                              : "Thuê xe"}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded ${getBookingStatusColor(conversation.bookingStatus)}`}
                        >
                          {conversation.bookingStatus === "confirmed"
                            ? "Đã xác nhận"
                            : conversation.bookingStatus === "pending"
                              ? "Chờ xác nhận"
                              : conversation.bookingStatus === "completed"
                                ? "Hoàn thành"
                                : "Đã hủy"}
                        </span>
                      </div>
                      {conversation.unreadCount > 0 && (
                        <div className="bg-[#008fa0] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                          {conversation.unreadCount}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Area - Message Thread */}
      <div className="flex-1 flex flex-col bg-white">
        {activeConv ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-[#008fa0] rounded-full flex items-center justify-center text-white font-semibold">
                      {activeConv.avatar}
                    </div>
                    {activeConv.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900 flex items-center">
                      {activeConv.customerName}
                      {activeConv.isOnline && (
                        <span className="ml-2 text-xs text-green-600 flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                          Đang online
                        </span>
                      )}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {activeConv.serviceName}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">
                        ID: {activeConv.bookingId}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${getBookingStatusColor(activeConv.bookingStatus)}`}
                      >
                        {activeConv.bookingStatus === "confirmed"
                          ? "Đã xác nhận"
                          : activeConv.bookingStatus === "pending"
                            ? "Chờ xác nhận"
                            : activeConv.bookingStatus === "completed"
                              ? "Hoàn thành"
                              : "Đã hủy"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-600 hover:text-[#008fa0] hover:bg-gray-100 rounded-lg transition-colors">
                    <Phone className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-[#008fa0] hover:bg-gray-100 rounded-lg transition-colors">
                    <Video className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-[#008fa0] hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Booking Quick Info */}
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  {activeConv.serviceType === "Homestay" &&
                    activeConv.checkInDate && (
                      <>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                          <div>
                            <div className="text-xs text-gray-500">
                              Check-in
                            </div>
                            <div className="font-medium text-gray-900">
                              {new Date(
                                activeConv.checkInDate,
                              ).toLocaleDateString("vi-VN")}
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  {activeConv.serviceType === "Tour" && activeConv.tourDate && (
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                      <div>
                        <div className="text-xs text-gray-500">Ngày tour</div>
                        <div className="font-medium text-gray-900">
                          {new Date(activeConv.tourDate).toLocaleDateString(
                            "vi-VN",
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  {activeConv.serviceType === "Car Rental" &&
                    activeConv.rentalDate && (
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-xs text-gray-500">Nhận xe</div>
                          <div className="font-medium text-gray-900">
                            {new Date(activeConv.rentalDate).toLocaleDateString(
                              "vi-VN",
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  <div className="flex items-center">
                    <User className="w-4 h-4 text-gray-400 mr-2" />
                    <div>
                      <div className="text-xs text-gray-500">Khách hàng</div>
                      <div className="font-medium text-gray-900">
                        {activeConv.customerId}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {activeConv.messages.map((message, index) => {
                const showDateDivider =
                  index === 0 ||
                  activeConv.messages[index - 1].date !== message.date;

                return (
                  <React.Fragment key={message.id}>
                    {showDateDivider && (
                      <div className="flex items-center justify-center my-4">
                        <div className="px-4 py-1 bg-gray-200 rounded-full text-xs text-gray-600">
                          {message.date}
                        </div>
                      </div>
                    )}
                    <div
                      className={`flex ${
                        message.sender === "partner"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl shadow-sm ${
                          message.sender === "partner"
                            ? "bg-[#008fa0] text-white rounded-br-none"
                            : "bg-white text-gray-900 border border-gray-200 rounded-bl-none"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">
                          {message.content}
                        </p>
                        <div
                          className={`flex items-center justify-between mt-1 text-xs ${
                            message.sender === "partner"
                              ? "text-[#E6F3F4]"
                              : "text-gray-500"
                          }`}
                        >
                          <span>{message.timestamp}</span>
                          {message.sender === "partner" && (
                            <span className="ml-2">
                              {message.status === "sent" && "✓"}
                              {message.status === "delivered" && "✓✓"}
                              {message.status === "read" && (
                                <span className="text-white">✓✓</span>
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 px-4 py-2 rounded-2xl rounded-bl-none">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex items-end space-x-2">
                <button className="p-2 text-gray-500 hover:text-[#008fa0] hover:bg-gray-100 rounded-lg transition-colors">
                  <Paperclip className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-500 hover:text-[#008fa0] hover:bg-gray-100 rounded-lg transition-colors">
                  <ImageIcon className="w-5 h-5" />
                </button>
                <div className="flex-1 relative">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Nhập tin nhắn..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#008fa0] focus:border-[#008fa0] resize-none"
                    rows={1}
                    style={{
                      minHeight: "40px",
                      maxHeight: "120px",
                    }}
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="p-2 bg-[#008fa0] text-white rounded-lg hover:bg-[#007a8a] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Nhấn Enter để gửi, Shift + Enter để xuống dòng
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Chọn cuộc trò chuyện
              </h3>
              <p className="text-gray-500">
                Chọn một khách hàng để bắt đầu nhắn tin
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PartnerMessaging;
