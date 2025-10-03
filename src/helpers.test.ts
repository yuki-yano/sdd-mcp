import { describe, expect, it } from 'vitest'
import { addPreconditions, checkPromptSize } from './helpers.js'
import type { TemplateMetadata } from './template-loader.js'

describe('addPreconditions', () => {
  const mockMetadata: TemplateMetadata = {
    id: 'test-template',
    version: '1.2.3',
    description: 'Test template',
    allowedTools: ['Bash', 'Read', 'Write'],
    argumentHint: '<arg>',
  }

  it('プロンプト冒頭に前提条件セクションを挿入する', () => {
    const prompt = 'This is the original prompt content.'

    const result = addPreconditions(prompt, mockMetadata)

    expect(result).toContain('## Pre-execution Checklist')
    expect(result).toContain('Template: test-template')
    expect(result).toContain('Version: 1.2.3')
    expect(result).toContain('Allowed tools: Bash, Read, Write')
    expect(result).toContain('This is the original prompt content.')
  })

  it('元のプロンプトが前提条件の後に配置される', () => {
    const prompt = 'Original content here.'

    const result = addPreconditions(prompt, mockMetadata)

    const originalContentIndex = result.indexOf('Original content here.')
    const preconditionIndex = result.indexOf('## Pre-execution Checklist')

    expect(preconditionIndex).toBeLessThan(originalContentIndex)
  })

  it('セパレーターが前提条件とプロンプトの間に挿入される', () => {
    const prompt = 'Content'

    const result = addPreconditions(prompt, mockMetadata)

    expect(result).toContain('---')
    const separatorIndex = result.indexOf('---')
    const contentIndex = result.indexOf('Content')
    expect(separatorIndex).toBeLessThan(contentIndex)
  })
})

describe('checkPromptSize', () => {
  it('プロンプトサイズが上限以下の場合undefinedを返す', () => {
    const shortPrompt = 'This is a short prompt.'

    const result = checkPromptSize(shortPrompt)

    expect(result).toBeUndefined()
  })

  it('プロンプトサイズが上限を超える場合警告メッセージを返す', () => {
    // 50KB以上の文字列を生成
    const largePrompt = 'a'.repeat(51000)

    const result = checkPromptSize(largePrompt)

    expect(result).toBeDefined()
    expect(result).toContain('Generated prompt exceeds size limit')
    expect(result).toContain('50000')
  })

  it('警告メッセージに実際のサイズと上限を含む', () => {
    const largePrompt = 'a'.repeat(55000)

    const result = checkPromptSize(largePrompt)

    expect(result).toMatch(/\d+ > 50000/)
  })

  it('マルチバイト文字を含む場合もバイト数で計算する', () => {
    // 日本語文字を大量に含む文字列（1文字=3バイト）
    const japanesePrompt = 'あ'.repeat(20000) // 約60KB

    const result = checkPromptSize(japanesePrompt)

    expect(result).toBeDefined()
    expect(result).toContain('Generated prompt exceeds size limit')
  })
})
