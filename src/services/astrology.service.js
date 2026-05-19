const { v4: uuidv4 } = require("uuid");
const supabase = require("../config/supabase");
const { askGemini } = require("./gemini.service");
const { buildAstrologyPrompt } = require("../prompts/astrology.prompt");
const { checkUsageLimit } = require("./usage.service");

const askQuestion = async (userId, question) => {
  // check usage
  await checkUsageLimit(userId);

  // fetch profile
  const { data: profile, error } = await supabase
    .from("UserProfile")
    .select("*")
    .eq("userId", userId)
    .single();

  if (error || !profile) {
    throw new Error("User profile not found");
  }

  // build prompt
  const prompt = buildAstrologyPrompt({
    profile,
    question,
  });

  // call gemini
  const response = await askGemini(prompt);

  // save chat
  await supabase.from("Chat").insert({
    id: uuidv4(),
    userId,
    question,
    response,
  });

  return {
    question,
    response,
  };
};

const getHistory = async (userId) => {
  const { data, error } = await supabase
    .from("Chat")
    .select("*")
    .eq("userId", userId)
    .order("createdAt", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return data;
};

module.exports = {
  askQuestion,
  getHistory,
};
