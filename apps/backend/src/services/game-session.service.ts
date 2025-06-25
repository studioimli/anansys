/**
 * @file Manages game session-related business logic.
 */

interface GameSession {
  id: string
  playerName: string
  currentScene: string
  lastUpdatedAt: string
}

/**
 * Retrieves a game session by its ID.
 * This is a simulation of fetching data from a database or a cache.
 * @param id The ID of the game session to retrieve.
 * @returns A promise that resolves to a game session or null if not found.
 */
export async function getPlayerSessionById(
  id: string,
): Promise<GameSession | null> {
  console.log(`Fetching game session with ID: ${id}`)

  // Simulate a session not found for specific IDs for testing purposes
  if (id === "000" || id === "404") {
    console.warn(`Session with ID: ${id} not found.`)
    return null
  }

  // Simulate fetching a real session
  const session: GameSession = {
    id,
    playerName: "Astra",
    currentScene: "TheCrossroads",
    lastUpdatedAt: new Date().toISOString(),
  }

  console.log("Session found:", session)
  return session
}
