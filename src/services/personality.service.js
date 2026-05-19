const { v4: uuidv4 } = require("uuid");
const supabase = require("../config/supabase");
const personalityQuestions = require("../constants/personalityQuestions");
const { askGemini } = require("./gemini.service");
const getQuestions = async () => {
  return personalityQuestions;
};

const submitAnswers = async (userId, answers) => {
  // delete old answers
  await supabase.from("PersonalityAnswer").delete().eq("userId", userId);

  // prepare insert payload
  const payload = answers.map((item) => ({
    id: uuidv4(),
    userId,
    question: item.question,
    answer: item.answer,
  }));

  // save answers
  const { error } = await supabase.from("PersonalityAnswer").insert(payload);

  if (error) {
    throw error;
  }

  // generate personality summary
  const summary = await generatePersonalitySummary(answers);

  // update user profile
  await supabase
    .from("UserProfile")
    .update({
      personalitySummary: summary,
    })
    .eq("userId", userId);

  return {
    summary,
  };
};

const generatePersonalitySummary = async (answers) => {
  const formattedAnswers = answers
    .map((item) => `Question: ${item.question}\nAnswer: ${item.answer}`)
    .join("\n\n");

  const prompt = `
You are a mystical personality analyst and astrologer.

Based on the user's answers below, generate:
- personality traits
- emotional tendencies
- hidden strengths
- weaknesses
- relationship behavior
- career energy

Keep tone:
- mystical
- emotionally intelligent
- deeply personal
- engaging

Answers:
${formattedAnswers}
`;

  return askGemini(prompt);
};

module.exports = {
  getQuestions,
  submitAnswers,
};
