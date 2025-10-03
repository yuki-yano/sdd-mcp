export type Parameters = Record<string, string | string[] | boolean | number>

/**
 * テンプレート内のプレースホルダを引数で置換する
 * @param template プレースホルダを含むテンプレート文字列
 * @param params プレースホルダ名と値のマップ
 * @returns 展開済みテンプレート
 * @throws {Error} 必須プレースホルダに対応する値が提供されない場合
 */
export const renderTemplate = (template: string, params: Parameters): string => {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    if (!(key in params)) {
      throw new Error(`Missing required parameter: ${key}`)
    }

    const value = params[key]
    if (Array.isArray(value)) {
      return value.join(', ')
    }
    return String(value)
  })
}

/**
 * 位置引数プレースホルダを名前付きプレースホルダに変換する
 * @param template 位置引数プレースホルダを含むテンプレート
 * @param mapping 位置引数から名前付きプレースホルダへのマッピング
 * @returns 変換済みテンプレート
 */
export const convertLegacyPlaceholders = (template: string, mapping: Record<string, string>): string => {
  let result = template
  for (const [legacy, named] of Object.entries(mapping)) {
    // $1の後に数字がある場合は変換しない（$10等）
    // $記号を正しくエスケープ
    const escapedLegacy = legacy.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`${escapedLegacy}(?!\\d)`, 'g')
    result = result.replace(regex, `{{${named}}}`)
  }
  return result
}
