const express = require("express");
const http = require("http");
const { initSocketIo } = require("./middlewares/socket");
const config = require("./config/config");
const cookieParser = require("cookie-parser");
const dbConnection = require("./config/db-config");
const { corsMiddleware, setHelmet, setPermissionPolicy } = require("./middlewares");

const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const postRoutes = require("./routes/postRoutes");
const userRoutes = require("./routes/userRoutes");
const forumRoutes = require("./routes/forumRoutes");
const commentRoutes = require("./routes/commentRoutes");

const app = express();
const server = http.createServer(app);
initSocketIo(server);
app.use(cookieParser());
app.use(express.json());
app.use(corsMiddleware);
app.use(setPermissionPolicy);
setHelmet(app);

// DB Connection
dbConnection();

// Routing
app.use("/api", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/user", userRoutes);
app.use("/api/forum", forumRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);

server.listen(config.port, () => console.log(`Server is running on http://localhost:${config.port}`));
// app.listen(config.port, () => console.log(`Server is running on http://localhost:${config.port}`));
