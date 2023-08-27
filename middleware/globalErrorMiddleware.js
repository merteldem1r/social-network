const globalErrorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  res.status(err.statusCode).json({
    status: err.statusCode,
    error: err.message,
  });
};

module.exports = globalErrorMiddleware;
