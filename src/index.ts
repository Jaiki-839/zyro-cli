#!/usr/bin/env node
import dotenv from 'dotenv';
dotenv.config();

import { Command } from 'commander';
import { configManager } from './config/config';
import { registerBuiltinCommands } from './commands/index';
import { commandRegistry } from './terminal/commandRegistry';
import { pluginManager } from './plugins/pluginManager';
import { Repl } from './terminal/repl';
import { playStartupAnimation } from './ui/Startup';
import { renderSystemInfoBlock, renderHelpHint } from './ui/banner';
import { CLI_VERSION } from './utils/version';
import { logger } from './utils/logger';
import { parseCommandLine } from './terminal/parser';

async function bootstrap(): Promise<void> {
  await configManager.init();
  registerBuiltinCommands();
  pluginManager.setCommandRegistrar((cmd) => commandRegistry.register(cmd));
  await pluginManager.loadAll();
  return;
}

async function showBanner(forceSuppress = false): Promise<void> {
  const config = configManager.get();
  if (forceSuppress || !config.banner) return;

  if (config.preferences.showAnimation !== false) {
    await playStartupAnimation(config.asciiArt);
  }
  console.log(await renderSystemInfoBlock(config.username, config.hostname));
  console.log(renderHelpHint());
}

/** Runs a single command non-interactively (used for `jaiki <command> [args]` one-shot invocations). */
async function runOnce(input: string): Promise<void> {
  const parsed = parseCommandLine(input);
  if (!parsed) return;
  const config = configManager.get();
  await configManager.addHistory(input);
  const aliasTarget = config.aliases[parsed.name];
  const effectiveLine = aliasTarget ? `${aliasTarget} ${parsed.args.join(' ')}`.trim() : input;
  const effective = parseCommandLine(effectiveLine)!;

  const command = commandRegistry.resolve(effective.name);
  if (!command) {
    logger.error(
      `Command not found: "${effective.name}". Run "jaiki" with no arguments to enter interactive mode.`
    );
    process.exitCode = 1;
    return;
  }

  await command.handler({
    args: effective.args,
    rawInput: input,
    cwd: process.cwd(),
    config,
    setCwd: () => {
      /* no-op in one-shot mode */
    },
    exit: (code = 0) => process.exit(code),
  });
}

async function main(): Promise<void> {
  await bootstrap();

  const program = new Command();
  program
    .name('zyro')
    .alias('jaiki')
    .description('Zyro CLI — A modern, AI-powered developer terminal.')
    .version(CLI_VERSION, '-v, --version')
    .option('--no-banner', 'Suppress startup banner and animation')
    .option('-q, --quiet', 'Quiet mode (suppress welcome banner)')
    .allowUnknownOption(true)
    .argument('[command...]', 'Run a single Jaiki CLI command and exit')
    .action(async (commandParts: string[], options: { banner?: boolean; quiet?: boolean }) => {
      if (commandParts && commandParts.length > 0) {
        await runOnce(commandParts.join(' '));
        return;
      }
      const suppressBanner = options.banner === false || Boolean(options.quiet);
      await showBanner(suppressBanner);
      const repl = new Repl(configManager.get());
      await repl.start();
    });

  await program.parseAsync(process.argv);
}

main().catch((err) => {
  logger.error(`Fatal error: ${err.message}`);
  process.exit(1);
});
