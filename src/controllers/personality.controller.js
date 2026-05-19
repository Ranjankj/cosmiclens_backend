const personalityService = require("../services/personality.service");

const getQuestions = async (_, res) => {
  try {
    const response = await personalityService.getQuestions();

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

const submitAnswers = async (req, res) => {
  try {
    const response = await personalityService.submitAnswers(
      req.user.id,
      req.body.answers,
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

module.exports = {
  getQuestions,
  submitAnswers,
};
