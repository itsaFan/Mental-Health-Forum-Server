const config = require("../config/config");
const cors = require("cors");

const corsOptions = {
  origin: [config.devUrl, config.mainUrl],
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  credentials: true,
  optionsSuccessStatus: 200,
};

const corsMiddleware = cors(corsOptions);

module.exports = corsMiddleware;
