const express = require("express");
const { createForum, viewAllForums } = require("../controllers/forumController");
const { viewPostsByForum } = require("../controllers/postController");
const { verifyAccessToken, checkRole } = require("../middlewares");

const router = express.Router();

router.get("/all", viewAllForums);
router.get("/posts", viewPostsByForum);
router.post("/add", verifyAccessToken, checkRole(["ROLE_MODERATOR", "ROLE_ADMIN"]), createForum);

module.exports = router;
