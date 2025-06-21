import { RouteHandler } from "fastify";

interface Params {
    id: string;
}

/**
 * Handles GET requests to /users/:id
 * Returns a single user by their ID.
 */
export const GET: RouteHandler<{ Params: Params }> = async (request, reply) => {
    const { id } = request.params;
    // In a real application, you would fetch this from a database
    // and handle the case where the user is not found.
    if (parseInt(id, 10) > 100) {
        reply.code(404);
        return { error: "User not found" };
    }
    return { id, name: `User ${id}` };
}; 