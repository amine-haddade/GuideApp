export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      const userRole = req.user?.role; // comes from verifyAccessToken middleware

      if (!userRole) {
        const error = new Error(`user role not found`);
        error.statusCode = 403;
        throw error;
      }

      if (!allowedRoles.includes(userRole)) {
        const error = new Error(`access denied : ${userRole} is not allowed to do this action` );
        error.statusCode = 403;
        throw error;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
