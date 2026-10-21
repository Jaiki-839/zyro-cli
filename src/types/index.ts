/**
 * Global type definitions shared across the Jaiki CLI codebase.
 */

/** Supported color themes. */
export type ThemeName =
  'dark' | 'light' | 'matrix' | 'cyberpunk' | 'dracula' | 'nord' | 'tokyo-night' | 'gruvbox';

/** Supported AI providers. */
export type AIProviderName = 'openai' | 'gemini';

/** A color palette used to theme CLI output. */
export interface ThemePalette {
  name: ThemeName;
  primary: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  muted: string;
  text: string;
}

/** A single installed/registered plugin descriptor. */
export interface PluginManifest {
  name: string;
  version: string;
  description?: string;
  main: string;
  enabled: boolean;
  installedAt: string;
}

/** Shape of the plugin module that plugin authors must export. */
export interface PluginModule {
  name: string;
  version: string;
  description?: string;
  /** Called once when the plugin is loaded at startup. */
  activate: (context: PluginContext) => void | Promise<void>;
  /** Optional cleanup hook, called on CLI exit. */
  deactivate?: () => void | Promise<void>;
}

/** API surface exposed to plugins so they can register commands. */
export interface PluginContext {
  registerCommand: (command: CommandDefinition) => void;
  log: (message: string) => void;
  config: JaikiConfig;
}

/** Persisted user configuration, stored at ~/.jaiki/config.json */
export interface JaikiConfig {
  theme: ThemeName;
  provider: AIProviderName;
  username: string;
  hostname: string;
  banner: boolean;
  asciiArt?: string;
  asciiFile?: string;
  openaiApiKey?: string;
  geminiApiKey?: string;
  aliases: Record<string, string>;
  plugins: PluginManifest[];
  preferences: {
    confirmOnExit: boolean;
    showTips: boolean;
    timestampInPrompt: boolean;
    maxHistorySize: number;
    showAnimation?: boolean;
  };
  history: string[];
}

/** The execution context passed to every command handler. */
export interface CommandContext {
  args: string[];
  rawInput: string;
  cwd: string;
  config: JaikiConfig;
  setCwd: (dir: string) => void;
  exit: (code?: number) => void;
}

/** A command handler function. */
export type CommandHandler = (ctx: CommandContext) => void | Promise<void>;

/** Definition of a registrable terminal command. */
export interface CommandDefinition {
  name: string;
  aliases?: string[];
  description: string;
  usage?: string;
  category: CommandCategory;
  handler: CommandHandler;
}

export type CommandCategory =
  | 'core'
  | 'filesystem'
  | 'system'
  | 'network'
  | 'devtools'
  | 'ai'
  | 'config'
  | 'plugins'
  | 'appearance';

/** Normalized chat message used by the AI provider abstraction. */
export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/** Common interface all AI providers must implement. */
export interface AIProvider {
  readonly name: AIProviderName;
  isConfigured(): boolean;
  complete(messages: AIMessage[]): Promise<string>;
}
