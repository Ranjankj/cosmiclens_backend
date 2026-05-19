const { v4: uuidv4 } = require("uuid");

const supabase = require("../config/supabase");

const DAILY_LIMIT = 5;

const checkUsageLimit = async (userId) => {
  const today = new Date().toISOString().split("T")[0];

  const { data } = await supabase
    .from("DailyUsage")
    .select("*")
    .eq("userId", userId)
    .eq("date", today)
    .single();

  if (!data) {
    await supabase.from("DailyUsage").insert({
      id: uuidv4(),
      userId,
      date: today,
      questionsUsed: 1,
    });

    return;
  }

  if (data.questionsUsed >= DAILY_LIMIT) {
    throw new Error("Daily question limit reached");
  }

  await supabase
    .from("DailyUsage")
    .update({
      questionsUsed: data.questionsUsed + 1,
    })
    .eq("id", data.id);
};

const getTodayUsage = async (userId) => {
  const today = new Date().toISOString().split("T")[0];

  const { data } = await supabase
    .from("DailyUsage")
    .select("*")
    .eq("userId", userId)
    .eq("date", today)
    .single();

  return {
    used: data?.questionsUsed || 0,
    limit: DAILY_LIMIT,
    remaining: DAILY_LIMIT - (data?.questionsUsed || 0),
  };
};

module.exports = {
  checkUsageLimit,
  getTodayUsage,
};
