import { RouteHandler } from "fastify"
import { createGameSession, GameSessionPayload } from "../../../src/services/ai/game-state-manager";
import { startNarration } from "../../../src/services/ai/narrator";

/**
 * Handles GET requests to /ai/gsm/create-session
 * Returns a list of users by calling the user service.
 */
export const GET: RouteHandler = async (request, response) => {
    //Empty response for now
    return response.send({})
}

/**
 * Handles POST requests to /ai/gsm/create-session
 * Creates a new game session.
 */
export const POST: RouteHandler = async (request, response) => {
    const payload = request.body as GameSessionPayload;

    //Call GSM to set up the game state based on user selections
    const result = await createGameSession(payload);

    //Call narrator to start the game
    const narratorResponse = await startNarration(result);

    return response.send(narratorResponse);
}
