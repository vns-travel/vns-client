const { BookingStatus } = require('../constants/enums');
const { ErrorCodes }    = require('../constants/errors');

// Allowed forward transitions per state machine in CLAUDE.md.
// Terminal states map to [] — any attempt to move out throws.
const TRANSITIONS = {
  [BookingStatus.PENDING]:     [BookingStatus.CONFIRMED, BookingStatus.CANCELLED],
  [BookingStatus.CONFIRMED]:   [BookingStatus.IN_PROGRESS, BookingStatus.CANCELLED, BookingStatus.REFUNDED],
  [BookingStatus.IN_PROGRESS]: [BookingStatus.COMPLETED, BookingStatus.CANCELLED],
  [BookingStatus.COMPLETED]:   [],
  [BookingStatus.CANCELLED]:   [],
  [BookingStatus.REFUNDED]:    [],
};

/**
 * Throws if moving from `current` → `next` is not a valid transition.
 * Call this before any UPDATE bookings SET status = ...
 */
function canTransitionTo(current, next) {
  const allowed = TRANSITIONS[current];
  if (!allowed) {
    throw Object.assign(
      new Error(`Unknown booking status: "${current}"`),
      { code: ErrorCodes.INVALID_TRANSITION, statusCode: 400 }
    );
  }
  if (!allowed.includes(next)) {
    throw Object.assign(
      new Error(`Cannot transition booking from "${current}" to "${next}"`),
      { code: ErrorCodes.INVALID_TRANSITION, statusCode: 422 }
    );
  }
}

module.exports = { canTransitionTo, TRANSITIONS };
