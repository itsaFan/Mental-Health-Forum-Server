const express = require("express");
const { verifyAccessToken } = require("../middlewares/verifyJwt");
const { checkRole } = require("../middlewares/roleAuth");
const { createForum } = require("../controllers/forumController");

const router = express.Router();

router.post("/add", createForum);

module.exports = router;
