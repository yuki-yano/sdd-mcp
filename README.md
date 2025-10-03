# sdd-mcp

Spec-Driven Development MCP Server - An MCP server that provides spec-driven development custom slash commands as MCP tools

## Features

- **Specification Management**: Consistent workflow from spec initialization to requirements definition, design, and task breakdown
- **TDD Implementation Support**: High-quality implementation support with test-first development
- **Design Validation**: Interactive design review and quality checks
- **Progress Tracking**: Spec status monitoring and implementation gap visualization
- **Steering Documents**: Manage project-wide direction with steering documents
- **MCP Tools**: 10 development support tools available from MCP clients like Claude Code
- **Template Engine**: Flexible prompt generation with frontmatter-enabled template engine

## Requirements

- **Bun**: >= 1.0.0
- **OS**: macOS, Linux, or WSL2 (Native Windows is not supported)

## Installation

### Quick Start with bunx

```bash
bunx sdd-mcp@latest
```

### Local Installation

```bash
bun install sdd-mcp
```

## MCP Tools

This server provides the following spec-driven development tools:

### Specification Management
- **spec-init**: Initialize a new specification (starting from project description)
- **spec-requirements**: Generate requirements definition
- **spec-design**: Generate design document
- **spec-tasks**: Execute task breakdown
- **spec-impl**: Execute implementation with TDD approach
- **spec-status**: Check specification status

### Steering Documents
- **steering**: Update steering documents
- **steering-custom**: Create custom steering documents

### Validation
- **validate-design**: Review design quality
- **validate-gap**: Analyze implementation gap

## Usage

### Start MCP Server

```bash
bunx sdd-mcp@latest
```

### Using MCP Tools

You can invoke the above tools from MCP clients. Each tool:

1. Loads template files
2. Expands parameters to generate prompts
3. Returns with metadata (template_id, version, allowed_tools, parameters)

See individual template files (`commands/*.md`) for details.

### Command-line Options

```bash
# Show help
bunx sdd-mcp@latest --help

# Show version
bunx sdd-mcp@latest --version

# Enable debug mode
bunx sdd-mcp@latest --debug
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
│   ├── cli.ts                  # CLI entry point
│   ├── index.ts                # Library exports
│   ├── server.ts               # MCP server factory
│   ├── tool-registry.ts        # Tool registry implementation
│   ├── resource-registry.ts    # Resource registry implementation
│   ├── types.ts                # Type definitions
│   ├── template-parser.ts      # Template frontmatter parser
│   ├── template-renderer.ts    # Template placeholder renderer
│   ├── template-loader.ts      # Template file loader
│   ├── helpers.ts              # Common helper functions
│   ├── mcp-tools-types.ts      # MCP tools type definitions
│   ├── tools/                  # MCP tool handlers
│   │   ├── spec-init.ts
│   │   ├── spec-requirements.ts
│   │   ├── spec-design.ts
│   │   ├── spec-tasks.ts
│   │   ├── spec-impl.ts
│   │   ├── spec-status.ts
│   │   ├── steering.ts
│   │   ├── steering-custom.ts
│   │   ├── validate-design.ts
│   │   └── validate-gap.ts
│   └── *.test.ts               # Unit tests (51 tests)
├── commands/                   # Template files (migrated)
│   ├── spec-init.md
│   ├── spec-requirements.md
│   ├── spec-design.md
│   ├── spec-tasks.md
│   ├── spec-impl.md
│   ├── spec-status.md
│   ├── steering.md
│   ├── steering-custom.md
│   ├── validate-design.md
│   └── validate-gap.md
├── scripts/
│   └── migrate-templates.ts    # Template migration script
├── dist/                       # Build output
├── tsdown.config.ts            # tsdown configuration
├── vitest.config.ts            # vitest configuration
├── biome.json                  # Biome configuration
├── tsconfig.json               # TypeScript configuration
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
| macOS | Supported |
| Linux | Supported |
| WSL2 (Windows) | Supported |
| Native Windows | Not supported |

## Development Scripts

| Script | Description |
|---|---|
| `bun run dev` | Start development server with hot reload |
| `bun run build` | Build for production |
| `bun run start` | Start built server |
| `bun test` | Run tests (51 tests, 96 assertions) |
| `bun run test:watch` | Run tests in watch mode |
| `bun run test:coverage` | Run tests with coverage report |
| `bun run lint` | Run linter |
| `bun run lint:fix` | Fix linter errors |
| `bun run format` | Format code |
| `bun run migrate:templates` | Migrate template files (legacy → named placeholders) |

### Template Migration

To convert positional argument placeholders (`$ARGUMENTS`, `$1`, `$2`) to named placeholders (`{{project_description}}`, `{{feature_name}}`) in template files:

```bash
bun run migrate:templates
```

This script will:
1. Convert positional arguments to named placeholders
2. Add `version` field to frontmatter (if not specified)
3. Process all 10 template files in batch

## Related Projects

- [cc-sdd](https://github.com/gotalab/cc-sdd) - Reference implementation for Claude Code slash commands

## License

MIT
