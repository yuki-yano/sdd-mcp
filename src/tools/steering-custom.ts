import { addPreconditions, checkPromptSize } from '../helpers.js'
import type { SteeringCustomInput, ToolResult } from '../mcp-tools-types.js'
import { loadTemplate } from '../template-loader.js'
import { renderTemplate } from '../template-renderer.js'

/**
 * steering-custom ツールハンドラー
 * @param input 空オブジェクト
 * @param templateDir テンプレートディレクトリ（テスト用）
 * @returns ツール実行結果
 */
export const handleSteeringCustom = async (input: SteeringCustomInput, templateDir?: string): Promise<ToolResult> => {
  // 1. テンプレート読み込み
  const template = await loadTemplate('steering-custom', templateDir)

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
      template_id: 'steering-custom',
      version: template.metadata.version,
      allowed_tools: template.metadata.allowedTools,
      parameters: {},
      ...(sizeWarning && { warning: sizeWarning }),
    },
  }
}
