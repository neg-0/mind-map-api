const { generateResponse, generateChatResponse } = require("./gpt4");
const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/api/ai/insights", async (req, res) => {
  const prompt = req.body.prompt;

  try {
    const response = await generateResponse(prompt);
    res.json({ insight: response });
  } catch (error) {
    res.status(500).json({ error: "Error generating AI insight" });
  }
});

/**
 * Integrates a body of text between two contextual texts
 */
app.post("/api/ai/integrate", async (req, res) => {
  const { text, startContext, endContext } = req.body;
  const messages = [
    {
      role: "system",
      content:
        "Seamlessly integrate the given text into the given context so that the verbiage, tone, and style are consistent with the context. Only return the integrated text. Do not return the context. Do not return any explanation of how the text was integrated.",
    },
    {
      role: "user",
      content: `Given the following text: ${text}
    
    Seamlessly integrate the text into the given context so that the verbiage, tone, and style are consistent with the context. Only return the integrated text. Do not return the context. Do not return any explanation of how the text was integrated.

    ${startContext}

    INSERT TEXT HERE
    
    ${endContext}`,
    },
  ];
  try {
    const response = await generateChatResponse(messages);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: "Error integrating text" });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
