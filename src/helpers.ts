import type { TemplateMetadata } from './template-loader.js'

const PROMPT_SIZE_LIMIT = 50000 // 50KB

/**
 * プロンプトの冒頭に前提条件セクションを挿入する
 * @param prompt 元のプロンプト
 * @param metadata テンプレートメタデータ
 * @returns 前提条件が挿入されたプロンプト
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
 * プロンプトサイズをチェックし、超過時は警告メッセージを返す
 * @param content プロンプト内容
 * @returns 警告メッセージ（超過時のみ）、undefinedはサイズ上限以内
 */
export const checkPromptSize = (content: string): string | undefined => {
  const sizeInBytes = new TextEncoder().encode(content).length

  if (sizeInBytes > PROMPT_SIZE_LIMIT) {
    return `Generated prompt exceeds size limit: ${sizeInBytes} > ${PROMPT_SIZE_LIMIT}`
  }

  return undefined
}
