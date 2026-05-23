const express = require("express");

const router = express.Router();
const personalityController = require("../controllers/personality.controller");
const authMiddleware = require("../middleware/auth.middleware");
router.get("/questions", authMiddleware, personalityController.getQuestions);
router.post("/submit", authMiddleware, personalityController.submitAnswers);

module.exports = router;
