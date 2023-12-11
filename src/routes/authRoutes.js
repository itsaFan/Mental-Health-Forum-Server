const express = require("express");
const { register, login, logout, refreshToken, requestResetPassword, resetPassword, forgotUsername } = require("../controllers/authController");
const { verifyRefreshToken, xRequestId } = require("../middlewares");

const router = express.Router();

router.post("/register", xRequestId, register);
router.post("/login", xRequestId, login);
router.post("/logout", xRequestId, logout);
router.post("/refreshToken", xRequestId, verifyRefreshToken, refreshToken);
router.post("/request-reset-password", xRequestId, requestResetPassword);
router.post("/reset-password", xRequestId, resetPassword);
router.post("/forgot-username", xRequestId, forgotUsername);

module.exports = router;
