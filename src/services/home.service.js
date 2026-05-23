const supabase = require("../config/supabase");

const getMyProfile = async (userId) => {
  const { data, error } = await supabase
    .from("UserProfile")
    .select("*")
    .eq("userId", userId)
    .single();

  if (error) {
    throw error;
  }

  return data;
};

module.exports = {
  getMyProfile,
};
