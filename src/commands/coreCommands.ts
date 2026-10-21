import os from 'os';
import chalk from 'chalk';
import { spawn } from 'child_process';
import { CommandDefinition, CommandCategory } from '../types';
import { logger } from '../utils/logger';
import { commandRegistry } from '../terminal/commandRegistry';
import { getActiveTheme } from '../config/themes';
import { CLI_VERSION } from '../utils/version';
import { renderLogo, renderWelcomeBox } from '../ui/banner';

const CATEGORY_LABELS: Record<CommandCategory, string> = {
  core: 'Core',
  filesystem: 'Filesystem',
  system: 'System',
  network: 'Network',
  devtools: 'Developer Tools',
  ai: 'AI',
  config: 'Configuration',
  plugins: 'Plugins',
  appearance: 'Appearance',
};

const helpCommand: CommandDefinition = {
  name: 'help',
  aliases: ['?'],
  description: 'Show all available commands',
  usage: 'help [command]',
  category: 'core',
  handler: (ctx) => {
    const theme = getActiveTheme();

    if (ctx.args[0]) {
      const cmd = commandRegistry.resolve(ctx.args[0]);
      if (!cmd) {
        logger.error(`No such command: ${ctx.args[0]}`);
        return;
      }
      logger.blank();
      console.log(chalk.hex(theme.accent).bold(cmd.name));
      logger.plain(cmd.description);
      if (cmd.usage) logger.muted(`Usage: ${cmd.usage}`);
      if (cmd.aliases?.length) logger.muted(`Aliases: ${cmd.aliases.join(', ')}`);
      logger.blank();
      return;
    }

    const all = commandRegistry.getAllUnique();
    const grouped = new Map<CommandCategory, CommandDefinition[]>();
    for (const cmd of all) {
      const list = grouped.get(cmd.category) ?? [];
      list.push(cmd);
      grouped.set(cmd.category, list);
    }

    logger.blank();
    console.log(chalk.hex(theme.primary).bold('Jaiki CLI — Available Commands'));
    logger.blank();

    for (const [category, commands] of grouped) {
      console.log(chalk.hex(theme.accent).bold(`  ${CATEGORY_LABELS[category]}`));
      const sorted = [...commands].sort((a, b) => a.name.localeCompare(b.name));
      for (const cmd of sorted) {
        const name = chalk.hex(theme.success)(cmd.name.padEnd(14));
        console.log(`    ${name}${chalk.hex(theme.text)(cmd.description)}`);
      }
      logger.blank();
    }

    logger.muted('Tip: run "help <command>" for detailed usage.');
    logger.blank();
  },
};

const clearCommand: CommandDefinition = {
  name: 'clear',
  aliases: ['cls'],
  description: 'Clear the terminal screen',
  category: 'core',
  handler: () => {
    console.clear();
  },
};

const exitCommand: CommandDefinition = {
  name: 'exit',
  aliases: ['quit'],
  description: 'Exit Jaiki CLI',
  category: 'core',
  handler: (ctx) => {
    const theme = getActiveTheme();
    console.log(chalk.hex(theme.muted)('\nGoodbye! 👋\n'));
    ctx.exit(0);
  },
};

const versionCommand: CommandDefinition = {
  name: 'version',
  aliases: ['--version', '-v'],
  description: 'Show the CLI version',
  category: 'core',
  handler: () => {
    logger.info(`Jaiki CLI v${CLI_VERSION}`);
  },
};

const whoamiCommand: CommandDefinition = {
  name: 'whoami',
  description: 'Show the current user',
  category: 'core',
  handler: () => {
    logger.plain(os.userInfo().username);
  },
};

const historyCommand: CommandDefinition = {
  name: 'history',
  description: 'Show recent command history',
  usage: 'history [count]',
  category: 'core',
  handler: (ctx) => {
    const count = parseInt(ctx.args[0], 10) || 20;
    const items = ctx.config.history.slice(-count);
    if (items.length === 0) {
      logger.muted('No history yet.');
      return;
    }
    items.forEach((cmd, i) => {
      logger.plain(`  ${chalk.dim(String(items.length - i).padStart(3))}  ${cmd}`);
    });
  },
};

const bannerCommand: CommandDefinition = {
  name: 'banner',
  description: 'Re-display the Jaiki CLI welcome banner',
  category: 'appearance',
  handler: (ctx) => {
    console.log(renderLogo(ctx.config.asciiArt));
    console.log(renderWelcomeBox());
  },
};

const logoCommand: CommandDefinition = {
  name: 'logo',
  description: 'Display the Jaiki CLI ASCII logo (or custom art)',
  category: 'appearance',
  handler: (ctx) => {
    console.log(renderLogo(ctx.config.asciiArt));
  },
};

const aboutCommand: CommandDefinition = {
  name: 'about',
  description: 'Show information about Jaiki CLI',
  category: 'core',
  handler: () => {
    const theme = getActiveTheme();
    logger.blank();
    console.log(chalk.hex(theme.primary).bold('Jaiki CLI'));
    logger.plain('A modern, AI-powered developer terminal.');
    logger.muted(`Version ${CLI_VERSION} · Built with Node.js, TypeScript & Ink`);
    logger.muted('Inspired by Gemini CLI, GitHub CLI, Warp, and classic Linux shells.');
    logger.blank();
  },
};

const terminalCommand: CommandDefinition = {
  name: 'terminal',
  description: 'Show information about this terminal session',
  category: 'core',
  handler: (ctx) => {
    logger.table([
      ['Shell', 'Jaiki CLI'],
      ['PID', String(process.pid)],
      ['CWD', ctx.cwd],
      ['Theme', ctx.config.theme],
      ['Provider', ctx.config.provider],
    ]);
  },
};

const restartCommand: CommandDefinition = {
  name: 'restart',
  description: 'Restart the Jaiki CLI session',
  category: 'core',
  handler: (ctx) => {
    logger.info('Restarting Jaiki CLI...');
    const [execPath, ...args] = process.argv;
    spawn(execPath, args, { stdio: 'inherit', cwd: ctx.cwd });
    ctx.exit(0);
  },
};

const reloadCommand: CommandDefinition = {
  name: 'reload',
  description: 'Reload configuration and plugins from disk',
  category: 'core',
  handler: async () => {
    const { configManager } = await import('../config/config');
    const { pluginManager } = await import('../plugins/pluginManager');
    await configManager.init();
    await pluginManager.loadAll();
    logger.success('Configuration and plugins reloaded.');
  },
};

export const coreCommands: CommandDefinition[] = [
  helpCommand,
  clearCommand,
  exitCommand,
  versionCommand,
  whoamiCommand,
  historyCommand,
  bannerCommand,
  logoCommand,
  aboutCommand,
  terminalCommand,
  restartCommand,
  reloadCommand,
];
