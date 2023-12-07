const express = require("express")
const {getAllUsers, getAllRole, updateUserRole} = require("../controllers/userController")
const { verifyAccessToken } = require("../middlewares/verifyJwt");


const router = express.Router();

router.get("/", verifyAccessToken, getAllUsers);




router.get("/role", verifyAccessToken, getAllRole)
router.put("/role/:userId/updateRole/:newRoleId", verifyAccessToken, updateUserRole)

module.exports = router;