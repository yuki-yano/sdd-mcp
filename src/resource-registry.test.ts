import { beforeEach, describe, expect, it } from 'vitest'
import { createResourceRegistry } from './resource-registry.js'

describe('createResourceRegistry', () => {
  let registry: ReturnType<typeof createResourceRegistry>

  beforeEach(() => {
    registry = createResourceRegistry()
  })

  it('should create a resource registry with required methods', () => {
    expect(registry).toBeDefined()
    expect(registry.register).toBeDefined()
    expect(registry.list).toBeDefined()
    expect(registry.get).toBeDefined()
  })

  it('should register a resource successfully', () => {
    const definition = {
      uri: 'file:///test.txt',
      name: 'Test Resource',
      description: 'A test resource',
      mimeType: 'text/plain',
    }

    const provider = async () => 'Test content'

    registry.register(definition, provider)

    const resources = registry.list()
    expect(resources).toHaveLength(1)
    expect(resources[0]?.uri).toBe('file:///test.txt')
  })

  it('should list all registered resources', () => {
    registry.register(
      {
        uri: 'file:///resource1.txt',
        name: 'Resource 1',
      },
      async () => 'content1',
    )

    registry.register(
      {
        uri: 'file:///resource2.txt',
        name: 'Resource 2',
      },
      async () => 'content2',
    )

    const resources = registry.list()
    expect(resources).toHaveLength(2)
    expect(resources.map((r) => r.uri)).toEqual(['file:///resource1.txt', 'file:///resource2.txt'])
  })

  it('should get a registered resource', async () => {
    const provider = async () => ({ data: 'Hello World' })

    registry.register(
      {
        uri: 'file:///data.json',
        name: 'Data Resource',
        mimeType: 'application/json',
      },
      provider,
    )

    const result = await registry.get('file:///data.json')
    expect(result).toEqual({ data: 'Hello World' })
  })

  it('should throw error when getting unregistered resource', async () => {
    await expect(registry.get('file:///nonexistent.txt')).rejects.toThrow('Resource not found: file:///nonexistent.txt')
  })

  it('should prevent duplicate resource registration', () => {
    const definition = {
      uri: 'file:///duplicate.txt',
      name: 'Duplicate Resource',
    }

    registry.register(definition, async () => 'content1')

    expect(() => {
      registry.register(definition, async () => 'content2')
    }).toThrow('Resource already registered: file:///duplicate.txt')
  })
})
