const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    const { role } = req.userPayload;

    if (!allowedRoles.includes(role)) {
      return res.status(403).json({
        message: "Access Denied, you don't have permission to access this endpoint",
      });
    }
    next();
  };
};

module.exports = {
  checkRole,
};
