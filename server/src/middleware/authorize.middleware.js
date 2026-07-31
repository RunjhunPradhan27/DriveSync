/**
 * Role-Based Authorization Middleware Factory
 * Restricts access to routes based on user roles attached to req.user.
 * 
 * @param {...string} allowedRoles - Allowed user roles (e.g. 'Admin', 'Sales Executive')
 * @returns {Function} Express middleware function
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // Check if user is authenticated (req.user exists)
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized'
      });
    }

    // Check if user's role is permitted to access the resource
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'Forbidden'
      });
    }

    // User is authorized; proceed to next middleware or controller handler
    return next();
  };
};

module.exports = {
  authorize
};
