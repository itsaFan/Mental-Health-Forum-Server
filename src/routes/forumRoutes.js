const express = require("express");
const { verifyAccessToken } = require("../middlewares/verifyJwt");
const { checkRole } = require("../middlewares/roleAuth");
const { createForum, viewAllForums } = require("../controllers/forumController");
const { viewPostsByForum } = require("../controllers/postController");

const router = express.Router();
// Add verify & Role nanti
router.post("/add",verifyAccessToken, checkRole(["ROLE_USER", "ROLE_MODERATOR", "ROLE_ADMIN"]) , createForum);
router.get("/all", viewAllForums);
router.get("/posts", viewPostsByForum);

module.exports = router;
