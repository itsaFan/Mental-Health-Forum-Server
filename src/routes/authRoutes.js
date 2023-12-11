const express = require("express");
const { register, login, logout, refreshToken, requestResetPassword, resetPassword, forgotUsername } = require("../controllers/authController");
const { verifyRefreshToken, xRequestId, LoginLimiter } = require("../middlewares");
const { body } = require("express-validator");

const router = express.Router();

router.post("/register", xRequestId, body("username", "email", "password").trim(), register);
router.post("/login", LoginLimiter, xRequestId, body("identifier").trim(), login);
router.post("/logout", xRequestId, logout);
router.post("/refreshToken", xRequestId, verifyRefreshToken, refreshToken);
router.post("/request-reset-password", xRequestId, requestResetPassword);
router.post("/reset-password", xRequestId, resetPassword);
router.post("/forgot-username", xRequestId, forgotUsername);

module.exports = router;
