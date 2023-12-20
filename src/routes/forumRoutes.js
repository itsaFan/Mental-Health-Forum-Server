const express = require("express");
const { createForum, viewAllForums, viewForumStatistics, searchForums } = require("../controllers/forumController");
const { viewPostsByForum, viewPaginatedPosts } = require("../controllers/postController");
const { verifyAccessToken, checkRole, xRequestId } = require("../middlewares");

const router = express.Router();

router.get("/all", viewAllForums);
router.get("/stats", viewForumStatistics);
router.get("/search", xRequestId, searchForums);
router.get("/:forumId", viewPostsByForum); //view posts based on the forum id
router.get("/:forumId/posts", viewPaginatedPosts);
router.post("/add", xRequestId, verifyAccessToken, checkRole(["ROLE_MODERATOR", "ROLE_ADMIN"]), createForum);

module.exports = router;
