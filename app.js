const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const tourRouter = require('./routes/tour.routes');
const userRouter = require('./routes/user.routes');
const { errorHandle } = require('./controllers/error.Controller');

const app = express();

//! 1)Global Middlewares
//Set Security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'To many request from this IP please try again in a hour',
});
app.use('/api', limiter);

// Body parser reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

//Serving static files
app.use(express.static(`${__dirname}/public`));

// Test Middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  //   console.log(req.headers);
  next();
});

//! 2) Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//! ERROR HANDLING ,MIDLLEWARE
app.use(errorHandle);

module.exports = app;
