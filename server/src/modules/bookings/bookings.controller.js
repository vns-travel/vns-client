// Controllers validate input (via validate middleware) and delegate to the service.
// They must NOT contain business logic.

const service = require('./bookings.service');

async function createBooking(req, res, next) {
  try {
    const data = await service.createBooking({
      userId: req.user.id,
      serviceType: req.body.serviceType,
      serviceId: req.body.serviceId,
      guests: req.body.guests,
      specialRequests: req.body.specialRequests,
      voucherCode: req.body.voucherCode,
      paymentMethod: req.body.paymentMethod,
      paymentType: req.body.paymentType,
      tourDetail: req.body.tourDetail,
      homestayDetail: req.body.homestayDetail,
      carDetail: req.body.carDetail,
    });
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function listMyBookings(req, res, next) {
  try {
    // page/limit are already coerced integers from validateQuery(listQuerySchema).
    const { status, page, limit } = req.query;
    const result = await service.listMyBookings({
      userId: req.user.id,
      status: status || null,
      page,
      limit,
    });
    res.json({ success: true, data: result.data, meta: result.meta });
  } catch (err) {
    next(err);
  }
}

async function getBookingDetail(req, res, next) {
  try {
    const data = await service.getBookingDetail({
      bookingId: req.params.id,
      userId: req.user.id,
      partnerId: req.user.partnerId || null,
      role: req.user.role,
    });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function listPartnerBookings(req, res, next) {
  try {
    // page/limit/serviceId are already coerced/validated from validateQuery(listQuerySchema).
    const { status, serviceId, page, limit } = req.query;
    const result = await service.listPartnerBookings({
      partnerId: req.user.partnerId,
      status: status || null,
      serviceId: serviceId || null,
      page,
      limit,
    });
    res.json({ success: true, data: result.data, meta: result.meta });
  } catch (err) {
    next(err);
  }
}

async function updatePartnerStatus(req, res, next) {
  try {
    const data = await service.transitionStatus({
      bookingId: req.params.id,
      newStatus: req.body.status,
      actorRole: 'partner',
      actorPartnerId: req.user.partnerId,
    });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function updateManagerStatus(req, res, next) {
  try {
    const data = await service.transitionStatus({
      bookingId: req.params.id,
      newStatus: req.body.status,
      actorRole: 'manager',
      actorPartnerId: null,
    });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function cancelBooking(req, res, next) {
  try {
    const data = await service.cancelBooking({
      bookingId:    req.params.id,
      userId:       req.user.id,
      reason:       req.body.reason,
      evidenceUrls: req.body.evidenceUrls,
    });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createBooking,
  listMyBookings,
  getBookingDetail,
  listPartnerBookings,
  updatePartnerStatus,
  updateManagerStatus,
  cancelBooking,
};
