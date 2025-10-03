import { addPreconditions, checkPromptSize } from '../helpers.js'
import type { SpecTasksInput, ToolResult } from '../mcp-tools-types.js'
import { loadTemplate } from '../template-loader.js'
import { renderTemplate } from '../template-renderer.js'

/**
 * spec-tasks ツールハンドラー
 * @param input フィーチャー名と自動承認フラグ
 * @param templateDir テンプレートディレクトリ（テスト用）
 * @returns ツール実行結果
 */
export const handleSpecTasks = async (input: SpecTasksInput, templateDir?: string): Promise<ToolResult> => {
  // 1. パラメータ検証
  if (!input.feature_name || input.feature_name.trim() === '') {
    throw new Error('Missing required parameter: feature_name')
  }

  if (input.auto_approve !== undefined && typeof input.auto_approve !== 'boolean') {
    throw new Error(`Invalid parameter type for auto_approve: expected boolean, got ${typeof input.auto_approve}`)
  }

  // 2. テンプレート読み込み
  const template = await loadTemplate('spec-tasks', templateDir)

  // 3. プレースホルダ展開
  const params: Record<string, string> = {
    feature_name: input.feature_name,
    auto_approve: input.auto_approve ? '-y' : '',
  }
  const expandedPrompt = renderTemplate(template.body, params)

  // 4. 前提条件の挿入
  const contentWithPreconditions = addPreconditions(expandedPrompt, template.metadata)

  // 5. サイズチェック
  const sizeWarning = checkPromptSize(contentWithPreconditions)

  // 6. レスポンス生成
  return {
    content: contentWithPreconditions,
    metadata: {
      template_id: 'spec-tasks',
      version: template.metadata.version,
      allowed_tools: template.metadata.allowedTools,
      parameters: input,
      ...(sizeWarning && { warning: sizeWarning }),
    },
  }
}
