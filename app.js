const { generateResponse } = require("./gpt4");
const express = require("express");
const app = express();
const port = 3000;

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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
