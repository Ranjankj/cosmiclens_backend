const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

router.get("/me", authMiddleware, async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

module.exports = router;
