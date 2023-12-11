const express = require("express");
const { register, login, logout, refreshToken, requestResetPassword, resetPassword, forgotUsername } = require("../controllers/authController");
const { verifyRefreshToken } = require("../middlewares");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refreshToken", verifyRefreshToken, refreshToken);
router.post("/request-reset-password", requestResetPassword);
router.post("/reset-password", resetPassword);
router.post("/forgot-username", forgotUsername);

module.exports = router;
