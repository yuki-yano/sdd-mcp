import { addPreconditions, checkPromptSize } from '../helpers.js'
import type { ToolResult, ValidateDesignInput } from '../mcp-tools-types.js'
import { loadTemplate } from '../template-loader.js'
import { renderTemplate } from '../template-renderer.js'

/**
 * Handler for the validate-design tool.
 * @param input Feature name.
 * @param templateDir Template directory path used for tests.
 * @returns Tool execution result.
 */
export const handleValidateDesign = async (input: ValidateDesignInput, templateDir?: string): Promise<ToolResult> => {
  // 1. Validate parameters.
  if (!input.feature_name || input.feature_name.trim() === '') {
    throw new Error('Missing required parameter: feature_name')
  }

  // 2. Load the template.
  const template = await loadTemplate('validate-design', templateDir)

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
      template_id: 'validate-design',
      version: template.metadata.version,
      allowed_tools: template.metadata.allowedTools,
      parameters: input,
      ...(sizeWarning && { warning: sizeWarning }),
    },
  }
}
