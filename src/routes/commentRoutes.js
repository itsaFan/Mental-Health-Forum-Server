const express = require("express");
const { commentToPost, editOwnComment, deleteOwnComment } = require("../controllers/commentController");
const { verifyAccessToken } = require("../middlewares/verifyJwt");
const { checkRole } = require("../middlewares/roleAuth");

const router = express.Router();

router.post("/:postId", verifyAccessToken, checkRole(["ROLE_USER", "ROLE_MODERATOR", "ROLE_ADMIN"]), commentToPost);
router.patch("/:postId", verifyAccessToken, checkRole(["ROLE_USER", "ROLE_MODERATOR", "ROLE_ADMIN"]), editOwnComment);
router.delete("/:postId", verifyAccessToken, deleteOwnComment);

module.exports = router;
