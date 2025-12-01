#!/usr/bin/env tsx
/**
 * Database and Uploads Backup Script
 * Usage: npx tsx scripts/backup.ts
 */

import { copyFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";
import { execSync } from "child_process";

const BACKUP_DIR = join(process.cwd(), "backups");
const DB_PATH = join(process.cwd(), "prisma", "dev.db");
const UPLOADS_DIR = join(process.cwd(), "public", "uploads");

async function backup() {
  try {
    // Create backup directory if it doesn't exist
    if (!existsSync(BACKUP_DIR)) {
      await mkdir(BACKUP_DIR, { recursive: true });
      console.log("✓ Created backup directory");
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, -5);

    // Backup database
    if (existsSync(DB_PATH)) {
      const dbBackupPath = join(BACKUP_DIR, `database-${timestamp}.db`);
      await copyFile(DB_PATH, dbBackupPath);
      console.log(`✓ Database backed up to: ${dbBackupPath}`);
    } else {
      console.log("⚠ Database file not found, skipping");
    }

    // Backup uploads
    if (existsSync(UPLOADS_DIR)) {
      const uploadsBackupPath = join(BACKUP_DIR, `uploads-${timestamp}.tar.gz`);
      try {
        execSync(
          `tar -czf "${uploadsBackupPath}" -C "${join(process.cwd(), "public")}" uploads`,
          { stdio: "inherit" }
        );
        console.log(`✓ Uploads backed up to: ${uploadsBackupPath}`);
      } catch (error) {
        console.log("⚠ Could not create uploads archive (tar might not be available)");
      }
    } else {
      console.log("⚠ Uploads directory not found, skipping");
    }

    console.log("\n✅ Backup completed successfully!");
    console.log(`\nBackup location: ${BACKUP_DIR}`);
    console.log("\nTo restore:");
    console.log("  Database: cp backups/database-<timestamp>.db prisma/dev.db");
    console.log("  Uploads:  tar -xzf backups/uploads-<timestamp>.tar.gz -C public/");
  } catch (error) {
    console.error("❌ Backup failed:", error);
    process.exit(1);
  }
}

backup();

