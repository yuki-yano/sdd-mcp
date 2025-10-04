#!/usr/bin/env bun
import { createServer } from './server.js'
import packageJson from '../package.json' with { type: 'json' }

/**
 * Parse command-line arguments
 */
const parseArgs = (argv: string[]) => {
  const args = argv.slice(2)

  return {
    debug: args.includes('--debug'),
    version: args.includes('--version') || args.includes('-v'),
    help: args.includes('--help') || args.includes('-h'),
  }
}

/**
 * Display help message
 */
const showHelp = () => {
  console.log(`
sdd-mcp - Spec-Driven Development MCP Server

Usage:
  bunx sdd-mcp [options]

Options:
  --help, -h     Show this help message
  --version, -v  Show version information
  --debug        Enable debug mode

Examples:
  bunx sdd-mcp
  bunx sdd-mcp --debug
`)
}

/**
 * Display version information
 */
const showVersion = () => {
  console.log(`sdd-mcp v${packageJson.version}`)
}

/**
 * Check OS compatibility
 */
const checkOSCompatibility = () => {
  const platform = process.platform

  if (platform === 'win32') {
    console.error('Error: Native Windows is not supported. Please use WSL2.')
    process.exit(1)
  }

  if (!['darwin', 'linux'].includes(platform)) {
    console.error(`Warning: Platform ${platform} may not be fully supported.`)
  }
}

/**
 * Main entry point
 */
const main = async () => {
  const options = parseArgs(process.argv)

  if (options.help) {
    showHelp()
    process.exit(0)
  }

  if (options.version) {
    showVersion()
    process.exit(0)
  }

  checkOSCompatibility()

  const server = createServer({
    name: 'sdd-mcp',
    version: packageJson.version,
    capabilities: {
      tools: true,
      resources: true,
      prompts: true,
    },
  })

  // Signal handling
  const shutdown = async () => {
    if (options.debug) {
      console.error('Shutting down server...')
    }

    if (server.isRunning()) {
      await server.stop()
    }

    process.exit(0)
  }

  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)

  // Start server
  try {
    if (options.debug) {
      console.error('Starting MCP server...')
    }

    await server.start()

    if (options.debug) {
      console.error('MCP server started successfully')
    }
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

main().catch((error) => {
  console.error('Unexpected error:', error)
  process.exit(1)
})
