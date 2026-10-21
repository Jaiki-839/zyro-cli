import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import { JaikiConfig, ThemeName, AIProviderName } from '../types';
import { setActiveThemeName } from './themes';

const CONFIG_DIR = path.join(os.homedir(), '.jaiki');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');
const PLUGINS_DIR = path.join(CONFIG_DIR, 'plugins');

function buildDefaultConfig(): JaikiConfig {
  return {
    theme: 'dark',
    provider: (process.env.JAIKI_DEFAULT_PROVIDER as AIProviderName) || 'gemini',
    username: os.userInfo().username,
    hostname: os.hostname(),
    banner: true,
    aliases: {
      ll: 'ls',
      c: 'clear',
      q: 'exit',
    },
    plugins: [],
    preferences: {
      confirmOnExit: false,
      showTips: true,
      timestampInPrompt: false,
      maxHistorySize: 500,
    },
    history: [],
  };
}

/**
 * ConfigManager owns reading/writing ~/.jaiki/config.json and keeps an
 * in-memory copy for fast synchronous access during a session.
 */
class ConfigManager {
  private config: JaikiConfig;

  constructor() {
    this.config = buildDefaultConfig();
  }

  /** Ensures ~/.jaiki and its config.json / plugins dir exist, then loads config into memory. */
  async init(): Promise<JaikiConfig> {
    await fs.ensureDir(CONFIG_DIR);
    await fs.ensureDir(PLUGINS_DIR);

    if (!(await fs.pathExists(CONFIG_FILE))) {
      await fs.writeJSON(CONFIG_FILE, buildDefaultConfig(), { spaces: 2 });
    }

    try {
      const loaded = await fs.readJSON(CONFIG_FILE);
      // Merge with defaults so newly-added fields don't break old configs.
      this.config = { ...buildDefaultConfig(), ...loaded };
    } catch {
      this.config = buildDefaultConfig();
      await this.save();
    }

    setActiveThemeName(this.config.theme);
    return this.config;
  }

  get(): JaikiConfig {
    return this.config;
  }

  async save(): Promise<void> {
    await fs.ensureDir(CONFIG_DIR);
    await fs.writeJSON(CONFIG_FILE, this.config, { spaces: 2 });
  }

  async setTheme(theme: ThemeName): Promise<void> {
    this.config.theme = theme;
    setActiveThemeName(theme);
    await this.save();
  }

  async setProvider(provider: AIProviderName): Promise<void> {
    this.config.provider = provider;
    await this.save();
  }

  async addHistory(command: string): Promise<void> {
    if (!command.trim()) return;
    this.config.history.push(command);
    const max = this.config.preferences.maxHistorySize;
    if (this.config.history.length > max) {
      this.config.history = this.config.history.slice(-max);
    }
    await this.save();
  }

  async setAlias(alias: string, target: string): Promise<void> {
    this.config.aliases[alias] = target;
    await this.save();
  }

  async removeAlias(alias: string): Promise<void> {
    delete this.config.aliases[alias];
    await this.save();
  }

  async setBanner(enabled: boolean): Promise<void> {
    this.config.banner = enabled;
    await this.save();
  }

  async setAsciiArt(art?: string): Promise<void> {
    this.config.asciiArt = art;
    await this.save();
  }

  async setAsciiFile(filePath: string): Promise<void> {
    const content = await fs.readFile(filePath, 'utf-8');
    this.config.asciiFile = filePath;
    this.config.asciiArt = content;
    await this.save();
  }

  async setApiKey(provider: 'gemini' | 'openai', key: string): Promise<void> {
    if (provider === 'gemini') {
      this.config.geminiApiKey = key;
    } else {
      this.config.openaiApiKey = key;
    }
    await this.save();
  }

  paths() {
    return { CONFIG_DIR, CONFIG_FILE, PLUGINS_DIR };
  }
}

export const configManager = new ConfigManager();
export { CONFIG_DIR, CONFIG_FILE, PLUGINS_DIR };
