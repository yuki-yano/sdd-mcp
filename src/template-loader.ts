import { readFile } from 'node:fs/promises'
import type { ParsedTemplate } from './template-parser.js'
import { parseFrontmatter } from './template-parser.js'

export type TemplateMetadata = {
  id: string
  version: string
  description: string
  allowedTools: string[]
  argumentHint: string
}

export type LoadedTemplate = {
  metadata: TemplateMetadata
  body: string
}

/**
 * テンプレートファイルを読み込んでパースする
 * @param templateId テンプレートID（ファイル名から.mdを除いたもの）
 * @param templateDir テンプレートディレクトリのパス（デフォルト: commands）
 * @returns パース済みテンプレート
 * @throws {Error} ファイルが存在しない、または読み込み/パースに失敗した場合
 */
export const loadTemplate = async (templateId: string, templateDir = 'commands'): Promise<LoadedTemplate> => {
  const filePath = `${templateDir}/${templateId}.md`

  // ファイル読み込み
  let content: string
  try {
    content = await readFile(filePath, 'utf-8')
  } catch (error) {
    throw new Error(`Template not found: ${templateId}`)
  }

  // frontmatterパース
  let parsed: ParsedTemplate
  try {
    parsed = parseFrontmatter(content)
  } catch (error) {
    throw new Error(`Invalid template frontmatter: ${(error as Error).message}`)
  }

  // メタデータ変換（ハイフン付きキー → キャメルケース）
  const metadata: TemplateMetadata = {
    id: templateId,
    version: parsed.metadata.version ?? '1.0.0',
    description: parsed.metadata.description,
    allowedTools: parsed.metadata['allowed-tools']
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0),
    argumentHint: parsed.metadata['argument-hint'],
  }

  return {
    metadata,
    body: parsed.body,
  }
}
