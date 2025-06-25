/**
 * APIs we need:
 * POST - /ai/gsm/create-session - will accept a json payload with the following fields:
 * 
{
  "setting": "Apartment Complex",
  "suspectCount": 3,
  "murderType": "Framed",
  "twist": "None",
  "conflictStructure": "Linear",
  "killerSelectionLogic": "Based on Opportunity",
  "victimArchetype": "Powerful",
  "timeOfDay": "Morning",
  "locationCount": "Small",
  "difficultyLevel": "Easy"
}
 * 
 */

import { z } from "zod";
import { openai } from "../../utils/config";
import { generateText, Output } from "ai";

export interface GameSessionPayload {
    setting: string;
    suspectCount: number;
    murderType: string;
    twist: string;
    conflictStructure: string;
    killerSelectionLogic: string;
    victimArchetype: string;
    timeOfDay: string;
    locationCount: string;
    difficultyLevel: string;
}

const outputSchema = z.object({
    publicInfo: z.string(),
    internalState: z.string()
})

export async function createGameSession(payload: GameSessionPayload) {

    const systemPrompt = `You are the game state manager of a murder mystery simulator.

    Your job is to:
    1. Create a full canonical story world using the config below.
    2. Internally decide:
       - Who is the killer
       - What their motive was
       - What the key alibis, murder weapon, and timeline are
    3. Maintain this truth internally.
    4. Only reveal information when prompted by player actions.
    
    Use this JSON config to seed the game:
    
    ${payload}
    
    When ready, respond with a summary for the narrator ONLY. Include:
    - Setting summary
    - List of characters (with 1-line bios)
    - Initial event summary (e.g., who was found dead, where)
    - Any key truths the player should NOT yet know (e.g., who the killer is, hidden accomplice, etc.)
    - Total clues in a structured format
    - Threshold of clues that need to be found for the case to be considered solvable
    
    Return your output in two parts as JSON:
    1. publicInfo: what the narrator can use to begin the story
    2. internalState: the hidden truth (for future turns)
    `

    //TODO: Implement ai call to create a game session
    const { experimental_output } = await generateText({
        model: openai("gpt-4o-mini"),
        system: systemPrompt,
        prompt: "Start the game",
        temperature: 0.75,
        maxTokens: 4000,
        experimental_output: Output.object({ schema: outputSchema })
    })

    return experimental_output;
}