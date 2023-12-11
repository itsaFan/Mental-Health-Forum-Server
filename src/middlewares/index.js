const corsMiddleware = require("./corsConfig");
const { setHelmet } = require("./helmet");
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
};
