import { beforeEach, describe, expect, it } from 'vitest'
import { createToolRegistry } from './tool-registry.js'

describe('createToolRegistry', () => {
  let registry: ReturnType<typeof createToolRegistry>

  beforeEach(() => {
    registry = createToolRegistry()
  })

  it('should create a tool registry with required methods', () => {
    expect(registry).toBeDefined()
    expect(registry.register).toBeDefined()
    expect(registry.list).toBeDefined()
    expect(registry.execute).toBeDefined()
  })

  it('should register a tool successfully', () => {
    const definition = {
      name: 'test-tool',
      description: 'A test tool',
      inputSchema: {
        type: 'object',
        properties: {
          input: { type: 'string' },
        },
      },
    }

    const handler = async (input: { input: string }) => `Processed: ${input.input}`

    registry.register(definition, handler)

    const tools = registry.list()
    expect(tools).toHaveLength(1)
    expect(tools[0]?.name).toBe('test-tool')
  })

  it('should list all registered tools', () => {
    registry.register(
      {
        name: 'tool1',
        description: 'Tool 1',
        inputSchema: { type: 'object' },
      },
      async () => 'result1',
    )

    registry.register(
      {
        name: 'tool2',
        description: 'Tool 2',
        inputSchema: { type: 'object' },
      },
      async () => 'result2',
    )

    const tools = registry.list()
    expect(tools).toHaveLength(2)
    expect(tools.map((t) => t.name)).toEqual(['tool1', 'tool2'])
  })

  it('should execute a registered tool', async () => {
    const handler = async (input: { message: string }) => `Echo: ${input.message}`

    registry.register(
      {
        name: 'echo',
        description: 'Echo tool',
        inputSchema: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
      },
      handler,
    )

    const result = await registry.execute('echo', { message: 'Hello' })
    expect(result).toBe('Echo: Hello')
  })

  it('should throw error when executing unregistered tool', async () => {
    await expect(registry.execute('nonexistent', {})).rejects.toThrow('Tool not found: nonexistent')
  })

  it('should prevent duplicate tool registration', () => {
    const definition = {
      name: 'duplicate',
      description: 'Duplicate tool',
      inputSchema: { type: 'object' },
    }

    registry.register(definition, async () => 'result1')

    expect(() => {
      registry.register(definition, async () => 'result2')
    }).toThrow('Tool already registered: duplicate')
  })
})
