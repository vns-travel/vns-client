# VietNamSea (VNS) — Project Briefing for Claude Code

## Project Overview

**Project Name:** Vietnam Travel Explorer (VietNamSea)
**Abbreviation:** VNS
**Vietnamese Name:** Du lịch khám phá Việt Nam

A travel platform for domestic tourism in Vietnam. The goal is to help travelers — especially young people — discover destinations and **book authentic local experiences** (tours, accommodations, activities) directly through verified local partners.

---

## The Problem

Information about local services and tour bookings is scattered and hard to find. Travelers struggle to book authentic experiences like guided tours, stays, and activities. VNS solves this by combining recommendations with a seamless booking system.

---

## Tech Stack

### Backend
- **ExpressJS (TypeScript)** — main API server
- **Java Spring Boot** — additional services
- **PostgreSQL** — relational data
- **MongoDB** — flexible/document data
- **Redis** — caching

### Frontend
- **Next.js + Tailwind CSS** — Admin Web App & Partner Web App
- **Flutter** — Mobile App (iOS & Android)

---

## Products / Apps

| Product | Description |
|---|---|
| **Web API** | Backend services |
| **Admin Web App** | Internal dashboard for Super Admin & Managers |
| **Partner Web App** | Portal for service providers (hotels, tour operators, etc.) |
| **VNS Mobile App** | Consumer-facing app for travelers |

---

## Features by App

### Admin Web App
- Admin authentication (username/password)
- Update profile (avatar, name, password)
- Reset passwords for lower-role accounts
- Manage feedback from users and partners
- Account management (Super Admin → Manager → Partner)
- Partner profile verification
- Profit/revenue management
- Voucher management

### Mobile App (User-facing)
- Register/login via email or Google OAuth
- Search and filter services (location, price, availability, ratings)
- Booking and payment (PayOS, ZaloPay)
- Order status tracking (confirmed / in progress / completed / cancelled)
- Booking history
- In-app notifications
- Multi-language support (Vietnamese & English)
- Reviews and ratings
- Location-based suggestions (nearby restaurants, attractions, etc.)
- Trip cancellation requests with image upload
- In-app chat (Box Chat) between customers and partners
- Itinerary management with map integration (auto-sync booked services)

### Partner Web App
- Partner registration and login
- Profile management (business info, address, contact)
- Business verification document upload
- Add/update services (rooms, tours, transport)
- Create service combos (e.g., room + breakfast)
- Manage promotions and discounts
- Messaging system with customers
- Notifications (bookings, cancellations, messages)
- Revenue overview and transaction history
- Refund management
- Financial reports (monthly/quarterly)
- Booking management (confirm, modify, cancel)

---

## Non-Functional Requirements

- **Performance:** Main screen loads in <3s on 4G; search results in <1.5s
- **Scalability:** Support 10,000 concurrent users
- **Reliability:** 99.9% uptime; data sync within 0.5s
- **Security:** Encrypted passwords, PCI-DSS payment compliance, HTTPS
- **Compatibility:** iOS & Android (latest 2 versions); Chrome, Firefox, Safari, Edge
- **Usability:** Common tasks completable in under 3 clicks/taps

---

## Team

| Name | Student Code | Role |
|---|---|---|
| Trần Huy Đức | SE161444 | — |
| Đinh Hữu Khang | SE160440 | — |
| Trương Anh Kiệt | SE160204 | — |
| Phan Trần Minh Trí | SE172500 | — |

**Supervisor:** Ms. Vũ Thị Thùy Dương

---

## Development Tasks

1. Admin Web Application
2. Partner Web Application (VNS website)
3. Mobile App for Users (Android)
4. Build, Deploy & Test the full system
5. Documentation: System Analysis & Design, Test Plan, Installation Manual, User Manual
