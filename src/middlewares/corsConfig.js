const config = require("../config/config");


const corsOptions = {
    origin: [config.devUrl, config.mainUrl],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true,
    optionsSuccessStatus: 204,
};

const corsMiddleware = cors(corsOptions);

module.exports = corsMiddleware;