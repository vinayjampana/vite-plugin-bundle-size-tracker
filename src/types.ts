export interface BundleSizeRecord {
  timestamp: number;
  totalSize: number;
  files: Record<string, number>;
}

export interface PluginOptions {
  /**
   * Path to the history file where build sizes are stored
   * @default '.bundle-size-history.json'
   */
  historyFile?: string;

  /**
   * Maximum number of builds to keep in history
   * @default 10
   */
  maxHistory?: number;

  /**
   * Percentage threshold for size increase warnings
   * @default 10
   */
  threshold?: number;

  /**
   * Generate a JSON report in the output directory
   * @default false
   */
  outputJson?: boolean;

  /**
   * Custom function to format file sizes
   */
  formatBytes?: (bytes: number) => string;
}

export interface BundleSizeReport {
  current: {
    totalSize: number;
    files: Record<string, number>;
  };
  average: number;
  percentChange: number;
  history: BundleSizeRecord[];
}
