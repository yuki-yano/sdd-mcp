import { addPreconditions, checkPromptSize } from '../helpers.js'
import type { SpecInitInput, ToolResult } from '../mcp-tools-types.js'
import { loadTemplate } from '../template-loader.js'
import { renderTemplate } from '../template-renderer.js'

/**
 * spec-init ツールハンドラー
 * @param input プロジェクト説明
 * @param templateDir テンプレートディレクトリ（テスト用）
 * @returns ツール実行結果
 */
export const handleSpecInit = async (input: SpecInitInput, templateDir?: string): Promise<ToolResult> => {
  // 1. パラメータ検証
  if (!input.project_description || input.project_description.trim() === '') {
    throw new Error('Missing required parameter: project_description')
  }

  // 2. テンプレート読み込み
  const template = await loadTemplate('spec-init', templateDir)

  // 3. プレースホルダ展開
  const params = {
    project_description: input.project_description,
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
      template_id: 'spec-init',
      version: template.metadata.version,
      allowed_tools: template.metadata.allowedTools,
      parameters: input,
      ...(sizeWarning && { warning: sizeWarning }),
    },
  }
}
