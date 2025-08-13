import { FastifyInstance, RouteHandler, RouteOptions } from "fastify"
import { readdirSync, statSync } from "fs"
import { join, relative } from "path"

/**
 * Interface for route handlers that can be exported from route files
 */
export interface RouteHandlers {
  GET?: RouteHandler
  POST?: RouteHandler
  PUT?: RouteHandler
  DELETE?: RouteHandler
  PATCH?: RouteHandler
  HEAD?: RouteHandler
  OPTIONS?: RouteHandler
  // You can also export route options
  routeOptions?: Partial<RouteOptions>
  // Method-specific route options
  getRouteOptions?: Partial<RouteOptions>
  postRouteOptions?: Partial<RouteOptions>
  putRouteOptions?: Partial<RouteOptions>
  deleteRouteOptions?: Partial<RouteOptions>
  patchRouteOptions?: Partial<RouteOptions>
  headRouteOptions?: Partial<RouteOptions>
  optionsRouteOptions?: Partial<RouteOptions>
}

/**
 * Convert file path to Fastify route path
 * Examples:
 * - "index.ts" -> "/"
 * - "dashboard/index.ts" -> "/dashboard"
 * - "dashboard/[id]/index.ts" -> "/dashboard/:id"
 * - "users/[userId]/posts/[postId]/index.ts" -> "/users/:userId/posts/:postId"
 */
function filePathToRoutePath(filePath: string): string {
  // Remove the file extension and normalize separators
  let routePath = filePath.replace(/\.(ts|js)$/, "").replace(/\\/g, "/")

  // Replace index with empty string
  routePath = routePath.replace(/\/index$/, "").replace(/^index$/, "")

  // Convert [param] to :param for Fastify dynamic routes
  routePath = routePath.replace(/\[([^\]]+)\]/g, ":$1")

  // Ensure route starts with /
  if (!routePath.startsWith("/")) {
    routePath = "/" + routePath
  }

  // Handle root route
  if (routePath === "/") {
    return "/"
  }

  return routePath
}

/**
 * Recursively find all route files in the routes directory
 */
function findRouteFiles(dir: string, baseDir: string = dir): string[] {
  const files: string[] = []

  try {
    const entries = readdirSync(dir)

    for (const entry of entries) {
      const fullPath = join(dir, entry)
      const stat = statSync(fullPath)

      if (stat.isDirectory()) {
        // Recursively search subdirectories
        files.push(...findRouteFiles(fullPath, baseDir))
      } else if (stat.isFile() && /\.(ts|js)$/.test(entry)) {
        // Get relative path from base routes directory
        const relativePath = relative(baseDir, fullPath)
        files.push(relativePath)
      }
    }
  } catch (error) {
    // Directory doesn't exist or can't be read
    console.warn(`Could not read routes directory: ${dir}`)
  }

  return files
}

/**
 * Load and register all routes from the routes directory
 */
export async function loadRoutes(
  fastify: FastifyInstance,
  routesDir: string = "routes",
): Promise<void> {
  const routeFiles = findRouteFiles(routesDir)

  console.log(`Found ${routeFiles.length} route files`)

  for (const filePath of routeFiles) {
    try {
      // Convert file path to route path
      const routePath = filePathToRoutePath(filePath)

      // Import the route handler module
      // Use relative path for dynamic import in development
      const importPath = `./../${routesDir}/${filePath.replace(/\\/g, "/")}`
      const routeModule = await import(importPath)

      // Check if it's a valid route module
      if (!routeModule || typeof routeModule !== "object") {
        console.warn(`Route file ${filePath} does not export a valid module`)
        continue
      }

      const handlers = routeModule as RouteHandlers
      let registeredMethods = 0

      // Register each HTTP method handler
      const methods = [
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "PATCH",
        "HEAD",
        "OPTIONS",
      ] as const

      for (const method of methods) {
        const handler = handlers[method]
        if (handler && typeof handler === "function") {
          // Get method-specific route options (e.g., postRouteOptions for POST)
          const methodSpecificOptionsKey =
            `${method.toLowerCase()}RouteOptions` as keyof typeof routeModule
          const methodSpecificOptions = routeModule[methodSpecificOptionsKey]

          // Start with base route options
          let optionsToApply = { ...handlers.routeOptions }

          // If method-specific options exist, use those instead
          if (
            methodSpecificOptions &&
            typeof methodSpecificOptions === "object"
          ) {
            optionsToApply = methodSpecificOptions as Partial<RouteOptions>
          }

          // For GET methods, remove body schema if it exists
          if (
            method === "GET" &&
            optionsToApply.schema &&
            (optionsToApply.schema as any).body
          ) {
            const { body, ...schemaWithoutBody } = optionsToApply.schema as any
            optionsToApply = {
              ...optionsToApply,
              schema: schemaWithoutBody,
            }
          }

          const routeOptions: RouteOptions = {
            method,
            url: routePath,
            handler,
            ...optionsToApply,
          }

          fastify.route(routeOptions)
          registeredMethods++

          console.log(`  ${method} ${routePath} -> ${filePath}`)
        }
      }

      if (registeredMethods === 0) {
        console.warn(
          `Route file ${filePath} does not export any valid HTTP method handlers`,
        )
      }
    } catch (error) {
      console.error(`Error loading route file ${filePath}:`, error)
    }
  }
}
