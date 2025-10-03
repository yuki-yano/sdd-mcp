import { addPreconditions, checkPromptSize } from '../helpers.js'
import type { SpecRequirementsInput, ToolResult } from '../mcp-tools-types.js'
import { loadTemplate } from '../template-loader.js'
import { renderTemplate } from '../template-renderer.js'

/**
 * spec-requirements ツールハンドラー
 * @param input フィーチャー名
 * @param templateDir テンプレートディレクトリ（テスト用）
 * @returns ツール実行結果
 */
export const handleSpecRequirements = async (
  input: SpecRequirementsInput,
  templateDir?: string,
): Promise<ToolResult> => {
  // 1. パラメータ検証
  if (!input.feature_name || input.feature_name.trim() === '') {
    throw new Error('Missing required parameter: feature_name')
  }

  // 2. テンプレート読み込み
  const template = await loadTemplate('spec-requirements', templateDir)

  // 3. プレースホルダ展開
  const params = {
    feature_name: input.feature_name,
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
      template_id: 'spec-requirements',
      version: template.metadata.version,
      allowed_tools: template.metadata.allowedTools,
      parameters: input,
      ...(sizeWarning && { warning: sizeWarning }),
    },
  }
}
