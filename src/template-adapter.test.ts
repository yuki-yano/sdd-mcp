import { describe, expect, it } from 'vitest'
import { adaptTemplateForMCP } from './template-adapter.js'

describe('adaptTemplateForMCP', () => {
  it('Run `/kiro:xxx` パターンをツール実行形式に変換する', () => {
    const input = 'Run `/kiro:spec-requirements {{feature_name}}` to proceed'
    const expected = 'Run spec-requirements ツールを実行 {{feature_name}} to proceed'

    expect(adaptTemplateForMCP(input)).toBe(expected)
  })

  it('バッククォート付き `/kiro:xxx` パターンをツール形式に変換する', () => {
    const input = 'Use `/kiro:spec-design <feature-name>` command'
    const expected = 'Use `spec-design ツール <feature-name>` command'

    expect(adaptTemplateForMCP(input)).toBe(expected)
  })

  it('バッククォートなし /kiro:xxx パターンをツール形式に変換する', () => {
    const input = 'The /kiro:spec-tasks command will help'
    const expected = 'The spec-tasks ツール command will help'

    expect(adaptTemplateForMCP(input)).toBe(expected)
  })

  it('複数の /kiro: パターンを変換する', () => {
    const input = `Follow these steps:
1. Run \`/kiro:spec-requirements <feature>\`
2. Run \`/kiro:spec-design <feature>\`
3. Run \`/kiro:spec-tasks <feature>\``

    const expected = `Follow these steps:
1. Run spec-requirements ツールを実行 <feature>
2. Run spec-design ツールを実行 <feature>
3. Run spec-tasks ツールを実行 <feature>`

    expect(adaptTemplateForMCP(input)).toBe(expected)
  })

  it('-y フラグ付きパターンも正しく変換する', () => {
    const input = 'Run `/kiro:spec-design {{feature_name}} -y` to auto-approve'
    const expected = 'Run spec-design ツールを実行 {{feature_name}} -y to auto-approve'

    expect(adaptTemplateForMCP(input)).toBe(expected)
  })

  it('タスク番号付きパターンも正しく変換する', () => {
    const input = '`/kiro:spec-impl {{feature_name}} 1,2,3` will run specific tasks'
    const expected = '`spec-impl ツール {{feature_name}} 1,2,3` will run specific tasks'

    expect(adaptTemplateForMCP(input)).toBe(expected)
  })

  it('/kiro: を含まないテキストはそのまま返す', () => {
    const input = 'This is a normal text without any command references'

    expect(adaptTemplateForMCP(input)).toBe(input)
  })

  it('実際のテンプレートパターンを変換する', () => {
    const input = `## Next Steps After Initialization

Follow the strict spec-driven development workflow:
1. **\`/kiro:spec-requirements <feature-name>\`** - Create and generate requirements.md
2. **\`/kiro:spec-design <feature-name>\`** - Create and generate design.md (requires approved requirements)
3. **\`/kiro:spec-tasks <feature-name>\`** - Create and generate tasks.md (requires approved design)

**Clear next step**: \`/kiro:spec-requirements <feature-name>\``

    const expected = `## Next Steps After Initialization

Follow the strict spec-driven development workflow:
1. **\`spec-requirements ツール <feature-name>\`** - Create and generate requirements.md
2. **\`spec-design ツール <feature-name>\`** - Create and generate design.md (requires approved requirements)
3. **\`spec-tasks ツール <feature-name>\`** - Create and generate tasks.md (requires approved design)

**Clear next step**: \`spec-requirements ツール <feature-name>\``

    expect(adaptTemplateForMCP(input)).toBe(expected)
  })
})
