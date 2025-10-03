import type { ResourceDefinition, ResourceProvider, ResourceRegistry } from './types.js'

/**
 * Create a resource registry (Functional implementation without classes)
 * Resources are managed in an immutable map structure
 */
export const createResourceRegistry = (): ResourceRegistry => {
  const resources = new Map<string, { definition: ResourceDefinition; provider: ResourceProvider }>()

  return {
    register: <T>(definition: ResourceDefinition, provider: ResourceProvider<T>) => {
      if (resources.has(definition.uri)) {
        throw new Error(`Resource already registered: ${definition.uri}`)
      }

      resources.set(definition.uri, {
        definition,
        provider: provider as ResourceProvider,
      })
    },

    list: () => {
      return Array.from(resources.values()).map((resource) => resource.definition)
    },

    get: async <T>(uri: string): Promise<T> => {
      const resource = resources.get(uri)

      if (!resource) {
        throw new Error(`Resource not found: ${uri}`)
      }

      return (await resource.provider()) as T
    },
  }
}
