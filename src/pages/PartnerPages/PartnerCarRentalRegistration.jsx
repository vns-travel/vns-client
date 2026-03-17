import React, { useState } from "react";
import {
  Car,
  MapPin,
  Plus,
  Trash2,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  List,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const PartnerCarRentalRegistration = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Define Depots
    depots: [
      {
        id: 1,
        name: "Main Depot",
        address: "",
        latitude: "",
        longitude: "",
        contact: "",
        openingHours: "08:00 - 20:00",
        isPrimary: true,
      },
    ],
    // Step 2: Define Fleet Templates (Vehicle Classes)
    fleetTemplates: [
      {
        id: 1,
        brand: "Toyota",
        model: "Vios",
        year: 2023,
        category: "Economy",
        seats: 5,
        transmissionType: "automatic",
        fuelType: "petrol",
        features: ["Air Conditioning", "Bluetooth"],
        basePricePerDay: 800000,
        minRentalHours: 4,
        maxRentalDays: 30,
        fuelPolicy: "Full-to-Full",
        lateReturnFeePerHour: 100000,
        cleaningFee: 150000,
        smokingPenalty: 500000,
      },
    ],
    // Step 3: Assign Inventory to Depots
    depotInventories: [
      // This will be populated when user assigns templates to depots
      // { depotId: 1, templateId: 1, quantity: 5 }
    ],
  });

  const navigate = useNavigate();

  const steps = [
    { id: 1, title: "Định nghĩa Depot", icon: MapPin },
    { id: 2, title: "Mẫu xe (Hạng xe)", icon: Car },
    { id: 3, title: "Phân bổ kho xe", icon: List },
    { id: 4, title: "Xem lại & Đăng", icon: CheckCircle },
  ];

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep === 1) {
      if (formData.depots.length < 1) {
        alert("Vui lòng thêm ít nhất một depot!");
        return;
      }
      if (!formData.depots.some((depot) => depot.isPrimary)) {
        alert("Vui lòng chọn ít nhất một depot chính!");
        return;
      }
      for (const depot of formData.depots) {
        if (
          !depot.name.trim() ||
          !depot.address.trim() ||
          !depot.contact.trim()
        ) {
          alert("Tất cả depot phải có tên, địa chỉ và thông tin liên hệ!");
          return;
        }
        if (
          depot.latitude === "" ||
          depot.longitude === "" ||
          isNaN(parseFloat(depot.latitude)) ||
          isNaN(parseFloat(depot.longitude))
        ) {
          alert("Vui lòng nhập tọa độ địa lý hợp lệ (vĩ độ, kinh độ)!");
          return;
        }
        if (!/^\d{2}:\d{2} - \d{2}:\d{2}$/.test(depot.openingHours)) {
          alert("Giờ mở cửa phải theo định dạng 'HH:MM - HH:MM'!");
          return;
        }
      }
    }

    if (currentStep === 2) {
      if (formData.fleetTemplates.length < 1) {
        alert("Vui lòng thêm ít nhất một mẫu xe!");
        return;
      }
      for (const template of formData.fleetTemplates) {
        if (
          !template.brand.trim() ||
          !template.model.trim() ||
          !template.category.trim() ||
          template.basePricePerDay <= 0
        ) {
          alert(
            "Tất cả mẫu xe phải có hãng, dòng xe, hạng xe và giá cơ bản > 0!",
          );
          return;
        }
      }
    }

    if (currentStep === 3) {
      // Check if at least one inventory assignment exists
      if (formData.depotInventories.length === 0) {
        alert("Vui lòng phân bổ ít nhất một mẫu xe cho một depot!");
        return;
      }

      // Validate quantities
      for (const assignment of formData.depotInventories) {
        if (assignment.quantity <= 0) {
          alert("Số lượng xe phải lớn hơn 0!");
          return;
        }
      }
    }

    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // --- Depot Management ---
  const addDepot = () => {
    const newId = Math.max(...formData.depots.map((d) => d.id), 0) + 1;
    setFormData((prev) => ({
      ...prev,
      depots: [
        ...prev.depots,
        {
          id: newId,
          name: "New Depot",
          address: "",
          latitude: "",
          longitude: "",
          contact: "",
          openingHours: "08:00 - 20:00",
          isPrimary: false,
        },
      ],
    }));
  };

  const updateDepot = (id, field, value) => {
    if (["name", "address", "contact"].includes(field) && !value.trim()) {
      alert(
        `Vui lòng nhập ${
          field === "name"
            ? "tên depot"
            : field === "address"
              ? "địa chỉ"
              : "thông tin liên hệ"
        }!`,
      );
      return;
    }

    if (field === "latitude" || field === "longitude") {
      const numValue = parseFloat(value);
      if (isNaN(numValue)) {
        alert("Tọa độ phải là số hợp lệ!");
        return;
      }
      if (field === "latitude" && (numValue < -90 || numValue > 90)) {
        alert("Vĩ độ phải nằm trong khoảng -90 đến 90!");
        return;
      }
      if (field === "longitude" && (numValue < -180 || numValue > 180)) {
        alert("Kinh độ phải nằm trong khoảng -180 đến 180!");
        return;
      }
    }

    if (
      field === "openingHours" &&
      !/^\d{2}:\d{2} - \d{2}:\d{2}$/.test(value)
    ) {
      alert("Giờ mở cửa phải theo định dạng 'HH:MM - HH:MM'!");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      depots: prev.depots.map((depot) =>
        depot.id === id ? { ...depot, [field]: value } : depot,
      ),
    }));
  };

  const removeDepot = (id) => {
    if (formData.depots.length > 1) {
      setFormData((prev) => ({
        ...prev,
        depots: prev.depots.filter((depot) => depot.id !== id),
        depotInventories: prev.depotInventories.filter(
          (inv) => inv.depotId !== id,
        ),
      }));
    }
  };

  const togglePrimaryDepot = (id) => {
    setFormData((prev) => ({
      ...prev,
      depots: prev.depots.map((depot) => ({
        ...depot,
        isPrimary: depot.id === id ? true : false,
      })),
    }));
  };

  // --- Fleet Template Management ---
  const addFleetTemplate = () => {
    const newId = Math.max(...formData.fleetTemplates.map((t) => t.id), 0) + 1;
    setFormData((prev) => ({
      ...prev,
      fleetTemplates: [
        ...prev.fleetTemplates,
        {
          id: newId,
          brand: "",
          model: "",
          year: new Date().getFullYear(),
          category: "Economy",
          seats: 5,
          transmissionType: "automatic",
          fuelType: "petrol",
          features: [],
          basePricePerDay: 0,
          minRentalHours: 4,
          maxRentalDays: 30,
          fuelPolicy: "Full-to-Full",
          lateReturnFeePerHour: 100000,
          cleaningFee: 150000,
          smokingPenalty: 500000,
        },
      ],
    }));
  };

  const updateFleetTemplate = (id, field, value) => {
    if (["brand", "model", "category"].includes(field) && !value.trim()) {
      alert(
        `Vui lòng nhập ${
          field === "brand" ? "hãng" : field === "model" ? "dòng xe" : "hạng xe"
        }!`,
      );
      return;
    }

    if (field === "year") {
      const newValue = parseInt(value);
      if (newValue < 1990 || newValue > new Date().getFullYear() + 1) {
        alert("Năm sản xuất phải từ 1990 đến năm hiện tại +1!");
        return;
      }
    }

    if (field === "seats") {
      const newValue = parseInt(value);
      if (newValue < 1 || newValue > 12) {
        alert("Số chỗ phải từ 1 đến 12!");
        return;
      }
    }

    if (field === "basePricePerDay") {
      const newValue = parseInt(value);
      if (newValue <= 0) {
        alert("Giá cơ bản mỗi ngày phải lớn hơn 0!");
        return;
      }
    }

    if (field === "minRentalHours" || field === "maxRentalDays") {
      const newValue = parseInt(value);
      if (isNaN(newValue) || newValue <= 0) {
        alert(
          `${
            field === "minRentalHours"
              ? "Thời gian thuê tối thiểu"
              : "Thời gian thuê tối đa"
          } phải lớn hơn 0!`,
        );
        return;
      }
      if (field === "maxRentalDays" && newValue > 90) {
        alert("Thời gian thuê tối đa không được vượt quá 90 ngày!");
        return;
      }
    }

    if (
      ["lateReturnFeePerHour", "cleaningFee", "smokingPenalty"].includes(field)
    ) {
      const newValue = parseInt(value);
      if (isNaN(newValue) || newValue < 0) {
        alert("Phí không được âm!");
        return;
      }
    }

    setFormData((prev) => ({
      ...prev,
      fleetTemplates: prev.fleetTemplates.map((template) =>
        template.id === id ? { ...template, [field]: value } : template,
      ),
    }));
  };

  const toggleTemplateFeature = (templateId, feature) => {
    setFormData((prev) => ({
      ...prev,
      fleetTemplates: prev.fleetTemplates.map((template) =>
        template.id === templateId
          ? {
              ...template,
              features: template.features.includes(feature)
                ? template.features.filter((f) => f !== feature)
                : [...template.features, feature],
            }
          : template,
      ),
    }));
  };

  const removeFleetTemplate = (id) => {
    if (formData.fleetTemplates.length > 1) {
      setFormData((prev) => ({
        ...prev,
        fleetTemplates: prev.fleetTemplates.filter(
          (template) => template.id !== id,
        ),
        depotInventories: prev.depotInventories.filter(
          (inv) => inv.templateId !== id,
        ),
      }));
    }
  };

  // --- Inventory Assignment Management ---
  const assignInventoryToDepot = (depotId, templateId, quantity) => {
    if (quantity <= 0) {
      alert("Số lượng phải lớn hơn 0!");
      return;
    }

    setFormData((prev) => {
      const existingIndex = prev.depotInventories.findIndex(
        (inv) => inv.depotId === depotId && inv.templateId === templateId,
      );

      if (existingIndex >= 0) {
        // Update existing assignment
        const updatedInventories = [...prev.depotInventories];
        updatedInventories[existingIndex] = {
          ...updatedInventories[existingIndex],
          quantity: quantity,
        };
        return { ...prev, depotInventories: updatedInventories };
      } else {
        // Add new assignment
        return {
          ...prev,
          depotInventories: [
            ...prev.depotInventories,
            { depotId, templateId, quantity },
          ],
        };
      }
    });
  };

  const removeInventoryAssignment = (depotId, templateId) => {
    setFormData((prev) => ({
      ...prev,
      depotInventories: prev.depotInventories.filter(
        (inv) => !(inv.depotId === depotId && inv.templateId === templateId),
      ),
    }));
  };

  const getAssignedQuantity = (depotId, templateId) => {
    const assignment = formData.depotInventories.find(
      (inv) => inv.depotId === depotId && inv.templateId === templateId,
    );
    return assignment ? assignment.quantity : 0;
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Định nghĩa các Depot
            </h2>
            <p className="text-gray-600 mb-4">
              Tạo một hoặc nhiều điểm nhận/trả xe (depot) cho dịch vụ của bạn
            </p>
            <div className="space-y-4">
              {formData.depots.map((depot) => (
                <div
                  key={depot.id}
                  className="p-4 border border-gray-200 rounded-lg space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-gray-900">{depot.name}</h4>
                    {formData.depots.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeDepot(depot.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Đặt làm depot chính
                    </label>
                    <input
                      type="checkbox"
                      checked={depot.isPrimary}
                      onChange={() => togglePrimaryDepot(depot.id)}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Địa chỉ *
                    </label>
                    <input
                      type="text"
                      value={depot.address}
                      onChange={(e) =>
                        updateDepot(depot.id, "address", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary"
                      placeholder="Số 123, Đường ABC"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Vĩ độ (Latitude) *
                      </label>
                      <input
                        type="number"
                        step="0.000001"
                        value={depot.latitude}
                        onChange={(e) =>
                          updateDepot(depot.id, "latitude", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary"
                        placeholder="21.0285"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Kinh độ (Longitude) *
                      </label>
                      <input
                        type="number"
                        step="0.000001"
                        value={depot.longitude}
                        onChange={(e) =>
                          updateDepot(depot.id, "longitude", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary"
                        placeholder="105.8542"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Thông tin liên hệ *
                    </label>
                    <input
                      type="text"
                      value={depot.contact}
                      onChange={(e) =>
                        updateDepot(depot.id, "contact", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary"
                      placeholder="0987 654 321"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Giờ mở cửa *
                    </label>
                    <input
                      type="text"
                      value={depot.openingHours}
                      onChange={(e) =>
                        updateDepot(depot.id, "openingHours", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary"
                      placeholder="08:00 - 20:00"
                    />
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addDepot}
              className="mt-4 flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              Thêm depot mới
            </button>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Định nghĩa Mẫu xe (Hạng xe)
            </h2>
            <p className="text-gray-600 mb-4">
              Xác định các loại xe có sẵn trong đội xe của bạn
            </p>
            <div className="space-y-6">
              {formData.fleetTemplates.map((template) => (
                <div
                  key={template.id}
                  className="p-4 border border-gray-200 rounded-lg space-y-4"
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-gray-900">
                      Mẫu xe #{template.id}: {template.brand} {template.model} (
                      {template.category})
                    </h4>
                    {formData.fleetTemplates.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFleetTemplate(template.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Hãng *
                      </label>
                      <input
                        type="text"
                        value={template.brand}
                        onChange={(e) =>
                          updateFleetTemplate(
                            template.id,
                            "brand",
                            e.target.value,
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary"
                        placeholder="Toyota"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Dòng xe *
                      </label>
                      <input
                        type="text"
                        value={template.model}
                        onChange={(e) =>
                          updateFleetTemplate(
                            template.id,
                            "model",
                            e.target.value,
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary"
                        placeholder="Camry"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Hạng xe *
                      </label>
                      <select
                        value={template.category}
                        onChange={(e) =>
                          updateFleetTemplate(
                            template.id,
                            "category",
                            e.target.value,
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary"
                      >
                        <option value="Economy">Tiết kiệm</option>
                        <option value="Compact">Gọn nhẹ</option>
                        <option value="Midsize">Trung bình</option>
                        <option value="Fullsize">Cỡ lớn</option>
                        <option value="SUV">SUV</option>
                        <option value="Luxury">Cao cấp</option>
                        <option value="Van">Xe tải nhỏ</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Năm SX
                      </label>
                      <input
                        type="number"
                        value={template.year}
                        onChange={(e) =>
                          updateFleetTemplate(
                            template.id,
                            "year",
                            parseInt(e.target.value),
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary"
                        min="1990"
                        max={new Date().getFullYear() + 1}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Số chỗ
                      </label>
                      <input
                        type="number"
                        value={template.seats}
                        onChange={(e) =>
                          updateFleetTemplate(
                            template.id,
                            "seats",
                            parseInt(e.target.value),
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary"
                        min="1"
                        max="12"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Hộp số
                      </label>
                      <select
                        value={template.transmissionType}
                        onChange={(e) =>
                          updateFleetTemplate(
                            template.id,
                            "transmissionType",
                            e.target.value,
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary"
                      >
                        <option value="automatic">Tự động</option>
                        <option value="manual">Số sàn</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Nhiên liệu
                      </label>
                      <select
                        value={template.fuelType}
                        onChange={(e) =>
                          updateFleetTemplate(
                            template.id,
                            "fuelType",
                            e.target.value,
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary"
                      >
                        <option value="petrol">Xăng</option>
                        <option value="diesel">Dầu</option>
                        <option value="electric">Điện</option>
                        <option value="hybrid">Hybrid</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Tiện nghi & Tính năng
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                      {[
                        "Điều hòa",
                        "Bluetooth",
                        "Camera lùi",
                        "Cảm biến lùi",
                        "Màn hình cảm ứng",
                        "Đề nổ từ xa",
                        "Ghế da",
                        "Cửa sổ trời",
                      ].map((feature) => (
                        <div
                          key={feature}
                          className={`p-2 border text-xs rounded cursor-pointer text-center ${
                            template.features.includes(feature)
                              ? "border-[--color-primary] bg-blue-50 text-primary"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() =>
                            toggleTemplateFeature(template.id, feature)
                          }
                        >
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Giá cơ bản mỗi ngày (₫) *
                      </label>
                      <input
                        type="number"
                        value={template.basePricePerDay}
                        onChange={(e) =>
                          updateFleetTemplate(
                            template.id,
                            "basePricePerDay",
                            parseInt(e.target.value),
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[--color-primary]"
                        min="0"
                      />
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <h5 className="font-medium text-gray-800 mb-3">
                      Chính sách thuê xe
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Thời gian thuê tối thiểu (giờ)
                        </label>
                        <input
                          type="number"
                          value={template.minRentalHours}
                          onChange={(e) =>
                            updateFleetTemplate(
                              template.id,
                              "minRentalHours",
                              parseInt(e.target.value),
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary"
                          min="1"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Thời gian thuê tối đa (ngày)
                        </label>
                        <input
                          type="number"
                          value={template.maxRentalDays}
                          onChange={(e) =>
                            updateFleetTemplate(
                              template.id,
                              "maxRentalDays",
                              parseInt(e.target.value),
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary"
                          min="1"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addFleetTemplate}
              className="mt-6 flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              Thêm mẫu xe mới
            </button>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Phân bổ kho xe cho các Depot
            </h2>
            <p className="text-gray-600 mb-4">
              Phân bổ số lượng xe cho từng depot dựa trên các mẫu xe đã định
              nghĩa
            </p>
            <div className="space-y-6">
              {formData.depots.map((depot) => (
                <div
                  key={depot.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <h3 className="font-medium text-gray-900 mb-4">
                    {depot.name} {depot.isPrimary && "(Chính)"}
                  </h3>
                  <div className="space-y-3">
                    {formData.fleetTemplates.map((template) => (
                      <div
                        key={template.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded"
                      >
                        <div>
                          <div className="font-medium">
                            {template.brand} {template.model} (
                            {template.category})
                          </div>
                          <div className="text-sm text-gray-600">
                            {template.seats} chỗ •{" "}
                            {template.transmissionType === "automatic"
                              ? "Số tự động"
                              : "Số sàn"}
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <label className="text-sm text-gray-700">
                            Số lượng:
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={getAssignedQuantity(depot.id, template.id)}
                            onChange={(e) =>
                              assignInventoryToDepot(
                                depot.id,
                                template.id,
                                parseInt(e.target.value) || 0,
                              )
                            }
                            className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-primary"
                          />
                          {getAssignedQuantity(depot.id, template.id) > 0 && (
                            <button
                              type="button"
                              onClick={() =>
                                removeInventoryAssignment(depot.id, template.id)
                              }
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Xem lại dịch vụ cho thuê xe
            </h2>
            <p className="text-gray-600 mb-4">
              Kiểm tra kỹ trước khi gửi đi phê duyệt
            </p>
            <div className="bg-gray-50 rounded-lg p-6 space-y-6">
              {/* Depots */}
              <div>
                <h3 className="font-medium text-gray-900 mb-2">
                  Các Depot ({formData.depots.length})
                </h3>
                <div className="space-y-2">
                  {formData.depots.map((depot) => (
                    <div
                      key={depot.id}
                      className="text-sm p-2 bg-white rounded border"
                    >
                      <div className="font-medium">
                        {depot.name} {depot.isPrimary && "(Chính)"}
                      </div>
                      <div>{depot.address}</div>
                      <div>Liên hệ: {depot.contact}</div>
                      <div>Giờ mở cửa: {depot.openingHours}</div>
                      <div>
                        Tọa độ: {depot.latitude}, {depot.longitude}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Fleet Templates */}
              <div>
                <h3 className="font-medium text-gray-900 mb-2">
                  Mẫu xe ({formData.fleetTemplates.length})
                </h3>
                <div className="space-y-2">
                  {formData.fleetTemplates.map((template) => (
                    <div
                      key={template.id}
                      className="text-sm p-2 bg-white rounded border"
                    >
                      <div className="font-medium">
                        {template.brand} {template.model} ({template.category})
                      </div>
                      <div>
                        {template.year} • {template.seats} chỗ •{" "}
                        {template.transmissionType === "automatic"
                          ? "Số tự động"
                          : "Số sàn"}{" "}
                        • {template.fuelType}
                      </div>
                      <div className="text-xs text-gray-600">
                        Giá: {template.basePricePerDay.toLocaleString()}₫/ngày
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Inventory Assignments */}
              <div>
                <h3 className="font-medium text-gray-900 mb-2">
                  Phân bổ kho xe
                </h3>
                {formData.depotInventories.length === 0 ? (
                  <p className="text-sm text-gray-500">Chưa có phân bổ nào</p>
                ) : (
                  <div className="space-y-2">
                    {formData.depots.map((depot) => {
                      const assignmentsForDepot =
                        formData.depotInventories.filter(
                          (inv) => inv.depotId === depot.id,
                        );
                      if (assignmentsForDepot.length === 0) return null;

                      return (
                        <div key={depot.id} className="mb-3">
                          <div className="font-medium text-gray-800 mb-1">
                            {depot.name}:
                          </div>
                          {assignmentsForDepot.map((assignment) => {
                            const template = formData.fleetTemplates.find(
                              (t) => t.id === assignment.templateId,
                            );
                            return (
                              <div
                                key={`${depot.id}-${assignment.templateId}`}
                                className="text-sm ml-4"
                              >
                                {template?.brand} {template?.model}:{" "}
                                {assignment.quantity} xe
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center">
              <input
                id="publish-confirmation"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label
                htmlFor="publish-confirmation"
                className="ml-2 block text-sm text-gray-900"
              >
                Tôi xác nhận rằng tất cả thông tin đều chính xác và tôi đồng ý
                với các điều khoản và điều kiện của nền tảng.
              </label>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const publishCarRental = () => {
    const confirmation = document.getElementById(
      "publish-confirmation",
    ).checked;
    if (!confirmation) {
      alert("Vui lòng xác nhận điều khoản và điều kiện!");
      return;
    }

    // Final validation
    if (
      formData.depots.length < 1 ||
      !formData.depots.some((d) => d.isPrimary)
    ) {
      alert("Vui lòng hoàn thiện thông tin depot!");
      return;
    }

    if (formData.fleetTemplates.length < 1) {
      alert("Vui lòng định nghĩa ít nhất một mẫu xe!");
      return;
    }

    if (formData.depotInventories.length === 0) {
      alert("Vui lòng phân bổ ít nhất một xe cho một depot!");
      return;
    }

    alert("Dịch vụ cho thuê xe đã được gửi đi để xác minh!");
    navigate("/partner/dashboard");
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Đăng dịch vụ cho thuê xe
          </h1>
          <p className="text-gray-600 mt-2">
            Làm theo các bước để đăng đội xe của bạn lên nền tảng
          </p>
        </div>
      </header>
      {/* Progress Bar */}
      <div className="mb-10">
        <div className="flex justify-between relative">
          <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 -z-10"></div>
          <div
            className="absolute top-4 left-0 h-1 bg-primary -z-10 transition-all duration-500"
            style={{
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            }}
          ></div>
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.id} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep === step.id
                      ? "bg-primary text-white border-2 border-[--color-primary]"
                      : currentStep > step.id
                        ? "bg-green-500 text-white border-2 border-green-500"
                        : "bg-white border-2 border-gray-300 text-gray-500"
                  }`}
                >
                  {currentStep > step.id ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>
                <span
                  className={`mt-2 text-xs font-medium text-center ${
                    currentStep === step.id ? "text-primary" : "text-gray-500"
                  }`}
                >
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      {/* Form Content */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        {renderStep()}
      </div>
      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          className={`flex items-center px-5 py-2 rounded-lg ${
            currentStep === 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Trước
        </button>
        {currentStep < 4 ? (
          <button
            onClick={nextStep}
            className="flex items-center px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover"
          >
            Tiếp theo
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        ) : (
          <button
            onClick={publishCarRental}
            className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Gửi đăng dịch vụ
          </button>
        )}
      </div>
    </div>
  );
};

export default PartnerCarRentalRegistration;
