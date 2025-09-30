# vite-plugin-bundle-size-tracker

> 📦 Track and compare your Vite bundle sizes across builds

A Vite plugin that automatically tracks your bundle sizes, compares them with historical averages, and alerts you when your bundle grows unexpectedly.

[![npm version](https://img.shields.io/npm/v/vite-plugin-bundle-size-tracker.svg)](https://www.npmjs.com/package/vite-plugin-bundle-size-tracker)
[![npm downloads](https://img.shields.io/npm/dm/vite-plugin-bundle-size-tracker.svg)](https://www.npmjs.com/package/vite-plugin-bundle-size-tracker)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- 📊 **Historical Tracking** - Maintains a history of your last N builds
- 📈 **Smart Comparison** - Compares current build with historical average
- ⚠️ **Configurable Alerts** - Warns when bundle size increases beyond threshold
- 🎨 **Beautiful Output** - Color-coded console output with detailed breakdown
- 📝 **JSON Reports** - Optional JSON report generation for CI/CD integration
- 🚀 **Zero Config** - Works out of the box with sensible defaults
- 🔧 **Fully Customizable** - Flexible options to match your workflow

## 📸 Screenshot

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 Bundle Size Analysis
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Current build: 145.18 KB
Average (last 9 builds): 142.35 KB
Change: ↑ 1.99%

File breakdown:
  assets/index-e5f6g7h8.js: 143.50 KB
  assets/index-a1b2c3d4.css: 1.23 KB
  index.html: 0.45 KB
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 📦 Installation

```bash
npm install -D vite-plugin-bundle-size-tracker
```

```bash
yarn add -D vite-plugin-bundle-size-tracker
```

```bash
pnpm add -D vite-plugin-bundle-size-tracker
```

## 🚀 Quick Start

Add the plugin to your `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import bundleSizeTracker from 'vite-plugin-bundle-size-tracker';

export default defineConfig({
  plugins: [
    bundleSizeTracker()
  ]
});
```

That's it! Now run your build:

```bash
npm run build
```

## ⚙️ Configuration

### All Options

```typescript
import { defineConfig } from 'vite';
import bundleSizeTracker from 'vite-plugin-bundle-size-tracker';

export default defineConfig({
  plugins: [
    bundleSizeTracker({
      // Path to store build history
      // Default: '.bundle-size-history.json'
      historyFile: '.bundle-size-history.json',
      
      // Number of previous builds to compare against
      // Default: 10
      maxHistory: 10,
      
      // Percentage increase threshold for warnings
      // Default: 10
      threshold: 10,
      
      // Generate JSON report in output directory
      // Default: false
      outputJson: true,
      
      // Custom formatter for file sizes
      // Default: built-in formatter
      formatBytes: (bytes) => {
        return `${(bytes / 1024).toFixed(2)} KB`;
      }
    })
  ]
});
```

### Option Details

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `historyFile` | `string` | `'.bundle-size-history.json'` | Path where build history is stored |
| `maxHistory` | `number` | `10` | Maximum number of builds to keep in history |
| `threshold` | `number` | `10` | Percentage increase that triggers a warning |
| `outputJson` | `boolean` | `false` | Generate a JSON report file |
| `formatBytes` | `function` | Built-in | Custom function to format byte sizes |

## 📋 Use Cases

### Basic Usage

Perfect for most projects with default settings:

```typescript
export default defineConfig({
  plugins: [
    bundleSizeTracker()
  ]
});
```

### Strict Size Control

For projects where bundle size is critical:

```typescript
export default defineConfig({
  plugins: [
    bundleSizeTracker({
      threshold: 5,        // Warn on 5% increase
      maxHistory: 20,      // Compare against 20 builds
      outputJson: true     // Generate reports for tracking
    })
  ]
});
```

### CI/CD Integration

For automated builds and size tracking:

```typescript
export default defineConfig({
  plugins: [
    bundleSizeTracker({
      outputJson: true,
      historyFile: '.bundle-history/production.json'
    })
  ]
});
```

Then in your CI pipeline:

```yaml
- name: Build and track bundle size
  run: npm run build

- name: Check bundle size report
  run: |
    if [ -f dist/bundle-size-report.json ]; then
      cat dist/bundle-size-report.json
    fi
```

### Multiple Environments

Track different environments separately:

```typescript
// vite.config.prod.ts
export default defineConfig({
  plugins: [
    bundleSizeTracker({
      historyFile: '.bundle-size-prod.json'
    })
  ]
});

// vite.config.staging.ts
export default defineConfig({
  plugins: [
    bundleSizeTracker({
      historyFile: '.bundle-size-staging.json'
    })
  ]
});
```

## 📊 JSON Report Format

When `outputJson: true`, a report is generated at `dist/bundle-size-report.json`:

```json
{
  "current": {
    "totalSize": 148623,
    "files": {
      "assets/index-e5f6g7h8.js": 146944,
      "assets/index-a1b2c3d4.css": 1259,
      "index.html": 420
    }
  },
  "average": 142350,
  "percentChange": 4.41,
  "history": [
    {
      "timestamp": 1704067200000,
      "totalSize": 145000,
      "files": { ... }
    }
  ]
}
```

## 🎯 Examples

### React Project

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import bundleSizeTracker from 'vite-plugin-bundle-size-tracker';

export default defineConfig({
  plugins: [
    react(),
    bundleSizeTracker({
      threshold: 5,
      outputJson: true
    })
  ]
});
```

### Vue Project

```typescript
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import bundleSizeTracker from 'vite-plugin-bundle-size-tracker';

export default defineConfig({
  plugins: [
    vue(),
    bundleSizeTracker()
  ]
});
```

### Svelte Project

```typescript
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import bundleSizeTracker from 'vite-plugin-bundle-size-tracker';

export default defineConfig({
  plugins: [
    svelte(),
    bundleSizeTracker()
  ]
});
```

## 🔍 How It Works

1. **Build Completion** - After Vite finishes building, the plugin scans the output directory
2. **Size Calculation** - Calculates sizes of all `.js`, `.css`, and `.html` files
3. **History Check** - Loads previous build sizes from the history file
4. **Comparison** - Compares current build with average of previous builds
5. **Alert** - Warns if size increase exceeds the configured threshold
6. **Storage** - Saves current build to history (keeping only last N builds)

## 📁 History File

The history file (`.bundle-size-history.json`) stores your build data:

```json
[
  {
    "timestamp": 1704067200000,
    "totalSize": 145000,
    "files": {
      "assets/index.js": 143500,
      "assets/index.css": 1230,
      "index.html": 270
    }
  }
]
```

**Important:** Add this file to `.gitignore` for local development, or commit it for team-wide tracking.

## 🚨 Warnings

The plugin will display warnings when:

- Bundle size increases beyond the threshold percentage
- Example: With `threshold: 10`, a warning appears if size increases by more than 10%

```
⚠️  Warning: Bundle size increased by more than 10%!
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

MIT © [Vinay Jampana]

## 🔗 Links

- [NPM Package](https://www.npmjs.com/package/vite-plugin-bundle-size-tracker)
- [GitHub Repository](https://github.com/vinayjampana/vite-plugin-bundle-size-tracker)
- [Issues](https://github.com/vinayjamapna/vite-plugin-bundle-size-tracker/issues)
- [Changelog](https://github.com/vinayjampana/vite-plugin-bundle-size-tracker/blob/main/CHANGELOG.md)

## ⭐ Show Your Support

If this plugin helped you, please consider giving it a star on GitHub!

## 🙏 Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- Colored output powered by [picocolors](https://github.com/alexeyraspopov/picocolors)

---

**Made with ❤️ for the Vite community**