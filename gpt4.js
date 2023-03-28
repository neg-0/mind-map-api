const openai = require("openai");

// OpenAI key from environment variable
openai.apiKey = process.env.OPENAI_API_KEY;

async function generateResponse(prompt) {
  try {
    const result = await openai.Completion.create({
      engine: "text-davinci-002", // You can use other engines like 'text-curie-002', 'text-babbage-002', etc.
      prompt: prompt,
      max_tokens: 100,
      n: 1,
      stop: null,
      temperature: 0.7,
    });

    return result.choices[0].text;
  } catch (error) {
    console.error("Error generating response:", error);
    return "";
  }
}

module.exports = {
  generateResponse,
};
