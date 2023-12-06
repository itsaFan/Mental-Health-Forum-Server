require("dotenv").config();

const config = {
    port: process.env.PORT,
    mongoUri: process.env.MONGODB_URI,
    accessSecret: process.env.ACCESS_SECRET,
    refreshSecret: process.env.REFRESH_SECRET,
    mainUrl: process.env.MAIN_URL,
    devUrl: process.env.DEV_URL,
}


module.exports = config