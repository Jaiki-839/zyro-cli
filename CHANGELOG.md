# Changelog

All notable changes to the **Zyro CLI** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.1.0] - 2026-10-21

### ⚡ Added & Enhanced
- **Dynamic Text-to-ASCII Generation (`ascii <word>`)**:
  - Integrated `figlet` to automatically convert plain text into large stylized ASCII art banners.
  - Users can change their terminal banner on the fly simply by typing `ascii <word>` or `ascii text <word>` (e.g., `ascii jaiki`).
  - Added `ascii reset` to instantly restore the default ZYRO wordmark.
  - Added support for loading ASCII art from files (`ascii file <path>`).
- **Custom Global Launch Shortcuts (`shortcut`)**:
  - Added `shortcut add <name>`: allows any user to create their own custom command name (e.g. `shortcut add term` enables launching via `term`).
  - Added `shortcut remove <name>` to delete custom launch shims.
  - Configured dual default binaries (`zyro` and `jaiki`) in `package.json`.
- **In-Process Reliable `restart` Command**:
  - Completely refactored `restart` command to reload configuration, reload all plugins, clear screen, and re-render header without relying on brittle child process spawning.
- **Global AI Key Persistence**:
  - Added `config set gemini-key <KEY>` and `config set openai-key <KEY>`.
  - Keys are stored globally in `~/.jaiki/config.json`, eliminating the need to copy `.env` files into every directory.

### 🎨 UI & Aesthetics
- **Removed Boxed Welcome Banner**:
  - Completely eradicated the double-bordered `boxen` startup banner (`renderWelcomeBox`) for a clean, minimal, distraction-free terminal look.
  - Replaced default wordmark with modern high-contrast `ZYRO` ASCII art logo.
  - Retained clean system introspection table (`renderSystemInfoBlock`) and helpful hint.
- **Help View Enhancements**:
  - Enhanced `help` and `help ascii` to display full argument syntax, real-world examples, and category groupings.

### 🔒 Security & Packaging
- **API Key Leak Prevention**:
  - Secured `.gitignore` to strictly ignore `.env`, `.env.local`, and `*.local` files.
  - Created `.env.example` template with clear instructions.
- **Build & Typescript Compatibility**:
  - Fixed invalid `ignoreDeprecations` option in `tsconfig.json`.
  - Added `@types/figlet` for strict TypeScript type checking.

---

## [1.0.0] - 2026-10-21

### 🚀 Initial Open-Source Release
- Interactive terminal REPL powered by Node.js `readline`.
- Dual AI providers: Google Gemini and OpenAI chat completions (`ask`, `chat`, `explain`, `fix`, `generate`).
- 8 built-in terminal color themes (`dark`, `light`, `matrix`, `cyberpunk`, `dracula`, `nord`, `tokyo-night`, `gruvbox`).
- 30+ built-in terminal commands for filesystem, hardware diagnostics, network tools, and developer utilities.
- Dynamic plugin system supporting hot-loading of third-party command modules from `~/.jaiki/plugins`.
- MIT License and full open-source community guidelines.
