# sdd-mcp

Spec-Driven Development MCP Server - A modern development environment for building MCP servers with Bun, tsdown, vitest, and biome.

## Features

- 🚀 **Bun Runtime**: Fast startup and package management
- ⚡ **tsdown**: High-speed TypeScript build with Rolldown
- 🧪 **vitest**: Fast and modern test runner
- 🎨 **Biome**: Fast linter and formatter
- 📦 **Functional Programming**: Class-free, pure function-based architecture
- 🔧 **MCP Protocol**: Built on Model Context Protocol standard

## Requirements

- **Bun**: >= 1.0.0
- **OS**: macOS, Linux, or WSL2 (Native Windows is not supported)

## Installation

### Quick Start with bunx

```bash
bunx sdd-mcp
```

### Local Installation

```bash
bun install sdd-mcp
```

## Usage

### Start MCP Server

```bash
bunx sdd-mcp
```

### Command-line Options

```bash
# Show help
bunx sdd-mcp --help

# Show version
bunx sdd-mcp --version

# Enable debug mode
bunx sdd-mcp --debug
```

## Development

### Install Dependencies

```bash
bun install
```

### Development Mode (with hot reload)

```bash
bun run dev
```

### Build

```bash
bun run build
```

### Test

```bash
# Run tests
bun test

# Run tests in watch mode
bun run test:watch

# Run tests with coverage
bun run test:coverage
```

### Code Quality

```bash
# Lint
bun run lint

# Lint and fix
bun run lint:fix

# Format code
bun run format
```

## Project Structure

```
sdd-mcp/
├── src/
│   ├── cli.ts              # CLI entry point
│   ├── index.ts            # Library exports
│   ├── server.ts           # MCP server factory
│   ├── tool-registry.ts    # Tool registry implementation
│   ├── resource-registry.ts # Resource registry implementation
│   ├── types.ts            # Type definitions
│   └── *.test.ts           # Unit tests
├── dist/                   # Build output
├── tsdown.config.ts        # tsdown configuration
├── vitest.config.ts        # vitest configuration
├── biome.json              # Biome configuration
├── tsconfig.json           # TypeScript configuration
└── package.json
```

## Architecture

### Functional Programming Principles

This project follows functional programming principles:

- **No classes in application code**: Pure functions and higher-order functions
- **Immutable data structures**: State is never mutated
- **Side effects isolation**: Pure functions and effect functions are clearly separated
- **MCP SDK exception**: @modelcontextprotocol/sdk uses classes, but wrapped in thin functional layers

### MCP Server Components

1. **Server Instance Factory**: Creates MCP server instances
2. **Tool Registry**: Manages tool definitions and handlers
3. **Resource Registry**: Manages resource definitions and providers
4. **STDIO Transport**: Standard input/output communication layer

## OS Compatibility

| OS | Support |
|---|---|
| macOS | ✅ Supported |
| Linux | ✅ Supported |
| WSL2 (Windows) | ✅ Supported |
| Native Windows | ❌ Not supported |

## Development Scripts

| Script | Description |
|---|---|
| `bun run dev` | Start development server with hot reload |
| `bun run build` | Build for production |
| `bun run start` | Start built server |
| `bun test` | Run tests |
| `bun run test:watch` | Run tests in watch mode |
| `bun run test:coverage` | Run tests with coverage report |
| `bun run lint` | Run linter |
| `bun run lint:fix` | Fix linter errors |
| `bun run format` | Format code |

## License

MIT

## Author

Your Name
