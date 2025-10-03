import type { Server } from '@modelcontextprotocol/sdk/server/index.js'
import {
  type CallToolRequest,
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type Tool,
} from '@modelcontextprotocol/sdk/types.js'
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
    description: '新しい仕様を初期化します。詳細なプロジェクト説明を提供してください。',
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
    description: '仕様の要件定義ドキュメントを生成します。',
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
    description: '仕様の設計ドキュメントを生成します。',
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
    description: '仕様のタスク分解を実行します。',
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
    description: 'TDD方式で仕様の実装を実行します。',
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
    description: '仕様の現在のステータスと進捗を確認します。',
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
    description: 'ステアリングドキュメントを作成または更新します。',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'steering-custom',
    description: '特殊なプロジェクトコンテキスト用のカスタムステアリングドキュメントを作成します。',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'validate-design',
    description: '設計ドキュメントの品質をインタラクティブにレビューします。',
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
    description: '要件と既存コードベース間の実装ギャップを分析します。',
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
const TOOL_HANDLERS: Record<string, (input: unknown) => Promise<unknown>> = {
  'spec-init': handleSpecInit,
  'spec-requirements': handleSpecRequirements,
  'spec-design': handleSpecDesign,
  'spec-tasks': handleSpecTasks,
  'spec-impl': handleSpecImpl,
  'spec-status': handleSpecStatus,
  steering: handleSteering,
  'steering-custom': handleSteeringCustom,
  'validate-design': handleValidateDesign,
  'validate-gap': handleValidateGap,
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
