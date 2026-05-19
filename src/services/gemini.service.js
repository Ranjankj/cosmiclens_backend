const axios = require("axios");

const askGemini = async (prompt) => {
  try {
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent",
      {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": process.env.GEMINI_API_KEY,
        },
      },
    );

    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error(error.response?.data || error.message);

    throw new Error("Gemini API Failed");
  }
};

module.exports = {
  askGemini,
};
