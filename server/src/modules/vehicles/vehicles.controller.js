const service = require('./vehicles.service');

// Controllers validate input (via validate middleware) and delegate to the service.
// They must NOT contain business logic.

async function createVehicle(req, res, next) {
  try {
    const data = await service.createVehicle({
      partnerId: req.user.partnerId,
      serviceId: req.body.serviceId,
      make: req.body.make,
      model: req.body.model,
      year: req.body.year,
      vehicleType: req.body.vehicleType,
      capacity: req.body.capacity,
      pricingModel: req.body.pricingModel,
      dailyRate: req.body.dailyRate,
      hourlyRate: req.body.hourlyRate,
      driverIncluded: req.body.driverIncluded,
      depositAmount: req.body.depositAmount,
      includedFeatures: req.body.includedFeatures,
    });
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function bulkVehicleAvailability(req, res, next) {
  try {
    const data = await service.bulkVehicleAvailability({
      partnerId: req.user.partnerId,
      vehicleId: req.params.vehicleId,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      availableFrom: req.body.availableFrom,
      availableTo: req.body.availableTo,
    });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

module.exports = { createVehicle, bulkVehicleAvailability };
