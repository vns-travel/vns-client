const ErrorCodes = {
  // Auth
  AUTH_REQUIRED:      'AUTH_REQUIRED',
  AUTH_INVALID:       'AUTH_INVALID',
  AUTH_EXPIRED:       'AUTH_EXPIRED',
  FORBIDDEN:          'FORBIDDEN',
  // Validation
  VALIDATION_ERROR:   'VALIDATION_ERROR',
  // Resources
  NOT_FOUND:          'NOT_FOUND',
  ALREADY_EXISTS:     'ALREADY_EXISTS',
  // Business logic
  INVALID_TRANSITION: 'INVALID_TRANSITION',
  LOCK_UNAVAILABLE:   'LOCK_UNAVAILABLE',
  SLOT_UNAVAILABLE:   'SLOT_UNAVAILABLE',
  VOUCHER_INVALID:    'VOUCHER_INVALID',
  VOUCHER_EXPIRED:    'VOUCHER_EXPIRED',
  VOUCHER_USED:       'VOUCHER_USED',
  PAYMENT_FAILED:     'PAYMENT_FAILED',
  REVIEW_NOT_ALLOWED: 'REVIEW_NOT_ALLOWED',
  // Server
  SERVER_ERROR:       'SERVER_ERROR',
};

const ErrorMessages = {
  [ErrorCodes.AUTH_REQUIRED]:      'Authentication required',
  [ErrorCodes.AUTH_INVALID]:       'Invalid or expired token',
  [ErrorCodes.FORBIDDEN]:          'Insufficient permissions',
  [ErrorCodes.NOT_FOUND]:          'Resource not found',
  [ErrorCodes.INVALID_TRANSITION]: 'Invalid booking status transition',
  [ErrorCodes.LOCK_UNAVAILABLE]:   'Service temporarily unavailable, please try again',
  [ErrorCodes.SLOT_UNAVAILABLE]:   'No availability for the selected date/time',
  [ErrorCodes.VOUCHER_INVALID]:    'Voucher is invalid or does not apply',
  [ErrorCodes.VOUCHER_EXPIRED]:    'Voucher has expired',
  [ErrorCodes.VOUCHER_USED]:       'You have already used this voucher',
  [ErrorCodes.REVIEW_NOT_ALLOWED]: 'You can only review completed bookings',
};

module.exports = { ErrorCodes, ErrorMessages };
