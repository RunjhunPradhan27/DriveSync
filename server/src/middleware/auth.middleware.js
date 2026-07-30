const jwt = require('jsonwebtoken');

/**
 * Authentication Middleware
 * Intercepts incoming requests, validates Bearer JWT tokens in the Authorization header,
 * attaches decoded user payload to req.user, and forwards request execution.
 */
const authenticateUser = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers['authorization'];

    // Validate presence of Authorization header
    if (!authHeader) {
      return res.status(401).json({
        status: 'error',
        message: 'Access token missing'
      });
    }

    // Extract Bearer token string
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : authHeader;

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Access token missing'
      });
    }

    // Verify token cryptographic signature and expiration
    const secretKey = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secretKey);

    // Attach decoded user payload to request object
    req.user = decoded;

    // Proceed to next middleware or controller handler
    return next();
  } catch (error) {
    console.error('JWT Authentication Error:', error.message);
    return res.status(401).json({
      status: 'error',
      message: 'Invalid or expired token'
    });
  }
};

module.exports = {
  authenticateUser
};
