import { readFile } from 'node:fs/promises'
import { dirname, isAbsolute, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { adaptTemplateForMCP } from './template-adapter.js'
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
 * Load and parse a template file.
 * @param templateId Template ID (file name without .md).
 * @param templateDir Path to the template directory (defaults to commands).
 * @returns Parsed template contents.
 * @throws {Error} When the file is missing or fails to load/parse.
 */
export const loadTemplate = async (templateId: string, templateDir = 'commands'): Promise<LoadedTemplate> => {
  // Use templateDir as-is when it is absolute; otherwise resolve it from the package root.
  let resolvedTemplateDir: string
  if (isAbsolute(templateDir)) {
    resolvedTemplateDir = templateDir
  } else {
    // Resolve an absolute path from the package root so bunx can locate templates.
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = dirname(__filename)
    const packageRoot = join(__dirname, '..') // One level above dist is the package root.
    resolvedTemplateDir = join(packageRoot, templateDir)
  }

  const filePath = join(resolvedTemplateDir, `${templateId}.md`)

  // Read the file contents.
  let content: string
  try {
    content = await readFile(filePath, 'utf-8')
  } catch (error) {
    throw new Error(`Template not found: ${templateId}`)
  }

  // Parse the frontmatter.
  let parsed: ParsedTemplate
  try {
    parsed = parseFrontmatter(content)
  } catch (error) {
    throw new Error(`Invalid template frontmatter: ${(error as Error).message}`)
  }

  // Convert metadata keys (hyphenated names -> camelCase).
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
