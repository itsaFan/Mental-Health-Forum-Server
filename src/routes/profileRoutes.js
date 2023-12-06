const express = require("express");
const userProfileController = require("../controllers/userProfileController");

router.patch("/user-profile/:userId", userProfileController.updateProfile);

module.exports = router;
