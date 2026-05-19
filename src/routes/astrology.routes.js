const express = require("express");

const router = express.Router();

const astrologyController = require("../controllers/astrology.controller");

const authMiddleware = require("../middleware/auth.middleware");

router.post("/ask", authMiddleware, astrologyController.askQuestion);

router.get("/history", authMiddleware, astrologyController.getHistory);

module.exports = router;
