const authService = require("../services/auth.service");

const register = async (req, res) => {
  try {
    const response = await authService.register(req.body);

    res.status(201).json({
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

const login = async (req, res) => {
  try {
    const response = await authService.login(req.body);

    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  register,
  login,
};
