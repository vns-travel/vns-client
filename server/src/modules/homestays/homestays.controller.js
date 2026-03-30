const service = require('./homestays.service');

async function createHomestay(req, res, next) {
  try {
    const data = await service.createHomestay({
      partnerId: req.user.partnerId,
      title: req.body.title,
      description: req.body.description,
      location: req.body.location,
      checkInTime: req.body.checkInTime,
      checkOutTime: req.body.checkOutTime,
      cancellationPolicy: req.body.cancellationPolicy,
      houseRules: req.body.houseRules,
    });
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function addRoom(req, res, next) {
  try {
    const data = await service.addRoom({
      partnerId: req.user.partnerId,
      homestayId: req.params.homestayId,
      roomName: req.body.roomName,
      roomDescription: req.body.roomDescription,
      maxOccupancy: req.body.maxOccupancy,
      roomSizeSqm: req.body.roomSizeSqm,
      bedType: req.body.bedType,
      bedCount: req.body.bedCount,
      privateBathroom: req.body.privateBathroom,
      basePrice: req.body.basePrice,
      weekendPrice: req.body.weekendPrice,
      holidayPrice: req.body.holidayPrice,
      roomAmenities: req.body.roomAmenities,
      numberOfRooms: req.body.numberOfRooms,
    });
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function bulkAvailability(req, res, next) {
  try {
    const data = await service.bulkAvailability({
      partnerId: req.user.partnerId,
      homestayId: req.params.homestayId,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      rooms: req.body.rooms,
    });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function submitHomestay(req, res, next) {
  try {
    await service.submitHomestay({
      partnerId: req.user.partnerId,
      homestayId: req.params.homestayId,
    });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

module.exports = { createHomestay, addRoom, bulkAvailability, submitHomestay };
