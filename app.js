const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const errorHandler = require('./src/middlewares/errorHandler');
const { ReferrerRouter } = require('./src/routes/referrer.Routes');
const { RefereeRouter } = require('./src/routes/referee.routes');
require('dotenv').config();

const app = express();

app.use(bodyParser.json());

const allowedOrigins = [
    'https://accredian-frontend-task-omega-five.vercel.app',
    'http://localhost:3000'
];
// CORS configuration
const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, postman)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

app.use(cors(corsOptions));


// Routes
app.use('/api/referrer', ReferrerRouter);
app.use('/api/referee', RefereeRouter);

// Error handling middleware
app.use(errorHandler);

module.exports = app;
