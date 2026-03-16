import React, { useState } from "react";
import { Home, Compass, Car, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PartnerServiceModal = ({ onClose }) => {
  const [selectedType, setSelectedType] = useState(null);
  const navigate = useNavigate();

  const serviceTypes = [
    {
      id: "rental",
      title: "Cho thuê",
      description: "Đăng phòng, căn hộ hoặc nhà cho khách du lịch",
      icon: Home,
    },
    {
      id: "tour",
      title: "Tour",
      description: "Cung cấp tour hướng dẫn hoặc trải nghiệm du lịch",
      icon: Compass,
    },
    {
      id: "car",
      title: "Thuê xe",
      description: "Cung cấp xe hơi hoặc phương tiện khác cho thuê",
      icon: Car,
    },
  ];

  const handleCardSelect = (serviceId) => {
    setSelectedType(serviceId);
  };

  const handleContinue = () => {
    if (selectedType) {
      onClose();

      switch (selectedType) {
        case "rental":
          navigate("/PartnerService/rental");
          break;
        case "tour":
          navigate("/PartnerService/tour");
          break;
        case "car":
          navigate("/PartnerService/car");
          break;
        default:
          break;
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900">
            Thêm dịch vụ mới
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 mb-8 text-center">
            Chọn loại dịch vụ bạn muốn cung cấp
          </p>

          {/* Service Type Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {serviceTypes.map((service) => {
              const IconComponent = service.icon;
              const isSelected = selectedType === service.id;

              return (
                <div
                  key={service.id}
                  onClick={() => handleCardSelect(service.id)}
                  className={`
                    relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-200
                    shadow-sm hover:shadow-md
                    ${
                      isSelected
                        ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5"
                        : "border-gray-200 hover:border-[var(--color-primary-hover)]"
                    }
                  `}
                  style={{
                    "--tw-shadow": isSelected
                      ? "0 4px 6px -1px rgb(0 0 0 / 0.1)"
                      : undefined,
                  }}
                >
                  {/* Selection indicator */}
                  {isSelected && (
                    <div className="absolute top-4 right-4">
                      <div className="w-5 h-5 bg-[var(--color-primary)] rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    </div>
                  )}

                  {/* Icon */}
                  <div
                    className={`
                    w-12 h-12 rounded-lg mb-4 flex items-center justify-center
                    ${
                      isSelected
                        ? "bg-[var(--color-primary)] text-white"
                        : "bg-gray-100 text-gray-600"
                    }
                  `}
                  >
                    <IconComponent className="w-6 h-6" />
                  </div>

                  {/* Content */}
                  <h3
                    className={`
                    text-lg font-semibold mb-2
                    ${
                      isSelected
                        ? "text-[var(--color-primary)]"
                        : "text-gray-900"
                    }
                  `}
                  >
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Hủy
            </button>
            <button
              onClick={handleContinue}
              disabled={!selectedType}
              className={`
                px-6 py-2.5 rounded-lg font-medium transition-colors
                ${
                  selectedType
                    ? "bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }
              `}
            >
              Tiếp tục
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerServiceModal;
