const notFoundMiddleware = (req, res, next) => {
  const error = new Error("URL Not Found");
  res.status(404);
  next(error);
};

const errorHandlerMiddleware = (err, req, res, next) => {
  const statusCode = req.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  const errStackStr = `\nStack: ${err.stack}`
  res.json({
    message: `${err.message}${process.env.NODE_ENV === "production" ? null : errStackStr}`,
  });
  return;
};

module.exports = { notFoundMiddleware, errorHandlerMiddleware };
