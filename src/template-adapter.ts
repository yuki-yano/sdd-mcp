/**
 * Adapt cc-sdd templates for the MCP environment.
 *
 * Converts the cc-sdd slash command syntax (/kiro:xxx) into MCP tool instructions
 * and turns positional placeholders ($1, $2, etc.) into named placeholders.
 * This keeps compatibility with cc-sdd templates while making them work correctly
 * within Claude Code's MCP environment.
 */

// Mapping from positional placeholders to named placeholders.
const PLACEHOLDER_MAPPINGS: Record<string, Record<string, string>> = {
  'spec-init': {
    $ARGUMENTS: 'project_description',
  },
  'spec-requirements': {
    $1: 'feature_name',
  },
  'spec-design': {
    $1: 'feature_name',
    $2: 'auto_approve',
  },
  'spec-tasks': {
    $1: 'feature_name',
    $2: 'auto_approve',
  },
  'spec-impl': {
    $1: 'feature_name',
    $2: 'task_numbers',
  },
  'spec-status': {
    $1: 'feature_name',
  },
  steering: {},
  'steering-custom': {},
  'validate-design': {
    $1: 'feature_name',
  },
  'validate-gap': {
    $1: 'feature_name',
  },
}

/**
 * Escape special regular expression characters.
 */
const escapeRegex = (str: string): string => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Convert positional placeholders into named placeholders.
 */
const convertPlaceholders = (content: string, mapping: Record<string, string>): string => {
  let result = content

  for (const [legacy, named] of Object.entries(mapping)) {
    // Do not convert when a digit follows $1 (e.g., $10).
    const escapedLegacy = escapeRegex(legacy)
    const regex = new RegExp(`${escapedLegacy}(?!\\d)`, 'g')
    result = result.replace(regex, `{{${named}}}`)
  }

  return result
}

/**
 * Convert the /kiro: prefix into MCP tool instructions.
 *
 * Conversion examples (outputs retain the localized Japanese word for "tool"):
 * - `/kiro:spec-requirements {{feature_name}}` becomes a `spec-requirements` tool invocation with the same arguments.
 * - `/kiro:spec-design <feature-name>` becomes a `spec-design` tool invocation with the provided arguments.
 * - `Run /kiro:spec-tasks` becomes `Run spec-tasks` followed by the localized tool phrase.
 * - `$1` is replaced with `{{feature_name}}` based on the templateId.
 *
 * @param content Template contents.
 * @param templateId Template ID used for positional placeholder conversion.
 * @returns Content adapted for the MCP environment.
 */
export const adaptTemplateForMCP = (content: string, templateId = ''): string => {
  let adapted = content

  // 1. Convert positional placeholders into named placeholders.
  const mapping = PLACEHOLDER_MAPPINGS[templateId]
  if (mapping) {
    adapted = convertPlaceholders(adapted, mapping)
  }

  // 2. Convert /kiro:xxx syntax into MCP tool invocations.
  // Convert the Run `/kiro:xxx` pattern while keeping the leading Run.
  adapted = adapted.replace(/Run `\/kiro:([a-z-]+)([^`]*)`/g, 'Run $1 ツールを実行$2')

  // Convert the `/kiro:xxx` pattern when it is wrapped in backticks.
  adapted = adapted.replace(/`\/kiro:([a-z-]+)([^`]*)`/g, '`$1 ツール$2`')

  // Convert the /kiro:xxx pattern when backticks are not used.
  adapted = adapted.replace(/\/kiro:([a-z-]+)/g, '$1 ツール')

  return adapted
}
