const express      = require('express');
const helmet       = require('helmet');
const cors         = require('cors');
const morgan       = require('morgan');
const routes       = require('./routes');
const notFound     = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api', routes);

// 404 catch-all — must come after all routes
app.use(notFound);
// Global error handler — must be last (4-argument signature is required by Express)
app.use(errorHandler);

module.exports = app;
