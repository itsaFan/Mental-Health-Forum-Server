const express = require("express");
const { getAllUsers, getAllRole, updateUserRole } = require("../controllers/userController");
const { verifyAccessToken } = require("../middlewares/verifyJwt");
const { checkRole } = require("../middlewares/roleAuth");

const router = express.Router();

router.get("/", verifyAccessToken, checkRole(["ROLE_ADMIN"]), getAllUsers);

router.get("/role", verifyAccessToken, checkRole(["ROLE_ADMIN"]), getAllRole);
router.put("/role/:userId/updateRole/:newRoleId", verifyAccessToken, checkRole(["ROLE_ADMIN"]), updateUserRole);

module.exports = router;
