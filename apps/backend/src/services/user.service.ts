/**
 * @file Manages user-related business logic.
 */

interface User {
  id: number;
  name: string;
}

/**
 * Retrieves a list of all users.
 * In a real application, this would fetch from a database.
 * @returns A promise that resolves to an array of users.
 */
export async function getAllUsers(): Promise<User[]> {
  return [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
  ];
}

/**
 * Retrieves a single user by their ID.
 * In a real application, this would fetch from a database.
 * @param id The ID of the user to retrieve.
 * @returns A promise that resolves to a user or null if not found.
 */
export async function getUserById(id: string): Promise<User | null> {
  const userId = parseInt(id, 10);
  if (userId > 100) {
    return null; // Simulate user not found
  }
  return { id: userId, name: `User ${userId}` };
} 