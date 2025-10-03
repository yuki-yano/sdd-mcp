import type { ToolDefinition, ToolHandler, ToolRegistry } from './types.js'

/**
 * Create a tool registry (Functional implementation without classes)
 * Tools are managed in an immutable map structure
 */
export const createToolRegistry = (): ToolRegistry => {
  const tools = new Map<string, { definition: ToolDefinition; handler: ToolHandler }>()

  return {
    register: <TInput, TOutput>(definition: ToolDefinition, handler: ToolHandler<TInput, TOutput>) => {
      if (tools.has(definition.name)) {
        throw new Error(`Tool already registered: ${definition.name}`)
      }

      tools.set(definition.name, {
        definition,
        handler: handler as ToolHandler,
      })
    },

    list: () => {
      return Array.from(tools.values()).map((tool) => tool.definition)
    },

    execute: async <TInput, TOutput>(name: string, input: TInput): Promise<TOutput> => {
      const tool = tools.get(name)

      if (!tool) {
        throw new Error(`Tool not found: ${name}`)
      }

      return (await tool.handler(input)) as TOutput
    },
  }
}
