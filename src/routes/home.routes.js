const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const { getMyProfile } = require("../controllers/home.controller");

router.get("/me", authMiddleware, getMyProfile);

module.exports = router;
