const express = require("express");
const config = require("./config/config");
const cookieParser = require("cookie-parser");
const dbConnection = require("./config/db-config");

const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const corsMiddleware = require("./middlewares/corsConfig")

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(corsMiddleware);

// DB Connection
dbConnection();

// Routing
app.use("/api", authRoutes);
app.use("/api/profile", profileRoutes);

app.listen(config.port, () => console.log(`Server is running on http://localhost:${config.port}`));
