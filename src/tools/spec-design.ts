import { addPreconditions, checkPromptSize } from '../helpers.js'
import type { SpecDesignInput, ToolResult } from '../mcp-tools-types.js'
import { loadTemplate } from '../template-loader.js'
import { renderTemplate } from '../template-renderer.js'

/**
 * Handler for the spec-design tool.
 * @param input Feature name and auto-approval flag.
 * @param templateDir Template directory path used for tests.
 * @returns Tool execution result.
 */
export const handleSpecDesign = async (input: SpecDesignInput, templateDir?: string): Promise<ToolResult> => {
  // 1. Validate parameters.
  if (!input.feature_name || input.feature_name.trim() === '') {
    throw new Error('Missing required parameter: feature_name')
  }

  if (input.auto_approve !== undefined && typeof input.auto_approve !== 'boolean') {
    throw new Error(`Invalid parameter type for auto_approve: expected boolean, got ${typeof input.auto_approve}`)
  }

  // 2. Load the template.
  const template = await loadTemplate('spec-design', templateDir)

  // 3. Expand placeholders.
  const params: Record<string, string> = {
    feature_name: input.feature_name,
    auto_approve: input.auto_approve ? '-y' : '',
  }
  const expandedPrompt = renderTemplate(template.body, params)

  // 4. Insert preconditions.
  const contentWithPreconditions = addPreconditions(expandedPrompt, template.metadata)

  // 5. Check size constraints.
  const sizeWarning = checkPromptSize(contentWithPreconditions)

  // 6. Build the response.
  return {
    content: contentWithPreconditions,
    metadata: {
      template_id: 'spec-design',
      version: template.metadata.version,
      allowed_tools: template.metadata.allowedTools,
      parameters: input,
      ...(sizeWarning && { warning: sizeWarning }),
    },
  }
}
