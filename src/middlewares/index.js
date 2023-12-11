const corsMiddleware = require("./corsConfig");
const { setHelmet } = require("./helmet");
const { LoginLimiter } = require("./limiter");
const { setPermissionPolicy } = require("./permissionPolicy");
const { checkRole } = require("./roleAuth");
const { verifyAccessToken, verifyRefreshToken } = require("./verifyJwt");
const { xRequestId } = require("./xRequestId");

module.exports = {
  corsMiddleware,
  setHelmet,
  setPermissionPolicy,
  xRequestId,
  checkRole,
  verifyAccessToken,
  verifyRefreshToken,
  LoginLimiter,
};
