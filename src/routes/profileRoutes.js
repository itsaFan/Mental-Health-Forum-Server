const express = require("express");
const { getUserProfile, updateProfile, getUserProfileById } = require("../controllers/profileController");
const { verifyAccessToken } = require("../middlewares/verifyJwt");

const router = express.Router();

router.get("/", verifyAccessToken, getUserProfile);
router.get("/:userId", verifyAccessToken, getUserProfileById);
router.put("/", verifyAccessToken, updateProfile);

module.exports = router;
