const { v4: uuidv4 } = require("uuid");

const supabase = require("../config/supabase");

const { getZodiacSign } = require("../utils/zodiac.util");

const createProfile = async (userId, payload) => {
  const { fullName, birthDate, birthTime, birthPlace } = payload;

  // check existing profile
  const { data: existingProfile } = await supabase
    .from("UserProfile")
    .select("*")
    .eq("userId", userId)
    .single();

  if (existingProfile) {
    throw new Error("Profile already exists");
  }

  const zodiacSign = getZodiacSign(birthDate);

  const profilePayload = {
    id: uuidv4(),
    userId,
    fullName,
    birthDate,
    birthTime,
    birthPlace,
    zodiacSign,
  };

  const { data, error } = await supabase
    .from("UserProfile")
    .insert(profilePayload)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

module.exports = {
  createProfile,
};
