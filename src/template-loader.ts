import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join, isAbsolute } from 'node:path'
import type { ParsedTemplate } from './template-parser.js'
import { parseFrontmatter } from './template-parser.js'
import { adaptTemplateForMCP } from './template-adapter.js'

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
  // templateDirが絶対パスの場合はそのまま使用、相対パスの場合はパッケージルートからの絶対パスを構築
  let resolvedTemplateDir: string
  if (isAbsolute(templateDir)) {
    resolvedTemplateDir = templateDir
  } else {
    // bunx実行時にもテンプレートを見つけられるように、パッケージルートからの絶対パスを構築
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = dirname(__filename)
    const packageRoot = join(__dirname, '..') // dist から一つ上がパッケージルート
    resolvedTemplateDir = join(packageRoot, templateDir)
  }

  const filePath = join(resolvedTemplateDir, `${templateId}.md`)

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
    body: adaptTemplateForMCP(parsed.body, templateId),
  }
}
