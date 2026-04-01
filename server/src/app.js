const express = require('express');
const cors = require('cors');

const authRouter         = require('./modules/auth/auth.router');
const usersRouter        = require('./modules/users/users.router');
const partnersRouter     = require('./modules/partners/partners.router');
const servicesRouter     = require('./modules/services/services.router');
const vehiclesRouter     = require('./modules/vehicles/vehicles.router');
const toursRouter        = require('./modules/tours/tours.router');
const homestaysRouter    = require('./modules/homestays/homestays.router');
const bookingsRouter     = require('./modules/bookings/bookings.router');
const paymentsRouter     = require('./modules/payments/payments.router');
const refundsRouter      = require('./modules/refunds/refunds.router');
const vouchersRouter     = require('./modules/vouchers/vouchers.router');
const reviewsRouter      = require('./modules/reviews/reviews.router');
const notificationsRouter = require('./modules/notifications/notifications.router');
const chatRouter         = require('./modules/chat/chat.router');
const combosRouter       = require('./modules/combos/combos.router');
const { errorHandler }   = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// All domain routers are mounted under /api/<module>
app.use('/api/auth',             authRouter);
app.use('/api/users',            usersRouter);
app.use('/api/partners',         partnersRouter);
app.use('/api/services',         servicesRouter);
app.use('/api/partner/vehicles', vehiclesRouter);
app.use('/api/partner/tours',    toursRouter);
app.use('/api/partner/homestays', homestaysRouter);
app.use('/api/bookings',         bookingsRouter);
app.use('/api/payments',         paymentsRouter);
app.use('/api/refunds',          refundsRouter);
app.use('/api/vouchers',         vouchersRouter);
app.use('/api/reviews',          reviewsRouter);
app.use('/api/notifications',    notificationsRouter);
app.use('/api/chat',             chatRouter);
app.use('/api/combos',           combosRouter);

// Must be registered last — catches errors forwarded via next(err)
app.use(errorHandler);

module.exports = app;
