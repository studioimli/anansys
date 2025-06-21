import { RouteHandler } from "fastify";

/**
 * Handles GET requests to /users
 * Returns a list of users.
 */
export const GET: RouteHandler = async (request, reply) => {
  // In a real application, you would fetch this from a database
  const users = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
  ];
  return users;
};

/**
 * Handles POST requests to /users
 * Creates a new user.
 */
export const POST: RouteHandler = async (request, reply) => {
  // In a real application, you would save the new user to a database
  // The request body would contain the user data
  const newUser = request.body;
  reply.code(201); // Created
  return { message: "User created successfully", user: newUser };
}; 