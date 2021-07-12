const express = require("express");
const router = express.Router();

const profileController = require("./../controllers/profileController");
const authController = require("./../controllers/authController");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

router.get("/profile", profileController.getProfile);

module.exports = router;
