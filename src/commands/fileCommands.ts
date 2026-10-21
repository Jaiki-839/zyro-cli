import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { CommandDefinition } from '../types';
import { logger } from '../utils/logger';
import { getActiveTheme } from '../config/themes';

function resolvePath(cwd: string, target: string): string {
  if (!target) return cwd;
  if (target === '~') return os.homedir();
  if (target.startsWith('~' + path.sep)) return path.join(os.homedir(), target.slice(2));
  return path.isAbsolute(target) ? target : path.resolve(cwd, target);
}

const cdCommand: CommandDefinition = {
  name: 'cd',
  description: 'Change the current working directory',
  usage: 'cd <directory>',
  category: 'filesystem',
  handler: async (ctx) => {
    const target = resolvePath(ctx.cwd, ctx.args[0] || os.homedir());
    try {
      const stat = await fs.stat(target);
      if (!stat.isDirectory()) {
        logger.error(`Not a directory: ${target}`);
        return;
      }
      ctx.setCwd(target);
    } catch {
      logger.error(`No such directory: ${target}`);
    }
  },
};

const lsCommand: CommandDefinition = {
  name: 'ls',
  aliases: ['dir'],
  description: 'List files and directories',
  usage: 'ls [directory]',
  category: 'filesystem',
  handler: async (ctx) => {
    const target = resolvePath(ctx.cwd, ctx.args[0] || '.');
    const theme = getActiveTheme();
    try {
      const entries = await fs.readdir(target, { withFileTypes: true });
      if (entries.length === 0) {
        logger.muted('(empty directory)');
        return;
      }
      const dirs = entries
        .filter((e) => e.isDirectory())
        .map((e) => e.name)
        .sort();
      const files = entries
        .filter((e) => !e.isDirectory())
        .map((e) => e.name)
        .sort();

      for (const d of dirs) {
        console.log(chalk.hex(theme.primary).bold(`📁 ${d}/`));
      }
      for (const f of files) {
        console.log(chalk.hex(theme.text)(`📄 ${f}`));
      }
    } catch {
      logger.error(`No such directory: ${target}`);
    }
  },
};

const pwdCommand: CommandDefinition = {
  name: 'pwd',
  description: 'Print the current working directory',
  category: 'filesystem',
  handler: (ctx) => {
    logger.plain(ctx.cwd);
  },
};

const mkdirCommand: CommandDefinition = {
  name: 'mkdir',
  description: 'Create a new directory (recursively)',
  usage: 'mkdir <directory>',
  category: 'filesystem',
  handler: async (ctx) => {
    if (!ctx.args[0]) {
      logger.error('Usage: mkdir <directory>');
      return;
    }
    const target = resolvePath(ctx.cwd, ctx.args[0]);
    await fs.ensureDir(target);
    logger.success(`Created directory: ${ctx.args[0]}`);
  },
};

const touchCommand: CommandDefinition = {
  name: 'touch',
  description: 'Create an empty file, or update its timestamp',
  usage: 'touch <file>',
  category: 'filesystem',
  handler: async (ctx) => {
    if (!ctx.args[0]) {
      logger.error('Usage: touch <file>');
      return;
    }
    const target = resolvePath(ctx.cwd, ctx.args[0]);
    await fs.ensureFile(target);
    const now = new Date();
    await fs.utimes(target, now, now);
    logger.success(`Touched: ${ctx.args[0]}`);
  },
};

const rmCommand: CommandDefinition = {
  name: 'rm',
  description: 'Remove a file or directory',
  usage: 'rm <path> [-f|--force] [-r|--recursive]',
  category: 'filesystem',
  handler: async (ctx) => {
    const positional = ctx.args.filter((a) => !a.startsWith('-'));
    const force = ctx.args.includes('-f') || ctx.args.includes('--force');

    if (!positional[0]) {
      logger.error('Usage: rm <path> [-f]');
      return;
    }

    const target = resolvePath(ctx.cwd, positional[0]);
    if (!(await fs.pathExists(target))) {
      logger.error(`No such file or directory: ${positional[0]}`);
      return;
    }

    if (!force) {
      const { confirmed } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirmed',
          message: `Delete "${positional[0]}"?`,
          default: false,
        },
      ]);
      if (!confirmed) {
        logger.muted('Cancelled.');
        return;
      }
    }

    await fs.remove(target);
    logger.success(`Removed: ${positional[0]}`);
  },
};

const cpCommand: CommandDefinition = {
  name: 'cp',
  description: 'Copy a file or directory',
  usage: 'cp <source> <destination>',
  category: 'filesystem',
  handler: async (ctx) => {
    const [src, dest] = ctx.args;
    if (!src || !dest) {
      logger.error('Usage: cp <source> <destination>');
      return;
    }
    const srcPath = resolvePath(ctx.cwd, src);
    const destPath = resolvePath(ctx.cwd, dest);
    await fs.copy(srcPath, destPath, { overwrite: true });
    logger.success(`Copied ${src} → ${dest}`);
  },
};

const mvCommand: CommandDefinition = {
  name: 'mv',
  description: 'Move or rename a file or directory',
  usage: 'mv <source> <destination>',
  category: 'filesystem',
  handler: async (ctx) => {
    const [src, dest] = ctx.args;
    if (!src || !dest) {
      logger.error('Usage: mv <source> <destination>');
      return;
    }
    const srcPath = resolvePath(ctx.cwd, src);
    const destPath = resolvePath(ctx.cwd, dest);
    await fs.move(srcPath, destPath, { overwrite: true });
    logger.success(`Moved ${src} → ${dest}`);
  },
};

const catCommand: CommandDefinition = {
  name: 'cat',
  description: 'Print the contents of a file',
  usage: 'cat <file>',
  category: 'filesystem',
  handler: async (ctx) => {
    if (!ctx.args[0]) {
      logger.error('Usage: cat <file>');
      return;
    }
    const target = resolvePath(ctx.cwd, ctx.args[0]);
    try {
      const content = await fs.readFile(target, 'utf-8');
      logger.plain(content);
    } catch {
      logger.error(`Could not read file: ${ctx.args[0]}`);
    }
  },
};

const echoCommand: CommandDefinition = {
  name: 'echo',
  description: 'Print text to the terminal',
  usage: 'echo <text>',
  category: 'core',
  handler: (ctx) => {
    logger.plain(ctx.args.join(' '));
  },
};

export const fileCommands: CommandDefinition[] = [
  cdCommand,
  lsCommand,
  pwdCommand,
  mkdirCommand,
  touchCommand,
  rmCommand,
  cpCommand,
  mvCommand,
  catCommand,
  echoCommand,
];
