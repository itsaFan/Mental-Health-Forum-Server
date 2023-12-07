const express = require("express");
const { getUserProfile, updateProfile } = require("../controllers/profileController");
const { verifyAccessToken } = require("../middlewares/verifyJwt");

const router = express.Router();

router.get("/", verifyAccessToken, getUserProfile);
router.put("/", verifyAccessToken, updateProfile);

module.exports = router;
