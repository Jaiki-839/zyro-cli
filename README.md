# ⚡ Zyro CLI — AI Developer Terminal

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node: >=18.0.0](https://img.shields.io/badge/Node-%3E%3D18.0.0-green.svg)](https://nodejs.org/)
[![TypeScript: 5.x](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

A modern, fast, AI-powered developer terminal shell inspired by Gemini CLI, Warp, GitHub CLI, and classic UNIX terminals.

```text
  ███████╗██╗   ██╗██████╗  ██████╗ 
  ╚══███╔╝╚██╗ ██╔╝██╔══██╗██╔═══██╗
    ███╔╝  ╚████╔╝ ██████╔╝██║   ██║
   ███╔╝    ╚██╔╝  ██╔══██╗██║   ██║
  ███████╗   ██║   ██║  ██║╚██████╔╝
  ╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ 

  ╔══════════════════════════════════════════════╗
  ║                 ZYRO CLI                     ║
  ║        AI Developer Terminal & Shell         ║
  ╚══════════════════════════════════════════════╝
```

---

## ✨ Features

- ⚡ **Instant Dual-Launch**: Launch as `zyro` or `jaiki` right out of the box, or register any custom launch name using `shortcut add <name>`.
- 🤖 **Multi-Provider AI Intelligence**: Seamless Google Gemini & OpenAI integration (`ask`, `chat`, `explain`, `fix`, `generate`).
- 🎨 **Fully Customizable Aesthetics**: 8 built-in themes (`dark`, `light`, `matrix`, `cyberpunk`, `dracula`, `nord`, `tokyo-night`, `gruvbox`).
- 🔤 **Customizable ASCII Art**: Easily customize your startup logo or load your own ASCII banner from any text file.
- ⚡ **Minimal Mode Support**: Easily toggle or completely remove the welcome banner with `--no-banner` or `config set banner false`.
- 🧩 **Dynamic Plugin Architecture**: Install, enable, disable, and author modular plugins at runtime.
- 🖥️ **Hardware & System Introspection**: Cross-platform system diagnostics (`sysinfo`, `cpu`, `mem`, `disk`, `uptime`, `processes`).
- 🗂️ **Cross-Platform Filesystem**: Unified Linux/macOS/Windows file operations (`ls`, `cd`, `cat`, `tree`, `find`, `mkdir`, `rm`, `cp`, `mv`).
- 🌐 **Network Diagnostics**: Built-in network tools (`ping`, `ip`, `dns`, `http`).
- 🛠️ **Developer Toolbelt**: Base64 encoding/decoding, crypto hashing (`MD5`, `SHA-256`), JSON inspector, and Git integration.
- ⌨️ **Native Terminal Experience**: Command history, tab-autocomplete, custom aliases, and zero-flicker readline editing.

---

## 🚀 Quick Start & Installation

### Option 1: Global Installation via NPM

```bash
npm install -g zyro-cli
```

Then run:
```bash
zyro
# or
jaiki
```

### Option 2: Set Your Own Custom Launch Command!

Want to launch Zyro with your own custom name (like `term`, `mycli`, `boss`)?
Inside Zyro, simply run:
```bash
shortcut add term
```
Now, simply typing `term` anywhere in your terminal launches your CLI!

### Option 3: Run Instantly via NPX (No Install)

```bash
npx zyro-cli
```

### Option 4: From Source (Developers / Contributors)

```bash
# 1. Clone the repository
git clone https://github.com/your-username/zyro-cli.git
cd zyro-cli

# 2. Install dependencies
npm install

# 3. Build the TypeScript source
npm run build

# 4. Link globally to your local machine
npm link
```

---

## 🔑 AI Provider Configuration

No need to touch `.env` files across different folders! Set your API keys once through the CLI, and they are saved securely in your global configuration (`~/.jaiki/config.json`):

### Using Google Gemini (Default)
Get a free key at [Google AI Studio](https://aistudio.google.com/app/apikey):
```bash
jaiki config set gemini-key YOUR_GEMINI_API_KEY
```

### Using OpenAI
Get an API key at [OpenAI Platform](https://platform.openai.com/api-keys):
```bash
jaiki config set openai-key YOUR_OPENAI_API_KEY
jaiki config provider openai
```

*(You can also set `GEMINI_API_KEY` or `OPENAI_API_KEY` as standard system environment variables).*

---

## 🎨 Removing Banner & Customizing ASCII Art

### Remove or Hide the Startup Banner
Prefer a quiet, clean prompt?
- **Permanently turn off banner**:
  ```bash
  config set banner false
  ```
- **One-time quiet mode**:
  ```bash
  jaiki --no-banner
  # or
  jaiki -q
  ```
- **Turn off boot animation only**:
  ```bash
  config set animation false
  ```

### Change or Customize the ASCII Logo
Anyone can replace the startup logo with their own custom ASCII art:
- **Set custom ASCII text**:
  ```bash
  ascii set "TERMINAL"
  ```
- **Load ASCII art from a file**:
  ```bash
  ascii file ./path/to/my-ascii-art.txt
  ```
- **Preview active ASCII banner**:
  ```bash
  ascii view
  ```
- **Reset back to default**:
  ```bash
  ascii reset
  ```

---

## 📖 Command Cheat Sheet

| Category | Commands |
|---|---|
| **Core** | `help`, `clear`, `exit`, `version`, `whoami`, `history`, `about`, `terminal`, `restart`, `reload` |
| **AI** | `ask <query>`, `chat`, `explain <code/topic>`, `fix <code>`, `generate <prompt>` |
| **Appearance** | `theme [list\|<name>]`, `banner`, `logo`, `ascii [view\|set\|file\|reset]` |
| **Config** | `config [get]`, `config set <key> <val>`, `config provider <gemini\|openai>`, `config alias` |
| **Filesystem** | `ls`, `cd`, `pwd`, `cat`, `touch`, `mkdir`, `rm`, `cp`, `mv`, `find`, `tree` |
| **System** | `sysinfo`, `cpu`, `mem`, `disk`, `uptime`, `env`, `processes` |
| **Network** | `ping`, `ip`, `dns`, `http` |
| **Dev Tools** | `git`, `project`, `json`, `hash`, `encode` |
| **Plugins** | `plugin list`, `plugin install <path>`, `plugin enable`, `plugin disable`, `plugin remove` |

For full command documentation and arguments, see [docs/COMMANDS.md](docs/COMMANDS.md).

---

## 📚 Documentation

- [Architecture & Design](docs/ARCHITECTURE.md)
- [Complete Command Reference](docs/COMMANDS.md)
- [Customization & Theming](docs/CUSTOMIZATION.md)
- [Plugin Authoring Guide](docs/PLUGINS.md)
- [Contributing Guidelines](CONTRIBUTING.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)

---

## 🤝 Contributing

Contributions, bug reports, and feature suggestions are very welcome! Please read the [Contributing Guide](CONTRIBUTING.md) to get started.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
