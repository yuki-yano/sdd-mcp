import { addPreconditions, checkPromptSize } from '../helpers.js'
import type { SpecImplInput, ToolResult } from '../mcp-tools-types.js'
import { loadTemplate } from '../template-loader.js'
import { renderTemplate } from '../template-renderer.js'

/**
 * spec-impl ツールハンドラー
 * @param input フィーチャー名とタスク番号配列
 * @param templateDir テンプレートディレクトリ（テスト用）
 * @returns ツール実行結果
 */
export const handleSpecImpl = async (input: SpecImplInput, templateDir?: string): Promise<ToolResult> => {
  // 1. パラメータ検証
  if (!input.feature_name || input.feature_name.trim() === '') {
    throw new Error('Missing required parameter: feature_name')
  }

  if (input.task_numbers !== undefined) {
    if (!Array.isArray(input.task_numbers)) {
      throw new Error(`Invalid parameter type for task_numbers: expected string[], got ${typeof input.task_numbers}`)
    }
  }

  // 2. テンプレート読み込み
  const template = await loadTemplate('spec-impl', templateDir)

  // 3. プレースホルダ展開
  const params: Record<string, string | string[]> = {
    feature_name: input.feature_name,
  }

  if (input.task_numbers && input.task_numbers.length > 0) {
    params.task_numbers = input.task_numbers
  } else {
    params.task_numbers = 'all pending tasks'
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
      template_id: 'spec-impl',
      version: template.metadata.version,
      allowed_tools: template.metadata.allowedTools,
      parameters: input,
      ...(sizeWarning && { warning: sizeWarning }),
    },
  }
}
