import { config } from "dotenv";

//TODO: Add types, validation, error handling, etc.
export function loadConfig() {
  const env = config();
  return env;
}