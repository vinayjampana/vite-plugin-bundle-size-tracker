import { Plugin, ResolvedConfig } from "vite";
import { promises as fs } from "fs";
import path from "path";
import pc from "picocolors";
import { PluginOptions, BundleSizeReport } from "./types";
import {
  calculateBundleSizes,
  loadHistory,
  saveHistory,
  formatBytes,
  calculateAverage,
  calculatePercentChange,
} from "./utils";

export default function bundleSizeTracker(options: PluginOptions = {}): Plugin {
  const {
    historyFile = ".bundle-size-history.json",
    maxHistory = 10,
    threshold = 10,
    outputJson = false,
    formatBytes: customFormatBytes = formatBytes,
  } = options;

  let config: ResolvedConfig;
  let outDir: string;

  return {
    name: "vite-plugin-bundle-size-tracker",
    apply: "build",

    configResolved(resolvedConfig) {
      config = resolvedConfig;
      outDir = path.resolve(resolvedConfig.root, resolvedConfig.build.outDir);
    },

    async closeBundle() {
      try {
        // Calculate current bundle sizes
        const bundleSizes = await calculateBundleSizes(outDir);
        const totalSize = Object.values(bundleSizes).reduce((a, b) => a + b, 0);

        // Load history
        const history = await loadHistory(historyFile);

        // Add current build to history
        history.push({
          timestamp: Date.now(),
          totalSize,
          files: bundleSizes,
        });

        // Keep only last N builds
        if (history.length > maxHistory) {
          history.splice(0, history.length - maxHistory);
        }

        // Calculate average of previous builds (excluding current)
        const previousBuilds = history.slice(0, -1);
        const avgSize =
          previousBuilds.length > 0
            ? calculateAverage(previousBuilds)
            : totalSize;

        // Calculate percentage change
        const percentChange =
          previousBuilds.length > 0
            ? calculatePercentChange(totalSize, avgSize)
            : 0;

        // Save history
        await saveHistory(historyFile, history);

        // Output results
        console.log("\n" + pc.cyan("━".repeat(60)));
        console.log(pc.bold(pc.cyan("📦 Bundle Size Analysis")));
        console.log(pc.cyan("━".repeat(60)));
        console.log(
          `${pc.bold("Current build:")} ${customFormatBytes(totalSize)}`
        );

        if (previousBuilds.length > 0) {
          console.log(
            `${pc.bold(
              "Average (last " + previousBuilds.length + " builds):"
            )} ${customFormatBytes(avgSize)}`
          );

          const changeColor =
            percentChange > threshold
              ? pc.red
              : percentChange > 0
              ? pc.yellow
              : pc.green;
          const changeSymbol = percentChange > 0 ? "↑" : "↓";
          console.log(
            `${pc.bold("Change:")} ${changeColor(
              changeSymbol + " " + Math.abs(percentChange).toFixed(2) + "%"
            )}`
          );

          if (percentChange > threshold) {
            console.log(
              pc.red(
                `\n⚠️  Warning: Bundle size increased by more than ${threshold}%!`
              )
            );
          }
        } else {
          console.log(pc.dim("No previous builds to compare"));
        }

        console.log("\n" + pc.bold("File breakdown:"));
        Object.entries(bundleSizes)
          .sort((a, b) => b[1] - a[1])
          .forEach(([file, size]) => {
            console.log(`  ${pc.dim(file)}: ${customFormatBytes(size)}`);
          });

        console.log(pc.cyan("━".repeat(60)) + "\n");

        // Optionally output JSON
        if (outputJson) {
          const jsonOutput: BundleSizeReport = {
            current: { totalSize, files: bundleSizes },
            average: avgSize,
            percentChange,
            history: previousBuilds,
          };
          await fs.writeFile(
            path.join(outDir, "bundle-size-report.json"),
            JSON.stringify(jsonOutput, null, 2)
          );
        }
      } catch (error) {
        console.error(pc.red("Error in bundle size tracker:"), error);
      }
    },
  };
}

// Named export for TypeScript users
export type {
  PluginOptions,
  BundleSizeRecord,
  BundleSizeReport,
} from "./types";
