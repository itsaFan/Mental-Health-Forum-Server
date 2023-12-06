const express = require("express");
const { register, login, logout, refreshToken, requestResetPassword } = require("../controllers/authController");
const { verifyRefreshToken } = require("../middlewares/verifyJwt");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refreshToken", verifyRefreshToken, refreshToken);
router.post("/request-reset-password", requestResetPassword);

module.exports = router;
