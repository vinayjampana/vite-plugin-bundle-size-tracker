import { promises as fs } from "fs";
import path from "path";
import { BundleSizeRecord } from "./types";

export async function calculateBundleSizes(
  outDir: string
): Promise<Record<string, number>> {
  const sizes: Record<string, number> = {};

  async function scanDir(dir: string) {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        await scanDir(fullPath);
      } else if (entry.isFile() && /\.(js|css|html)$/.test(entry.name)) {
        const stats = await fs.stat(fullPath);
        const relativePath = path.relative(outDir, fullPath);
        sizes[relativePath] = stats.size;
      }
    }
  }

  await scanDir(outDir);
  return sizes;
}

export async function loadHistory(
  historyFile: string
): Promise<BundleSizeRecord[]> {
  try {
    const data = await fs.readFile(historyFile, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function saveHistory(
  historyFile: string,
  history: BundleSizeRecord[]
): Promise<void> {
  await fs.writeFile(historyFile, JSON.stringify(history, null, 2));
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

export function calculateAverage(history: BundleSizeRecord[]): number {
  if (history.length === 0) return 0;
  const sum = history.reduce((acc, record) => acc + record.totalSize, 0);
  return sum / history.length;
}

export function calculatePercentChange(
  current: number,
  average: number
): number {
  if (average === 0) return 0;
  return ((current - average) / average) * 100;
}
