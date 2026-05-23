const homeService = require("../services/home.service");

const getMyProfile = async (req, res) => {
  try {
    const profile = await homeService.getMyProfile(req.user.id);

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getMyProfile,
};
