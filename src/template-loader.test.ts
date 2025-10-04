import { mkdir, rm, writeFile } from 'node:fs/promises'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { loadTemplate } from './template-loader.js'

const TEST_TEMPLATE_DIR = '/tmp/sdd-mcp-test-templates'

describe('loadTemplate', () => {
  beforeEach(async () => {
    // Create a test directory.
    await mkdir(TEST_TEMPLATE_DIR, { recursive: true })
  })

  afterEach(async () => {
    // Clean up after each test.
    await rm(TEST_TEMPLATE_DIR, { recursive: true, force: true })
  })

  it('有効なテンプレートファイルを読み込める', async () => {
    const templateContent = `---
description: Test template
allowed-tools: Bash, Read, Write
argument-hint: <test-arg>
version: 2.0.0
---

# Test Template
This is a test {{parameter}}`

    await writeFile(`${TEST_TEMPLATE_DIR}/test-template.md`, templateContent)

    const result = await loadTemplate('test-template', TEST_TEMPLATE_DIR)

    expect(result.metadata.id).toBe('test-template')
    expect(result.metadata.version).toBe('2.0.0')
    expect(result.metadata.description).toBe('Test template')
    expect(result.metadata.allowedTools).toEqual(['Bash', 'Read', 'Write'])
    expect(result.metadata.argumentHint).toBe('<test-arg>')
    expect(result.body).toContain('# Test Template')
    expect(result.body).toContain('This is a test {{parameter}}')
  })

  it('存在しないファイルでエラーをスローする', async () => {
    await expect(loadTemplate('non-existent', TEST_TEMPLATE_DIR)).rejects.toThrow('Template not found: non-existent')
  })

  it('不正な形式のファイルでエラーをスローする', async () => {
    const invalidContent = '# Just markdown without frontmatter'

    await writeFile(`${TEST_TEMPLATE_DIR}/invalid.md`, invalidContent)

    await expect(loadTemplate('invalid', TEST_TEMPLATE_DIR)).rejects.toThrow('Invalid template frontmatter')
  })

  it('メタデータをハイフン付きキーからキャメルケースに変換する', async () => {
    const templateContent = `---
description: Test
allowed-tools: Read
argument-hint: <arg>
---

Body`

    await writeFile(`${TEST_TEMPLATE_DIR}/camel-test.md`, templateContent)

    const result = await loadTemplate('camel-test', TEST_TEMPLATE_DIR)

    // Verify that hyphenated keys are converted to camelCase.
    expect(result.metadata.allowedTools).toBeDefined()
    expect(result.metadata.argumentHint).toBeDefined()
  })

  it('allowed-toolsをカンマ区切りでパースして配列に変換する', async () => {
    const templateContent = `---
description: Test
allowed-tools: Bash, Read, Write, Glob, Grep
argument-hint: <arg>
---

Body`

    await writeFile(`${TEST_TEMPLATE_DIR}/tools-test.md`, templateContent)

    const result = await loadTemplate('tools-test', TEST_TEMPLATE_DIR)

    expect(result.metadata.allowedTools).toEqual(['Bash', 'Read', 'Write', 'Glob', 'Grep'])
  })

  it('versionフィールドが未指定の場合デフォルト値を使用する', async () => {
    const templateContent = `---
description: Test
allowed-tools: Read
argument-hint: <arg>
---

Body`

    await writeFile(`${TEST_TEMPLATE_DIR}/no-version.md`, templateContent)

    const result = await loadTemplate('no-version', TEST_TEMPLATE_DIR)

    expect(result.metadata.version).toBe('1.0.0')
  })
})
