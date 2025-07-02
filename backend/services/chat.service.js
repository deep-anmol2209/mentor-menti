
const fs = require("fs");

const { ChatOpenAI } = require("@langchain/openai");
const { PromptTemplate } = require("@langchain/core/prompts");
const { LLMChain } = require("langchain/chains");
const config = require("../config");

// Read your custom document or dataset
const fileData = fs.readFileSync('./dataSource.txt', 'utf-8');

// Initialize the LLM using Together.ai via OpenAI-compatible API
const llm = new ChatOpenAI({
  temperature: 0,
  apiKey: config.TOGETHER_API_KEY, // Your Together AI key
  configuration: {
    baseURL: "https://api.together.xyz/v1" // Must override OpenAI's default
  },
  modelName: "mistralai/Mistral-7B-Instruct-v0.1",
});

// Define a prompt template
const prompt = PromptTemplate.fromTemplate(`
You are a helpful and friendly assistant.

If the user greets you (e.g., "hi", "hello"), just greet back and offer help.
If the user asks a question, use the following data to answer it.
You are MentorMenti, an AI assistant embedded in a mentoring and course-booking platform. Your goal is to provide clear, helpful, and friendly support to both mentors and students. You have knowledge of:

• How the platform works—searching mentors, booking sessions (1-on-1 or fixed-course), managing availability, rescheduling & canceling.
• User flows—sign‑in/signup, viewing mentor profiles, selecting time slots, and making payments.
• FAQs—platform features, pricing, scheduling, mentor roles, cancellation, refunds, privacy, and user support.

When a user asks a question:
1. Understand their intent—are they looking for a mentor, encountering a booking error, confused about availability, etc.?
2. Respond clearly, using short headings and bullet points when needed.
3. Offer actionable next steps—e.g., "Here's how to book," or "To reset availability, go to...".
4. If you don't have an answer, ask clarifying questions politely.
5. Always indicate where they can find more info—links to help docs or contact support.

Example:
User: "How do I book a 1-on-1 session?"
Assistant:
- “Sure! Here’s how:
   1. Go to a mentor's profile.
   2. Choose **1‑on‑1**, pick a date and time slot.
   3. Click **Book**, confirm payment.
- If no slots are available, try another mentor or later date.
- Want to book now? I can guide you.”

`);

// Setup the LangChain pipeline
const qaChain = new LLMChain({
  llm: llm,
  prompt: prompt,
});

// Function to call the chain
async function askQuestion(question) {
  try {
    const response = await qaChain.call({
      context: fileData,
      question: question,
    });

    console.log("Answer:", response.text); // Display the answer
    return response.text;
  } catch (err) {
    console.error("Error:", err.message);
  }
}

// Example usage
// askQuestion("What is this document about?");
module.exports={askQuestion}