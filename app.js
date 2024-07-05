const express = require('express');
const bodyParser = require('body-parser');
const errorHandler = require('./src/middlewares/errorHandler');

const { ReferrerRouter } = require('./src/routes/referrer.Routes');
const { RefereeRouter } = require('./src/routes/referee.routes');

require('dotenv').config();

const app = express();

app.use(bodyParser.json());

// Routes
app.use('/api/referrer', ReferrerRouter);
app.use('/api/referee', RefereeRouter);

// Error handling middleware
app.use(errorHandler);

module.exports = app;
