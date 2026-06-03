import OpenAI from "openai";
import { MENTOR_CONTEXT } from "./mentorPersonality.js";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:5173",
    "X-Title": "MentorAI",
  },
});

const MODEL = process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini";
const sessions = new Map();

function getOrCreateSession(sessionId) {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, {
      history: [],
      hintLevel: 1,
      createdAt: Date.now(),
      isInitialized: false,
    });
  }
  return sessions.get(sessionId);
}

async function getMentorResponse(sessionId, userMessage, mode = "default") {
  console.log(`Session: ${sessionId}, Mode: ${mode}, Model: ${MODEL}`);

  const session = getOrCreateSession(sessionId);

  let modeInstruction = "";
  if (mode === "socratic") {
    modeInstruction =
      "\n\nCURRENT MODE: SOCRATIC. You can ONLY ask questions. No statements.";
  } else if (mode === "debug") {
    modeInstruction =
      "\n\nCURRENT MODE: DEBUG. Focus on helping understand the error.";
  } else if (mode === "review") {
    modeInstruction =
      "\n\nCURRENT MODE: CODE REVIEW. Praise first, then one improvement.";
  }

  // Build messages array
  const messages = [];

  // First message: inject mentor context
  if (!session.isInitialized) {
    messages.push({
      role: "user",
      content:
        MENTOR_CONTEXT +
        modeInstruction +
        `\n\nCurrent hint level: 1/5.\n\nAcknowledge these instructions and ask what I'm working on.`,
    });
    messages.push({
      role: "assistant",
      content:
        "Got it! I am MentorAI, your coding mentor. I will guide you with questions and progressive hints — never direct answers. What are you working on today?",
    });
    session.isInitialized = true;
  }

  // Add conversation history
  messages.push(
    ...session.history.slice(-10).map((msg) => ({
      role: msg.role === "mentor" ? "assistant" : msg.role,
      content: msg.content,
    })),
  );

  // Add current message
  messages.push({
    role: "user",
    content: userMessage,
  });

  try {
    console.log("Sending to OpenRouter...");

    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    const response = completion.choices[0].message.content;
    console.log("Response received:", response.substring(0, 80) + "...");

    // Update session
    session.history.push(
      { role: "user", content: userMessage },
      { role: "mentor", content: response },
    );

    // Adjust hint level based on frustration
    const frustrationSignals = [
      "stuck",
      "help",
      "confused",
      "dont understand",
      "still not working",
      "give up",
      "just tell me",
    ];
    const userLower = userMessage.toLowerCase();
    if (frustrationSignals.some((signal) => userLower.includes(signal))) {
      session.hintLevel = Math.min(session.hintLevel + 1, 5);
    }

    return {
      response,
      hintLevel: session.hintLevel,
      mode,
      sessionId,
    };
  } catch (error) {
    console.error("OpenRouter error:", error.message);
    throw error;
  }
}

setInterval(() => {
  const oneHourAgo = Date.now() - 3600000;
  for (const [id, session] of sessions) {
    if (session.createdAt < oneHourAgo) {
      sessions.delete(id);
    }
  }
}, 300000);

export { getMentorResponse };
