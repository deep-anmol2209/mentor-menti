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

// Function to call the chain
async function askQuestion(question) {
  try {
    // Define the prompt template with proper variable formatting
    const prompt = PromptTemplate.fromTemplate(`
You are a knowledgeable assistant. Use the following document content to answer the user's question accurately and helpfully.

Document:
${fileData.replace(/{/g, "{{").replace(/}/g, "}}")}

User Question:
{question}

Instructions:
- Base your response only on the document unless asked something general (like greetings)
- If the answer is not in the document, say "I couldn't find that information"
- If the user greets you, just greet back and offer help
- Be clear and concise
`);

    const qaChain = new LLMChain({
      llm: llm,
      prompt: prompt,
    });

    const response = await qaChain.call({
      question: question,
    });

    console.log("Answer:", response.text);
    return response.text;
  } catch (err) {
    console.error("Error:", err.message);
    throw err;
  }
}

module.exports = { askQuestion };