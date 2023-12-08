const express = require("express");
const { verifyAccessToken } = require("../middlewares/verifyJwt");
const { createPost, editPost, viewAllPosts } = require("../controllers/postController");
const { checkRole } = require("../middlewares/roleAuth");

const router = express.Router();

router.post("/", verifyAccessToken, checkRole(["ROLE_USER", "ROLE_MODERATOR", "ROLE_ADMIN"]), createPost);
router.get("/all", viewAllPosts);

router.patch("/edit/:postId", verifyAccessToken, checkRole(["ROLE_USER", "ROLE_ADMIN"]), editPost);

module.exports = router;
