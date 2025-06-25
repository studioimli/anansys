import { z } from "zod";
import { openai } from "../../utils/config";
import { generateText, Output } from "ai";
import { GameState } from "./narrator";

/**
 * Payload for creating a game session
 */
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

/**
 * Schema for the output of the game state manager
 */
const outputSchema = z.object({
    publicInfo: z.object({
        settingSummary: z.string(),
        characters: z.array(z.object({
            name: z.string(),
            bio: z.string()
        })),
        initialEventSummary: z.string()
    }),
    internalState: z.object({
        killer: z.string(),
        motive: z.string(),
        keyAlibis: z.record(z.string(), z.string()),
        murderWeapon: z.string(),
        timeline: z.record(z.string(), z.string()),
        clues: z.array(z.object({
            description: z.string(),
            location: z.string()
        })),
        accomplice: z.string(),
        thresholdForSolvable: z.number()
    })
})

/**
 * Creates a game session
 * @param payload - The payload for creating a game session
 * @returns The game state
 */
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
        prompt: "Create a game session",
        temperature: 0.1, //Must be extremely low to ensure the game state is consistent
        maxTokens: 4000,
        experimental_output: Output.object({ schema: outputSchema })
    })

    return experimental_output;
}

/**
 * Manages the game state
 * @param gameState - The current game state
 * @returns The updated game state
 */
export async function manageGameState(gameState: GameState) {
    //TODO: Implement ai call to manage the game state
    return gameState;
}