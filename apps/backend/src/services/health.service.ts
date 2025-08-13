/**
 * Retrieves the health status of the application.
 * @returns An object indicating the application's health.
 */
export async function getHealthStatus() {
  return {
    status: "OK",
    timestamp: new Date().toISOString(),
  }
}
