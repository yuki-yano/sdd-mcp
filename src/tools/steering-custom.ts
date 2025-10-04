import { addPreconditions, checkPromptSize } from '../helpers.js'
import type { SteeringCustomInput, ToolResult } from '../mcp-tools-types.js'
import { loadTemplate } from '../template-loader.js'
import { renderTemplate } from '../template-renderer.js'

/**
 * Handler for the steering-custom tool.
 * @param input Empty object.
 * @param templateDir Template directory path used for tests.
 * @returns Tool execution result.
 */
export const handleSteeringCustom = async (_input: SteeringCustomInput, templateDir?: string): Promise<ToolResult> => {
  // 1. Load the template.
  const template = await loadTemplate('steering-custom', templateDir)

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
      template_id: 'steering-custom',
      version: template.metadata.version,
      allowed_tools: template.metadata.allowedTools,
      parameters: {},
      ...(sizeWarning && { warning: sizeWarning }),
    },
  }
}
