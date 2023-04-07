require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

/**
 * Generates a response from a prompt
 * @param {string} prompt The prompt to generate a response from
 * @param {string} model The model to use
 * @param {number} responses The number of responses to generate
 * @returns {string} The generated response
 * @throws {Error} If the prompt is invalid
 */
async function generateResponse(prompt, model = "gpt-4", responses = 1) {
  // Verify that prompt is a string
  if (typeof prompt !== "string") {
    throw new Error("Invalid prompt");
  }

  // Verify the model
  if (!verifyModel(model)) {
    throw new Error("Invalid model");
  }

  // Verify that responses is a number
  if (typeof responses !== "number") {
    throw new Error("Invalid responses");
  }

  try {
    const completion = await openai.createChatCompletion({
      model,
      messages: [{ role: "user", content: prompt }],
      n: responses,
    });
    console.log(completion.data.choices);
    return completion.data.choices[0].message.content;
  } catch (error) {
    console.error("Error generating response:", error);
    return "";
  }
}

/**
 * Generates a response from a series of chat messages
 * @param {object[]} messages An array of prompt messages
 * @param {number} responses The number of responses to generate
 * @returns {object[]} An array of messages
 */
async function generateChatResponse(messages, model = "gpt-4", responses = 1) {
  // Verify that messages is an array of objects, with role and content keys and string values
  if (
    !Array.isArray(messages) ||
    messages.some(
      (message) =>
        typeof message !== "object" ||
        typeof message.role !== "string" ||
        typeof message.content !== "string"
    )
  ) {
    throw new Error("Invalid messages");
  }

  // Verify the model
  if (!verifyModel(model)) {
    throw new Error("Invalid model");
  }

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages,
      n: responses,
    });
    console.log(completion.data);
    return completion.data.choices;
  } catch (error) {
    console.error("Error generating response:", error);
    return "";
  }
}

function verifyModel(model) {
  // Verify that model is a string of a valid model
  const validChatModels = [
    "gpt-4",
    "gpt-4-0314",
    "gpt-4-32k",
    "gpt-4-32k-0314",
    "gpt-3.5-turbo",
    "gpt-3.5-turbo-0301",
    "text-davinci-003",
    "text-davinci-002",
    "code-davinci-002",
  ];
  if (typeof model !== "string" || !validChatModels.includes(model)) {
    return false;
  }
  return true;
}

module.exports = { generateResponse, generateChatResponse };
