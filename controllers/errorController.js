const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleMongoErrorDB = (err) => {
  const value = err.errmsg.match(/"(.*?)"/g)[0];
  const message = `Duplicate field value: ${value}. Please use another value`;
  return new AppError(message, 400);
};

const handleValidatorErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.properties.message);
  const message = `Invalid input data: ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handlerJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

const handlerJWTExpireError = () => {
  new AppError('Your token has expired! Please log in again. ', 401);
};

// development
const sendErrorDev = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  }
  // B) RENDERED WEBSITE
  console.error('ERROR 💥', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: err.message,
  });
};

// production
const sendErrorProd = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    // operational , trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });

      // programming or other unknown error: don't leak details error
    }
    // 1. Log error
    console.error('ERROR 💥', err);

    // 2. Send generic message
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }

  // B) RENDERED WEBSITE
  // operational , trusted error: send message to client

  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message,
    });
  }
  // programming or other unknown error: don't leak details error
  // 1. Log error
  console.error('ERROR 💥', err);
  // 2. Send generic message
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: 'Please try again later.',
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    else if (error.code === 11000) error = handleMongoErrorDB(error);
    else if (error.name === 'ValidationError')
      error = handleValidatorErrorDB(error);
    else if (error.name === 'JsonWebTokenError') error = handlerJWTError();
    else if (error.name === 'TokenExpiredError')
      error = handlerJWTExpireError();
    sendErrorProd(error, req, res);
  }
};
