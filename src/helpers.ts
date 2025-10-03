import type { TemplateMetadata } from './template-loader.js'

const PROMPT_SIZE_LIMIT = 50000 // 50KB

/**
 * プロンプトの冒頭に前提条件セクションを挿入する
 * @param prompt 元のプロンプト
 * @param metadata テンプレートメタデータ
 * @returns 前提条件が挿入されたプロンプト
 */
export const addPreconditions = (prompt: string, metadata: TemplateMetadata): string => {
  const preconditions = `## 実行前の確認事項

**このプロンプトについて**:
- テンプレート: ${metadata.id}
- バージョン: ${metadata.version}
- 許可ツール: ${metadata.allowedTools.join(', ')}

**前提条件**:
- このプロンプトは上記の許可ツールのみを使用して実行してください
- 指示に従って段階的に作業を進めてください
- エラーが発生した場合は、明確なエラーメッセージと共に報告してください

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
