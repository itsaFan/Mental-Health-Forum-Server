const express = require("express");
const { commentToPost } = require("../controllers/commentController");
const { verifyAccessToken } = require("../middlewares/verifyJwt");

const router = express.Router();

router.post("/", verifyAccessToken, commentToPost);

module.exports = router;
