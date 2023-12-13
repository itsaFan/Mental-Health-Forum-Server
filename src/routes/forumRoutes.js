const express = require("express");
const { createForum, viewAllForums } = require("../controllers/forumController");
const { viewPostsByForum } = require("../controllers/postController");
const { verifyAccessToken, checkRole, xRequestId } = require("../middlewares");

const router = express.Router();

router.get("/all", viewAllForums);
router.get("/:forumId", viewPostsByForum); //view posts based on the forum id
router.post("/add", xRequestId, verifyAccessToken, checkRole(["ROLE_MODERATOR", "ROLE_ADMIN"]), createForum);

module.exports = router;
