const astrologyService = require("../services/astrology.service");

const askQuestion = async (req, res) => {
  try {
    const response = await astrologyService.askQuestion(
      req.user.id,
      req.body.question,
    );

    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getHistory = async (req, res) => {
  try {
    const response = await astrologyService.getHistory(req.user.id);

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
  askQuestion,
  getHistory,
};
