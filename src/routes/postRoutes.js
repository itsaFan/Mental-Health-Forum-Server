const express = require("express");
const { verifyAccessToken } = require("../middlewares/verifyJwt");
const { createPost, editPost } = require("../controllers/postController");
const { checkRole } = require("../middlewares/roleAuth");

const router = express.Router();

router.post("/", verifyAccessToken, checkRole(["ROLE_USER", "ROLE_MODERATOR"]), createPost);
router.patch("/edit/:postId", verifyAccessToken, checkRole(["ROLE_USER", "ROLE_MODERATOR"]), editPost);

module.exports = router;
