const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const tourRouter = require('./routes/tour.routes');
const userRouter = require('./routes/user.routes');
const { errorHandle } = require('./controllers/error.Controller');

const app = express();

//! 1)Global Middlewares

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

const limiter = rateLimit({
  max: 3,
  windowMs: 60 * 60 * 1000,
  message: 'To many request from this IP please try again in a hour',
});

app.use('/api', limiter);
// app.use((req, res, next) => {
//   req.requestTime = new Date().toISOString();
//   console.log(req.headers);
//   next();
// });

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//! 2) Routes

//! ERROR HANDLING ,MIDLLEWARE
app.use(errorHandle);

module.exports = app;
