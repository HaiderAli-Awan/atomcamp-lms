import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";

app.post("/api/claude", async (req, res) => {
  const { messages, system } = req.body;

  if (!ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: "Missing Anthropic API key" });
  }

  try {
    const response = await fetch(ANTHROPIC_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022", // change if needed
        max_tokens: 1000,
        messages,
        system: system || "",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Claude API error:", errorText);
      return res.status(response.status).json({ error: "Claude API request failed" });
    }

    const data = await response.json();
    const replyText = data.content[0].text;
    res.json({ content: replyText });
  } catch (error) {
    console.error("Backend error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});