import { generateText, Output } from "ai"
import { openai } from "../../utils/config"
import { z } from "zod"



export interface GameState {
    /**
     * Public information that the player can see
     */
    publicInfo: {
        settingSummary: string;
        characters: {
            name: string;
            bio: string;
        }[];
        initialEventSummary: string;
    };
    /**
     * Internal state that the player cannot see
     */
    internalState: {
        killer: string;
        motive: string;
        keyAlibis: Record<string, string>;
        murderWeapon: string;
        timeline: Record<string, string>;
        clues: {
            description: string;
            location: string;
        }[];
        accomplice: string;
        thresholdForSolvable: number;
    };
}

const outputSchema = z.object({
    story: z.string(),
    options: z.array(z.object({
        id: z.string(),
        description: z.string()
    })),
    clue_log: z.array(z.object({
        id: z.string(),
        description: z.string()
    }))
})

export async function startNarration(gsmResult: GameState): Promise<z.infer<typeof outputSchema>> {

const systemPrompt = `You are the narrator and interaction manager for a turn-based murder mystery game. Your goal is to immerse the player in an interactive mystery where they gather clues and solve the murder.

Your role:
- Introduce the story with a captivating and suspenseful narrative based on the provided setup.
- Allow the player to explore rooms, interact with characters, and gather clues while maintaining an air of mystery.
- For each player action, confer with the GSM (Game State Manager) for outcome determination.
- Narrate each scene with intrigue, ensuring an engaging and immersive experience.
- Keep meticulous track of clues unearthed and maintain a clue log.
- Provide 2–4 follow-up actions or options, while allowing for player-typed custom commands if desired.

## Story Setup

Input: ${gsmResult}

- Only reveal publicInfo to the player; keep other JSON details confidential.

## Begin the Game

Start by setting an intriguing scene, explaining the player's location at the game's start. Conclude the introduction by inviting the player to take action and providing actionable options.

# Output Format

The story should be in markdown format with proper formatting.

After narrating, include a section listing the player's action options in this JSON format:

{
  "options": [
    { "id": "option_1", "description": "Description of first suspenseful action" },
    { "id": "option_2", "description": "Description of second mysterious action" }
    // Provide 2–4 options in total
  ],
"clue_log": ["id": "uuid", "description": ""]
}

Place this JSON at the end of your message to maintain suspense and clear gameplay direction.

# Notes

- Emphasize narrative elements that build mystery and suspense throughout gameplay.
- Adjust narration based on player actions to maintain an engaging mystery experience.`

    //TODO: Implement ai call to start the narration
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