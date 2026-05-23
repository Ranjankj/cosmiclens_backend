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

  // fetch profile
  const { data: profile, error: profileError } = await supabase
    .from("UserProfile")
    .select("*")
    .eq("userId", userId)
    .single();

  if (profileError) {
    throw profileError;
  }

  // generate summary
  const summary = await generatePersonalitySummary(profile, answers);

  // update profile
  const { error: updateError } = await supabase
    .from("UserProfile")
    .update({
      personalitySummary: summary,
    })
    .eq("userId", userId);

  if (updateError) {
    throw updateError;
  }

  return {
    summary,
  };
};

const generatePersonalitySummary = async (profile, answers) => {
  const formattedAnswers = answers
    .map(
      (item) =>
        `Question: ${item.question}
Answer: ${item.answer}`,
    )
    .join("\n\n");

  const prompt = `
You are an emotionally intelligent modern astrologer and personality analyst.

Your task is to generate a deeply personalized astrology personality profile.

IMPORTANT RULES:
- Use simple and natural English
- Keep tone warm, insightful, and personal
- Avoid cringe mystical roleplay
- Avoid fantasy storytelling
- Write like a smart astrologer talking to a modern human
- Keep insights emotionally relatable and practical
- Response must be valid JSON only
- Do not wrap JSON in markdown
- Do not add explanation outside JSON

USER BIRTH DETAILS:
Name: ${profile.fullName}
Birth Date: ${profile.birthDate}
Birth Time: ${profile.birthTime}
Birth Place: ${profile.birthPlace}
Zodiac Sign: ${profile.zodiacSign}

PERSONALITY ANSWERS:
${formattedAnswers}

Return ONLY valid JSON:

{
  "corePersonality": "",
  "emotionalTendencies": "",
  "hiddenStrengths": [],
  "weaknesses": [],
  "relationshipStyle": "",
  "careerEnergy": "",
  "growthAdvice": ""
}
`;

  const response = await askGemini(prompt);

  try {
    const cleanedResponse = response
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleanedResponse);
  } catch (error) {
    console.error("Gemini JSON Parse Error:", error);

    return {
      corePersonality: "Unable to generate personality profile.",
      emotionalTendencies: "",
      hiddenStrengths: [],
      weaknesses: [],
      relationshipStyle: "",
      careerEnergy: "",
      growthAdvice: "",
    };
  }
};

module.exports = {
  getQuestions,
  submitAnswers,
};
