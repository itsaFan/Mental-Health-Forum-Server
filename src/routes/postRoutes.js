const express = require("express");
const { createPost, editPost, deletePost, viewPostById, viewTopTenPosts } = require("../controllers/postController");
const { xRequestId, verifyAccessToken, checkRole } = require("../middlewares");

const router = express.Router();

router.get("/recent", viewTopTenPosts);
router.get("/:postId", xRequestId, viewPostById);
router.post("/add", xRequestId, verifyAccessToken, checkRole(["ROLE_USER", "ROLE_MODERATOR", "ROLE_ADMIN"]), createPost);

router.patch("/edit/:postId", xRequestId, verifyAccessToken, checkRole(["ROLE_USER", "ROLE_MODERATOR"]), editPost);
router.delete("/delete/:postId", xRequestId, verifyAccessToken, checkRole(["ROLE_USER", "ROLE_MODERATOR", "ROLE_ADMIN"]), deletePost);

module.exports = router;
