import { RouteHandler } from "fastify"

export const GET: RouteHandler = async (request, reply) => {
  return { hello: "world" }
} 