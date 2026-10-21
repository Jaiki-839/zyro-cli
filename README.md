# ⚡ Zyro CLI — AI Developer Terminal & Shell

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
```

---

## ✨ Key Features

- ⚡ **Instant Dual-Launch**: Launch via `zyro` or `jaiki` right out of the box.
- 🔤 **Dynamic Text-to-ASCII Generator**: Turn any text into your startup logo in seconds with `ascii <text>` (e.g., `ascii jaiki`).
- 🚀 **Custom Launch Shortcut**: Anyone can define their own command name using `shortcut add <name>` (e.g. `shortcut add term`).
- 🤖 **Multi-Provider AI Intelligence**: Seamless Google Gemini & OpenAI integration (`ask`, `chat`, `explain`, `fix`, `generate`).
- 🎨 **Minimalist Aesthetic**: Clean ASCII wordmark without clunky boxed borders, plus 8 built-in themes (`dark`, `light`, `matrix`, `cyberpunk`, `dracula`, `nord`, `tokyo-night`, `gruvbox`).
- ⚡ **Minimal Mode Support**: Easily toggle or remove the welcome banner with `--no-banner` or `config set banner false`.
- 🔄 **Safe In-Process Restart**: Instant `restart` command that refreshes environment and config without crashing terminal sessions.
- 🧩 **Dynamic Plugin Architecture**: Install, enable, disable, and author modular plugins at runtime.
- 🖥️ **Hardware & System Introspection**: Cross-platform diagnostics (`sysinfo`, `cpu`, `mem`, `disk`, `uptime`, `processes`).
- 🗂️ **Cross-Platform Filesystem**: Unified Linux/macOS/Windows file operations (`ls`, `cd`, `cat`, `tree`, `find`, `mkdir`, `rm`, `cp`, `mv`).
- 🌐 **Network Diagnostics**: Built-in network tools (`ping`, `ip`, `dns`, `http`).
- 🛠️ **Developer Toolbelt**: Base64 encoding/decoding, crypto hashing (`MD5`, `SHA-256`), JSON inspector, and Git helper.

---

## 🚀 Installation & Setup

### 1. Global Installation via NPM

Install globally to access the CLI from any directory or terminal on your machine:

```bash
npm install -g zyro-cli
```

Then run:
```bash
zyro
# or
jaiki
```

### 2. Set Your Own Custom Launch Command!

Want to launch Zyro using your own keyword (like `term`, `mycli`, `boss`)?
Inside Zyro, simply run:
```bash
shortcut add term
```
Now, typing `term` anywhere in your terminal launches the CLI!

### 3. Run Instantly via NPX (Zero Install)

```bash
npx zyro-cli
```

### 4. From Source (Development / Contributing)

```bash
git clone https://github.com/Jaiki-839/zyro-cli.git
cd zyro-cli
npm install
npm run build
npm link --force
```

---

## 🔤 Change Banner ASCII via Text Command

You do not need to paste raw ASCII characters. Simply pass any text to `ascii`:

```bash
# Generate from any text directly:
ascii jaiki

# Or using explicit text subcommand:
ascii text "MY TERMINAL"

# Preview current banner:
ascii view

# Load ASCII art from a file:
ascii file ./banner.txt

# Reset back to default ZYRO logo:
ascii reset
```

---

## 🎨 Hiding or Removing the Banner

If you prefer a clean, minimal prompt without startup information:

- **Permanently turn off banner**:
  ```bash
  config set banner false
  ```
- **One-time quiet mode**:
  ```bash
  zyro --no-banner
  # or
  zyro -q
  ```
- **Turn off boot animation only**:
  ```bash
  config set animation false
  ```

---

## 🔑 AI Provider Configuration

No need to touch `.env` files in different project folders! Set your API keys once through the CLI, and they are saved securely in your global configuration (`~/.jaiki/config.json`):

### Google Gemini (Default)
Get a free key at [Google AI Studio](https://aistudio.google.com/app/apikey):
```bash
zyro config set gemini-key YOUR_GEMINI_API_KEY
```

### OpenAI
Get an API key at [OpenAI Platform](https://platform.openai.com/api-keys):
```bash
zyro config set openai-key YOUR_OPENAI_API_KEY
zyro config provider openai
```

---

## 📖 Command Reference

| Category | Commands |
|---|---|
| **Core** | `help`, `clear`, `exit`, `version`, `whoami`, `history`, `about`, `terminal`, `restart`, `reload`, `shortcut` |
| **Appearance** | `ascii [word\|text\|reset\|view]`, `theme [list\|<name>]`, `banner`, `logo` |
| **AI** | `ask <query>`, `chat`, `explain <code/topic>`, `fix <code>`, `generate <prompt>` |
| **Config** | `config [get]`, `config set <key> <val>`, `config provider <gemini\|openai>`, `config alias` |
| **Filesystem** | `ls`, `cd`, `pwd`, `cat`, `touch`, `mkdir`, `rm`, `cp`, `mv`, `find`, `tree` |
| **System** | `sysinfo`, `cpu`, `mem`, `disk`, `uptime`, `env`, `processes`, `doctor` |
| **Network** | `ping`, `ip`, `dns`, `http`, `wifi` |
| **Dev Tools** | `git`, `project`, `json`, `hash`, `encode`, `open` |
| **Plugins** | `plugin list`, `plugin install <path>`, `plugin enable`, `plugin disable`, `plugin remove` |

For full command details, flags, and options, see [docs/COMMANDS.md](docs/COMMANDS.md).

---

## 📚 Documentation Index

- [Changelog](CHANGELOG.md)
- [Architecture & Design](docs/ARCHITECTURE.md)
- [Complete Command Reference](docs/COMMANDS.md)
- [Customization & Theming](docs/CUSTOMIZATION.md)
- [Plugin Authoring Guide](docs/PLUGINS.md)
- [Contributing Guidelines](CONTRIBUTING.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
