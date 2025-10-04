import { addPreconditions, checkPromptSize } from '../helpers.js'
import type { SpecInitInput, ToolResult } from '../mcp-tools-types.js'
import { loadTemplate } from '../template-loader.js'
import { renderTemplate } from '../template-renderer.js'

/**
 * Handler for the spec-init tool.
 * @param input Project description.
 * @param templateDir Template directory path used for tests.
 * @returns Tool execution result.
 */
export const handleSpecInit = async (input: SpecInitInput, templateDir?: string): Promise<ToolResult> => {
  // 1. Validate parameters.
  if (!input.project_description || input.project_description.trim() === '') {
    throw new Error('Missing required parameter: project_description')
  }

  // 2. Load the template.
  const template = await loadTemplate('spec-init', templateDir)

  // 3. Expand placeholders.
  const params = {
    project_description: input.project_description,
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
      template_id: 'spec-init',
      version: template.metadata.version,
      allowed_tools: template.metadata.allowedTools,
      parameters: input,
      ...(sizeWarning && { warning: sizeWarning }),
    },
  }
}
