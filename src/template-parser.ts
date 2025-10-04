export type TemplateFrontmatter = {
  description: string
  'allowed-tools': string
  'argument-hint': string
  version?: string
  [key: string]: string | undefined
}

export type ParsedTemplate = {
  metadata: TemplateFrontmatter
  body: string
}

/**
 * テンプレートファイルからfrontmatterとマークダウン本文を分離してパースする
 * @param content テンプレートファイルの内容
 * @returns パース済みのfrontmatterとbody
 * @throws {Error} frontmatterが無効な形式の場合
 */
export const parseFrontmatter = (content: string): ParsedTemplate => {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) {
    throw new Error('Invalid frontmatter format')
  }

  const rawMeta = match[1]
  const body = match[2]
  if (!rawMeta) {
    throw new Error('Missing frontmatter metadata')
  }
  if (body === undefined) {
    throw new Error('Missing template body')
  }
  const lines = rawMeta.split('\n').filter((line) => line.trim())
  const metadata: Record<string, string> = {}

  for (const line of lines) {
    const colonIndex = line.indexOf(':')
    if (colonIndex === -1) continue

    const key = line.slice(0, colonIndex).trim()
    const value = line.slice(colonIndex + 1).trim()
    metadata[key] = value
  }

  // versionフィールドのデフォルト値設定
  const description = metadata.description
  if (!description) {
    throw new Error('Missing required frontmatter field: description')
  }

  const allowedTools = metadata['allowed-tools']
  if (!allowedTools) {
    throw new Error('Missing required frontmatter field: allowed-tools')
  }

  const argumentHint = metadata['argument-hint']
  if (!argumentHint) {
    throw new Error('Missing required frontmatter field: argument-hint')
  }

  const version = metadata.version ?? '1.0.0'

  const parsedMetadata: TemplateFrontmatter = {
    ...metadata,
    description,
    'allowed-tools': allowedTools,
    'argument-hint': argumentHint,
    version,
  }

  return {
    metadata: parsedMetadata,
    body,
  }
}
