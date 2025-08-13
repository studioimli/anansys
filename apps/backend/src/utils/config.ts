import { config } from "dotenv";
import { createOpenAI } from "@ai-sdk/openai";

//TODO: Add types, validation, error handling, etc.
export function loadConfig() {
    const env = config();
    return env;
}

//Extend as needed
export const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  compatibility: "strict",
});