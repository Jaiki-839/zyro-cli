# Command Reference Catalog

Every built-in command available in the CLI, organized by functional category.

---

## 🧭 Core Commands

| Command | Aliases | Description | Usage |
|---|---|---|---|
| `help` | `?` | Show all commands or detailed help for a specific command | `help [command]` |
| `clear` | `cls` | Clear the terminal display | `clear` |
| `exit` | `quit` | Exit the CLI session | `exit` |
| `version` | `-v`, `--version` | Display version information | `version` |
| `whoami` | - | Display current operating system username | `whoami` |
| `history` | - | View recent command history | `history [count]` |
| `about` | - | Display CLI info, authors, and background | `about` |
| `terminal` | - | Inspect current session details (shell, PID, CWD, theme) | `terminal` |
| `restart` | - | Restart the CLI in the current directory | `restart` |
| `reload` | - | Reload configuration and plugins from disk | `reload` |

---

## 🤖 AI Commands

| Command | Aliases | Description | Usage |
|---|---|---|---|
| `ask` | `ai` | Ask the configured AI provider a one-off question | `ask <question>` |
| `chat` | - | Start an interactive multi-turn conversational AI session | `chat` |
| `explain` | - | Ask the AI to explain a piece of code, error, or concept | `explain <code or query>` |
| `fix` | - | Provide broken code and have AI detect and fix bugs | `fix <code>` |
| `generate` | - | Generate code or boilerplate from a natural language prompt | `generate <prompt>` |

---

## 🎨 Appearance & Banner Commands

| Command | Aliases | Description | Usage |
|---|---|---|---|
| `banner` | - | Re-display the welcome banner and system info block | `banner` |
| `logo` | - | Display the active ASCII art logo | `logo` |
| `ascii` | - | View, set, load from file, or reset custom ASCII art | `ascii [view \| set <text> \| file <path> \| reset]` |
| `theme` | - | View available color themes or switch active theme | `theme [list \| <themename>]` |

---

## ⚙️ Configuration Commands

| Command | Aliases | Description | Usage |
|---|---|---|---|
| `config` | - | View all current settings | `config` or `config get` |
| `config provider` | - | Switch active AI provider (`gemini` or `openai`) | `config provider <openai \| gemini>` |
| `config set` | - | Modify a specific configuration setting | `config set <key> <value>` |
| `config alias` | - | Create or remove custom command aliases | `config alias set <alias> <command>` |
| `config reset` | - | Reload configuration from disk | `config reset` |

### Supported `config set` Keys:
- `banner <true|false>`: Enable or disable startup banner
- `animation <true|false>`: Enable or disable startup boot animation
- `gemini-key <API_KEY>`: Save Google Gemini API key
- `openai-key <API_KEY>`: Save OpenAI API key
- `ascii <text>`: Set custom ASCII text
- `ascii-file <path>`: Load ASCII art from a text file
- `username <name>`: Override displayed username
- `hostname <host>`: Override displayed hostname
- `timestampInPrompt <true|false>`: Display timestamp in prompt

---

## 📁 Filesystem Commands

| Command | Aliases | Description | Usage |
|---|---|---|---|
| `ls` | `dir` | List files and directories in current or specified path | `ls [path]` |
| `cd` | - | Change current working directory | `cd <path>` |
| `pwd` | - | Print current working directory | `pwd` |
| `cat` | `read` | Print contents of a file | `cat <filename>` |
| `touch` | - | Create an empty file | `touch <filename>` |
| `mkdir` | - | Create directory (including parent directories) | `mkdir <dir>` |
| `rm` | `del` | Delete file or directory recursively | `rm [-r] <path>` |
| `cp` | `copy` | Copy file or directory | `cp <source> <target>` |
| `mv` | `move` | Move or rename file or directory | `mv <source> <target>` |
| `find` | - | Search for files by pattern | `find <pattern> [dir]` |
| `tree` | - | Render tree view of directory structure | `tree [dir] [depth]` |

---

## 💻 System & Hardware Inspection

| Command | Aliases | Description | Usage |
|---|---|---|---|
| `sysinfo` | `neofetch` | Display hardware, OS, kernel, uptime & memory summary | `sysinfo` |
| `cpu` | - | Inspect CPU model, core count, and architecture | `cpu` |
| `mem` | `memory` | Inspect RAM usage, free memory, and total memory | `mem` |
| `disk` | - | Inspect disk storage | `disk` |
| `env` | - | List environment variables or lookup a specific variable | `env [name]` |
| `uptime` | - | Show system uptime | `uptime` |
| `processes`| `ps` | List running processes | `processes` |

---

## 🌐 Network Commands

| Command | Aliases | Description | Usage |
|---|---|---|---|
| `ping` | - | Check network host connectivity | `ping <host>` |
| `ip` | `myip` | Display local and public IP addresses | `ip` |
| `http` | `curl` | Make quick HTTP GET/POST requests | `http [get\|post] <url>` |
| `dns` | `nslookup`| Resolve host domain names to IP addresses | `dns <domain>` |

---

## 🛠️ Developer Tools

| Command | Aliases | Description | Usage |
|---|---|---|---|
| `git` | - | Git status shortcut and repository helper | `git [status\|log]` |
| `project` | - | Inspect current project (detects package.json, Cargo.toml, Go, etc.) | `project` |
| `json` | - | Format, inspect, and query JSON files | `json <file>` |
| `hash` | - | Compute MD5, SHA-256, or SHA-512 hashes | `hash <algorithm> <string\|file>` |
| `encode` | `base64`| Base64 encode or decode text | `encode [encode\|decode] <text>` |

---

## 🔌 Plugin Management

| Command | Aliases | Description | Usage |
|---|---|---|---|
| `plugin list` | - | List all installed and active plugins | `plugin list` |
| `plugin install` | - | Install a plugin from a JavaScript/TypeScript file | `plugin install <path>` |
| `plugin enable` | - | Enable an installed plugin | `plugin enable <name>` |
| `plugin disable` | - | Disable a plugin without uninstalling it | `plugin disable <name>` |
| `plugin remove` | `uninstall` | Remove a plugin from the system | `plugin remove <name>` |
