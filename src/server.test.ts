import { describe, expect, it } from 'vitest'
import { createServer } from './server.js'

describe('createServer', () => {
  it('should create a server instance with required methods', () => {
    const server = createServer({
      name: 'test-server',
      version: '1.0.0',
      capabilities: {
        tools: true,
        resources: true,
        prompts: true,
      },
    })

    expect(server).toBeDefined()
    expect(server.start).toBeDefined()
    expect(server.stop).toBeDefined()
    expect(server.isRunning).toBeDefined()
    expect(typeof server.start).toBe('function')
    expect(typeof server.stop).toBe('function')
    expect(typeof server.isRunning).toBe('function')
  })

  it('should return isRunning as false when server is not started', () => {
    const server = createServer({
      name: 'test-server',
      version: '1.0.0',
      capabilities: {},
    })

    expect(server.isRunning()).toBe(false)
  })

  it('should accept valid server config', () => {
    const config = {
      name: 'valid-server',
      version: '2.0.0',
      capabilities: {
        tools: true,
      },
    }

    const server = createServer(config)
    expect(server).toBeDefined()
  })
})
