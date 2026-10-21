import ora from 'ora';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { CommandDefinition } from '../types';
import { logger } from '../utils/logger';
import { askAI, explainCode, fixCode, generateCode, ChatSession } from '../services/aiService';
import { getActiveTheme } from '../config/themes';

async function runPrompt(
  ctx: Parameters<CommandDefinition['handler']>[0],
  label: string,
  task: (prompt: string) => Promise<string>
): Promise<void> {
  const prompt = ctx.args.join(' ');
  if (!prompt) {
    logger.error(`Usage: ${label} <text>`);
    return;
  }
  const spinner = ora(`Thinking (${ctx.config.provider})...`).start();
  try {
    const result = await task(prompt);
    spinner.stop();
    const theme = getActiveTheme();
    logger.blank();
    console.log(chalk.hex(theme.text)(result));
    logger.blank();
  } catch (err: any) {
    spinner.stop();
    logger.error(err.message);
  }
}

const askCommand: CommandDefinition = {
  name: 'ask',
  description: 'Ask the configured AI provider a one-off question',
  usage: 'ask <question>',
  category: 'ai',
  handler: (ctx) => runPrompt(ctx, 'ask', (p) => askAI(ctx.config, p)),
};

const aiCommand: CommandDefinition = {
  name: 'ai',
  description: 'Alias for "ask" — query the configured AI provider',
  usage: 'ai <question>',
  category: 'ai',
  handler: (ctx) => runPrompt(ctx, 'ai', (p) => askAI(ctx.config, p)),
};

const explainCommand: CommandDefinition = {
  name: 'explain',
  description: 'Ask the AI to explain a piece of code or a concept',
  usage: 'explain <code or topic>',
  category: 'ai',
  handler: (ctx) => runPrompt(ctx, 'explain', (p) => explainCode(ctx.config, p)),
};

const fixCommand: CommandDefinition = {
  name: 'fix',
  description: 'Ask the AI to find and fix bugs in a piece of code',
  usage: 'fix <code>',
  category: 'ai',
  handler: (ctx) => runPrompt(ctx, 'fix', (p) => fixCode(ctx.config, p)),
};

const generateCommand: CommandDefinition = {
  name: 'generate',
  description: 'Ask the AI to generate code from a description',
  usage: 'generate <description>',
  category: 'ai',
  handler: (ctx) => runPrompt(ctx, 'generate', (p) => generateCode(ctx.config, p)),
};

const chatCommand: CommandDefinition = {
  name: 'chat',
  description: 'Start an interactive multi-turn AI chat session (type "exit" to leave)',
  category: 'ai',
  handler: async (ctx) => {
    const theme = getActiveTheme();
    const session = new ChatSession(ctx.config);

    logger.blank();
    logger.info(`Starting chat with ${ctx.config.provider}. Type "exit" to leave the chat.`);
    logger.blank();

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { message } = await inquirer.prompt([
        { type: 'input', name: 'message', message: chalk.hex(theme.primary)('you >') },
      ]);

      if (!message || ['exit', 'quit'].includes(message.trim().toLowerCase())) {
        logger.muted('Left chat session.');
        break;
      }

      const spinner = ora('Thinking...').start();
      try {
        const reply = await session.send(message);
        spinner.stop();
        console.log(chalk.hex(theme.accent)('jaiki >'), chalk.hex(theme.text)(reply));
      } catch (err: any) {
        spinner.stop();
        logger.error(err.message);
      }
    }
  },
};

export const aiCommands: CommandDefinition[] = [
  askCommand,
  aiCommand,
  explainCommand,
  fixCommand,
  generateCommand,
  chatCommand,
];
