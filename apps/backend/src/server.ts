// src/index.ts

import fastify from "fastify"
import { loadRoutes } from "./routeLoader"

/**
 * Build the Fastify server instance
 * @returns Configured Fastify server instance
 */
async function buildServer() {
  const server = fastify({
    logger: {
      transport: {
        target: "pino-pretty",
        options: {
          translateTime: "HH:MM:ss Z",
          ignore: "pid,hostname",
        },
      },
    },
  })

  // Health check endpoint
  server.get("/health", async (request, reply) => {
    try {
      const { getHealthStatus } = await import("./services/health.service")
      const healthData = await getHealthStatus()
      return healthData
    } catch (error) {
      server.log.error(error)
      reply.status(500)
      return {
        status: "ERROR",
        timestamp: new Date().toISOString(),
        error: "Health check failed",
      }
    }
  })

  // Example ping endpoint
  server.get("/ping", async (request, reply) => {
    return "pong"
  })

  // Load file-based routes
  await loadRoutes(server)

  return server
}

/**
 * Start the server
 */
async function start(): Promise<void> {
  const server = await buildServer()

  try {
    const address = await server.listen({
      port: 3000,
      host: "0.0.0.0",
    })
    console.log(`Server listening at ${address}`)
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

// Handle graceful shutdown
process.on("SIGINT", async () => {
  console.log("Received SIGINT, shutting down gracefully...")
  process.exit(0)
})

process.on("SIGTERM", async () => {
  console.log("Received SIGTERM, shutting down gracefully...")
  process.exit(0)
})

// Start the server if this file is run directly
if (require.main === module) {
  start()
}

export { buildServer, start }
