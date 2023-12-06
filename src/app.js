const express = require("express");
const config = require("./config/config");
const cookieParser = require("cookie-parser");
const dbConnection = require("./config/db-config");

const app = express();
app.use(cookieParser());
app.use(express.json());

// DB Connection
dbConnection;

app.listen(config.port, () => console.log(`Server is running on http://localhost:${config.port}`));
