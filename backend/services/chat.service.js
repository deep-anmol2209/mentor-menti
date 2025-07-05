
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
const prompt = PromptTemplate.fromTemplate(`You are a knowledgeable assistant. Use the following document content to answer the user's question accurately and helpfully.

  Document:
  {context}
  
  User Question:
  {question}
  
  Instructions:
  - Base your response only on the document unless asked something general (like greetings).
  - If the answer is not in the document, say "I'm sorry, I couldn't find that information in the document."
  - If the user greets you (e.g., "hi", "hello"), just greet back and offer help.
  - Be clear and concise.
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