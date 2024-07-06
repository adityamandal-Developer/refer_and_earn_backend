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
    "https://accredian-frontend-task-omega-five.vercel.app/",
    'http://localhost:3000'
];
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));


// Routes
app.use('/api/referrer', ReferrerRouter);
app.use('/api/referee', RefereeRouter);

app.use(errorHandler);

module.exports = app;
