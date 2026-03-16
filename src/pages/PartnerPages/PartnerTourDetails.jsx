import React, { useState, useEffect } from "react";
import {
  Info,
  MapPin,
  Clock,
  List,
  DollarSign,
  Camera,
  Calendar,
  Pencil,
  Trash2,
  Plus,
  Save,
  X,
  ToggleLeft,
  Users,
  ToggleRight,
  CheckCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const PartnerTourDetails = () => {
  const { tourId } = useParams();
  const navigate = useNavigate();

  const [tour, setTour] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data — replace with API call
  useEffect(() => {
    const mockTour = {
      tourId: tourId || "tour-001",
      serviceId: "service-tour-123",
      tourType: "cultural",
      tourTitle: "Tour Ẩm Thực Phố Cổ Hà Nội",
      shortDescription:
        "Khám phá tinh hoa ẩm thực Hà Nội qua 5 món ăn đặc sắc.",
      durationHours: 4,
      difficultyLevel: "easy",
      locationName: "Nhà hát Lớn Hà Nội",
      address: "Số 1 Tràng Tiền",
      city: "Hà Nội",
      district: "Hoàn Kiếm",
      meetingPoint: "Cổng chính, cạnh tượng đài",
      minParticipants: 2,
      maxParticipants: 10,
      ageRestrictions: "Phù hợp cho trẻ em từ 6 tuổi trở lên",
      includes: ["Vé vào cửa", "Nước uống", "Bữa ăn nhẹ"],
      excludes: ["Tiền tip", "Đồ uống có cồn"],
      whatToBring: "Kem chống nắng, mũ, máy ảnh",
      pricePerAdult: 500000,
      pricePerChild: 300000,
      pricePerInfant: 0,
      cancellationPolicy: "flexible",
      images: [
        "https://via.placeholder.com/300x200?text=Tour+Food+1",
        "https://via.placeholder.com/300x200?text=Tour+Food+2",
        "https://via.placeholder.com/300x200?text=Tour+Food+3",
      ],
      itinerary: [
        {
          id: 1,
          location: "Chợ Đồng Xuân",
          activity: "Thưởng thức phở truyền thống",
          durationMinutes: 45,
          description: "Khởi đầu tour với bát phở nóng hổi tại quán lâu đời.",
        },
        {
          id: 2,
          location: "Phố Hàng Buồm",
          activity: "Ăn bánh cuốn và uống cà phê trứng",
          durationMinutes: 60,
          description: "Trải nghiệm ẩm thực đường phố đặc sắc.",
        },
        {
          id: 3,
          location: "Hồ Hoàn Kiếm",
          activity: "Dạo bộ và ăn kem Tràng Tiền",
          durationMinutes: 30,
          description: "Giải nhiệt với kem Tràng Tiền bên hồ.",
        },
      ],
      schedules: [
        {
          id: 1,
          dayOfWeek: "Tuesday",
          startTime: "09:00",
          endTime: "13:00",
          availableSlots: 8,
          guideName: "Nguyen Van A",
          bookedSlots: 2,
        },
        {
          id: 2,
          dayOfWeek: "Thursday",
          startTime: "14:00",
          endTime: "18:00",
          availableSlots: 10,
          guideName: "Tran Thi B",
          bookedSlots: 0,
        },
      ],
      isActive: true,
    };
    setTour(mockTour);
  }, [tourId]);

  if (!tour) {
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
    alert("Tour saved successfully!");
    setIsEditing(false);
  };

  const handleToggleActive = () => {
    setTour((prev) => (prev ? { ...prev, isActive: !prev.isActive } : null));
    alert(`Tour ${tour.isActive ? "deactivated" : "activated"}!`);
  };

  // Itinerary Management
  const addItineraryStep = () => {
    const newId = Math.max(...tour.itinerary.map((i) => i.id), 0) + 1;
    setTour((prev) => ({
      ...prev,
      itinerary: [
        ...prev.itinerary,
        {
          id: newId,
          location: "",
          activity: "",
          durationMinutes: 30,
          description: "",
        },
      ],
    }));
  };

  const updateItineraryStep = (id, field, value) => {
    setTour((prev) => ({
      ...prev,
      itinerary: prev.itinerary.map((step) =>
        step.id === id ? { ...step, [field]: value } : step
      ),
    }));
  };

  const removeItineraryStep = (id) => {
    if (window.confirm("Are you sure you want to delete this step?")) {
      setTour((prev) => ({
        ...prev,
        itinerary: prev.itinerary.filter((step) => step.id !== id),
      }));
    }
  };

  // Schedule Management
  const addSchedule = () => {
    const newId = Math.max(...tour.schedules.map((s) => s.id), 0) + 1;
    setTour((prev) => ({
      ...prev,
      schedules: [
        ...prev.schedules,
        {
          id: newId,
          dayOfWeek: "Monday",
          startTime: "09:00",
          endTime: "13:00",
          availableSlots: 10,
          guideName: "",
          bookedSlots: 0,
        },
      ],
    }));
  };

  const updateSchedule = (id, field, value) => {
    setTour((prev) => ({
      ...prev,
      schedules: prev.schedules.map((sched) => {
        if (sched.id !== id) return sched;
        if (field === "startTime") {
          const [h, m] = value.split(":").map(Number);
          const startMinutes = h * 60 + m;
          const durationMinutes = prev.durationHours * 60;
          const endMinutes = (startMinutes + durationMinutes) % (24 * 60);
          const endHour = Math.floor(endMinutes / 60)
            .toString()
            .padStart(2, "0");
          const endMin = (endMinutes % 60).toString().padStart(2, "0");
          return {
            ...sched,
            startTime: value,
            endTime: `${endHour}:${endMin}`,
          };
        }
        return { ...sched, [field]: value };
      }),
    }));
  };

  const removeSchedule = (id) => {
    const schedule = tour.schedules.find((s) => s.id === id);
    if (schedule && schedule.bookedSlots > 0) {
      alert("Cannot delete schedule with existing bookings.");
      return;
    }
    if (window.confirm("Are you sure you want to delete this schedule?")) {
      setTour((prev) => ({
        ...prev,
        schedules: prev.schedules.filter((sched) => sched.id !== id),
      }));
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{tour.tourTitle}</h1>
          <p className="text-gray-600 mt-1">
            {tour.locationName}, {tour.city}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0">
          <button
            onClick={toggleEditMode}
            className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          >
            <Pencil className="w-4 h-4 mr-2" />
            {isEditing ? "Cancel Edit" : "Edit Tour"}
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
              tour.isActive
                ? "bg-red-100 text-red-700 hover:bg-red-200"
                : "bg-green-100 text-green-700 hover:bg-green-200"
            }`}
          >
            {tour.isActive ? (
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
            tour.isActive
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {tour.isActive ? "ACTIVE" : "INACTIVE"}
        </span>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: "overview", label: "Overview", icon: Info },
            { id: "itinerary", label: "Itinerary", icon: List },
            { id: "schedule", label: "Schedule", icon: Calendar },
            { id: "pricing", label: "Pricing & Policies", icon: DollarSign },
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
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Basic Info */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Info className="w-5 h-5 mr-2" />
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tour Title
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={tour.tourTitle}
                      onChange={(e) =>
                        setTour((prev) => ({
                          ...prev,
                          tourTitle: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  ) : (
                    <p className="text-gray-900">{tour.tourTitle}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Short Description
                  </label>
                  {isEditing ? (
                    <textarea
                      value={tour.shortDescription}
                      onChange={(e) =>
                        setTour((prev) => ({
                          ...prev,
                          shortDescription: e.target.value,
                        }))
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  ) : (
                    <p className="text-gray-900">{tour.shortDescription}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (Hours)
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={tour.durationHours}
                      onChange={(e) =>
                        setTour((prev) => ({
                          ...prev,
                          durationHours: parseInt(e.target.value) || 1,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      min="1"
                      max="24"
                    />
                  ) : (
                    <p className="text-gray-900">{tour.durationHours} hours</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Difficulty Level
                  </label>
                  {isEditing ? (
                    <select
                      value={tour.difficultyLevel}
                      onChange={(e) =>
                        setTour((prev) => ({
                          ...prev,
                          difficultyLevel: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="easy">Easy</option>
                      <option value="moderate">Moderate</option>
                      <option value="difficult">Difficult</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">
                      {tour.difficultyLevel === "easy"
                        ? "Easy"
                        : tour.difficultyLevel === "moderate"
                        ? "Moderate"
                        : "Difficult"}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Location */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Location & Meeting Point
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={tour.locationName}
                      onChange={(e) =>
                        setTour((prev) => ({
                          ...prev,
                          locationName: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  ) : (
                    <p className="text-gray-900">{tour.locationName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={tour.address}
                      onChange={(e) =>
                        setTour((prev) => ({
                          ...prev,
                          address: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  ) : (
                    <p className="text-gray-900">{tour.address}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={tour.city}
                      onChange={(e) =>
                        setTour((prev) => ({ ...prev, city: e.target.value }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  ) : (
                    <p className="text-gray-900">{tour.city}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    District
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={tour.district}
                      onChange={(e) =>
                        setTour((prev) => ({
                          ...prev,
                          district: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  ) : (
                    <p className="text-gray-900">{tour.district}</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meeting Point Details
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={tour.meetingPoint}
                      onChange={(e) =>
                        setTour((prev) => ({
                          ...prev,
                          meetingPoint: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  ) : (
                    <p className="text-gray-900">{tour.meetingPoint}</p>
                  )}
                </div>
              </div>
            </section>

            {/* Group Size */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Group Size & Age Restrictions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min Participants
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={tour.minParticipants}
                      onChange={(e) =>
                        setTour((prev) => ({
                          ...prev,
                          minParticipants: parseInt(e.target.value) || 1,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      min="1"
                    />
                  ) : (
                    <p className="text-gray-900">{tour.minParticipants}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Participants
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={tour.maxParticipants}
                      onChange={(e) =>
                        setTour((prev) => ({
                          ...prev,
                          maxParticipants: parseInt(e.target.value) || 1,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      min="1"
                    />
                  ) : (
                    <p className="text-gray-900">{tour.maxParticipants}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Age Restrictions
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={tour.ageRestrictions}
                      onChange={(e) =>
                        setTour((prev) => ({
                          ...prev,
                          ageRestrictions: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  ) : (
                    <p className="text-gray-900">
                      {tour.ageRestrictions || "No restrictions"}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Photos */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Camera className="w-5 h-5 mr-2" />
                Photos
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {tour.images.map((img, index) => (
                  <div key={index} className="relative">
                    <img
                      src={img}
                      alt={`Tour ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    {isEditing && (
                      <button
                        onClick={() => {
                          const newImages = [...tour.images];
                          newImages.splice(index, 1);
                          setTour((prev) => ({ ...prev, images: newImages }));
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
                {isEditing && (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center h-32">
                    <button className="text-primary text-sm">
                      + Add Photo
                    </button>
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

        {activeTab === "itinerary" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">
                Itinerary Steps
              </h2>
              {isEditing && (
                <button
                  onClick={addItineraryStep}
                  className="flex items-center px-3 py-1 bg-primary text-white text-sm rounded hover:bg-primary-hover"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Step
                </button>
              )}
            </div>

            {tour.itinerary.map((step) => (
              <div
                key={step.id}
                className="border border-gray-200 rounded-lg p-4 bg-white"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-medium text-gray-900">
                    Step {step.id}: {step.location || "Untitled"}
                  </h3>
                  {isEditing && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => removeItineraryStep(step.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={step.location}
                        onChange={(e) =>
                          updateItineraryStep(
                            step.id,
                            "location",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    ) : (
                      <p className="text-gray-900">{step.location}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Activity
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={step.activity}
                        onChange={(e) =>
                          updateItineraryStep(
                            step.id,
                            "activity",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    ) : (
                      <p className="text-gray-900">{step.activity}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration (Minutes)
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={step.durationMinutes}
                        onChange={(e) =>
                          updateItineraryStep(
                            step.id,
                            "durationMinutes",
                            parseInt(e.target.value) || 1
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        min="1"
                      />
                    ) : (
                      <p className="text-gray-900">
                        {step.durationMinutes} minutes
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  {isEditing ? (
                    <textarea
                      value={step.description}
                      onChange={(e) =>
                        updateItineraryStep(
                          step.id,
                          "description",
                          e.target.value
                        )
                      }
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  ) : (
                    <p className="text-gray-900">{step.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "schedule" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">
                Tour Schedules
              </h2>
              {isEditing && (
                <button
                  onClick={addSchedule}
                  className="flex items-center px-3 py-1 bg-primary text-white text-sm rounded hover:bg-primary-hover"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Schedule
                </button>
              )}
            </div>

            {tour.schedules.map((sched) => (
              <div
                key={sched.id}
                className="border border-gray-200 rounded-lg p-4 bg-white"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-medium text-gray-900">
                    {sched.dayOfWeek} | {sched.startTime} - {sched.endTime}
                  </h3>
                  {isEditing && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => removeSchedule(sched.id)}
                        className={`text-red-500 hover:text-red-700 ${
                          sched.bookedSlots > 0
                            ? "cursor-not-allowed opacity-50"
                            : ""
                        }`}
                        disabled={sched.bookedSlots > 0}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Day of Week
                    </label>
                    {isEditing ? (
                      <select
                        value={sched.dayOfWeek}
                        onChange={(e) =>
                          updateSchedule(sched.id, "dayOfWeek", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        {[
                          "Monday",
                          "Tuesday",
                          "Wednesday",
                          "Thursday",
                          "Friday",
                          "Saturday",
                          "Sunday",
                        ].map((day) => (
                          <option key={day} value={day}>
                            {day === "Monday"
                              ? "Thứ Hai"
                              : day === "Tuesday"
                              ? "Thứ Ba"
                              : day === "Wednesday"
                              ? "Thứ Tư"
                              : day === "Thursday"
                              ? "Thứ Năm"
                              : day === "Friday"
                              ? "Thứ Sáu"
                              : day === "Saturday"
                              ? "Thứ Bảy"
                              : "Chủ Nhật"}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-gray-900">{sched.dayOfWeek}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Time
                    </label>
                    {isEditing ? (
                      <input
                        type="time"
                        value={sched.startTime}
                        onChange={(e) =>
                          updateSchedule(sched.id, "startTime", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    ) : (
                      <p className="text-gray-900">{sched.startTime}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Available Slots
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={sched.availableSlots}
                        onChange={(e) =>
                          updateSchedule(
                            sched.id,
                            "availableSlots",
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        min="1"
                      />
                    ) : (
                      <p className="text-gray-900">
                        {sched.availableSlots - sched.bookedSlots} /{" "}
                        {sched.availableSlots} slots available
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Guide Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={sched.guideName}
                        onChange={(e) =>
                          updateSchedule(sched.id, "guideName", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    ) : (
                      <p className="text-gray-900">{sched.guideName}</p>
                    )}
                  </div>
                </div>

                {sched.bookedSlots > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-yellow-800 text-sm">
                      ⚠️ This schedule has {sched.bookedSlots} confirmed
                      booking(s). Some edits may be restricted.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === "pricing" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Pricing & Policies
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price per Adult (VND)
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    value={tour.pricePerAdult}
                    onChange={(e) =>
                      setTour((prev) => ({
                        ...prev,
                        pricePerAdult: parseInt(e.target.value) || 0,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                ) : (
                  <p className="text-gray-900">
                    {tour.pricePerAdult.toLocaleString()}₫
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price per Child (VND)
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    value={tour.pricePerChild}
                    onChange={(e) =>
                      setTour((prev) => ({
                        ...prev,
                        pricePerChild: parseInt(e.target.value) || 0,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                ) : (
                  <p className="text-gray-900">
                    {tour.pricePerChild.toLocaleString()}₫
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price per Infant (VND)
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    value={tour.pricePerInfant}
                    onChange={(e) =>
                      setTour((prev) => ({
                        ...prev,
                        pricePerInfant: parseInt(e.target.value) || 0,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                ) : (
                  <p className="text-gray-900">
                    {tour.pricePerInfant.toLocaleString()}₫
                  </p>
                )}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cancellation Policy
              </label>
              {isEditing ? (
                <select
                  value={tour.cancellationPolicy}
                  onChange={(e) =>
                    setTour((prev) => ({
                      ...prev,
                      cancellationPolicy: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="flexible">
                    Linh hoạt - Hoàn 100% nếu hủy trước 24h
                  </option>
                  <option value="moderate">
                    Vừa phải - Hoàn 50% nếu hủy trước 72h
                  </option>
                  <option value="strict">Không hoàn tiền</option>
                </select>
              ) : (
                <p className="text-gray-900">
                  {tour.cancellationPolicy === "flexible"
                    ? "Linh hoạt - Hoàn 100% nếu hủy trước 24h"
                    : tour.cancellationPolicy === "moderate"
                    ? "Vừa phải - Hoàn 50% nếu hủy trước 72h"
                    : "Không hoàn tiền"}
                </p>
              )}
            </div>

            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-3">Includes</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {[
                  "Vé vào cửa",
                  "Nước uống",
                  "Bữa ăn nhẹ",
                  "Phương tiện di chuyển",
                  "Bảo hiểm du lịch",
                ].map((item) => (
                  <div
                    key={item}
                    className={`p-2 text-xs border rounded cursor-pointer ${
                      isEditing ? "hover:bg-gray-50" : "cursor-default"
                    } ${
                      tour.includes.includes(item)
                        ? "border-primary bg-[#e6f7f9] text-primary"
                        : "border-gray-200 text-gray-700"
                    }`}
                    onClick={
                      isEditing
                        ? () => {
                            const newIncludes = tour.includes.includes(item)
                              ? tour.includes.filter((a) => a !== item)
                              : [...tour.includes, item];
                            setTour((prev) => ({
                              ...prev,
                              includes: newIncludes,
                            }));
                          }
                        : undefined
                    }
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-3">Excludes</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {[
                  "Tiền tip",
                  "Chi phí cá nhân",
                  "Đồ uống có cồn",
                  "Chi phí phát sinh",
                ].map((item) => (
                  <div
                    key={item}
                    className={`p-2 text-xs border rounded cursor-pointer ${
                      isEditing ? "hover:bg-gray-50" : "cursor-default"
                    } ${
                      tour.excludes.includes(item)
                        ? "border-primary bg-[#e6f7f9] text-primary"
                        : "border-gray-200 text-gray-700"
                    }`}
                    onClick={
                      isEditing
                        ? () => {
                            const newExcludes = tour.excludes.includes(item)
                              ? tour.excludes.filter((a) => a !== item)
                              : [...tour.excludes, item];
                            setTour((prev) => ({
                              ...prev,
                              excludes: newExcludes,
                            }));
                          }
                        : undefined
                    }
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                What to Bring
              </label>
              {isEditing ? (
                <textarea
                  value={tour.whatToBring}
                  onChange={(e) =>
                    setTour((prev) => ({
                      ...prev,
                      whatToBring: e.target.value,
                    }))
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              ) : (
                <p className="text-gray-900">{tour.whatToBring}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PartnerTourDetails;
