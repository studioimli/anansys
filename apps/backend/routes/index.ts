import { RouteHandler } from "fastify"

export const GET: RouteHandler = async (request, reply) => {
    return { hello: "world" }
}

export const POST: RouteHandler = async (request, reply) => {
    return { received: request.body }
} 