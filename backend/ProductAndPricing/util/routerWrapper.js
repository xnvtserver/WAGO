// routerWrapper.js
// In routerWrapper.js
export function wrapHandler(handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (err) {
      const statusCode = err.statusCode || 500;
      res.status(statusCode).json({
        error: process.env.NODE_ENV === 'production' 
          ? 'Operation failed' 
          : err.message,
        code: err.code || 'SERVER_ERROR'
      });
    }
  };
}