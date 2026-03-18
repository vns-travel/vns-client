VNS TRAVEL API CATALOG
Base URL (deployed): https://vns-server.onrender.com

IMPORTANT NOTES
- This catalog lists all currently exposed APIs in the backend.
- Most enum values should be sent as integers unless the frontend explicitly serializes enums as strings.
- Some endpoints use broad DTOs that include server-generated fields. For create requests, frontend should send only the fields shown in the examples below.
- Recommended creation flows:
  1. Homestay: use /api/partner/homestays and its child endpoints
  2. Tour: use /api/partner/services with serviceType = 1 and tourDetails
  3. Other service/news post: use /api/partner/services with serviceType = 2 and platformFeeAmount
  4. Combo: use /api/partner/combos

ENUMS
- ServiceType:
  0 = Homestay
  1 = Tour
  2 = Other

- BookingType:
  0 = Service
  1 = Combo

- BookingStatus:
  1 = Pending
  2 = Confirmed
  3 = InProgress
  4 = Completed
  5 = Cancelled
  6 = Refunded

- PaymentMethod:
  1 = CreditCard
  2 = BankTransfer
  3 = Zalopay
  4 = Cash

- PaymentStatus:
  1 = Pending
  2 = Completed
  3 = Failed
  4 = Refunded


================================================================
SYSTEM
================================================================

GET /
Auth: none
Description: API root status
Sample:
GET https://vns-server.onrender.com/

GET /health
Auth: none
Description: Health check
Sample:
GET https://vns-server.onrender.com/health


================================================================
AUTH
================================================================

POST /api/Auth/register
Auth: none
Body fields:
- email
- password
- fullName
- phoneNumber
Sample body:
{
  "email": "customer@example.com",
  "password": "123456",
  "fullName": "Nguyen Van A",
  "phoneNumber": "0900000001"
}

POST /api/Auth/register-partner
Auth: none
Body fields:
- email
- password
- phoneNumber
- businessName
Sample body:
{
  "email": "partner@example.com",
  "password": "123456",
  "phoneNumber": "0900000002",
  "businessName": "VNS Travel Partner"
}

POST /api/Auth/login
Auth: none
Body fields:
- email
- password
Sample body:
{
  "email": "customer@example.com",
  "password": "123456"
}

POST /api/Auth/refresh-token
Auth: none
Body fields:
- refreshToken
Sample body:
{
  "refreshToken": "your_refresh_token"
}

POST /api/Auth/forgot-password
Auth: none
Body fields:
- email
Sample body:
{
  "email": "customer@example.com"
}

POST /api/Auth/verify-otp
Auth: none
Body fields:
- email
- otp
Sample body:
{
  "email": "customer@example.com",
  "otp": "123456"
}

POST /api/Auth/reset-password
Auth: none
Body fields:
- email
- otp
- newPassword
Sample body:
{
  "email": "customer@example.com",
  "otp": "123456",
  "newPassword": "newpassword123"
}

GET /api/Auth/google-login?returnUrl=/
Auth: none
Description: Starts Google login flow
Sample:
GET https://vns-server.onrender.com/api/Auth/google-login?returnUrl=/


================================================================
PUBLIC CATALOG AND DISCOVERY
================================================================

GET /api/Service
Auth: none
Query fields:
- serviceId (optional)
- partnerId (optional)
- title (optional)
- locationId (optional)
- serviceType (optional)
- includeInactive (optional, true/false)
Sample:
GET https://vns-server.onrender.com/api/Service?serviceType=0&title=SaPa

GET /api/Service/{id}
Auth: none
Sample:
GET https://vns-server.onrender.com/api/Service/{serviceId}

POST /api/Service
Auth: none
WARNING: legacy/internal endpoint. Prefer partner-specific endpoints for creation.
Body fields:
- serviceId
- partnerId
- title
- description
- price
- availability
- serviceType
- location
Sample body:
{
  "serviceId": "00000000-0000-0000-0000-000000000000",
  "partnerId": "00000000-0000-0000-0000-000000000000",
  "title": "Legacy Service",
  "description": "Legacy create endpoint",
  "price": 1000000,
  "availability": 10,
  "serviceType": 1,
  "location": "Da Nang"
}

PUT /api/Service/{id}
Auth: none
WARNING: legacy/internal endpoint.
Sample body:
{
  "serviceId": "{same_as_route_id}",
  "partnerId": "00000000-0000-0000-0000-000000000000",
  "title": "Updated Service",
  "description": "Updated via legacy endpoint",
  "price": 1200000,
  "availability": 10,
  "serviceType": 1,
  "location": "Da Nang"
}

DELETE /api/Service/{id}
Auth: none
WARNING: legacy/internal endpoint.

GET /api/combos
Auth: none
Description: Get all approved active combos
Sample:
GET https://vns-server.onrender.com/api/combos

GET /api/combos/{comboId}
Auth: none
Sample:
GET https://vns-server.onrender.com/api/combos/{comboId}


================================================================
PARTNER SERVICE CREATION
================================================================

POST /api/partner/services
Auth: Bearer token, Partner role
Used for:
- Tour creation
- Other service/news post creation
Do NOT use for Homestay creation.
Response note:
- When serviceType = 1 (Tour), the response includes `tourId`. Frontend should keep this value to create schedules and itineraries.
Body fields:
- locationId
- destinationId (optional)
- serviceType
- title
- description
- platformFeeAmount
- tourDetails (required only when serviceType = 1)
Sample body for Tour:
{
  "locationId": "11111111-1111-1111-1111-111111111111",
  "destinationId": "22222222-2222-2222-2222-222222222222",
  "serviceType": 1,
  "title": "Ha Giang Loop Adventure",
  "description": "3D2N tour in Ha Giang",
  "platformFeeAmount": 0,
  "tourDetails": {
    "tourType": 4,
    "durationHours": 72,
    "difficultyLevel": 2,
    "minParticipants": 2,
    "maxParticipants": 12,
    "includes": ["transport", "guide", "breakfast"],
    "excludes": ["personal expenses"],
    "whatToBring": "Jacket, shoes, ID card",
    "cancellationPolicy": "Cancel 48h before departure",
    "ageRestrictions": "12+",
    "fitnessRequirements": "Basic health required"
  }
}
Sample body for Other service/news:
{
  "locationId": "11111111-1111-1111-1111-111111111111",
  "destinationId": "22222222-2222-2222-2222-222222222222",
  "serviceType": 2,
  "title": "Traditional craft village event",
  "description": "News post for upcoming partner event",
  "platformFeeAmount": 50000,
  "tourDetails": null
}

PUT /api/partner/services/{serviceId}
Auth: Bearer token, Partner role
Body shape: same as POST /api/partner/services

DELETE /api/partner/services/{serviceId}
Auth: Bearer token, Partner role

PUT /api/manager/services/{serviceId}/approve
Auth: Bearer token, Manager or SuperAdmin role
Description: Approves pending service and activates it
Body: none


================================================================
PARTNER TOUR MANAGEMENT
================================================================

POST /api/partner/tours/{tourId}/schedules
Auth: Bearer token, Partner role
Description: Create a bookable schedule for a tour that belongs to the current partner
Body fields:
- tourDate
- startTime
- endTime
- availableSlots
- guideId (optional)
- meetingPoint (optional)
- isActive
- price
Sample body:
{
  "tourDate": "2026-05-20T00:00:00Z",
  "startTime": "08:00:00",
  "endTime": "17:00:00",
  "availableSlots": 20,
  "guideId": "GUIDE-001",
  "meetingPoint": "Da Nang Museum",
  "isActive": true,
  "price": 1200000
}
Response shape:
- scheduleId
- tourId
- tourDate
- startTime
- endTime
- availableSlots
- bookedSlots
- guideId
- meetingPoint
- isActive
- price

POST /api/partner/tours/{tourId}/itineraries
Auth: Bearer token, Partner role
Description: Add itinerary step for a tour that belongs to the current partner
Body fields:
- stepOrder
- location
- activity
- durationMinutes
- description
Sample body:
{
  "stepOrder": 1,
  "location": "Ba Na Hills",
  "activity": "Cable car and sightseeing",
  "durationMinutes": 180,
  "description": "Morning check-in and guided sightseeing"
}
Response shape:
- itineraryId
- tourId
- stepOrder
- location
- activity
- durationMinutes
- description


================================================================
PARTNER HOMESTAY CREATION
================================================================

POST /api/partner/homestays
Auth: Bearer token, Partner role
Description: Create homestay base service, location, homestay detail
Body fields:
- title
- description
- location
  - name
  - address
  - city
  - district
  - ward
  - postalCode
  - latitude
  - longitude
  - phoneNumber
  - openingHours
- checkInTime
- checkOutTime
- cancellationPolicy (optional)
- houseRules (optional)
Sample body:
{
  "title": "Sapa Cloud Homestay",
  "description": "Mountain view homestay in Sapa",
  "location": {
    "name": "Sapa Cloud Homestay",
    "address": "123 Fansipan Road",
    "city": "Lao Cai",
    "district": "Sa Pa",
    "ward": "Sa Pa Ward",
    "postalCode": "330000",
    "latitude": 22.3364,
    "longitude": 103.8438,
    "phoneNumber": "0900000003",
    "openingHours": "Always open"
  },
  "checkInTime": "14:00:00",
  "checkOutTime": "12:00:00",
  "cancellationPolicy": "Free cancellation within 48 hours",
  "houseRules": "No smoking indoors"
}

POST /api/partner/homestays/{homestayId}/rooms
Auth: Bearer token, Partner role
Description: Add one or many rooms to a homestay
Body fields:
- roomName
- roomDescription
- maxOccupancy
- roomSizeSqm
- bedType
- bedCount
- privateBathroom
- basePrice
- weekendPrice
- holidayPrice
- roomAmenities
- numberOfRooms
Sample body:
{
  "roomName": "Deluxe Double Room",
  "roomDescription": "Valley view room",
  "maxOccupancy": 2,
  "roomSizeSqm": 28,
  "bedType": "Queen",
  "bedCount": 1,
  "privateBathroom": true,
  "basePrice": 850000,
  "weekendPrice": 950000,
  "holidayPrice": 1100000,
  "roomAmenities": ["wifi", "heater", "balcony"],
  "numberOfRooms": 3
}

POST /api/partner/homestays/{homestayId}/availability/bulk
Auth: Bearer token, Partner role
Description: Generate room availability by date range
Body fields:
- startDate
- endDate
- rooms[]
  - roomId
  - defaultPrice
  - minNights
- applyToAllDates
Sample body:
{
  "startDate": "2026-04-01T00:00:00Z",
  "endDate": "2026-04-30T00:00:00Z",
  "rooms": [
    {
      "roomId": "33333333-3333-3333-3333-333333333333",
      "defaultPrice": 850000,
      "minNights": 1
    }
  ],
  "applyToAllDates": true
}

POST /api/partner/homestays/{homestayId}/create
Auth: Bearer token, Partner role
Description: Final submit for manager review
Body fields:
- confirmed
Sample body:
{
  "confirmed": true
}

APPROVING A HOMESTAY
- Homestay approval is currently done through the base service endpoint:
  PUT /api/manager/services/{serviceId}/approve


================================================================
COMBO SERVICES
================================================================

GET /api/partner/combos
Auth: Bearer token, Partner role
Description: Get all combos of current partner

POST /api/partner/combos
Auth: Bearer token, Partner role
Description: Create combo request pending manager approval
Body fields:
- title
- description
- originalPrice
- discountedPrice
- validFrom
- validTo
- maxBookings
- comboServices[]
  - serviceId
  - quantity
  - sequenceOrder
  - includedFeatures
- additionalServices[]
  - name
  - description
Notes:
- comboServices can only reference approved Homestay/Tour services of the same partner
- additionalServices is for Other services metadata only
Sample body:
{
  "title": "Da Nang 3D2N Combo",
  "description": "Homestay + city tour combo",
  "originalPrice": 3500000,
  "discountedPrice": 2990000,
  "validFrom": "2026-04-01T00:00:00Z",
  "validTo": "2026-06-30T23:59:59Z",
  "maxBookings": 100,
  "currentBookings": 0,
  "isActive": false,
  "comboServices": [
    {
      "serviceId": "44444444-4444-4444-4444-444444444444",
      "quantity": 1,
      "sequenceOrder": 1,
      "includedFeatures": "2 nights stay"
    },
    {
      "serviceId": "55555555-5555-5555-5555-555555555555",
      "quantity": 1,
      "sequenceOrder": 2,
      "includedFeatures": "Half-day tour"
    }
  ],
  "additionalServices": [
    {
      "name": "Welcome article on local event",
      "description": "Reference only, not a concrete service item"
    }
  ]
}

DELETE /api/partner/combos/{comboId}
Auth: Bearer token, Partner role

PUT /api/manager/combos/{comboId}/approve
Auth: Bearer token, Manager or SuperAdmin role
Body: none


================================================================
BOOKING AND PAYMENT
================================================================

POST /api/Booking
Auth: Bearer token
Description: Create booking, validate voucher, create pending payment
For service booking, frontend sends serviceId and either homestayDetail or tourDetail.
For combo booking, frontend sends comboId and bookingType = 1.
Pricing note:
- Homestay price is calculated from availability rows in the selected date range.
- Tour price is now calculated on the backend from `TourSchedule.Price * participants`.
- Frontend can send `originalAmount = 0` for tour bookings; backend will compute the actual amount from the selected schedule.

Sample body for Homestay booking:
{
  "serviceId": "44444444-4444-4444-4444-444444444444",
  "comboId": null,
  "bookingType": 0,
  "bookingStatus": 1,
  "originalAmount": 0,
  "discountAmount": 0,
  "totalAmount": 0,
  "finalAmount": 0,
  "paymentMethod": 2,
  "paymentStatus": 1,
  "numberOfGuests": 2,
  "specialRequests": "Need early check-in if possible",
  "voucherCode": "WELCOME20-ABC123",
  "homestayDetail": {
    "homestayId": "66666666-6666-6666-6666-666666666666",
    "roomId": "77777777-7777-7777-7777-777777777777",
    "checkInDate": "2026-05-10T00:00:00Z",
    "checkOutDate": "2026-05-12T00:00:00Z",
    "adults": 2,
    "children": 0,
    "cleaningFee": 100000,
    "serviceFee": 50000,
    "hostApprovalRequired": false
  },
  "tourDetail": null
}

Sample body for Tour booking:
{
  "serviceId": "55555555-5555-5555-5555-555555555555",
  "comboId": null,
  "bookingType": 0,
  "bookingStatus": 1,
  "originalAmount": 0,
  "discountAmount": 0,
  "totalAmount": 0,
  "finalAmount": 0,
  "paymentMethod": 3,
  "paymentStatus": 1,
  "numberOfGuests": 2,
  "specialRequests": "Pickup at hotel lobby",
  "voucherCode": null,
  "homestayDetail": null,
  "tourDetail": {
    "scheduleId": "88888888-8888-8888-8888-888888888888",
    "participants": 2,
    "pickupLocation": "Da Nang city center",
    "pickupTime": "08:00:00"
  }
}

Sample body for Combo booking:
{
  "serviceId": null,
  "comboId": "99999999-9999-9999-9999-999999999999",
  "bookingType": 1,
  "bookingStatus": 1,
  "originalAmount": 0,
  "discountAmount": 0,
  "totalAmount": 0,
  "finalAmount": 0,
  "paymentMethod": 2,
  "paymentStatus": 1,
  "numberOfGuests": 2,
  "specialRequests": "Please confirm quickly",
  "voucherCode": "WELCOME20-ABC123",
  "homestayDetail": null,
  "tourDetail": null
}

GET /api/Booking/{bookingId}
Auth: Bearer token
Description: Get single booking

GET /api/Booking?userId={userId}
Auth: Bearer token
Description: Get bookings by user. If query is omitted, controller uses current authenticated user.

PUT /api/Booking?bookingId={bookingId}
Auth: Bearer token
WARNING: current endpoint only touches UpdatedAt and has no request body.

DELETE /api/Booking?bookingId={bookingId}
Auth: Bearer token


================================================================
VOUCHERS
================================================================

GET /api/vouchers/my
Auth: Bearer token
Description: Get currently available vouchers for authenticated user

POST /api/vouchers/validate
Auth: Bearer token
Body fields:
- userId (currently ignored by controller; authenticated user is used)
- voucherCode
- originalAmount
- serviceTypes[]
Sample body:
{
  "userId": "00000000-0000-0000-0000-000000000000",
  "voucherCode": "WELCOME20-ABC123",
  "originalAmount": 2500000,
  "serviceTypes": [0]
}

POST /api/manager/vouchers
Auth: Bearer token, Manager or SuperAdmin role
Body fields:
- userId (optional if public voucher)
- voucherCode
- discountPercentage (choose one: percentage or amount)
- discountAmount (choose one: percentage or amount)
- validFrom
- validTo
- serviceTypes[]
- isPublic
- maxUsage
Sample public percentage voucher:
{
  "userId": null,
  "voucherCode": "SUMMER10",
  "discountPercentage": 10,
  "discountAmount": null,
  "validFrom": "2026-04-01T00:00:00Z",
  "validTo": "2026-06-30T23:59:59Z",
  "serviceTypes": [0, 1],
  "isPublic": true,
  "maxUsage": 1000
}
Sample user-specific fixed voucher:
{
  "userId": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
  "voucherCode": "VIP200K",
  "discountPercentage": null,
  "discountAmount": 200000,
  "validFrom": "2026-04-01T00:00:00Z",
  "validTo": "2026-12-31T23:59:59Z",
  "serviceTypes": [0],
  "isPublic": false,
  "maxUsage": 1
}


================================================================
DESTINATIONS
================================================================

GET /api/destinations
Auth: none

GET /api/destinations/{id}
Auth: none

POST /api/destinations
Auth: none
Body fields:
- destinationId
- name
- country
- city
- district
- ward
- address
- postalCode
- latitude
- longitude
- description
Sample body:
{
  "destinationId": "00000000-0000-0000-0000-000000000000",
  "name": "Da Nang",
  "country": "Vietnam",
  "city": "Da Nang",
  "district": "Hai Chau",
  "ward": "Thach Thang",
  "address": "Da Nang center",
  "postalCode": "550000",
  "latitude": 16.0544,
  "longitude": 108.2022,
  "description": "Coastal city in central Vietnam"
}

PUT /api/destinations/{id}
Auth: none
Body shape: same as create

DELETE /api/destinations/{id}
Auth: none


================================================================
DESTINATION IMAGES
================================================================

GET /api/destination-images?destinationId={destinationId}
Auth: none

GET /api/destination-images/{id}
Auth: none

POST /api/destination-images
Auth: none
Body fields:
- destinationImageId
- destinationId
- url
- caption
Sample body:
{
  "destinationImageId": "00000000-0000-0000-0000-000000000000",
  "destinationId": "22222222-2222-2222-2222-222222222222",
  "url": "https://cdn.example.com/destination.jpg",
  "caption": "Beach sunset"
}

DELETE /api/destination-images/{id}
Auth: none


================================================================
SERVICE IMAGES
================================================================

GET /api/service-images?serviceId={serviceId}
Auth: none

GET /api/service-images/{id}
Auth: none

POST /api/service-images
Auth: none
Body fields:
- serviceImageId
- serviceId
- url
- caption
- displayOrder
Sample body:
{
  "serviceImageId": "00000000-0000-0000-0000-000000000000",
  "serviceId": "44444444-4444-4444-4444-444444444444",
  "url": "https://cdn.example.com/service.jpg",
  "caption": "Main cover",
  "displayOrder": 1
}

DELETE /api/service-images/{id}
Auth: none


================================================================
BOOKING ITEMS
================================================================

GET /api/booking-items?bookingId={bookingId}
Auth: none

GET /api/booking-items/{id}
Auth: none

POST /api/booking-items
Auth: none
Body fields:
- bookingItemId
- bookingId
- serviceId
- serviceDetailId
- unitPrice
- quantity
- startDate
- endDate
- itemStatus
Sample body:
{
  "bookingItemId": "00000000-0000-0000-0000-000000000000",
  "bookingId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
  "serviceId": "44444444-4444-4444-4444-444444444444",
  "serviceDetailId": "66666666-6666-6666-6666-666666666666",
  "unitPrice": 850000,
  "quantity": 1,
  "startDate": "2026-05-10T00:00:00Z",
  "endDate": "2026-05-12T00:00:00Z",
  "itemStatus": 1
}

PUT /api/booking-items/{id}
Auth: none
Body shape: same as create

DELETE /api/booking-items/{id}
Auth: none


================================================================
REVIEWS
================================================================

GET /api/reviews
Auth: none
Query options:
- serviceId
- bookingId

GET /api/reviews/{id}
Auth: none

POST /api/reviews
Auth: none
Body fields:
- reviewId
- bookingId
- bookingItemId
- serviceId
- userId
- rating
- comment
Sample body:
{
  "reviewId": "00000000-0000-0000-0000-000000000000",
  "bookingId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
  "bookingItemId": null,
  "serviceId": "44444444-4444-4444-4444-444444444444",
  "userId": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
  "rating": 5,
  "comment": "Very good experience"
}

PUT /api/reviews/{id}
Auth: none
Body shape: same as create

DELETE /api/reviews/{id}
Auth: none


================================================================
NOTIFICATIONS
================================================================

GET /api/notifications?userId={userId}
Auth: none

GET /api/notifications/{id}
Auth: none

POST /api/notifications
Auth: none
Body fields:
- notificationId
- userId
- title
- content
- notificationType
- isRead
- createdAt
- readAt
Sample body:
{
  "notificationId": "00000000-0000-0000-0000-000000000000",
  "userId": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
  "title": "Booking Created",
  "content": "Your booking has been created successfully",
  "notificationType": 1,
  "isRead": false,
  "createdAt": "2026-03-17T12:00:00Z",
  "readAt": null
}

PUT /api/notifications/{id}/read
Auth: none

DELETE /api/notifications/{id}
Auth: none


================================================================
CHAT
================================================================

POST /api/Chat/send
Auth: Bearer token
Body fields:
- receiverId
- content
Sample body:
{
  "receiverId": "cccccccc-cccc-cccc-cccc-cccccccccccc",
  "content": "Xin chao, toi muon hoi ve tour nay"
}

GET /api/Chat/history/{partnerId}
Auth: Bearer token

GET /api/Chat/recent
Auth: Bearer token


================================================================
FIREBASE FILE INFO
================================================================

POST /api/Firebase/add-file-info
Auth: none
Body fields:
- fileName
- url
Sample body:
{
  "fileName": "banner.jpg",
  "url": "https://storage.example.com/banner.jpg"
}


================================================================
FRONTEND RECOMMENDATIONS
================================================================

Use these endpoints for main app flows:
- Customer registration/login: /api/Auth/*
- Partner create Tour/Other: /api/partner/services
- Partner complete Tour setup after creation: /api/partner/tours/{tourId}/schedules and /api/partner/tours/{tourId}/itineraries
- Partner create Homestay: /api/partner/homestays -> /rooms -> /availability/bulk -> /create
- Manager approve service: /api/manager/services/{serviceId}/approve
- Partner create combo: /api/partner/combos
- Manager approve combo: /api/manager/combos/{comboId}/approve
- Customer validate voucher: /api/vouchers/validate
- Customer create booking: /api/Booking
- Public mobile browse services: /api/Service
- Public mobile browse combos: /api/combos

Endpoints that look more legacy or internal:
- /api/Service POST/PUT/DELETE
- /api/booking-items POST/PUT/DELETE
- /api/notifications POST
- /api/reviews POST/PUT/DELETE

Known API contract caveats:
- /api/vouchers/validate accepts userId in body but backend ignores it and uses the authenticated user.
- /api/Booking PUT and DELETE currently use query parameter bookingId instead of route parameter.
- /api/partner/homestays/{homestayId}/create is actually a submit-for-review action.
- Many public CRUD endpoints have no authorization yet; frontend should avoid exposing admin/internal actions directly without product confirmation.
