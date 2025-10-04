import { addPreconditions, checkPromptSize } from '../helpers.js'
import type { SpecStatusInput, ToolResult } from '../mcp-tools-types.js'
import { loadTemplate } from '../template-loader.js'
import { renderTemplate } from '../template-renderer.js'

/**
 * Handler for the spec-status tool.
 * @param input Feature name.
 * @param templateDir Template directory path used for tests.
 * @returns Tool execution result.
 */
export const handleSpecStatus = async (input: SpecStatusInput, templateDir?: string): Promise<ToolResult> => {
  // 1. Validate parameters.
  if (!input.feature_name || input.feature_name.trim() === '') {
    throw new Error('Missing required parameter: feature_name')
  }

  // 2. Load the template.
  const template = await loadTemplate('spec-status', templateDir)

  // 3. Expand placeholders.
  const params = {
    feature_name: input.feature_name,
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
      template_id: 'spec-status',
      version: template.metadata.version,
      allowed_tools: template.metadata.allowedTools,
      parameters: input,
      ...(sizeWarning && { warning: sizeWarning }),
    },
  }
}
