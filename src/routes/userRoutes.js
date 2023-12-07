const express = require("express")
const {getAllUsers} = require("../controllers/userController")
const { verifyAccessToken } = require("../middlewares/verifyJwt");


const router = express.Router();

router.get("/", verifyAccessToken, getAllUsers);

module.exports = router;