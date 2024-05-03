const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const tourRouter = require('./routes/tour.routes');
const userRouter = require('./routes/user.routes');
const { errorHandle } = require('./controllers/error.Controller');

const app = express();

//! 1) Middalwares

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// app.use((req, res, next) => {
//   req.requestTime = new Date().toISOString();
//   console.log(req.headers);
//   next();
// });

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//! 2) Routes

// app.all('*', (req, res, next) => {
//   next(new AppError(`Cannt find ${req.originalUrl} on this server!`));

//   next(err);
// });

//! ERROR HANDLING ,MIDLLEWARE
app.use(errorHandle);

module.exports = app;
