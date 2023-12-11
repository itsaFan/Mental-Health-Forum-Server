const express = require("express");
const { commentToPost, editOwnComment, deleteOwnComment } = require("../controllers/commentController");
const { verifyAccessToken, checkRole } = require("../middlewares");


const router = express.Router();

router.post("/:postId", verifyAccessToken, checkRole(["ROLE_USER", "ROLE_MODERATOR", "ROLE_ADMIN"]), commentToPost);
router.patch("/:postId", verifyAccessToken, checkRole(["ROLE_USER", "ROLE_MODERATOR", "ROLE_ADMIN"]), editOwnComment);
router.delete("/:postId", verifyAccessToken, checkRole(["ROLE_USER", "ROLE_MODERATOR", "ROLE_ADMIN"]), deleteOwnComment);

module.exports = router;
