/**
 * cc-sdd形式のテンプレートをMCP環境に適応させる
 *
 * cc-sddのスラッシュコマンド形式（/kiro:xxx）をMCPツール指示形式に変換します。
 * これにより、cc-sddテンプレートとの互換性を維持しながら、
 * Claude CodeのMCP環境で適切に機能させることができます。
 */

/**
 * /kiro: プレフィックスをMCPツール指示に変換
 *
 * 変換例:
 * - `/kiro:spec-requirements {{feature_name}}` → `spec-requirements ツールを実行: {{feature_name}}`
 * - `/kiro:spec-design <feature-name>` → `spec-design ツールを実行: <feature-name>`
 * - `Run /kiro:spec-tasks` → `spec-tasks ツールを実行`
 *
 * @param content テンプレートコンテンツ
 * @returns MCP環境に適応させたコンテンツ
 */
export const adaptTemplateForMCP = (content: string): string => {
  // /kiro:xxx 形式をMCPツール呼び出しに変換
  // パターン: /kiro:command-name → command-name ツールを実行
  let adapted = content

  // Run `/kiro:xxx` パターンを変換（Runを保持）
  adapted = adapted.replace(/Run `\/kiro:([a-z-]+)([^`]*)`/g, 'Run $1 ツールを実行$2')

  // `/kiro:xxx` パターンを変換（バッククォートで囲まれている場合）
  adapted = adapted.replace(/`\/kiro:([a-z-]+)([^`]*)`/g, '`$1 ツール$2`')

  // /kiro:xxx パターンを変換（バッククォートなし）
  adapted = adapted.replace(/\/kiro:([a-z-]+)/g, '$1 ツール')

  return adapted
}
