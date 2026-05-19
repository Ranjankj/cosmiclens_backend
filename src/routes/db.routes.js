const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");

router.get("/", async (_, res) => {
  try {
    const { data, error } = await supabase.from("User").select("*").limit(1);

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      message: "Database connected successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
