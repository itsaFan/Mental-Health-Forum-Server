const express = require("express");
const config = require("./config/config");
const cookieParser = require("cookie-parser");

const app = express();
app.use(cookieParser());
app.use(express.json());

app.listen(config.port, () => console.log(`Server is running on http://localhost:${config.port}`));
