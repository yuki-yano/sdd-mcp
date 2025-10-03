#!/usr/bin/env bun

/**
 * テンプレートファイルのマイグレーションスクリプト
 *
 * このスクリプトは以下の処理を行います：
 * 1. 位置引数プレースホルダ（$ARGUMENTS, $1, $2）を名前付きプレースホルダに変換
 * 2. frontmatterにversionフィールドを追加（未指定の場合）
 */

import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const TEMPLATE_DIR = "commands";

// 位置引数から名前付きプレースホルダへのマッピング
const PLACEHOLDER_MAPPINGS: Record<string, Record<string, string>> = {
  "spec-init": {
    $ARGUMENTS: "project_description",
  },
  "spec-requirements": {
    $1: "feature_name",
  },
  "spec-design": {
    $1: "feature_name",
    $2: "auto_approve",
  },
  "spec-tasks": {
    $1: "feature_name",
    $2: "auto_approve",
  },
  "spec-impl": {
    $1: "feature_name",
    $2: "task_numbers",
  },
  "spec-status": {
    $1: "feature_name",
  },
  steering: {},
  "steering-custom": {},
  "validate-design": {
    $1: "feature_name",
  },
  "validate-gap": {
    $1: "feature_name",
  },
};

/**
 * 正規表現特殊文字をエスケープする
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * 位置引数プレースホルダを名前付きプレースホルダに変換する
 */
function convertPlaceholders(
  content: string,
  mapping: Record<string, string>,
): string {
  let result = content;

  for (const [legacy, named] of Object.entries(mapping)) {
    // $1の後に数字がある場合は変換しない（$10等）
    const escapedLegacy = escapeRegex(legacy);
    const regex = new RegExp(`${escapedLegacy}(?!\\d)`, "g");
    result = result.replace(regex, `{{${named}}}`);
  }

  return result;
}

/**
 * frontmatterにversionフィールドを追加する
 */
function addVersionToFrontmatter(content: string): string {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (!frontmatterMatch) {
    console.warn("  !  Frontmatter not found");
    return content;
  }

  const frontmatter = frontmatterMatch[1];

  // すでにversionフィールドがある場合はスキップ
  if (frontmatter.includes("version:")) {
    console.log("  i  Version field already exists");
    return content;
  }

  // versionフィールドを追加
  const newFrontmatter = `${frontmatter}\nversion: 1.0.0`;
  return content.replace(
    /^---\n[\s\S]*?\n---\n/,
    `---\n${newFrontmatter}\n---\n`,
  );
}

/**
 * 単一のテンプレートファイルをマイグレーションする
 */
async function migrateTemplate(templateId: string): Promise<void> {
  const filePath = join(TEMPLATE_DIR, `${templateId}.md`);

  try {
    // ファイル読み込み
    const content = await readFile(filePath, "utf-8");

    // 位置引数プレースホルダを変換
    const mapping = PLACEHOLDER_MAPPINGS[templateId] || {};
    let migratedContent = convertPlaceholders(content, mapping);

    // versionフィールドを追加
    migratedContent = addVersionToFrontmatter(migratedContent);

    // ファイル書き込み
    await writeFile(filePath, migratedContent, "utf-8");

    console.log(`✅ Migrated: ${templateId}.md`);
  } catch (error) {
    console.error(`❌ Failed to migrate ${templateId}.md:`, error);
    throw error;
  }
}

/**
 * 全テンプレートファイルをマイグレーションする
 */
async function migrateAll(): Promise<void> {
  console.log("🚀 Starting template migration...\n");

  const templateIds = Object.keys(PLACEHOLDER_MAPPINGS);

  for (const templateId of templateIds) {
    await migrateTemplate(templateId);
  }

  console.log("\n✨ Migration completed successfully!");
}

// スクリプト実行
migrateAll().catch((error) => {
  console.error("\n💥 Migration failed:", error);
  process.exit(1);
});
