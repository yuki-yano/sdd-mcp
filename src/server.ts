import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { registerTools } from './register-tools.js'
import type { ServerConfig, ServerInstance } from './types.js'

/**
 * Create an MCP server instance (Functional wrapper around SDK's Server class)
 * This is a thin wrapper that encapsulates the MCP SDK's class-based API,
 * allowing the application layer to use pure functions.
 */
export const createServer = (config: ServerConfig): ServerInstance => {
  // Encapsulate the SDK's Server class instance
  const sdkServer = new Server(
    {
      name: config.name,
      version: config.version,
    },
    {
      capabilities: {
        tools: config.capabilities.tools ? {} : undefined,
        resources: config.capabilities.resources ? {} : undefined,
        prompts: config.capabilities.prompts ? {} : undefined,
      },
    },
  )

  // ツールを登録
  if (config.capabilities.tools) {
    registerTools(sdkServer)
  }

  let running = false

  return {
    start: async () => {
      const transport = new StdioServerTransport()
      await sdkServer.connect(transport)
      running = true
    },
    stop: async () => {
      await sdkServer.close()
      running = false
    },
    isRunning: () => running,
  }
}
