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

- **Runtime**: Bun >= 1.0.0 (recommended) or Node.js >= 20
- **OS**: macOS, Linux, or WSL2 (Native Windows is not supported)

## Installation

### Quick Start with bunx (Recommended)

```bash
bunx sdd-mcp@latest
```

### Quick Start with npx

```bash
npx sdd-mcp@latest
```

### Local Installation

```bash
# With Bun (Recommended)
bun install sdd-mcp

# With npm
npm install sdd-mcp
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
# With bunx (Recommended)
bunx sdd-mcp@latest

# With npx
npx sdd-mcp@latest
```

### Using MCP Tools

You can invoke the above tools from MCP clients. Each tool:

1. Loads template files
2. Expands parameters to generate prompts
3. Returns with metadata (template_id, version, allowed_tools, parameters)

See individual template files (`commands/*.md`) for details.

### Workflow Example

Here's a complete workflow for developing a new feature with spec-driven development:

#### 1. Optional: Create Steering Documents (First Time)

```
Use MCP tool: steering
```

This creates project-wide context documents (product.md, tech.md, structure.md) in `.kiro/steering/`.

#### 2. Initialize Specification

```
Use MCP tool: spec-init
Parameters: "Implement user authentication with JWT tokens and refresh token rotation"
```

This creates:
- `.kiro/specs/user-authentication/spec.json` (metadata)
- `.kiro/specs/user-authentication/requirements.md` (template)

#### 3. Generate Requirements

```
Use MCP tool: spec-requirements
Parameters: user-authentication
```

AI analyzes the project and generates comprehensive requirements in `requirements.md`.

**Human Review Required**: Review and approve the requirements.

#### 4. Generate Design

```
Use MCP tool: spec-design
Parameters: user-authentication
```

AI creates technical design document in `design.md` based on approved requirements.

**Human Review Required**: Review and approve the design.

**Quick tip**: Use `spec-design user-authentication -y` to auto-approve requirements and skip the interactive prompt.

#### 5. Generate Implementation Tasks

```
Use MCP tool: spec-tasks
Parameters: user-authentication
```

AI breaks down the design into concrete implementation tasks in `tasks.md`.

**Human Review Required**: Review and approve the tasks.

**Quick tip**: Use `spec-tasks user-authentication -y` to auto-approve previous phases.

#### 6. Execute Implementation with TDD

```
Use MCP tool: spec-impl
Parameters: user-authentication
```

AI implements the feature following Test-Driven Development methodology.

**Optional**: Specify task numbers: `spec-impl user-authentication 1,2,3` to implement specific tasks.

#### 7. Check Status

```
Use MCP tool: spec-status
Parameters: user-authentication
```

View current phase, approval status, and implementation progress.

#### Optional: Validation Tools

```
Use MCP tool: validate-design
Parameters: user-authentication
```

Interactive design quality review with recommendations.

```
Use MCP tool: validate-gap
Parameters: user-authentication
```

Analyze gaps between requirements and existing codebase.

### Command-line Options

```bash
# Show help (bunx recommended)
bunx sdd-mcp@latest --help
# or with npx
npx sdd-mcp@latest --help

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

## OS Compatibility

| OS | Support |
|---|---|
| macOS | Supported |
| Linux | Supported |
| WSL2 (Windows) | Supported |
| Native Windows | Not supported |

### Template Migration

To convert positional argument placeholders (`$ARGUMENTS`, `$1`, `$2`) to named placeholders (`{{project_description}}`, `{{feature_name}}`) in template files:

```bash
bun run migrate:templates
```

This script will:
1. Convert positional arguments to named placeholders
2. Add `version` field to frontmatter (if not specified)
3. Process all 10 template files in batch

## Acknowledgments

This project is based on [cc-sdd](https://github.com/gotalab/cc-sdd) by Gota Lab.
The command templates (`commands/*.md`) are adapted from cc-sdd under the MIT License.

## License

MIT - See [LICENSE](LICENSE) for details

### Third-Party Licenses

- cc-sdd: MIT License - Copyright (c) 2024 Gota Lab
