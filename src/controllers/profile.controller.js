const profileService = require("../services/profile.service");

const createProfile = async (req, res) => {
  try {
    const response = await profileService.createProfile(req.user.id, req.body);

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

module.exports = {
  createProfile,
};
