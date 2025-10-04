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

  describe('位置引数プレースホルダ変換', () => {
    it('spec-requirements: $1 を {{feature_name}} に変換する', () => {
      const input = 'Generate requirements for $1 feature'
      const expected = 'Generate requirements for {{feature_name}} feature'

      expect(adaptTemplateForMCP(input, 'spec-requirements')).toBe(expected)
    })

    it('spec-design: $1 と $2 を変換する', () => {
      const input = 'Design $1 with auto_approve=$2'
      const expected = 'Design {{feature_name}} with auto_approve={{auto_approve}}'

      expect(adaptTemplateForMCP(input, 'spec-design')).toBe(expected)
    })

    it('spec-init: $ARGUMENTS を {{project_description}} に変換する', () => {
      const input = 'Initialize project: $ARGUMENTS'
      const expected = 'Initialize project: {{project_description}}'

      expect(adaptTemplateForMCP(input, 'spec-init')).toBe(expected)
    })

    it('$10 のような複数桁の位置引数は変換しない', () => {
      const input = 'Use $1 and $10 and $11'
      const expected = 'Use {{feature_name}} and $10 and $11'

      expect(adaptTemplateForMCP(input, 'spec-requirements')).toBe(expected)
    })

    it('マッピングにないtemplateIdの場合は位置引数を変換しない', () => {
      const input = 'This is $1 and $2'

      expect(adaptTemplateForMCP(input, 'unknown-template')).toBe(input)
    })

    it('templateIdが空の場合は位置引数を変換しない', () => {
      const input = 'This is $1 and $2'

      expect(adaptTemplateForMCP(input, '')).toBe(input)
      expect(adaptTemplateForMCP(input)).toBe(input)
    })

    it('位置引数変換と/kiro:変換を同時に行う', () => {
      const input = 'Run `/kiro:spec-design $1 -y` to proceed'
      const expected = 'Run spec-design ツールを実行 {{feature_name}} -y to proceed'

      expect(adaptTemplateForMCP(input, 'spec-design')).toBe(expected)
    })
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
