import { describe, expect, it } from 'vitest'
import { convertLegacyPlaceholders, renderTemplate } from './template-renderer.js'

describe('renderTemplate', () => {
  it('単純なプレースホルダを置換できる', () => {
    const template = 'Hello {{name}}!'
    const params = { name: 'World' }

    const result = renderTemplate(template, params)

    expect(result).toBe('Hello World!')
  })

  it('複数のプレースホルダを置換できる', () => {
    const template = '{{greeting}} {{name}}, welcome to {{place}}!'
    const params = {
      greeting: 'Hello',
      name: 'Alice',
      place: 'Wonderland',
    }

    const result = renderTemplate(template, params)

    expect(result).toBe('Hello Alice, welcome to Wonderland!')
  })

  it('配列パラメータをカンマ区切りに変換する', () => {
    const template = 'Tools: {{tools}}'
    const params = {
      tools: ['Bash', 'Read', 'Write'],
    }

    const result = renderTemplate(template, params)

    expect(result).toBe('Tools: Bash, Read, Write')
  })

  it('boolean型パラメータを文字列化する', () => {
    const template = 'Enabled: {{enabled}}'
    const params = {
      enabled: true,
    }

    const result = renderTemplate(template, params)

    expect(result).toBe('Enabled: true')
  })

  it('number型パラメータを文字列化する', () => {
    const template = 'Count: {{count}}'
    const params = {
      count: 42,
    }

    const result = renderTemplate(template, params)

    expect(result).toBe('Count: 42')
  })

  it('必須パラメータが欠落している場合エラーをスローする', () => {
    const template = 'Hello {{name}}!'
    const params = {}

    expect(() => renderTemplate(template, params)).toThrow('Missing required parameter: name')
  })

  it('同一プレースホルダが複数回出現する場合も正しく置換する', () => {
    const template = '{{name}} says: "Hello, I am {{name}}"'
    const params = { name: 'Bob' }

    const result = renderTemplate(template, params)

    expect(result).toBe('Bob says: "Hello, I am Bob"')
  })
})

describe('convertLegacyPlaceholders', () => {
  it('$ARGUMENTSを名前付きプレースホルダに変換する', () => {
    const template = 'Initialize with: $ARGUMENTS'
    const mapping = { $ARGUMENTS: 'project_description' }

    const result = convertLegacyPlaceholders(template, mapping)

    expect(result).toBe('Initialize with: {{project_description}}')
  })

  it('$1を名前付きプレースホルダに変換する', () => {
    const template = 'Feature: $1'
    const mapping = { $1: 'feature_name' }

    const result = convertLegacyPlaceholders(template, mapping)

    expect(result).toBe('Feature: {{feature_name}}')
  })

  it('$2を名前付きプレースホルダに変換する', () => {
    const template = 'Tasks: $2'
    const mapping = { $2: 'task_numbers' }

    const result = convertLegacyPlaceholders(template, mapping)

    expect(result).toBe('Tasks: {{task_numbers}}')
  })

  it('複数の位置引数を一度に変換する', () => {
    const template = 'Init: $ARGUMENTS, Feature: $1, Tasks: $2'
    const mapping = {
      $ARGUMENTS: 'project_description',
      $1: 'feature_name',
      $2: 'task_numbers',
    }

    const result = convertLegacyPlaceholders(template, mapping)

    expect(result).toBe('Init: {{project_description}}, Feature: {{feature_name}}, Tasks: {{task_numbers}}')
  })

  it('$1の後に数字がある場合は変換しない（$10等）', () => {
    const template = 'Feature: $1, but not $10'
    const mapping = { $1: 'feature_name' }

    const result = convertLegacyPlaceholders(template, mapping)

    expect(result).toBe('Feature: {{feature_name}}, but not $10')
  })
})
