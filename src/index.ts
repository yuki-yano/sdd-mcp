/**
 * sdd-mcp - Spec-Driven Development MCP Server
 * Main library exports
 */

export { createServer } from './server.js'
export { createToolRegistry } from './tool-registry.js'
export { createResourceRegistry } from './resource-registry.js'

export type {
  ServerConfig,
  ServerInstance,
  ToolDefinition,
  ToolHandler,
  ToolRegistry,
  ResourceDefinition,
  ResourceProvider,
  ResourceRegistry,
} from './types.js'
