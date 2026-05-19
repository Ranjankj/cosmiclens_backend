const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

const usageController = require("../controllers/usage.controller");

router.get("/today", authMiddleware, usageController.getTodayUsage);

module.exports = router;
