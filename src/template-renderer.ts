export type Parameters = Record<string, string | string[] | boolean | number>

/**
 * Replace placeholders in the template with the provided parameters.
 * @param template Template string that contains placeholders.
 * @param params Map of placeholder names and their values.
 * @returns Rendered template string.
 * @throws {Error} When a required placeholder value is not provided.
 */
export const renderTemplate = (template: string, params: Parameters): string => {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    if (!(key in params)) {
      throw new Error(`Missing required parameter: ${key}`)
    }

    const value = params[key]
    if (Array.isArray(value)) {
      return value.join(', ')
    }
    return String(value)
  })
}

/**
 * Convert positional placeholders to named placeholders.
 * @param template Template that contains positional placeholders.
 * @param mapping Mapping from positional to named placeholders.
 * @returns Converted template string.
 */
export const convertLegacyPlaceholders = (template: string, mapping: Record<string, string>): string => {
  let result = template
  for (const [legacy, named] of Object.entries(mapping)) {
    // Do not convert when a digit follows $1 (e.g., $10).
    // Escape the dollar symbol correctly.
    const escapedLegacy = legacy.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`${escapedLegacy}(?!\\d)`, 'g')
    result = result.replace(regex, `{{${named}}}`)
  }
  return result
}
