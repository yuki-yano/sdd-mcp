/**
 * Server configuration
 */
export type ServerConfig = {
  name: string
  version: string
  capabilities: {
    tools?: boolean
    resources?: boolean
    prompts?: boolean
  }
}

/**
 * Server instance interface
 */
export type ServerInstance = {
  start: () => Promise<void>
  stop: () => Promise<void>
  isRunning: () => boolean
}

/**
 * Tool definition
 */
export type ToolDefinition = {
  name: string
  description: string
  inputSchema: Record<string, unknown>
}

/**
 * Tool handler function (pure function)
 */
export type ToolHandler<TInput = unknown, TOutput = unknown> = (input: TInput) => Promise<TOutput>

/**
 * Tool registry interface
 */
export type ToolRegistry = {
  register: <TInput, TOutput>(
    definition: ToolDefinition,
    handler: ToolHandler<TInput, TOutput>,
  ) => void
  list: () => readonly ToolDefinition[]
  execute: <TInput, TOutput>(name: string, input: TInput) => Promise<TOutput>
}

/**
 * Resource definition
 */
export type ResourceDefinition = {
  uri: string
  name: string
  description?: string
  mimeType?: string
}

/**
 * Resource provider function (pure function)
 */
export type ResourceProvider<T = unknown> = () => Promise<T>

/**
 * Resource registry interface
 */
export type ResourceRegistry = {
  register: <T>(definition: ResourceDefinition, provider: ResourceProvider<T>) => void
  list: () => readonly ResourceDefinition[]
  get: <T>(uri: string) => Promise<T>
}
