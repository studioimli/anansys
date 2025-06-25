import { RouteHandler } from "fastify"
import { getUserById } from "../../../src/services/user.service"

interface Params {
  id: string
}

/**
 * Handles GET requests to /users/:id
 * Returns a single user by their ID by calling the user service.
 */
export const GET: RouteHandler<{ Params: Params }> = async (request, reply) => {
  const { id } = request.params
  const user = await getUserById(id)

  if (!user) {
    reply.code(404)
    return { error: "User not found" }
  }

  return user
}
