import { addPreconditions, checkPromptSize } from '../helpers.js'
import type { SteeringInput, ToolResult } from '../mcp-tools-types.js'
import { loadTemplate } from '../template-loader.js'
import { renderTemplate } from '../template-renderer.js'

/**
 * Handler for the steering tool.
 * @param input Empty object.
 * @param templateDir Template directory path used for tests.
 * @returns Tool execution result.
 */
export const handleSteering = async (_input: SteeringInput, templateDir?: string): Promise<ToolResult> => {
  // 1. Load the template.
  const template = await loadTemplate('steering', templateDir)

  // 2. Expand placeholders (no parameters).
  const expandedPrompt = renderTemplate(template.body, {})

  // 3. Insert preconditions.
  const contentWithPreconditions = addPreconditions(expandedPrompt, template.metadata)

  // 4. Check size constraints.
  const sizeWarning = checkPromptSize(contentWithPreconditions)

  // 5. Build the response.
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
