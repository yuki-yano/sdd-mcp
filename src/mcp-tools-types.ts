/**
 * Response type for MCP tools.
 */
export type ToolResult = {
  content: string
  metadata: ToolMetadata
}

/**
 * Metadata type for MCP tools.
 */
export type ToolMetadata = {
  template_id: string
  version: string
  allowed_tools: string[]
  parameters: Record<string, unknown>
  warning?: string
}

/**
 * Input type for the spec-init tool.
 */
export type SpecInitInput = {
  project_description: string
}

/**
 * Input type for the spec-requirements tool.
 */
export type SpecRequirementsInput = {
  feature_name: string
}

/**
 * Input type for the spec-status tool.
 */
export type SpecStatusInput = {
  feature_name: string
}

/**
 * Input type for the validate-design tool.
 */
export type ValidateDesignInput = {
  feature_name: string
}

/**
 * Input type for the validate-gap tool.
 */
export type ValidateGapInput = {
  feature_name: string
}

/**
 * Input type for the spec-design tool.
 */
export type SpecDesignInput = {
  feature_name: string
  auto_approve?: boolean
}

/**
 * Input type for the spec-tasks tool.
 */
export type SpecTasksInput = {
  feature_name: string
  auto_approve?: boolean
}

/**
 * Input type for the spec-impl tool.
 */
export type SpecImplInput = {
  feature_name: string
  task_numbers?: string[]
}

/**
 * Input type for the steering tool (no parameters).
 */
export type SteeringInput = Record<string, never>

/**
 * Input type for the steering-custom tool (no parameters).
 */
export type SteeringCustomInput = Record<string, never>
