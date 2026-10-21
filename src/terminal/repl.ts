import readline from 'readline';
import chalk from 'chalk';
import { JaikiConfig } from '../types';
import { commandRegistry } from './commandRegistry';
import { parseCommandLine } from './parser';
import { buildPrompt } from '../ui/prompt';
import { logger } from '../utils/logger';
import { configManager } from '../config/config';

/**
 * The interactive read-eval-print loop. Uses Node's built-in readline
 * for native line editing, arrow-key history navigation, and Ctrl+C/D
 * handling — this gives a snappier, more "real terminal" feel than
 * re-implementing input handling from scratch.
 */
export class Repl {
  private rl: readline.Interface;
  private cwd: string;
  private config: JaikiConfig;
  private running = true;
  private queue: Promise<void> = Promise.resolve();

  constructor(config: JaikiConfig) {
    this.config = config;
    this.cwd = process.cwd();

    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: buildPrompt(this.config, this.cwd),
      completer: this.completer.bind(this),
      history: [...config.history].reverse(),
      historySize: config.preferences.maxHistorySize,
    });
  }

  private completer(line: string): [string[], string] {
    const names = commandRegistry.getAllNames();
    const hits = names.filter((n) => n.startsWith(line.toLowerCase()));
    return [hits.length ? hits : names, line];
  }

  private setCwd(dir: string): void {
    this.cwd = dir;
    this.rl.setPrompt(buildPrompt(this.config, this.cwd));
  }

  private exit(code = 0): void {
    this.running = false;
    this.rl.close();
    process.exit(code);
  }

  async start(): Promise<void> {
    this.rl.prompt();

    this.rl.on('line', (line) => {
      this.queue = this.queue.then(async () => {
        await this.handleLine(line);
        if (this.running) {
          this.rl.setPrompt(buildPrompt(this.config, this.cwd));
          this.rl.prompt();
        }
      });
    });

    this.rl.on('SIGINT', () => {
      console.log(chalk.dim('\n(Press Ctrl+D or type "exit" to quit)'));
      this.rl.prompt();
    });

    this.rl.on('close', async () => {
      await this.queue;
      if (this.running) {
        console.log(chalk.dim('\nGoodbye! 👋'));
        process.exit(0);
      }
    });
  }

  private async handleLine(line: string): Promise<void> {
    const trimmed = line.trim();
    if (!trimmed) return;

    await configManager.addHistory(trimmed);

    const parsed = parseCommandLine(trimmed);
    if (!parsed) return;

    // Resolve user-defined aliases first (e.g. "ll" -> "ls").
    const aliasTarget = this.config.aliases[parsed.name];
    const effectiveLine = aliasTarget ? `${aliasTarget} ${parsed.args.join(' ')}`.trim() : trimmed;
    const effective = aliasTarget ? parseCommandLine(effectiveLine) : parsed;
    if (!effective) return;

    const command = commandRegistry.resolve(effective.name);
    if (!command) {
      logger.error(
        `Command not found: "${effective.name}". Type "help" to see available commands.`
      );
      return;
    }

    try {
      await command.handler({
        args: effective.args,
        rawInput: trimmed,
        cwd: this.cwd,
        config: this.config,
        setCwd: (dir) => this.setCwd(dir),
        exit: (code) => this.exit(code),
      });
    } catch (err: any) {
      logger.error(`Unexpected error running "${effective.name}": ${err.message}`);
    }
  }
}
