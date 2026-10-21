# Architecture & System Design

This document details the internal architecture, design principles, and data flow of the CLI.

---

## 🏗️ High-Level System Architecture

```mermaid
flowchart TD
    User([User Terminal / TTY]) --> CLIEntry[CLI Bootstrap (src/index.ts)]
    CLIEntry --> ConfigMgr[Config Manager (src/config/config.ts)]
    CLIEntry --> CmdReg[Command Registry (src/terminal/commandRegistry.ts)]
    CLIEntry --> PluginMgr[Plugin Manager (src/plugins/pluginManager.ts)]
    
    CLIEntry --> ModeDecision{Interactive or One-Shot?}
    
    ModeDecision -->|Interactive| Splash[Startup Splash & Banner (src/ui/)]
    Splash --> REPL[Interactive Shell REPL (src/terminal/repl.ts)]
    
    ModeDecision -->|One-Shot| Parser[Command Parser (src/terminal/parser.ts)]
    REPL --> Parser
    
    Parser --> Dispatcher[Command Dispatcher]
    Dispatcher --> Builtins[Builtin Commands]
    Dispatcher --> Plugins[Custom Plugins]
    
    Builtins --> AIService[AI Provider Engine]
    AIService --> Gemini[Google Gemini Provider]
    AIService --> OpenAI[OpenAI Provider]
    
    Builtins --> SysService[System & Hardware Inspection]
    Builtins --> FileService[Cross-Platform Filesystem]
    Builtins --> NetService[Network & Latency Diagnostics]
```

---

## 🧩 Core Subsystems

### 1. Bootstrapper & Lifecycle (`src/index.ts`)
- **Initialization**: Loads configuration from `~/.jaiki/config.json`, registers built-in commands, initializes plugin directories, and dynamically imports plugins.
- **Invocation Modes**:
  - **REPL Mode**: When invoked with no parameters (e.g. `jaiki`), checks banner preference, optionally plays startup animation, prints system specs, and opens interactive readline shell.
  - **One-Shot Mode**: When passed commands (e.g. `jaiki sysinfo` or `jaiki ask "explain rust ownership"`), runs immediately and terminates with standard exit code.
  - **Flags**: Supports `--no-banner` and `-q, --quiet` to skip splash displays for scripting or minimal terminal aesthetics.

### 2. Configuration System (`src/config/config.ts`)
- Stored globally in user's home directory: `~/.jaiki/config.json`.
- Holds:
  - Active color theme
  - AI provider selection (`gemini` or `openai`) and encrypted/stored API keys
  - Custom ASCII banner text or file path
  - Shell command aliases (`ll` -> `ls`, `c` -> `clear`, etc.)
  - Installed plugin manifests
  - Shell preferences (timestamp prompts, exit confirmation, history size)
  - Persistent command history

### 3. Terminal REPL & Autocompletion (`src/terminal/repl.ts`)
- Built on top of Node.js `readline` for zero-flicker native terminal scrollback, clipboard paste support, and line editing.
- **Autocompleter**: Dynamically matches input against registered command names, aliases, and category actions with Tab completion.
- Custom Prompt: Computes user, host, current working directory basename, and git branch status in real time.

### 4. AI Provider Abstraction Layer (`src/providers/ai/`)
- Unified interface (`AIProvider`):
  ```typescript
  export interface AIProvider {
    readonly name: AIProviderName;
    isConfigured(): boolean;
    complete(messages: AIMessage[]): Promise<string>;
  }
  ```
- **Gemini Provider**: Uses Google Generative AI REST API (supports Gemini 1.5/2.5 models).
- **OpenAI Provider**: Uses OpenAI Chat Completions API (supports GPT-4o, GPT-5 models).
- Key Resolution: Prioritizes system environment variables (`GEMINI_API_KEY`, `OPENAI_API_KEY`), seamlessly falling back to user's saved CLI configuration (`config set gemini-key <KEY>`).

### 5. Plugin Engine (`src/plugins/pluginManager.ts`)
- Dynamic runtime loading of CommonJS / TypeScript plugins from `~/.jaiki/plugins`.
- Provides plugins with an isolated `PluginContext` to register new terminal commands and access logging/configuration.
- Safe sandboxing: catches plugin initialization failures without crashing the primary shell.

### 6. UI & Theming (`src/ui/` & `src/config/themes.ts`)
- 8 built-in themes: `dark`, `light`, `matrix`, `cyberpunk`, `dracula`, `nord`, `tokyo-night`, `gruvbox`.
- Modular ASCII banner rendering with fallback, color gradients, and user customization.
