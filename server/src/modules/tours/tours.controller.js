const service = require('./tours.service');

async function addSchedule(req, res, next) {
  try {
    const data = await service.addSchedule({
      partnerId: req.user.partnerId,
      tourId: req.params.tourId,
      tourDate: req.body.tourDate,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      availableSlots: req.body.availableSlots,
      price: req.body.price,
      guideId: req.body.guideId,
      isActive: req.body.isActive,
    });
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function addItinerary(req, res, next) {
  try {
    const data = await service.addItinerary({
      partnerId: req.user.partnerId,
      tourId: req.params.tourId,
      stepOrder: req.body.stepOrder,
      location: req.body.location,
      activity: req.body.activity,
      durationMinutes: req.body.durationMinutes,
      description: req.body.description,
    });
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

module.exports = { addSchedule, addItinerary };
