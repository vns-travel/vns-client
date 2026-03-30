// Plain JS objects used as enums throughout the codebase.
// Never hardcode status strings inline — always import from here.

const BookingStatus = {
  PENDING:     'pending',
  CONFIRMED:   'confirmed',
  IN_PROGRESS: 'in_progress',
  COMPLETED:   'completed',
  CANCELLED:   'cancelled',
  REFUNDED:    'refunded',
};

const PaymentStatus = {
  PENDING:  'pending',
  PAID:     'paid',
  FAILED:   'failed',
  REFUNDED: 'refunded',
};

const PaymentType = {
  FULL:             'full',
  DEPOSIT:          'deposit',
  BALANCE:          'balance',
  SECURITY_DEPOSIT: 'security_deposit',
};

const ServiceType = {
  TOUR:       'tour',
  HOMESTAY:   'homestay',
  CAR_RENTAL: 'car_rental',
  OTHER:      'other',
};

const ServiceStatus = {
  DRAFT:     'draft',
  PENDING:   'pending',
  APPROVED:  'approved',
  REJECTED:  'rejected',
  SUSPENDED: 'suspended',
};

const UserRole = {
  CUSTOMER:    'customer',
  PARTNER:     'partner',
  MANAGER:     'manager',
  SUPER_ADMIN: 'super_admin',
};

const VerifyStatus = {
  PENDING:   'pending',
  REVIEWING: 'reviewing',
  APPROVED:  'approved',
  REJECTED:  'rejected',
};

const PricingModel = {
  DAILY:  'daily',
  HOURLY: 'hourly',
};

const RefundStatus = {
  PENDING:   'pending',
  APPROVED:  'approved',
  REJECTED:  'rejected',
  PROCESSED: 'processed',
};

module.exports = {
  BookingStatus,
  PaymentStatus,
  PaymentType,
  ServiceType,
  ServiceStatus,
  UserRole,
  VerifyStatus,
  PricingModel,
  RefundStatus,
};
