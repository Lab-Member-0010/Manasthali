import logger from "./logger.js";

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    logger.error(`${req.method} ${req.originalUrl} - ${err.message}`);
    next(err);
  });
};

export default asyncHandler;
