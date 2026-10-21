import fs from 'fs-extra';
import path from 'path';
import { PLUGINS_DIR, configManager } from '../config/config';
import { CommandDefinition, PluginManifest, PluginModule } from '../types';
import { logger } from '../utils/logger';

/**
 * Manages the plugin lifecycle: install (copy into ~/.jaiki/plugins),
 * remove, enable/disable, list, and auto-load-on-startup.
 *
 * A plugin is a single CommonJS/TS file that exports a `PluginModule`
 * (see src/types/index.ts). Example plugin skeleton is documented in
 * the README's "Plugin Development" section.
 */
class PluginManager {
  private commandRegistrar: ((cmd: CommandDefinition) => void) | null = null;
  private loadedPlugins: Map<string, PluginModule> = new Map();

  /** Called once by the terminal so plugins can register commands dynamically. */
  setCommandRegistrar(fn: (cmd: CommandDefinition) => void): void {
    this.commandRegistrar = fn;
  }

  async install(sourcePath: string): Promise<string> {
    const resolved = path.resolve(sourcePath);
    if (!(await fs.pathExists(resolved))) {
      throw new Error(`Plugin source not found at "${resolved}".`);
    }

    const fileName = path.basename(resolved);
    const destPath = path.join(PLUGINS_DIR, fileName);
    await fs.copy(resolved, destPath, { overwrite: true });

    // Validate it actually exports a plugin module before registering it.
    delete require.cache[require.resolve(destPath)];
    const mod = require(destPath) as { default?: PluginModule } & PluginModule; // eslint-disable-line @typescript-eslint/no-var-requires
    const plugin = mod.default ?? mod;

    if (!plugin?.name || typeof plugin.activate !== 'function') {
      await fs.remove(destPath);
      throw new Error('Invalid plugin: must export { name, version, activate }.');
    }

    const manifest: PluginManifest = {
      name: plugin.name,
      version: plugin.version ?? '0.0.0',
      description: plugin.description,
      main: fileName,
      enabled: true,
      installedAt: new Date().toISOString(),
    };

    const config = configManager.get();
    config.plugins = config.plugins.filter((p) => p.name !== plugin.name);
    config.plugins.push(manifest);
    await configManager.save();

    return plugin.name;
  }

  async remove(name: string): Promise<void> {
    const config = configManager.get();
    const manifest = config.plugins.find((p) => p.name === name);
    if (!manifest) {
      throw new Error(`Plugin "${name}" is not installed.`);
    }

    const filePath = path.join(PLUGINS_DIR, manifest.main);
    await fs.remove(filePath);

    config.plugins = config.plugins.filter((p) => p.name !== name);
    await configManager.save();
    this.loadedPlugins.delete(name);
  }

  async setEnabled(name: string, enabled: boolean): Promise<void> {
    const config = configManager.get();
    const manifest = config.plugins.find((p) => p.name === name);
    if (!manifest) {
      throw new Error(`Plugin "${name}" is not installed.`);
    }
    manifest.enabled = enabled;
    await configManager.save();
  }

  list(): PluginManifest[] {
    return configManager.get().plugins;
  }

  /** Loads and activates every enabled plugin. Called once at startup. */
  async loadAll(): Promise<void> {
    const config = configManager.get();
    for (const manifest of config.plugins) {
      if (!manifest.enabled) continue;
      try {
        await this.loadPlugin(manifest);
      } catch (err: any) {
        logger.warn(`Failed to load plugin "${manifest.name}": ${err.message}`);
      }
    }
  }

  private async loadPlugin(manifest: PluginManifest): Promise<void> {
    const filePath = path.join(PLUGINS_DIR, manifest.main);
    if (!(await fs.pathExists(filePath))) {
      throw new Error(`Plugin file missing: ${filePath}`);
    }

    delete require.cache[require.resolve(filePath)];
    const mod = require(filePath) as { default?: PluginModule } & PluginModule; // eslint-disable-line @typescript-eslint/no-var-requires
    const plugin = mod.default ?? mod;

    await plugin.activate({
      registerCommand: (cmd) => this.commandRegistrar?.(cmd),
      log: (msg) => logger.muted(`[plugin:${plugin.name}] ${msg}`),
      config: configManager.get(),
    });

    this.loadedPlugins.set(plugin.name, plugin);
  }
}

export const pluginManager = new PluginManager();
