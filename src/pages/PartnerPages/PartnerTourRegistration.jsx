import React, { useState } from "react";
import {
  MapPin,
  Users,
  DollarSign,
  Camera,
  FileText,
  Clock,
  List,
  Calendar,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Info,
  Plus,
  Minus,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const PartnerTourRegistration = () => {
  const [guides] = useState([
    {
      guideId: "G001",
      name: "Nguyen Van A",
      email: "nguyen.a@example.com",
      bio: "Local historian with 5 years guiding cultural tours in Hanoi.",
      languages: ["Vietnamese", "English"],
      availability: ["Monday", "Wednesday", "Friday"],
    },
    {
      guideId: "G002",
      name: "Tran Thi B",
      email: "tran.b@example.com",
      bio: "Adventure guide specializing in trekking and outdoor activities.",
      languages: ["Vietnamese", "English", "French"],
      availability: ["Tuesday", "Thursday", "Saturday"],
    },
    {
      guideId: "G003",
      name: "Le Van C",
      email: "le.c@example.com",
      bio: "Food tour expert with a passion for Vietnamese cuisine.",
      languages: ["Vietnamese", "English"],
      availability: ["Monday", "Tuesday", "Sunday"],
    },
  ]);

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1
    tourType: "cultural",
    tourTitle: "",
    shortDescription: "",
    durationHours: 4,
    difficultyLevel: "moderate",
    // Step 2
    locationName: "",
    address: "",
    city: "",
    district: "",
    meetingPoint: "",
    // Step 3
    minParticipants: 2,
    maxParticipants: 10,
    // Step 4
    includes: [],
    excludes: [],
    whatToBring: "",
    // Step 5
    pricePerAdult: "",
    pricePerChild: "",
    pricePerInfant: "0",
    cancellationPolicy: "flexible",
    // Step 6
    images: [],
    // Step 7 - Itinerary
    itinerary: [
      {
        id: 1,
        location: "",
        activity: "",
        durationMinutes: 30,
        description:
          "",
      },
    ],
    // Step 8 - Schedule
    schedules: [
      {
        id: 1,
        dayOfWeek: "Tuesday",
        startTime: "09:00",
        endTime: "13:00",
        availableSlots: 10,
        guideName: "Nguyen Van A",
      },
    ],
  });
  const navigate = useNavigate();

  const steps = [
    { id: 1, title: "Loại & Thông tin", icon: Info },
    { id: 2, title: "Vị trí", icon: MapPin },
    { id: 3, title: "Quy mô & Độ khó", icon: Users },
    { id: 4, title: "Bao gồm", icon: List },
    { id: 5, title: "Giá cả", icon: DollarSign },
    { id: 6, title: "Hình ảnh", icon: Camera },
    { id: 7, title: "Hoạt động", icon: Clock },
    { id: 8, title: "Lịch trình", icon: Calendar },
    { id: 9, title: "Xem lại & Đăng", icon: CheckCircle },
  ];

  const updateFormData = (field, value) => {
    if (field === "ageRestrictions" && value.length > 100) {
      value = value.slice(0, 100);
    }

    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    // Case 1 validations
    if (currentStep === 1) {
      if (!formData.tourTitle.trim()) {
        alert("Vui lòng nhập tên tour!");
        return;
      }
      if (!formData.shortDescription.trim()) {
        alert("Vui lòng nhập mô tả ngắn!");
        return;
      }
      if (formData.tourTitle.length > 100) {
        alert("Tên tour không được vượt quá 100 ký tự!");
        return;
      }
      if (formData.shortDescription.length > 200) {
        alert("Mô tả ngắn không được vượt quá 200 ký tự!");
        return;
      }
      if (formData.durationHours > 24) {
        alert("Thời lượng tour không được vượt quá 24 giờ!");
        return;
      }
    }

    // Case 2 validations
    if (currentStep === 2) {
      const requiredFields = [
        "locationName",
        "address",
        "city",
        "district",
        "meetingPoint",
      ];
      for (const field of requiredFields) {
        if (!formData[field].trim()) {
          alert(
            `Vui lòng nhập ${
              field === "locationName"
                ? "tên địa điểm gặp mặt"
                : field === "address"
                ? "địa chỉ"
                : field === "city"
                ? "thành phố"
                : field === "district"
                ? "quận/huyện"
                : "điểm gặp cụ thể"
            }!`
          );
          return;
        }
        if (
          formData[field].length >
          (field === "address" ? 200 : field === "meetingPoint" ? 150 : 50)
        ) {
          alert(
            `Trường ${
              field === "locationName"
                ? "tên địa điểm gặp mặt"
                : field === "address"
                ? "địa chỉ"
                : field === "city"
                ? "thành phố"
                : field === "district"
                ? "quận/huyện"
                : "điểm gặp cụ thể"
            } không được vượt quá ${
              field === "address" ? 200 : field === "meetingPoint" ? 150 : 50
            } ký tự!`
          );
          if (formData.minParticipants < 2) {
            alert("Số lượng khách phải lớn hơn hoặc bằng 2!");
            return;
          }
          if (formData.maxParticipants > 50) {
            alert("Số lượng khách tối đa không được vượt quá 50!");
            return;
          }
          if (formData.minParticipants > formData.maxParticipants) {
            alert("Số lượng tối thiểu không được lớn hơn số lượng tối đa!");
            return;
          }
          return;
        }
      }
    }

    // Case 4 validations
    if (currentStep === 4) {
      if (formData.includes.length === 0) {
        alert("Vui lòng chọn ít nhất một mục trong danh sách bao gồm!");
        return;
      }
      if (formData.whatToBring && formData.whatToBring.length > 200) {
        alert("Mô tả 'Khách nên mang theo gì' không được vượt quá 200 ký tự!");
        return;
      }
    }

    // Case 5 validations
    if (currentStep === 5) {
      const adult = parseInt(formData.pricePerAdult) || 0;
      const child = parseInt(formData.pricePerChild) || 0;
      const infant = parseInt(formData.pricePerInfant) || 0;

      if (adult <= 0) {
        alert("Vui lòng nhập giá người lớn hợp lệ!");
        return;
      }
      if (adult > 10000000) {
        alert("Giá người lớn không được vượt quá 10,000,000₫!");
        return;
      }
      if (child < 0 || child > 10000000) {
        alert("Giá trẻ em không hợp lệ!");
        return;
      }
      if (child >= adult) {
        alert("Giá trẻ em không được cao hơn hoặc bằng giá người lớn!");
        return;
      }
      if (infant < 0 || infant > 10000000) {
        alert("Giá trẻ sơ sinh không hợp lệ!");
        return;
      }
      if (infant >= adult || (child && infant >= child)) {
        alert(
          "Giá trẻ sơ sinh không được cao hơn hoặc bằng giá người lớn hoặc trẻ em!"
        );
        return;
      }
    }

    // Case 6 validations
    if (currentStep === 6) {
      if (formData.images.length < 3) {
        alert("Vui lòng tải lên ít nhất 3 ảnh!");
        return;
      }
    }

    // Case 7 validations
    if (currentStep === 7) {
      if (formData.itinerary.length < 2) {
        alert("Vui lòng thêm ít nhất 2 bước trong lịch trình!");
        return;
      }
      for (const step of formData.itinerary) {
        if (!step.location.trim() || !step.activity.trim()) {
          alert("Tất cả các bước phải có địa điểm và hoạt động!");
          return;
        }
      }

      const seen = new Set();
      for (const step of formData.itinerary) {
        const key =
          step.location.trim().toLowerCase() +
          "|" +
          step.activity.trim().toLowerCase();
        if (seen.has(key)) {
          alert("Có bước trùng lặp địa điểm và hoạt động trong lịch trình!");
          return;
        }
        seen.add(key);
      }

      const totalItineraryMinutes = getTotalItineraryMinutes();
      const totalTourMinutes = formData.durationHours * 60;
      if (totalItineraryMinutes <= totalTourMinutes * 0.8) {
        alert(
          `Hoạt động chỉ sử dụng ${totalItineraryMinutes} phút, nhưng tour yêu cầu đúng ${totalTourMinutes} phút! Vui lòng thêm hoặc điều chỉnh các bước.`
        );

        return;
      }
    }

    // Case 8 validations
    if (currentStep === 8) {
      if (formData.schedules.length === 0) {
        alert("Vui lòng thêm ít nhất một lịch trình!");
        return;
      }
      for (const sched of formData.schedules) {
        if (!sched.guideName.trim()) {
          alert("Tất cả các ca phải có tên hướng dẫn viên!");
          return;
        }
        const guide = guides.find((g) => g.name === sched.guideName);
        if (!guide || !guide.availability.includes(sched.dayOfWeek)) {
          alert(
            `Hướng dẫn viên ${sched.guideName} không trống vào ${sched.dayOfWeek}!`
          );
          return;
        }
        const start = new Date(`2000-01-01T${sched.startTime}`);
        const end = new Date(`2000-01-01T${sched.endTime}`);
        const diffMinutes = (end - start) / (1000 * 60);
        if (diffMinutes <= 0) {
          alert("Giờ kết thúc phải sau giờ bắt đầu!");
          return;
        }
        if (diffMinutes !== formData.durationHours * 60) {
          alert(`Thời lượng ca phải bằng ${formData.durationHours} giờ!`);
          return;
        }
        if (sched.availableSlots > formData.maxParticipants) {
          alert("Số chỗ trống không được vượt quá số lượng khách tối đa!");
          return;
        }
      }

      // Define buffer time (1 hour = 60 minutes)
      const BUFFER_MINUTES = 60;

      // Check for overlapping schedules (with buffer) for the same guide on the same day
      for (let i = 0; i < formData.schedules.length; i++) {
        for (let j = i + 1; j < formData.schedules.length; j++) {
          const schedA = formData.schedules[i];
          const schedB = formData.schedules[j];

          // Only check if it's the same day and same guide
          if (
            schedA.dayOfWeek === schedB.dayOfWeek &&
            schedA.guideName.trim().toLowerCase() ===
              schedB.guideName.trim().toLowerCase()
          ) {
            const startA = new Date(`2000-01-01T${schedA.startTime}`);
            const endA = new Date(`2000-01-01T${schedA.endTime}`);
            const startB = new Date(`2000-01-01T${schedB.startTime}`);
            const endB = new Date(`2000-01-01T${schedB.endTime}`);

            // Add buffer to end time of schedA and subtract buffer from start time of schedB for comparison
            const endAWithBuffer = new Date(
              endA.getTime() + BUFFER_MINUTES * 60 * 1000
            );

            const endBWithBuffer = new Date(
              endB.getTime() + BUFFER_MINUTES * 60 * 1000
            );

            const schedulesOverlapWithBuffer =
              startA < endBWithBuffer && startB < endAWithBuffer;

            if (schedulesOverlapWithBuffer) {
              alert(
                `Hướng dẫn viên "${schedA.guideName}" cần ít nhất ${BUFFER_MINUTES} phút nghỉ giữa các ca. Lịch ${schedA.dayOfWeek}: ${schedA.startTime}-${schedA.endTime} và ${schedB.startTime}-${schedB.endTime} quá sát nhau!`
              );
              return;
            }
          }
        }
      }

      // Check for exact duplicates (optional, but good to keep)
      const seenSchedules = new Set();
      for (const sched of formData.schedules) {
        const key =
          sched.dayOfWeek +
          "|" +
          sched.startTime +
          "|" +
          sched.guideName.trim().toLowerCase();
        if (seenSchedules.has(key)) {
          alert("Có ca bị trùng trong lịch trình!");
          return;
        }
        seenSchedules.add(key);
      }
    }

    if (currentStep < 9) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => {
      const validTypes = ["image/png", "image/jpeg", "image/gif"];
      if (!validTypes.includes(file.type)) {
        alert(`Tệp ${file.name} không phải định dạng PNG, JPG hoặc GIF!`);
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert(`Tệp ${file.name} vượt quá giới hạn 10MB!`);
        return false;
      }
      return true;
    });
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...validFiles],
    }));
  };

  const toggleInclude = (item) => {
    if (formData.excludes.includes(item)) {
      alert(
        `Không thể thêm "${item}" vào danh sách bao gồm vì nó đã có trong danh sách không bao gồm!`
      );
      return;
    }
    setFormData((prev) => ({
      ...prev,
      includes: prev.includes.includes(item)
        ? prev.includes.filter((a) => a !== item)
        : [...prev.includes, item],
    }));
  };

  const toggleExclude = (item) => {
    if (formData.includes.includes(item)) {
      alert(
        `Không thể thêm "${item}" vào danh sách không bao gồm vì nó đã có trong danh sách bao gồm!`
      );
      return;
    }
    setFormData((prev) => ({
      ...prev,
      excludes: prev.excludes.includes(item)
        ? prev.excludes.filter((a) => a !== item)
        : [...prev.excludes, item],
    }));
  };

  // Itinerary Management
  const addItineraryStep = () => {
    const remainingMinutes = getRemainingMinutes();
    if (remainingMinutes < 15) {
      // Minimum 15 minutes per step
      alert("Không thể thêm bước mới! Thời lượng tour đã gần đầy.");
      return;
    }

    const newId = Math.max(...formData.itinerary.map((i) => i.id), 0) + 1;
    setFormData((prev) => ({
      ...prev,
      itinerary: [
        ...prev.itinerary,
        {
          id: newId,
          location: "",
          activity: "",
          durationMinutes: Math.min(60, remainingMinutes), // Default to min(60, remaining)
          description: "",
        },
      ],
    }));
  };

  const updateItineraryStep = (id, field, value) => {
    if (field === "durationMinutes") {
      const newValue = parseInt(value) || 0;
      const totalTourMinutes = formData.durationHours * 60;
      const currentTotalWithoutThisStep = formData.itinerary
        .filter((step) => step.id !== id)
        .reduce(
          (total, step) => total + (parseInt(step.durationMinutes) || 0),
          0
        );

      if (currentTotalWithoutThisStep + newValue > totalTourMinutes) {
        // still okay to warn user here, but don’t block typing
        return;
      }
    }

    if (field === "description" && value.length > 500) {
      value = value.slice(0, 500); // truncate instead of blocking
    }

    setFormData((prev) => ({
      ...prev,
      itinerary: prev.itinerary.map((step) =>
        step.id === id ? { ...step, [field]: value } : step
      ),
    }));
  };

  const removeItineraryStep = (id) => {
    setFormData((prev) => ({
      ...prev,
      itinerary: prev.itinerary.filter((step) => step.id !== id),
    }));
  };

  // Schedule Management
  const addSchedule = () => {
    const newId = Math.max(...formData.schedules.map((s) => s.id), 0) + 1;
    const newSchedule = {
      id: newId,
      dayOfWeek: "Monday",
      startTime: "09:00",
      endTime: "12:00",
      availableSlots: Math.min(10, formData.maxParticipants),
      guideName: "",
    };
    const isDuplicate = formData.schedules.some(
      (s) =>
        s.dayOfWeek === newSchedule.dayOfWeek &&
        s.startTime === newSchedule.startTime &&
        s.guideName === newSchedule.guideName
    );
    if (isDuplicate) {
      alert("Lịch trình này đã tồn tại!");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      schedules: [...prev.schedules, newSchedule],
    }));
  };

  const updateSchedule = (id, field, value) => {
    if (field === "guideName" && value) {
      const guide = guides.find((g) => g.name === value);
      if (!guide) {
        alert("Hướng dẫn viên không hợp lệ!");
        return;
      }
    }

    setFormData((prev) => ({
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

        if (field === "dayOfWeek") {
          const currentGuide = guides.find((g) => g.name === sched.guideName);
          if (currentGuide && !currentGuide.availability.includes(value)) {
            return { ...sched, [field]: value, guideName: "" }; // Reset guideName
          }
        }

        return { ...sched, [field]: value };
      }),
    }));
  };

  const removeSchedule = (id) => {
    setFormData((prev) => ({
      ...prev,
      schedules: prev.schedules.filter((sched) => sched.id !== id),
    }));
  };

  // Calculate total duration of itinerary in minutes
  const getTotalItineraryMinutes = () => {
    return formData.itinerary.reduce(
      (total, step) => total + (parseInt(step.durationMinutes) || 0),
      0
    );
  };

  // Check if itinerary exceeds total tour duration
  const isItineraryOverLimit = () => {
    const totalItineraryMinutes = getTotalItineraryMinutes();
    const totalTourMinutes = formData.durationHours * 60;
    return totalItineraryMinutes > totalTourMinutes;
  };

  // Get remaining time for itinerary
  const getRemainingMinutes = () => {
    const totalTourMinutes = formData.durationHours * 60;
    const totalItineraryMinutes = getTotalItineraryMinutes();
    return Math.max(0, totalTourMinutes - totalItineraryMinutes);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Bạn đang đăng loại tour nào?
            </h2>
            <p className="text-gray-600 mb-4">
              Chọn loại tour phù hợp nhất với trải nghiệm bạn cung cấp
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  value: "cultural",
                  label: "Văn hóa",
                  desc: "Tham quan di tích, bảo tàng, làng nghề",
                },
                {
                  value: "adventure",
                  label: "Mạo hiểm",
                  desc: "Leo núi, chèo thuyền, trekking",
                },
                {
                  value: "food",
                  label: "Ẩm thực",
                  desc: "Lớp học nấu ăn, tour ẩm thực đường phố",
                },
                {
                  value: "photography",
                  label: "Nhiếp ảnh",
                  desc: "Chụp ảnh phong cảnh, con người, kiến trúc",
                },
              ].map((type) => (
                <div
                  key={type.value}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    formData.tourType === type.value
                      ? "border-primary bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => updateFormData("tourType", type.value)}
                >
                  <h3 className="font-medium text-gray-900">{type.label}</h3>
                  <p className="text-sm text-gray-600 mt-1">{type.desc}</p>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên Tour *
              </label>
              <input
                type="text"
                value={formData.tourTitle}
                onChange={(e) => updateFormData("tourTitle", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-hover focus:border-primary"
                placeholder="Ví dụ: Tour Ẩm Thực Phố Cổ Hà Nội"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mô tả ngắn *
              </label>
              <textarea
                rows={3}
                value={formData.shortDescription}
                onChange={(e) =>
                  updateFormData("shortDescription", e.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-hover focus:border-primary"
                placeholder="Mô tả hấp dẫn trong 1-2 câu để thu hút khách hàng"
              />
            </div>

            <div className="text-center">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thời lượng (giờ)
              </label>
              <div className="flex items-center justify-center space-x-3">
                <button
                  onClick={() =>
                    updateFormData(
                      "durationHours",
                      Math.max(1, formData.durationHours - 1)
                    )
                  }
                  className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-xl font-semibold w-8 text-center">
                  {formData.durationHours}
                </span>
                <button
                  onClick={() =>
                    updateFormData(
                      "durationHours",
                      Math.min(24, formData.durationHours + 1)
                    )
                  }
                  className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Tour của bạn bắt đầu ở đâu?
            </h2>
            <p className="text-gray-600 mb-4">
              Cung cấp địa điểm gặp mặt và địa chỉ chi tiết
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên Địa Điểm Gặp Mặt *
                </label>
                <input
                  type="text"
                  value={formData.locationName}
                  onChange={(e) =>
                    updateFormData("locationName", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-hover focus:border-primary"
                  placeholder="Nhà hát Lớn Hà Nội"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ *
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => updateFormData("address", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-hover focus:border-primary"
                  placeholder="Số 1 Tràng Tiền"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thành phố *
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => updateFormData("city", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-hover focus:border-primary"
                    placeholder="Hà Nội"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quận/Huyện *
                  </label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => updateFormData("district", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-hover focus:border-primary"
                    placeholder="Hoàn Kiếm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Điểm Gặp Cụ Thể *
                </label>
                <input
                  type="text"
                  value={formData.meetingPoint}
                  onChange={(e) =>
                    updateFormData("meetingPoint", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-hover focus:border-primary"
                  placeholder="Cổng chính, cạnh tượng đài"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Quy mô nhóm và yêu cầu
            </h2>
            <p className="text-gray-600 mb-4">
              Số lượng khách tối thiểu/tối đa và yêu cầu độ tuổi
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tối thiểu
                </label>
                <div className="flex items-center justify-center space-x-3">
                  <button
                    onClick={() =>
                      updateFormData(
                        "minParticipants",
                        Math.max(1, formData.minParticipants - 1)
                      )
                    }
                    className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-xl font-semibold w-8 text-center">
                    {formData.minParticipants}
                  </span>
                  <button
                    onClick={() =>
                      updateFormData(
                        "minParticipants",
                        formData.minParticipants + 1
                      )
                    }
                    className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="text-center">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tối đa
                </label>
                <div className="flex items-center justify-center space-x-3">
                  <button
                    onClick={() =>
                      updateFormData(
                        "maxParticipants",
                        Math.max(1, formData.maxParticipants - 1)
                      )
                    }
                    className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-xl font-semibold w-8 text-center">
                    {formData.maxParticipants}
                  </span>
                  <button
                    onClick={() =>
                      updateFormData(
                        "maxParticipants",
                        formData.maxParticipants + 1
                      )
                    }
                    className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Yêu cầu độ tuổi (tuỳ chọn)
              </label>
              <input
                type="text"
                value={formData.ageRestrictions}
                onChange={(e) =>
                  updateFormData("ageRestrictions", e.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-hover focus:border-primary"
                placeholder="Ví dụ: Phù hợp cho trẻ em từ 6 tuổi trở lên"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Tour của bạn bao gồm những gì?
            </h2>
            <p className="text-gray-600 mb-4">
              Giúp khách hàng hiểu rõ họ sẽ nhận được gì
            </p>

            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-3">Bao gồm</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  "Vé vào cửa",
                  "Nước uống",
                  "Bữa ăn nhẹ",
                  "Phương tiện di chuyển",
                  "Bảo hiểm du lịch",
                ].map((item) => (
                  <div
                    key={item}
                    className={`p-3 border rounded cursor-pointer text-center text-sm ${
                      formData.includes.includes(item)
                        ? "border-primary bg-blue-50 text-primary"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => toggleInclude(item)}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-3">Không bao gồm</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  "Tiền tip",
                  "Chi phí cá nhân",
                  "Đồ uống có cồn",
                  "Chi phí phát sinh",
                ].map((item) => (
                  <div
                    key={item}
                    className={`p-3 border rounded cursor-pointer text-center text-sm ${
                      formData.excludes.includes(item)
                        ? "border-primary bg-blue-50 text-primary"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => toggleExclude(item)}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Khách nên mang theo gì?
              </label>
              <textarea
                rows={3}
                value={formData.whatToBring}
                onChange={(e) => updateFormData("whatToBring", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-hover focus:border-primary"
                placeholder="Ví dụ: Kem chống nắng, mũ, giày thể thao, máy ảnh..."
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Đặt giá tour</h2>
            <p className="text-gray-600 mb-4">
              Xác định giá cho từng nhóm đối tượng
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giá Người Lớn *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">₫</span>
                  <input
                    type="number"
                    value={formData.pricePerAdult}
                    onChange={(e) =>
                      updateFormData("pricePerAdult", e.target.value)
                    }
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-hover focus:border-primary"
                    placeholder="500000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giá Trẻ Em
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">₫</span>
                  <input
                    type="number"
                    value={formData.pricePerChild}
                    onChange={(e) =>
                      updateFormData("pricePerChild", e.target.value)
                    }
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-hover focus:border-primary"
                    placeholder="300000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giá Trẻ Sơ Sinh
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">₫</span>
                  <input
                    type="number"
                    value={formData.pricePerInfant}
                    onChange={(e) =>
                      updateFormData("pricePerInfant", e.target.value)
                    }
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-hover focus:border-primary"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chính sách hủy bỏ
              </label>
              <select
                value={formData.cancellationPolicy}
                onChange={(e) =>
                  updateFormData("cancellationPolicy", e.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-hover focus:border-primary"
              >
                <option value="flexible">
                  Linh hoạt - Hoàn 100% nếu hủy trước 24h
                </option>
                <option value="moderate">
                  Vừa phải - Hoàn 50% nếu hủy trước 72h
                </option>
                <option value="strict">Không hoàn tiền</option>
              </select>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Thêm ảnh về tour của bạn
            </h2>
            <p className="text-gray-600 mb-4">
              Hình ảnh chất lượng cao giúp tăng tỷ lệ đặt tour. Tải lên ít nhất
              3 ảnh.
            </p>

            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
              <div className="space-y-1 text-center">
                <Camera className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary">
                    <span>Tải lên tệp</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="sr-only"
                    />
                  </label>
                  <p className="pl-1">hoặc kéo và thả</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF tối đa 10MB
                </p>
              </div>
            </div>

            {formData.images.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-2">
                {formData.images.map((file, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Preview"
                      className="h-24 w-full object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newImages = [...formData.images];
                        newImages.splice(index, 1);
                        setFormData({ ...formData, images: newImages });
                      }}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Xây dựng lịch trình chi tiết
            </h2>
            <p className="text-gray-600 mb-4">
              Mô tả từng bước trong tour của bạn
            </p>

            <p className="text-sm mb-4">
              <span className="font-medium">
                Thời lượng tour: {formData.durationHours} giờ (
                {formData.durationHours * 60} phút)
              </span>
              <span
                className={`ml-2 px-2 py-1 rounded text-xs ${
                  isItineraryOverLimit()
                    ? "bg-red-100 text-red-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {isItineraryOverLimit()
                  ? `Vượt quá ${
                      getTotalItineraryMinutes() - formData.durationHours * 60
                    } phút!`
                  : `Đã sử dụng ${getTotalItineraryMinutes()} phút, còn lại ${getRemainingMinutes()} phút`}
              </span>
            </p>

            <div className="space-y-4">
              {formData.itinerary.map((step) => (
                <div
                  key={step.id}
                  className="p-4 border border-gray-200 rounded-lg space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-gray-900">
                      Bước {step.id}
                    </h4>
                    {formData.itinerary.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItineraryStep(step.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Địa điểm
                    </label>
                    <input
                      type="text"
                      value={step.location}
                      onChange={(e) =>
                        updateItineraryStep(step.id, "location", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary-hover"
                      placeholder="Ví dụ: Chợ Bến Thành"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Hoạt động
                    </label>
                    <input
                      type="text"
                      value={step.activity}
                      onChange={(e) =>
                        updateItineraryStep(step.id, "activity", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary-hover"
                      placeholder="Ví dụ: Tham quan và mua sắm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Thời lượng (phút){" "}
                        <span
                          className={`text-xs ${
                            getRemainingMinutes() < 30
                              ? "text-red-500"
                              : "text-gray-500"
                          }`}
                        >
                          (Còn lại: {getRemainingMinutes()} phút)
                        </span>
                      </label>
                      <input
                        type="number"
                        value={step.durationMinutes}
                        onChange={(e) =>
                          updateItineraryStep(
                            step.id,
                            "durationMinutes",
                            e.target.value
                          )
                        }
                        className={`w-full px-3 py-2 border rounded focus:ring-1 focus:ring-primary-hover ${
                          (parseInt(step.durationMinutes) || 0) >
                          getRemainingMinutes()
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300"
                        }`}
                        min="1"
                        max={getRemainingMinutes()}
                        placeholder="30"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Thứ tự
                      </label>
                      <input
                        type="number"
                        value={step.id}
                        disabled
                        className="w-full px-3 py-2 border border-gray-200 rounded bg-gray-50 text-gray-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Mô tả chi tiết
                    </label>
                    <textarea
                      rows={2}
                      value={step.description}
                      onChange={(e) =>
                        updateItineraryStep(
                          step.id,
                          "description",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary-hover"
                      placeholder="Mô tả chi tiết hoạt động tại địa điểm này..."
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addItineraryStep}
              className="mt-4 flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              Thêm bước mới
            </button>
          </div>
        );

      case 8:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Thiết lập lịch trình và khả dụng
            </h2>
            <p className="text-gray-600 mb-4">
              Tour của bạn chạy vào những ngày nào trong tuần? Chỉ các hướng dẫn
              viên có lịch trống vào ngày được chọn mới có thể được chọn.
            </p>

            <div className="space-y-4">
              {formData.schedules.map((sched) => (
                <div
                  key={sched.id}
                  className="p-4 border border-gray-200 rounded-lg space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-gray-900">Ca {sched.id}</h4>
                    {formData.schedules.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSchedule(sched.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Ngày trong tuần
                      </label>
                      <select
                        value={sched.dayOfWeek}
                        onChange={(e) =>
                          updateSchedule(sched.id, "dayOfWeek", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary-hover"
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
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Hướng dẫn viên *
                      </label>
                      <select
                        value={sched.guideName}
                        onChange={(e) =>
                          updateSchedule(sched.id, "guideName", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary-hover"
                      >
                        <option value="">Chọn hướng dẫn viên</option>
                        {guides.map((guide) => (
                          <option
                            key={guide.guideId}
                            value={guide.name}
                            disabled={
                              !guide.availability.includes(sched.dayOfWeek)
                            }
                            style={
                              !guide.availability.includes(sched.dayOfWeek)
                                ? { color: "gray" }
                                : {}
                            }
                          >
                            {guide.name} ({guide.guideId})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Giờ Bắt Đầu
                      </label>
                      <input
                        type="time"
                        value={sched.startTime}
                        onChange={(e) =>
                          updateSchedule(sched.id, "startTime", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary-hover"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Giờ Kết Thúc
                      </label>
                      <input
                        type="time"
                        value={sched.endTime}
                        disabled
                        className="w-full px-3 py-2 border border-gray-200 rounded bg-gray-50 text-gray-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Số chỗ trống
                    </label>
                    <input
                      type="number"
                      value={sched.availableSlots}
                      onChange={(e) =>
                        updateSchedule(
                          sched.id,
                          "availableSlots",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-primary-hover"
                      min="1"
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addSchedule}
              className="mt-4 flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              Thêm ca mới
            </button>
          </div>
        );

      case 9:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Xem lại tour của bạn
            </h2>
            <p className="text-gray-600 mb-4">
              Kiểm tra kỹ trước khi gửi đi phê duyệt
            </p>

            <div className="bg-gray-50 rounded-lg p-6 space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="font-medium text-gray-900 mb-2">
                  Thông tin cơ bản
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  <p>
                    <span className="font-medium">Tên Tour:</span>{" "}
                    {formData.tourTitle || "Chưa đặt"}
                  </p>
                  <p>
                    <span className="font-medium">Loại Tour:</span>{" "}
                    {formData.tourType}
                  </p>
                  <p>
                    <span className="font-medium">Thời lượng:</span>{" "}
                    {formData.durationHours} giờ
                  </p>
                </div>
              </div>

              {/* Location */}
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Vị trí</h3>
                <p className="text-sm">
                  <span className="font-medium">Điểm gặp:</span>{" "}
                  {formData.locationName}, {formData.address}, {formData.city},{" "}
                  {formData.district}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Chi tiết:</span>{" "}
                  {formData.meetingPoint}
                </p>
              </div>

              {/* Group Size */}
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Quy mô nhóm</h3>
                <p className="text-sm">
                  {formData.minParticipants} - {formData.maxParticipants} khách
                </p>
                {formData.ageRestrictions && (
                  <p className="text-sm">
                    <span className="font-medium">Yêu cầu tuổi:</span>{" "}
                    {formData.ageRestrictions}
                  </p>
                )}
              </div>

              {/* Pricing */}
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Giá cả</h3>
                <div className="text-sm">
                  <p>
                    Người lớn:{" "}
                    {parseInt(formData.pricePerAdult || 0).toLocaleString()}₫
                  </p>
                  {formData.pricePerChild && (
                    <p>
                      Trẻ em:{" "}
                      {parseInt(formData.pricePerChild).toLocaleString()}₫
                    </p>
                  )}
                  <p>Chính sách hủy: {formData.cancellationPolicy}</p>
                </div>
              </div>

              {/* Includes/Excludes */}
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Bao gồm</h3>
                <div className="flex flex-wrap gap-2">
                  {formData.includes.length > 0 ? (
                    formData.includes.map((item) => (
                      <span
                        key={item}
                        className="px-2 py-1 bg-primary text-white text-xs rounded"
                      >
                        {item}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">Không có</span>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">
                  Không bao gồm
                </h3>
                <div className="flex flex-wrap gap-2">
                  {formData.excludes.length > 0 ? (
                    formData.excludes.map((item) => (
                      <span
                        key={item}
                        className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded"
                      >
                        {item}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">Không có</span>
                  )}
                </div>
              </div>

              {/* Itinerary */}
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Lịch trình</h3>
                <div className="space-y-2">
                  {formData.itinerary.map((step) => (
                    <div
                      key={step.id}
                      className="text-sm p-2 bg-white rounded border"
                    >
                      <div className="font-medium">
                        {step.location} ({step.durationMinutes} phút)
                      </div>
                      <div>{step.activity}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Schedule */}
              <div>
                <h3 className="font-medium text-gray-900 mb-2">
                  Lịch trình hoạt động
                </h3>
                <div className="space-y-2">
                  {formData.schedules.map((sched) => (
                    <div
                      key={sched.id}
                      className="text-sm p-2 bg-white rounded border"
                    >
                      {sched.dayOfWeek} | {sched.startTime} - {sched.endTime} |{" "}
                      {sched.availableSlots} chỗ | HDV: {sched.guideName}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="publish-confirmation"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary-hover border-gray-300 rounded"
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

  const publishTour = () => {
    const confirmation = document.getElementById(
      "publish-confirmation"
    ).checked;
    if (!confirmation) {
      alert("Vui lòng xác nhận điều khoản và điều kiện!");
      return;
    }
    // Comprehensive validation
    const requiredFields = {
      tourTitle: "Tên tour",
      shortDescription: "Mô tả ngắn",
      locationName: "Tên địa điểm gặp mặt",
      address: "Địa chỉ",
      city: "Thành phố",
      district: "Quận/Huyện",
      meetingPoint: "Điểm gặp cụ thể",
      pricePerAdult: "Giá người lớn",
    };
    for (const [field, label] of Object.entries(requiredFields)) {
      if (
        !formData[field] ||
        (typeof formData[field] === "string" && !formData[field].trim())
      ) {
        alert(`Vui lòng điền ${label}!`);
        return;
      }
    }
    if (formData.includes.length === 0) {
      alert("Vui lòng chọn ít nhất một mục trong danh sách bao gồm!");
      return;
    }
    if (formData.itinerary.length < 2) {
      alert("Vui lòng thêm ít nhất 2 bước trong lịch trình!");
      return;
    }
    if (formData.images.length < 3) {
      alert("Vui lòng tải lên ít nhất 3 ảnh!");
      return;
    }
    alert("Tour đã được gửi đi để xác minh!");
    navigate("/partner/dashboard");
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Đăng tour của bạn
          </h1>
          <p className="text-gray-600 mt-2">
            Làm theo các bước để tạo tour hấp dẫn và dễ đặt chỗ
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
                      ? "bg-primary text-white border-2 border-primary"
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

        {currentStep < 9 ? (
          <button
            onClick={() => {
              if (currentStep === 7 && isItineraryOverLimit()) {
                alert(
                  "Vui lòng điều chỉnh lịch trình để không vượt quá thời lượng tour!"
                );
                return;
              }
              nextStep();
            }}
            className="flex items-center px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover"
            disabled={currentStep === 7 && isItineraryOverLimit()}
          >
            Tiếp theo
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        ) : (
          <button
            onClick={publishTour}
            className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Gửi đăng tour
          </button>
        )}
      </div>
    </div>
  );
};

export default PartnerTourRegistration;
