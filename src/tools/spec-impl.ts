import { addPreconditions, checkPromptSize } from '../helpers.js'
import type { SpecImplInput, ToolResult } from '../mcp-tools-types.js'
import { loadTemplate } from '../template-loader.js'
import { renderTemplate } from '../template-renderer.js'

/**
 * Handler for the spec-impl tool.
 * @param input Feature name and array of task numbers.
 * @param templateDir Template directory path used for tests.
 * @returns Tool execution result.
 */
export const handleSpecImpl = async (input: SpecImplInput, templateDir?: string): Promise<ToolResult> => {
  // 1. Validate parameters.
  if (!input.feature_name || input.feature_name.trim() === '') {
    throw new Error('Missing required parameter: feature_name')
  }

  if (input.task_numbers !== undefined) {
    if (!Array.isArray(input.task_numbers)) {
      throw new Error(`Invalid parameter type for task_numbers: expected string[], got ${typeof input.task_numbers}`)
    }
  }

  // 2. Load the template.
  const template = await loadTemplate('spec-impl', templateDir)

  // 3. Expand placeholders.
  const params: Record<string, string | string[]> = {
    feature_name: input.feature_name,
  }

  if (input.task_numbers && input.task_numbers.length > 0) {
    params.task_numbers = input.task_numbers
  } else {
    params.task_numbers = 'all pending tasks'
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
      template_id: 'spec-impl',
      version: template.metadata.version,
      allowed_tools: template.metadata.allowedTools,
      parameters: input,
      ...(sizeWarning && { warning: sizeWarning }),
    },
  }
}
