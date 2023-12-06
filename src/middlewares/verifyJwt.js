const config = require("../config/config");
const jwt = require("jsonwebtoken");

const verifyAccessToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!config.accessSecret) {
    return res.status(500).json({ error: "Access Secret is missing or undefined" });
  }

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, config.accessSecret, (error, userPayload) => {
      if (error) {
        console.log("JWT Verification Error:", error);
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
      }
      req.userPayload = userPayload;
      next();
    });
  } else {
    res.status(401).json({ error: "Unauthorized: No bearer token" });
  }
};

module.exports = {
  verifyAccessToken,
};
