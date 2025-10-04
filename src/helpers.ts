import type { TemplateMetadata } from './template-loader.js'

const PROMPT_SIZE_LIMIT = 50000 // 50KB

/**
 * Insert the preconditions section at the beginning of the prompt.
 * @param prompt Original prompt text.
 * @param metadata Template metadata.
 * @returns Prompt with preconditions prepended.
 */
export const addPreconditions = (prompt: string, metadata: TemplateMetadata): string => {
  const preconditions = `## Pre-execution Checklist

**About this prompt**:
- Template: ${metadata.id}
- Version: ${metadata.version}
- Allowed tools: ${metadata.allowedTools.join(', ')}

**Prerequisites**:
- Execute this prompt using only the allowed tools listed above
- Follow the instructions step by step
- Report any errors with clear error messages

---

${prompt}`

  return preconditions
}

/**
 * Check the prompt size and return a warning when it exceeds the limit.
 * @param content Prompt body.
 * @returns Warning message when over the limit, otherwise undefined.
 */
export const checkPromptSize = (content: string): string | undefined => {
  const sizeInBytes = new TextEncoder().encode(content).length

  if (sizeInBytes > PROMPT_SIZE_LIMIT) {
    return `Generated prompt exceeds size limit: ${sizeInBytes} > ${PROMPT_SIZE_LIMIT}`
  }

  return undefined
}
