const cors = require('cors');


const corsOptions = {
    origin: [process.env.DEV_URL, process.env.MAIN_URL],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true,
    optionsSuccessStatus: 204,
};


const corsMiddleware = cors(corsOptions);

module.exports = corsMiddleware;