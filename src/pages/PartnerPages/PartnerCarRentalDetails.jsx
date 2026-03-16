import React, { useState, useEffect } from "react";
import {
  Car,
  MapPin,
  DollarSign,
  FileText,
  Settings,
  Plus,
  Trash2,
  Pencil,
  Save,
  X,
  ToggleLeft,
  ToggleRight,
  CheckCircle,
  List,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const PartnerCarRentalDetails = () => {
  const { rentalId } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("depots");

  // Mock data — replace with API call
  useEffect(() => {
    const mockService = {
      rentalId: rentalId || "rental-001",
      serviceId: "service-rental-123",
      businessName: "Saigon Car Rental",
      depots: [
        {
          id: 1,
          name: "Tan Son Nhat Airport",
          address: "International Terminal, Tan Son Nhat Airport",
          latitude: "10.8188",
          longitude: "106.6521",
          contact: "+84 901 234 567",
          openingHours: "06:00 - 22:00",
          isPrimary: true,
        },
        {
          id: 2,
          name: "District 1 Downtown",
          address: "123 Nguyen Hue Blvd, District 1, Ho Chi Minh City",
          latitude: "10.7758",
          longitude: "106.6921",
          contact: "+84 901 234 568",
          openingHours: "08:00 - 20:00",
          isPrimary: false,
        },
      ],
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
          features: ["Air Conditioning", "Bluetooth", "Camera lùi"],
          basePricePerDay: 800000,
          minRentalHours: 4,
          maxRentalDays: 30,
          fuelPolicy: "Full-to-Full",
          lateReturnFeePerHour: 100000,
          cleaningFee: 150000,
          smokingPenalty: 500000,
        },
        {
          id: 2,
          brand: "KIA",
          model: "Sorento",
          year: 2022,
          category: "SUV",
          seats: 7,
          transmissionType: "automatic",
          fuelType: "diesel",
          features: ["Điều hòa", "Ghế da", "Cửa sổ trời"],
          basePricePerDay: 1500000,
          minRentalHours: 4,
          maxRentalDays: 30,
          fuelPolicy: "Full-to-Full",
          lateReturnFeePerHour: 200000,
          cleaningFee: 200000,
          smokingPenalty: 1000000,
        },
      ],
      depotInventories: [
        { depotId: 1, templateId: 1, quantity: 5 },
        { depotId: 1, templateId: 2, quantity: 3 },
        { depotId: 2, templateId: 1, quantity: 2 },
      ],
      businessLicense: "456789",
      insurancePolicy: "ABC-123-XYZ",
      operatingHours: "06:00 - 22:00",
      pickupLocations: "Tan Son Nhat Airport, District 1, District 3",
      deliveryAvailable: true,
      isActive: true,
    };
    setService(mockService);
  }, [rentalId]);

  if (!service) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    alert("Car rental service saved successfully!");
    setIsEditing(false);
  };

  const handleToggleActive = () => {
    setService((prev) => (prev ? { ...prev, isActive: !prev.isActive } : null));
    alert(`Service ${service.isActive ? "deactivated" : "activated"}!`);
  };

  // --- Depot Management ---
  const addDepot = () => {
    const newId = Math.max(...service.depots.map((d) => d.id), 0) + 1;
    setService((prev) => ({
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
    setService((prev) => ({
      ...prev,
      depots: prev.depots.map((depot) =>
        depot.id === id ? { ...depot, [field]: value } : depot
      ),
    }));
  };

  const removeDepot = (id) => {
    if (window.confirm("Are you sure you want to delete this depot?")) {
      setService((prev) => ({
        ...prev,
        depots: prev.depots.filter((depot) => depot.id !== id),
        depotInventories: prev.depotInventories.filter(
          (inv) => inv.depotId !== id
        ),
      }));
    }
  };

  const togglePrimaryDepot = (id) => {
    setService((prev) => ({
      ...prev,
      depots: prev.depots.map((depot) => ({
        ...depot,
        isPrimary: depot.id === id ? true : false,
      })),
    }));
  };

  // --- Fleet Template Management ---
  const addFleetTemplate = () => {
    const newId = Math.max(...service.fleetTemplates.map((t) => t.id), 0) + 1;
    setService((prev) => ({
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
    setService((prev) => ({
      ...prev,
      fleetTemplates: prev.fleetTemplates.map((template) =>
        template.id === id ? { ...template, [field]: value } : template
      ),
    }));
  };

  const toggleTemplateFeature = (templateId, feature) => {
    setService((prev) => ({
      ...prev,
      fleetTemplates: prev.fleetTemplates.map((template) =>
        template.id === templateId
          ? {
              ...template,
              features: template.features.includes(feature)
                ? template.features.filter((f) => f !== feature)
                : [...template.features, feature],
            }
          : template
      ),
    }));
  };

  const removeFleetTemplate = (id) => {
    if (
      window.confirm("Are you sure you want to delete this vehicle template?")
    ) {
      setService((prev) => ({
        ...prev,
        fleetTemplates: prev.fleetTemplates.filter(
          (template) => template.id !== id
        ),
        depotInventories: prev.depotInventories.filter(
          (inv) => inv.templateId !== id
        ),
      }));
    }
  };

  // --- Inventory Assignment Management ---
  const assignInventoryToDepot = (depotId, templateId, quantity) => {
    setService((prev) => {
      const existingIndex = prev.depotInventories.findIndex(
        (inv) => inv.depotId === depotId && inv.templateId === templateId
      );
      if (existingIndex >= 0) {
        const updatedInventories = [...prev.depotInventories];
        updatedInventories[existingIndex] = {
          ...updatedInventories[existingIndex],
          quantity: quantity,
        };
        return { ...prev, depotInventories: updatedInventories };
      } else {
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
    setService((prev) => ({
      ...prev,
      depotInventories: prev.depotInventories.filter(
        (inv) => !(inv.depotId === depotId && inv.templateId === templateId)
      ),
    }));
  };

  const getAssignedQuantity = (depotId, templateId) => {
    const assignment = service.depotInventories.find(
      (inv) => inv.depotId === depotId && inv.templateId === templateId
    );
    return assignment ? assignment.quantity : 0;
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {service.businessName}
          </h1>
          <p className="text-gray-600 mt-1">Car Rental Service</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0">
          <button
            onClick={toggleEditMode}
            className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          >
            <Pencil className="w-4 h-4 mr-2" />
            {isEditing ? "Cancel Edit" : "Edit Service"}
          </button>
          {isEditing && (
            <button
              onClick={handleSave}
              className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </button>
          )}
          <button
            onClick={handleToggleActive}
            className={`flex items-center px-4 py-2 rounded-lg ${
              service.isActive
                ? "bg-red-100 text-red-700 hover:bg-red-200"
                : "bg-green-100 text-green-700 hover:bg-green-200"
            }`}
          >
            {service.isActive ? (
              <>
                <ToggleLeft className="w-4 h-4 mr-2" />
                Deactivate
              </>
            ) : (
              <>
                <ToggleRight className="w-4 h-4 mr-2" />
                Activate
              </>
            )}
          </button>
        </div>
      </header>

      {/* Status Badge */}
      <div className="mb-6">
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            service.isActive
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {service.isActive ? "ACTIVE" : "INACTIVE"}
        </span>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: "depots", label: "Depots", icon: MapPin },
            { id: "fleet", label: "Fleet Templates", icon: Car },
            { id: "inventory", label: "Inventory", icon: List },
            { id: "policies", label: "Policies", icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl shadow-md p-6">
        {activeTab === "depots" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Depots</h2>
              {isEditing && (
                <button
                  onClick={addDepot}
                  className="flex items-center px-3 py-1 bg-primary text-white text-sm rounded hover:bg-primary-hover"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Depot
                </button>
              )}
            </div>

            {service.depots.map((depot) => (
              <div
                key={depot.id}
                className="border border-gray-200 rounded-lg p-4 bg-white"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-medium text-gray-900">{depot.name}</h3>
                  {isEditing && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => removeDepot(depot.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Set as Primary Depot
                  </label>
                  {isEditing ? (
                    <input
                      type="checkbox"
                      checked={depot.isPrimary}
                      onChange={() => togglePrimaryDepot(depot.id)}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                  ) : (
                    <p className="text-gray-900">
                      {depot.isPrimary ? "Yes" : "No"}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={depot.address}
                        onChange={(e) =>
                          updateDepot(depot.id, "address", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    ) : (
                      <p className="text-gray-900">{depot.address}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={depot.contact}
                        onChange={(e) =>
                          updateDepot(depot.id, "contact", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    ) : (
                      <p className="text-gray-900">{depot.contact}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Latitude
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        step="0.000001"
                        value={depot.latitude}
                        onChange={(e) =>
                          updateDepot(depot.id, "latitude", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    ) : (
                      <p className="text-gray-900">{depot.latitude}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Longitude
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        step="0.000001"
                        value={depot.longitude}
                        onChange={(e) =>
                          updateDepot(depot.id, "longitude", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    ) : (
                      <p className="text-gray-900">{depot.longitude}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Opening Hours
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={depot.openingHours}
                        onChange={(e) =>
                          updateDepot(depot.id, "openingHours", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    ) : (
                      <p className="text-gray-900">{depot.openingHours}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "fleet" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">
                Fleet Templates
              </h2>
              {isEditing && (
                <button
                  onClick={addFleetTemplate}
                  className="flex items-center px-3 py-1 bg-primary text-white text-sm rounded hover:bg-primary-hover"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Template
                </button>
              )}
            </div>

            {service.fleetTemplates.map((template) => (
              <div
                key={template.id}
                className="border border-gray-200 rounded-lg p-4 bg-white"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-medium text-gray-900">
                    {template.brand} {template.model} ({template.category})
                  </h3>
                  {isEditing && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => removeFleetTemplate(template.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Brand
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={template.brand}
                        onChange={(e) =>
                          updateFleetTemplate(
                            template.id,
                            "brand",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    ) : (
                      <p className="text-gray-900">{template.brand}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Model
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={template.model}
                        onChange={(e) =>
                          updateFleetTemplate(
                            template.id,
                            "model",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    ) : (
                      <p className="text-gray-900">{template.model}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    {isEditing ? (
                      <select
                        value={template.category}
                        onChange={(e) =>
                          updateFleetTemplate(
                            template.id,
                            "category",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="Economy">Economy</option>
                        <option value="Compact">Compact</option>
                        <option value="Midsize">Midsize</option>
                        <option value="Fullsize">Fullsize</option>
                        <option value="SUV">SUV</option>
                        <option value="Luxury">Luxury</option>
                        <option value="Van">Van</option>
                      </select>
                    ) : (
                      <p className="text-gray-900">{template.category}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Year
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={template.year}
                        onChange={(e) =>
                          updateFleetTemplate(
                            template.id,
                            "year",
                            parseInt(e.target.value) || new Date().getFullYear()
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        min="1990"
                        max={new Date().getFullYear() + 1}
                      />
                    ) : (
                      <p className="text-gray-900">{template.year}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Seats
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={template.seats}
                        onChange={(e) =>
                          updateFleetTemplate(
                            template.id,
                            "seats",
                            parseInt(e.target.value) || 5
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        min="1"
                        max="12"
                      />
                    ) : (
                      <p className="text-gray-900">{template.seats}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Transmission
                    </label>
                    {isEditing ? (
                      <select
                        value={template.transmissionType}
                        onChange={(e) =>
                          updateFleetTemplate(
                            template.id,
                            "transmissionType",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="automatic">Automatic</option>
                        <option value="manual">Manual</option>
                      </select>
                    ) : (
                      <p className="text-gray-900">
                        {template.transmissionType === "automatic"
                          ? "Automatic"
                          : "Manual"}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fuel Type
                    </label>
                    {isEditing ? (
                      <select
                        value={template.fuelType}
                        onChange={(e) =>
                          updateFleetTemplate(
                            template.id,
                            "fuelType",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="petrol">Petrol</option>
                        <option value="diesel">Diesel</option>
                        <option value="electric">Electric</option>
                        <option value="hybrid">Hybrid</option>
                      </select>
                    ) : (
                      <p className="text-gray-900">{template.fuelType}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Base Price/Day (₫)
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={template.basePricePerDay}
                        onChange={(e) =>
                          updateFleetTemplate(
                            template.id,
                            "basePricePerDay",
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    ) : (
                      <p className="text-gray-900">
                        {template.basePricePerDay.toLocaleString()}₫
                      </p>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Features
                  </label>
                  {isEditing ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                      {[
                        "Air Conditioning",
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
                              ? "border-primary bg-[#e6f7f9] text-primary"
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
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {template.features.length > 0 ? (
                        template.features.map((feature) => (
                          <span
                            key={feature}
                            className="px-2 py-1 bg-primary text-white text-xs rounded"
                          >
                            {feature}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500 text-sm">
                          No features
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium text-gray-800 mb-3">
                    Rental Policies
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Min Rental Hours
                      </label>
                      {isEditing ? (
                        <input
                          type="number"
                          value={template.minRentalHours}
                          onChange={(e) =>
                            updateFleetTemplate(
                              template.id,
                              "minRentalHours",
                              parseInt(e.target.value) || 4
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      ) : (
                        <p className="text-gray-900">
                          {template.minRentalHours}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Max Rental Days
                      </label>
                      {isEditing ? (
                        <input
                          type="number"
                          value={template.maxRentalDays}
                          onChange={(e) =>
                            updateFleetTemplate(
                              template.id,
                              "maxRentalDays",
                              parseInt(e.target.value) || 30
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      ) : (
                        <p className="text-gray-900">
                          {template.maxRentalDays}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fuel Policy
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={template.fuelPolicy}
                          onChange={(e) =>
                            updateFleetTemplate(
                              template.id,
                              "fuelPolicy",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      ) : (
                        <p className="text-gray-900">{template.fuelPolicy}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Late Return Fee/Hour (₫)
                      </label>
                      {isEditing ? (
                        <input
                          type="number"
                          value={template.lateReturnFeePerHour}
                          onChange={(e) =>
                            updateFleetTemplate(
                              template.id,
                              "lateReturnFeePerHour",
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      ) : (
                        <p className="text-gray-900">
                          {template.lateReturnFeePerHour.toLocaleString()}₫
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cleaning Fee (₫)
                      </label>
                      {isEditing ? (
                        <input
                          type="number"
                          value={template.cleaningFee}
                          onChange={(e) =>
                            updateFleetTemplate(
                              template.id,
                              "cleaningFee",
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      ) : (
                        <p className="text-gray-900">
                          {template.cleaningFee.toLocaleString()}₫
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Smoking Penalty (₫)
                      </label>
                      {isEditing ? (
                        <input
                          type="number"
                          value={template.smokingPenalty}
                          onChange={(e) =>
                            updateFleetTemplate(
                              template.id,
                              "smokingPenalty",
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      ) : (
                        <p className="text-gray-900">
                          {template.smokingPenalty.toLocaleString()}₫
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "inventory" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800">
              Inventory Allocation
            </h2>
            <p className="text-gray-600 mb-4">
              Assign vehicle quantities to each depot based on your fleet
              templates.
            </p>

            <div className="space-y-6">
              {service.depots.map((depot) => (
                <div
                  key={depot.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <h3 className="font-medium text-gray-900 mb-4">
                    {depot.name} {depot.isPrimary && "(Primary)"}
                  </h3>
                  <div className="space-y-3">
                    {service.fleetTemplates.map((template) => (
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
                            {template.seats} seats •{" "}
                            {template.transmissionType === "automatic"
                              ? "Automatic"
                              : "Manual"}
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <label className="text-sm text-gray-700">
                            Quantity:
                          </label>
                          {isEditing ? (
                            <input
                              type="number"
                              min="0"
                              value={getAssignedQuantity(depot.id, template.id)}
                              onChange={(e) =>
                                assignInventoryToDepot(
                                  depot.id,
                                  template.id,
                                  parseInt(e.target.value) || 0
                                )
                              }
                              className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-primary"
                            />
                          ) : (
                            <span className="text-gray-900">
                              {getAssignedQuantity(depot.id, template.id)}
                            </span>
                          )}
                          {isEditing &&
                            getAssignedQuantity(depot.id, template.id) > 0 && (
                              <button
                                type="button"
                                onClick={() =>
                                  removeInventoryAssignment(
                                    depot.id,
                                    template.id
                                  )
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
        )}

        {activeTab === "policies" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800">
              Service Policies
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business License
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={service.businessLicense}
                    onChange={(e) =>
                      setService((prev) => ({
                        ...prev,
                        businessLicense: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                ) : (
                  <p className="text-gray-900">{service.businessLicense}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Insurance Policy
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={service.insurancePolicy}
                    onChange={(e) =>
                      setService((prev) => ({
                        ...prev,
                        insurancePolicy: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                ) : (
                  <p className="text-gray-900">{service.insurancePolicy}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Operating Hours
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={service.operatingHours}
                    onChange={(e) =>
                      setService((prev) => ({
                        ...prev,
                        operatingHours: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                ) : (
                  <p className="text-gray-900">{service.operatingHours}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pickup Locations
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={service.pickupLocations}
                    onChange={(e) =>
                      setService((prev) => ({
                        ...prev,
                        pickupLocations: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                ) : (
                  <p className="text-gray-900">{service.pickupLocations}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Available
                </label>
                {isEditing ? (
                  <select
                    value={service.deliveryAvailable ? "true" : "false"}
                    onChange={(e) =>
                      setService((prev) => ({
                        ...prev,
                        deliveryAvailable: e.target.value === "true",
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                ) : (
                  <p className="text-gray-900">
                    {service.deliveryAvailable ? "Yes" : "No"}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PartnerCarRentalDetails;
