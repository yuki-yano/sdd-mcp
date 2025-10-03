/**
 * MCPツールのレスポンス型
 */
export type ToolResult = {
  content: string
  metadata: ToolMetadata
}

/**
 * MCPツールのメタデータ型
 */
export type ToolMetadata = {
  template_id: string
  version: string
  allowed_tools: string[]
  parameters: Record<string, unknown>
  warning?: string
}

/**
 * spec-init ツールの入力型
 */
export type SpecInitInput = {
  project_description: string
}

/**
 * spec-requirements ツールの入力型
 */
export type SpecRequirementsInput = {
  feature_name: string
}

/**
 * spec-status ツールの入力型
 */
export type SpecStatusInput = {
  feature_name: string
}

/**
 * validate-design ツールの入力型
 */
export type ValidateDesignInput = {
  feature_name: string
}

/**
 * validate-gap ツールの入力型
 */
export type ValidateGapInput = {
  feature_name: string
}

/**
 * spec-design ツールの入力型
 */
export type SpecDesignInput = {
  feature_name: string
  auto_approve?: boolean
}

/**
 * spec-tasks ツールの入力型
 */
export type SpecTasksInput = {
  feature_name: string
  auto_approve?: boolean
}

/**
 * spec-impl ツールの入力型
 */
export type SpecImplInput = {
  feature_name: string
  task_numbers?: string[]
}

/**
 * steering ツールの入力型（パラメータなし）
 */
export type SteeringInput = Record<string, never>

/**
 * steering-custom ツールの入力型（パラメータなし）
 */
export type SteeringCustomInput = Record<string, never>
