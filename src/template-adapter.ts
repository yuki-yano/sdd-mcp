/**
 * cc-sdd形式のテンプレートをMCP環境に適応させる
 *
 * cc-sddのスラッシュコマンド形式（/kiro:xxx）をMCPツール指示形式に変換し、
 * 位置引数プレースホルダ（$1, $2など）を名前付きプレースホルダに変換します。
 * これにより、cc-sddテンプレートとの互換性を維持しながら、
 * Claude CodeのMCP環境で適切に機能させることができます。
 */

// 位置引数から名前付きプレースホルダへのマッピング
const PLACEHOLDER_MAPPINGS: Record<string, Record<string, string>> = {
  'spec-init': {
    $ARGUMENTS: 'project_description',
  },
  'spec-requirements': {
    $1: 'feature_name',
  },
  'spec-design': {
    $1: 'feature_name',
    $2: 'auto_approve',
  },
  'spec-tasks': {
    $1: 'feature_name',
    $2: 'auto_approve',
  },
  'spec-impl': {
    $1: 'feature_name',
    $2: 'task_numbers',
  },
  'spec-status': {
    $1: 'feature_name',
  },
  steering: {},
  'steering-custom': {},
  'validate-design': {
    $1: 'feature_name',
  },
  'validate-gap': {
    $1: 'feature_name',
  },
}

/**
 * 正規表現特殊文字をエスケープする
 */
const escapeRegex = (str: string): string => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * 位置引数プレースホルダを名前付きプレースホルダに変換する
 */
const convertPlaceholders = (content: string, mapping: Record<string, string>): string => {
  let result = content

  for (const [legacy, named] of Object.entries(mapping)) {
    // $1の後に数字がある場合は変換しない（$10等）
    const escapedLegacy = escapeRegex(legacy)
    const regex = new RegExp(`${escapedLegacy}(?!\\d)`, 'g')
    result = result.replace(regex, `{{${named}}}`)
  }

  return result
}

/**
 * /kiro: プレフィックスをMCPツール指示に変換
 *
 * 変換例:
 * - `/kiro:spec-requirements {{feature_name}}` → `spec-requirements ツールを実行: {{feature_name}}`
 * - `/kiro:spec-design <feature-name>` → `spec-design ツールを実行: <feature-name>`
 * - `Run /kiro:spec-tasks` → `spec-tasks ツールを実行`
 * - `$1` → `{{feature_name}}`（templateIdに基づく）
 *
 * @param content テンプレートコンテンツ
 * @param templateId テンプレートID（位置引数変換に使用）
 * @returns MCP環境に適応させたコンテンツ
 */
export const adaptTemplateForMCP = (content: string, templateId = ''): string => {
  let adapted = content

  // 1. 位置引数プレースホルダを名前付きプレースホルダに変換
  const mapping = PLACEHOLDER_MAPPINGS[templateId]
  if (mapping) {
    adapted = convertPlaceholders(adapted, mapping)
  }

  // 2. /kiro:xxx 形式をMCPツール呼び出しに変換
  // Run `/kiro:xxx` パターンを変換（Runを保持）
  adapted = adapted.replace(/Run `\/kiro:([a-z-]+)([^`]*)`/g, 'Run $1 ツールを実行$2')

  // `/kiro:xxx` パターンを変換（バッククォートで囲まれている場合）
  adapted = adapted.replace(/`\/kiro:([a-z-]+)([^`]*)`/g, '`$1 ツール$2`')

  // /kiro:xxx パターンを変換（バッククォートなし）
  adapted = adapted.replace(/\/kiro:([a-z-]+)/g, '$1 ツール')

  return adapted
}
