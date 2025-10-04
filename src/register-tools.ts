import type { Server } from '@modelcontextprotocol/sdk/server/index.js'
import {
  type CallToolRequest,
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type Tool,
} from '@modelcontextprotocol/sdk/types.js'
import type {
  SpecDesignInput,
  SpecImplInput,
  SpecInitInput,
  SpecRequirementsInput,
  SpecStatusInput,
  SpecTasksInput,
  SteeringCustomInput,
  SteeringInput,
  ValidateDesignInput,
  ValidateGapInput,
} from './mcp-tools-types.js'
import { handleSpecDesign } from './tools/spec-design.js'
import { handleSpecImpl } from './tools/spec-impl.js'
import { handleSpecInit } from './tools/spec-init.js'
import { handleSpecRequirements } from './tools/spec-requirements.js'
import { handleSpecStatus } from './tools/spec-status.js'
import { handleSpecTasks } from './tools/spec-tasks.js'
import { handleSteeringCustom } from './tools/steering-custom.js'
import { handleSteering } from './tools/steering.js'
import { handleValidateDesign } from './tools/validate-design.js'
import { handleValidateGap } from './tools/validate-gap.js'

/**
 * ツール定義一覧
 */
const TOOL_DEFINITIONS: Tool[] = [
  {
    name: 'spec-init',
    description:
      'Initializes a new specification from a project description. Trigger this when the request says things like "start a spec", "init spec", or "set up this idea".',
    inputSchema: {
      type: 'object',
      properties: {
        project_description: {
          type: 'string',
          description: 'プロジェクトの詳細な説明',
        },
      },
      required: ['project_description'],
    },
  },
  {
    name: 'spec-requirements',
    description:
      'Generates the requirements document for a feature. Use this when someone asks to "write requirements", "document needs", or "define acceptance criteria".',
    inputSchema: {
      type: 'object',
      properties: {
        feature_name: {
          type: 'string',
          description: 'フィーチャー名',
        },
      },
      required: ['feature_name'],
    },
  },
  {
    name: 'spec-design',
    description:
      'Produces the design document from approved requirements. Call this when you hear "create the design", "plan implementation", or "move to the design phase".',
    inputSchema: {
      type: 'object',
      properties: {
        feature_name: {
          type: 'string',
          description: 'フィーチャー名',
        },
        auto_approve: {
          type: 'boolean',
          description: '自動承認フラグ',
        },
      },
      required: ['feature_name'],
    },
  },
  {
    name: 'spec-tasks',
    description:
      'Breaks the design into actionable tasks. Run this when asked to "make tasks", "plan work items", or "enter task breakdown".',
    inputSchema: {
      type: 'object',
      properties: {
        feature_name: {
          type: 'string',
          description: 'フィーチャー名',
        },
        auto_approve: {
          type: 'boolean',
          description: '自動承認フラグ',
        },
      },
      required: ['feature_name'],
    },
  },
  {
    name: 'spec-impl',
    description:
      'Executes the implementation with TDD. Use this when the user says "run impl", "do the implementation phase", or "start coding tasks".',
    inputSchema: {
      type: 'object',
      properties: {
        feature_name: {
          type: 'string',
          description: 'フィーチャー名',
        },
        task_numbers: {
          type: 'array',
          items: {
            type: 'string',
          },
          description: 'タスク番号配列（省略時は全タスク）',
        },
      },
      required: ['feature_name'],
    },
  },
  {
    name: 'spec-status',
    description:
      'Reports the current specification status. Call this when someone says "show spec status", "check approvals", or "where are we in the workflow".',
    inputSchema: {
      type: 'object',
      properties: {
        feature_name: {
          type: 'string',
          description: 'フィーチャー名',
        },
      },
      required: ['feature_name'],
    },
  },
  {
    name: 'steering',
    description:
      'Creates or refreshes the core steering documents. Use this when a request mentions "update steering docs", "refresh product context", or "set project direction".',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'steering-custom',
    description:
      'Creates custom steering documents for special contexts. Trigger this when you hear "add custom steering", "document edge-case guidance", or "provide conditional context".',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'validate-design',
    description:
      'Reviews a design document for quality gaps. Use this when asked to "review the design", "validate the architecture", or "double-check the design spec".',
    inputSchema: {
      type: 'object',
      properties: {
        feature_name: {
          type: 'string',
          description: 'フィーチャー名',
        },
      },
      required: ['feature_name'],
    },
  },
  {
    name: 'validate-gap',
    description:
      'Analyzes gaps between requirements and the codebase. Call this when someone says "check implementation gaps", "compare code to requirements", or "ensure nothing is missing".',
    inputSchema: {
      type: 'object',
      properties: {
        feature_name: {
          type: 'string',
          description: 'フィーチャー名',
        },
      },
      required: ['feature_name'],
    },
  },
]

/**
 * ツールハンドラーマップ
 */
const wrapHandler = <T>(
  handler: (input: T, templateDir?: string) => Promise<unknown>,
): ((input: unknown) => Promise<unknown>) => {
  return (input: unknown) => handler(input as T)
}

const TOOL_HANDLERS: Record<string, (input: unknown) => Promise<unknown>> = {
  'spec-init': wrapHandler<SpecInitInput>(handleSpecInit),
  'spec-requirements': wrapHandler<SpecRequirementsInput>(handleSpecRequirements),
  'spec-design': wrapHandler<SpecDesignInput>(handleSpecDesign),
  'spec-tasks': wrapHandler<SpecTasksInput>(handleSpecTasks),
  'spec-impl': wrapHandler<SpecImplInput>(handleSpecImpl),
  'spec-status': wrapHandler<SpecStatusInput>(handleSpecStatus),
  steering: wrapHandler<SteeringInput>(handleSteering),
  'steering-custom': wrapHandler<SteeringCustomInput>(handleSteeringCustom),
  'validate-design': wrapHandler<ValidateDesignInput>(handleValidateDesign),
  'validate-gap': wrapHandler<ValidateGapInput>(handleValidateGap),
}

/**
 * MCPサーバーにツールを登録
 */
export const registerTools = (server: Server): void => {
  // ツール一覧を返すハンドラー
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: TOOL_DEFINITIONS,
  }))

  // ツール実行ハンドラー
  server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest) => {
    const { name, arguments: args } = request.params

    const handler = TOOL_HANDLERS[name]
    if (!handler) {
      throw new Error(`Unknown tool: ${name}`)
    }

    try {
      const result = await handler(args ?? {})
      // ToolResultからcontentを抽出
      const content =
        typeof result === 'object' && result !== null && 'content' in result
          ? (result as { content: string }).content
          : typeof result === 'string'
            ? result
            : JSON.stringify(result, null, 2)

      return {
        content: [
          {
            type: 'text',
            text: content,
          },
        ],
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${errorMessage}`,
          },
        ],
        isError: true,
      }
    }
  })
}
