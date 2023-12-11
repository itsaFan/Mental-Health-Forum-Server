const express = require("express");
const { createPost, editPost, deletePost, viewPostById } = require("../controllers/postController");
const { xRequestId, verifyAccessToken, checkRole } = require("../middlewares");

const router = express.Router();

router.get("/:postId", xRequestId, viewPostById);
router.post("/add", verifyAccessToken, checkRole(["ROLE_USER", "ROLE_MODERATOR", "ROLE_ADMIN"]), createPost);

router.patch("/edit/:postId", verifyAccessToken, checkRole(["ROLE_USER", "ROLE_MODERATOR"]), editPost);
router.delete("/delete/:postId", verifyAccessToken, checkRole(["ROLE_USER", "ROLE_MODERATOR", "ROLE_ADMIN"]), deletePost);

module.exports = router;
