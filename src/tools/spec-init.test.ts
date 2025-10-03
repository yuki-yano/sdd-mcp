import { mkdir, rm, writeFile } from 'node:fs/promises'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { handleSpecInit } from './spec-init.js'

const TEST_TEMPLATE_DIR = '/tmp/sdd-mcp-test-tools'

describe('handleSpecInit', () => {
  beforeEach(async () => {
    // テスト用ディレクトリを作成
    await mkdir(TEST_TEMPLATE_DIR, { recursive: true })

    // テスト用テンプレートファイルを作成
    const templateContent = `---
description: Test spec-init template
allowed-tools: Bash, Read, Write
argument-hint: <project-description>
version: 1.0.0
---

# Initialize Project
Project: {{project_description}}`

    await writeFile(`${TEST_TEMPLATE_DIR}/spec-init.md`, templateContent)
  })

  afterEach(async () => {
    await rm(TEST_TEMPLATE_DIR, { recursive: true, force: true })
  })

  it('正常な入力でプロンプトを生成できる', async () => {
    const input = {
      project_description: 'Build a new MCP server',
    }

    const result = await handleSpecInit(input, TEST_TEMPLATE_DIR)

    expect(result.content).toContain('Project: Build a new MCP server')
    expect(result.metadata.template_id).toBe('spec-init')
    expect(result.metadata.version).toBe('1.0.0')
    expect(result.metadata.allowed_tools).toEqual(['Bash', 'Read', 'Write'])
    expect(result.metadata.parameters).toEqual(input)
  })

  it('前提条件セクションが挿入されている', async () => {
    const input = {
      project_description: 'Test project',
    }

    const result = await handleSpecInit(input, TEST_TEMPLATE_DIR)

    expect(result.content).toContain('## Pre-execution Checklist')
    expect(result.content).toContain('Template: spec-init')
    expect(result.content).toContain('Version: 1.0.0')
    expect(result.content).toContain('Allowed tools: Bash, Read, Write')
  })

  it('必須パラメータが欠落している場合エラーをスローする', async () => {
    const input: Partial<SpecInitInput> = {
      // project_description が欠けている
    }

    await expect(handleSpecInit(input as SpecInitInput, TEST_TEMPLATE_DIR)).rejects.toThrow(
      'Missing required parameter: project_description',
    )
  })

  it('空文字列のパラメータでエラーをスローする', async () => {
    const input = {
      project_description: '',
    }

    await expect(handleSpecInit(input, TEST_TEMPLATE_DIR)).rejects.toThrow(
      'Missing required parameter: project_description',
    )
  })

  it('プロンプトサイズが上限を超える場合警告を含む', async () => {
    const input = {
      project_description: 'a'.repeat(50000),
    }

    const result = await handleSpecInit(input, TEST_TEMPLATE_DIR)

    expect(result.metadata.warning).toBeDefined()
    expect(result.metadata.warning).toContain('Generated prompt exceeds size limit')
  })
})
