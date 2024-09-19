 import logger from "../utils/looger.js";
// Error-handling middleware
const errorHandler = (err, req, res, next) => {
  // log error

  logger.error(`Error: ${err.message}`,{
    method:req.method,
    url:req.url,
    stack:err.stack,
    statusCode:err.statusCode ||500
  });
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Server Error",
    });
  };
  
  export { errorHandler };
  