import { RouteHandler } from "fastify"
import { getAllUsers } from "../../src/services/user.service"

/**
 * Handles GET requests to /users
 * Returns a list of users by calling the user service.
 */
export const GET: RouteHandler = async (request, reply) => {
    const users = await getAllUsers()
    return users
}

/**
 * Handles POST requests to /users
 * Creates a new user.
 */
export const POST: RouteHandler = async (request, reply) => {
    // In a real application, you would use a service to create the user
    const newUser = request.body
    reply.code(201) // Created
    return { message: "User created successfully", user: newUser }
}
