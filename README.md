# sdd-mcp

Spec-Driven Development MCP Server - Spec駆動開発のカスタムスラッシュコマンドをMCPツールとして提供するサーバー

## Features

- **Specification Management**: 仕様の初期化から要件定義、設計、タスク分解まで一貫したワークフロー
- **TDD Implementation Support**: テストファースト開発による品質の高い実装サポート
- **Design Validation**: インタラクティブな設計レビューと品質チェック
- **Progress Tracking**: 仕様のステータス確認と実装ギャップの可視化
- **Steering Documents**: プロジェクト全体の方向性を管理するステアリングドキュメント
- **MCP Tools**: Claude Code等のMCPクライアントから利用可能な10個の開発支援ツール
- **Template Engine**: フロントマター対応のテンプレートエンジンによる柔軟なプロンプト生成

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

## MCP Tools

このサーバーは以下のSpec駆動開発ツールを提供します：

### Specification Management
- **spec-init**: 新しい仕様を初期化（プロジェクト説明から開始）
- **spec-requirements**: 要件定義を生成
- **spec-design**: 設計ドキュメントを生成
- **spec-tasks**: タスク分解を実行
- **spec-impl**: TDD方式で実装を実行
- **spec-status**: 仕様のステータスを確認

### Steering Documents
- **steering**: ステアリングドキュメントを更新
- **steering-custom**: カスタムステアリングドキュメントを作成

### Validation
- **validate-design**: 設計品質をレビュー
- **validate-gap**: 実装ギャップを分析

## Usage

### Start MCP Server

```bash
bunx sdd-mcp
```

### Using MCP Tools

MCPクライアントから上記のツールを呼び出すことができます。各ツールは：

1. テンプレートファイルを読み込み
2. パラメータを展開してプロンプトを生成
3. メタデータ（template_id, version, allowed_tools, parameters）と共に返却

詳細は各テンプレートファイル（`commands/*.md`）を参照してください。

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

テンプレートファイルの位置引数プレースホルダ（`$ARGUMENTS`, `$1`, `$2`）を名前付きプレースホルダ（`{{project_description}}`, `{{feature_name}}`）に変換するには：

```bash
bun run migrate:templates
```

このスクリプトは：
1. 位置引数を名前付きプレースホルダに変換
2. frontmatterに`version`フィールドを追加（未指定の場合）
3. 全10個のテンプレートファイルを一括処理

## License

MIT
