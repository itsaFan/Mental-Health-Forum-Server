const express = require("express");
const { getUserProfile, updateProfile, getUserProfileById } = require("../controllers/profileController");
const { verifyAccessToken, checkRole } = require("../middlewares");


const router = express.Router();

router.get("/:userId", getUserProfileById); //public user profile view
router.get("/", verifyAccessToken, checkRole(["ROLE_USER", "ROLE_MODERATOR", "ROLE_ADMIN"]), getUserProfile);
router.put("/", verifyAccessToken, checkRole(["ROLE_USER", "ROLE_MODERATOR", "ROLE_ADMIN"]), updateProfile);

module.exports = router;
