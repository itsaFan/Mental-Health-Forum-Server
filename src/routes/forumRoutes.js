const express = require("express");
const { verifyAccessToken } = require("../middlewares/verifyJwt");
const { checkRole } = require("../middlewares/roleAuth");
const { createForum, viewAllForums } = require("../controllers/forumController");

const router = express.Router();
// Add verify & Role nanti
router.post("/add", createForum);
router.get("/all", viewAllForums);

module.exports = router;