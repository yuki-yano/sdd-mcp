import { addPreconditions, checkPromptSize } from '../helpers.js'
import type { SteeringInput, ToolResult } from '../mcp-tools-types.js'
import { loadTemplate } from '../template-loader.js'
import { renderTemplate } from '../template-renderer.js'

/**
 * steering ツールハンドラー
 * @param input 空オブジェクト
 * @param templateDir テンプレートディレクトリ（テスト用）
 * @returns ツール実行結果
 */
export const handleSteering = async (input: SteeringInput, templateDir?: string): Promise<ToolResult> => {
  // 1. テンプレート読み込み
  const template = await loadTemplate('steering', templateDir)

  // 2. プレースホルダ展開（パラメータなし）
  const expandedPrompt = renderTemplate(template.body, {})

  // 3. 前提条件の挿入
  const contentWithPreconditions = addPreconditions(expandedPrompt, template.metadata)

  // 4. サイズチェック
  const sizeWarning = checkPromptSize(contentWithPreconditions)

  // 5. レスポンス生成
  return {
    content: contentWithPreconditions,
    metadata: {
      template_id: 'steering',
      version: template.metadata.version,
      allowed_tools: template.metadata.allowedTools,
      parameters: {},
      ...(sizeWarning && { warning: sizeWarning }),
    },
  }
}
