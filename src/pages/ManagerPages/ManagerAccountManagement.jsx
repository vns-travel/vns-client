import React, { useState } from "react";
import {
  User,
  Building,
  Mail,
  Phone,
  Shield,
  Eye,
  CheckCircle,
  X,
  AlertCircle,
  Download,
  Clock,
  FileText,
  Search,
  Filter,
} from "lucide-react";

export default function ManagerAccountManagement() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPartner, setSelectedPartner] = useState(null);

  const [pendingVerifications] = useState([
    {
      id: 1,
      fullName: "Minh Trí",
      businessName: "Công Ty Du Lịch Việt Nam",
      email: "minhtri@dulichtour.vn",
      phone: "+84 901 234 567",
      businessType: "tours",
      submittedDate: "2025-01-15",
      status: "pending",
      documents: {
        houseRental: { uploaded: true, fileName: "giay-phep-cho-thue-nha.pdf" },
        tours: { uploaded: true, fileName: "giay-phep-tour.pdf" },
        carRentals: { uploaded: false, fileName: null },
        additional: { uploaded: true, fileName: "chung-chi-bo-sung.pdf" },
      },
    },
    {
      id: 2,
      fullName: "Thanh Hoa",
      businessName: "Khách Sạn Hoa Mai",
      email: "thanhhoa@hoamai.vn",
      phone: "+84 902 345 678",
      businessType: "accommodation",
      submittedDate: "2025-01-14",
      status: "pending",
      documents: {
        houseRental: { uploaded: true, fileName: "giay-phep-khach-san.pdf" },
        tours: { uploaded: false, fileName: null },
        carRentals: { uploaded: false, fileName: null },
        additional: { uploaded: false, fileName: null },
      },
    },
    {
      id: 3,
      fullName: "Văn Đức",
      businessName: "Cho Thuê Xe Đức Anh",
      email: "vanduc@ducanhcar.vn",
      phone: "+84 903 456 789",
      businessType: "transportation",
      submittedDate: "2025-01-13",
      status: "approved",
      documents: {
        houseRental: { uploaded: false, fileName: null },
        tours: { uploaded: false, fileName: null },
        carRentals: { uploaded: true, fileName: "giay-phep-cho-thue-xe.pdf" },
        additional: { uploaded: true, fileName: "bao-hiem-xe.pdf" },
      },
    },
  ]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Chờ Xét Duyệt
          </span>
        );
      case "reviewing":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Eye className="w-3 h-3 mr-1" />
            Đang Xem Xét
          </span>
        );
      case "approved":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Đã Duyệt
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <X className="w-3 h-3 mr-1" />
            Từ Chối
          </span>
        );
      default:
        return null;
    }
  };

  const getBusinessTypeText = (type) => {
    switch (type) {
      case "tours":
        return "Tour & Hoạt Động";
      case "accommodation":
        return "Cho Thuê Nhà";
      case "transportation":
        return "Cho Thuê Xe";
      case "mixed":
        return "Nhiều Dịch Vụ";
      default:
        return type;
    }
  };

  const handleApprovePartner = (partnerId) => {
    console.log("Duyệt đối tác:", partnerId);
    // Logic để duyệt đối tác
  };

  const handleRejectPartner = (partnerId) => {
    console.log("Từ chối đối tác:", partnerId);
    // Logic để từ chối đối tác
  };

  const handleDownloadDocument = (fileName) => {
    console.log("Tải xuống tài liệu:", fileName);
    // Logic để tải xuống tài liệu
  };

  const filteredPartners = pendingVerifications.filter((partner) => {
    const matchesSearch =
      partner.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      selectedFilter === "all" || partner.status === selectedFilter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-[#e9e9e9] pb-20">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center pt-6 px-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Xác Minh Đối Tác
            </h1>
            <p className="text-gray-600 mt-1">
              Quản lý và xét duyệt hồ sơ đăng ký đối tác kinh doanh
            </p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto p-6 pt-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-6">
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên, doanh nghiệp, email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Filter className="w-4 h-4 text-gray-400 mr-2" />
                  <select
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">Tất Cả</option>
                    <option value="pending">Chờ Xét Duyệt</option>
                    <option value="reviewing">Đang Xem Xét</option>
                    <option value="approved">Đã Duyệt</option>
                    <option value="rejected">Từ Chối</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Partners List */}
        <div className="space-y-6">
          {filteredPartners.map((partner) => (
            <div
              key={partner.id}
              className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
            >
              {/* Partner Basic Info */}
              <div className="px-6 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {partner.fullName}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <Building className="w-4 h-4 mr-1" />
                        {partner.businessName}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getStatusBadge(partner.status)}
                    <button
                      onClick={() =>
                        setSelectedPartner(
                          selectedPartner?.id === partner.id ? null : partner
                        )
                      }
                      className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-medium transition-colors"
                    >
                      {selectedPartner?.id === partner.id
                        ? "Thu Gọn"
                        : "Xem Chi Tiết"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Partner Details (Expandable) */}
              {selectedPartner?.id === partner.id && (
                <div className="p-6 space-y-6">
                  {/* Contact Information */}
                  <div>
                    <h4 className="text-md font-semibold text-gray-900 mb-4">
                      Thông Tin Liên Hệ
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-600">{partner.email}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-600">{partner.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <Building className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-600">
                          {getBusinessTypeText(partner.businessType)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Documents */}
                  <div>
                    <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                      <Shield className="w-4 h-4 mr-2" />
                      Tài Liệu Xác Minh
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* House Rental License */}
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h5 className="font-medium text-gray-900 mb-2">
                          Giấy Phép Cho Thuê Nhà
                        </h5>
                        {partner.documents.houseRental.uploaded ? (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-sm text-green-600">
                              <FileText className="w-4 h-4 mr-1" />
                              {partner.documents.houseRental.fileName}
                            </div>
                            <button
                              onClick={() =>
                                handleDownloadDocument(
                                  partner.documents.houseRental.fileName
                                )
                              }
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">
                            Chưa tải lên
                          </span>
                        )}
                      </div>

                      {/* Tours License */}
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h5 className="font-medium text-gray-900 mb-2">
                          Giấy Phép Đặt Tour
                        </h5>
                        {partner.documents.tours.uploaded ? (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-sm text-green-600">
                              <FileText className="w-4 h-4 mr-1" />
                              {partner.documents.tours.fileName}
                            </div>
                            <button
                              onClick={() =>
                                handleDownloadDocument(
                                  partner.documents.tours.fileName
                                )
                              }
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">
                            Chưa tải lên
                          </span>
                        )}
                      </div>

                      {/* Car Rentals License */}
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h5 className="font-medium text-gray-900 mb-2">
                          Giấy Phép Cho Thuê Xe
                        </h5>
                        {partner.documents.carRentals.uploaded ? (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-sm text-green-600">
                              <FileText className="w-4 h-4 mr-1" />
                              {partner.documents.carRentals.fileName}
                            </div>
                            <button
                              onClick={() =>
                                handleDownloadDocument(
                                  partner.documents.carRentals.fileName
                                )
                              }
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">
                            Chưa tải lên
                          </span>
                        )}
                      </div>

                      {/* Additional Certificates */}
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h5 className="font-medium text-gray-900 mb-2">
                          Chứng Chỉ Bổ Sung
                        </h5>
                        {partner.documents.additional.uploaded ? (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-sm text-green-600">
                              <FileText className="w-4 h-4 mr-1" />
                              {partner.documents.additional.fileName}
                            </div>
                            <button
                              onClick={() =>
                                handleDownloadDocument(
                                  partner.documents.additional.fileName
                                )
                              }
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">
                            Chưa tải lên
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <div className="text-sm text-gray-600">
                      Ngày nộp hồ sơ:{" "}
                      {new Date(partner.submittedDate).toLocaleDateString(
                        "vi-VN"
                      )}
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleRejectPartner(partner.id)}
                        className="px-6 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 font-medium transition-colors flex items-center"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Từ Chối
                      </button>
                      <button
                        onClick={() => handleApprovePartner(partner.id)}
                        className="px-6 py-2 text-white rounded-lg hover:bg-green-700 font-medium transition-colors flex items-center"
                        style={{
                          backgroundColor: "var(--color-primary, #10b981)",
                        }}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Duyệt Hồ Sơ
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {filteredPartners.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-12 text-center">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Không tìm thấy hồ sơ nào
              </h3>
              <p className="text-gray-600">
                Không có hồ sơ đối tác nào phù hợp với tiêu chí tìm kiếm của
                bạn.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
