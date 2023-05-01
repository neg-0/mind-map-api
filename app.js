const { generateResponse, generateChatResponse } = require("./gpt4");
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const logger = require("./logger");

const WebSocket = require("ws");
const wss = new WebSocket.Server({ server });

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
  logger.info("GET request to root endpoint");
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

// Initialize the data
let nodes = []; // Replace with your initial nodes data
let edges = []; // Replace with your initial edges data

// Broadcast a message to all connected clients
function broadcast(message) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

wss.on("connection", (socket) => {
  logger.info("Client connected");

  // Send the current nodes and edges to the newly connected client
  socket.send(JSON.stringify({ type: "nodes-update", nodes }));
  socket.send(JSON.stringify({ type: "edges-update", edges }));

  // Listen for messages from clients
  socket.on("message", (message) => {
    const data = JSON.parse(message);

    switch (data.type) {
      case "nodes-update":
        logger.info("Received nodes update");
        nodes = data.nodes;
        broadcast(JSON.stringify({ type: "nodes-update", nodes }));
        break;
      case "edges-update":
        logger.info("Received edges update");
        edges = data.edges;
        broadcast(JSON.stringify({ type: "edges-update", edges }));
        break;
      // Handle other message types as needed
    }
  });

  socket.on("close", () => {
    logger.info("Client disconnected");
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  logger.info(`Example app listening on port ${PORT}`);
});
