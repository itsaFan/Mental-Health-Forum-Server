const express = require("express");
const { verifyAccessToken } = require("../middlewares/verifyJwt");
const { createPost, editPost } = require("../controllers/postController");

const router = express.Router();

router.post("/", verifyAccessToken, createPost);
router.patch("/edit/:postId", verifyAccessToken, editPost);

module.exports = router;
