const usageService = require("../services/usage.service");

const getTodayUsage = async (req, res) => {
  try {
    const response = await usageService.getTodayUsage(req.user.id);

    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getTodayUsage,
};
