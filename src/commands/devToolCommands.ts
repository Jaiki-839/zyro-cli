import execa from 'execa';
import ora from 'ora';
import { CommandDefinition } from '../types';
import { logger } from '../utils/logger';
import { openTarget } from '../services/openService';

/** Builds a passthrough command that forwards args to a native CLI tool (git, npm, ...). */
function buildPassthroughCommand(
  name: CommandDefinition['name'],
  binary: string,
  description: string,
  category: CommandDefinition['category'] = 'devtools'
): CommandDefinition {
  return {
    name,
    description,
    usage: `${name} <args...>`,
    category,
    handler: async (ctx) => {
      try {
        const subprocess = execa(binary, ctx.args, { cwd: ctx.cwd, stdio: 'inherit' });
        await subprocess;
      } catch (err: any) {
        if (err.code === 'ENOENT') {
          logger.error(`"${binary}" is not installed or not in your PATH.`);
        } else if (typeof err.exitCode === 'number') {
          // Non-zero exit from the underlying tool — it already printed its own output.
        } else {
          logger.error(`Failed to run ${binary}: ${err.message}`);
        }
      }
    },
  };
}

const gitCommand = buildPassthroughCommand('git', 'git', 'Run a Git command');
const npmCommand = buildPassthroughCommand('npm', 'npm', 'Run an npm command');
const nodeCommand = buildPassthroughCommand('node', 'node', 'Run a Node.js script or REPL');
const pythonCommand = buildPassthroughCommand(
  'python',
  process.platform === 'win32' ? 'python' : 'python3',
  'Run a Python script or REPL'
);

const searchCommand: CommandDefinition = {
  name: 'search',
  description: 'Search for files by name in the current directory tree',
  usage: 'search <pattern>',
  category: 'devtools',
  handler: async (ctx) => {
    const pattern = ctx.args.join(' ');
    if (!pattern) {
      logger.error('Usage: search <pattern>');
      return;
    }
    const spinner = ora(`Searching for "${pattern}"...`).start();
    const fs = await import('fs-extra');
    const path = await import('path');
    const results: string[] = [];

    async function walk(dir: string, depth: number): Promise<void> {
      if (depth > 6 || results.length >= 200) return;
      let entries;
      try {
        entries = await fs.readdir(dir, { withFileTypes: true });
      } catch {
        return;
      }
      for (const entry of entries) {
        if (entry.name === 'node_modules' || entry.name === '.git') continue;
        const full = path.join(dir, entry.name);
        if (entry.name.toLowerCase().includes(pattern.toLowerCase())) {
          results.push(full);
        }
        if (entry.isDirectory()) {
          await walk(full, depth + 1);
        }
      }
    }

    await walk(ctx.cwd, 0);
    spinner.stop();

    if (results.length === 0) {
      logger.muted(`No files matching "${pattern}" found.`);
      return;
    }
    results.slice(0, 100).forEach((r) => logger.plain(r));
    if (results.length > 100) {
      logger.muted(`...and ${results.length - 100} more.`);
    }
  },
};

const openCommand: CommandDefinition = {
  name: 'open',
  description: 'Open an app, file, folder, or URL',
  usage:
    'open <chrome|edge|firefox|vscode|notepad|calculator|cmd|powershell|explorer|.|file|folder|url>',
  category: 'devtools',
  handler: async (ctx) => {
    const target = ctx.args.join(' ');
    const spinner = ora(`Opening "${target}"...`).start();
    const result = await openTarget(target);
    spinner.stop();
    if (result.success) {
      logger.success(result.message);
    } else {
      logger.error(result.message);
    }
  },
};

export const devToolCommands: CommandDefinition[] = [
  gitCommand,
  npmCommand,
  nodeCommand,
  pythonCommand,
  searchCommand,
  openCommand,
];
