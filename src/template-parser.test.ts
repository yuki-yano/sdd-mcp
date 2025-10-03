import { describe, expect, it } from 'vitest'
import { parseFrontmatter } from './template-parser.js'

describe('parseFrontmatter', () => {
  it('正常なfrontmatterをパースできる', () => {
    const content = `---
description: Test template
allowed-tools: Bash, Read, Write
argument-hint: <test>
version: 1.0.0
---

# Template body
Test content here`

    const result = parseFrontmatter(content)

    expect(result.metadata.description).toBe('Test template')
    expect(result.metadata['allowed-tools']).toBe('Bash, Read, Write')
    expect(result.metadata['argument-hint']).toBe('<test>')
    expect(result.metadata.version).toBe('1.0.0')
    expect(result.body).toBe('\n# Template body\nTest content here')
  })

  it('versionフィールド未指定時にデフォルト値"1.0.0"を使用する', () => {
    const content = `---
description: Test template
allowed-tools: Bash, Read, Write
argument-hint: <test>
---

# Template body`

    const result = parseFrontmatter(content)

    expect(result.metadata.version).toBe('1.0.0')
  })

  it('未知のキーを保持する', () => {
    const content = `---
description: Test template
allowed-tools: Bash, Read, Write
argument-hint: <test>
custom-field: custom value
another-field: another value
---

# Template body`

    const result = parseFrontmatter(content)

    expect(result.metadata['custom-field']).toBe('custom value')
    expect(result.metadata['another-field']).toBe('another value')
  })

  it('無効な形式のfrontmatterでエラーをスローする', () => {
    const invalidContent = '# Just markdown\nNo frontmatter here'

    expect(() => parseFrontmatter(invalidContent)).toThrow('Invalid frontmatter format')
  })

  it('frontmatterとbodyを正しく分離する', () => {
    const content = `---
description: Test
allowed-tools: Read
argument-hint: <arg>
---

Body line 1
Body line 2
Body line 3`

    const result = parseFrontmatter(content)

    expect(result.body).toBe('\nBody line 1\nBody line 2\nBody line 3')
    expect(result.metadata.description).toBe('Test')
  })

  it('値にコロンが含まれる場合も正しくパースする', () => {
    const content = `---
description: Test: with colon
allowed-tools: Bash, Read
argument-hint: <test>
---

# Body`

    const result = parseFrontmatter(content)

    expect(result.metadata.description).toBe('Test: with colon')
  })
})
