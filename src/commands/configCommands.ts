import chalk from 'chalk';
import fs from 'fs-extra';
import { CommandDefinition, ThemeName, AIProviderName } from '../types';
import { logger } from '../utils/logger';
import { configManager } from '../config/config';
import { getActiveTheme, listThemeNames } from '../config/themes';
import { renderLogo, DEFAULT_LOGO, generateAsciiFromText } from '../ui/banner';

const configCommand: CommandDefinition = {
  name: 'config',
  description: 'View or update Jaiki CLI configuration',
  usage: 'config [get|set|provider|alias|reset] ...',
  category: 'config',
  handler: async (ctx) => {
    const [sub, ...rest] = ctx.args;

    if (!sub || sub === 'get') {
      logger.table([
        ['Theme', ctx.config.theme],
        ['Provider', ctx.config.provider],
        ['Username', ctx.config.username],
        ['Hostname', ctx.config.hostname],
        ['Banner', String(ctx.config.banner)],
        ['Animation', String(ctx.config.preferences.showAnimation !== false)],
        ['Custom ASCII', ctx.config.asciiArt ? 'Customized' : 'Default'],
        ['Gemini Key', ctx.config.geminiApiKey ? 'Configured (✓)' : (process.env.GEMINI_API_KEY ? 'From ENV (✓)' : 'Not set')],
        ['OpenAI Key', ctx.config.openaiApiKey ? 'Configured (✓)' : (process.env.OPENAI_API_KEY ? 'From ENV (✓)' : 'Not set')],
        ['Aliases', Object.keys(ctx.config.aliases).join(', ') || '(none)'],
        ['Plugins', String(ctx.config.plugins.length)],
      ]);
      return;
    }

    if (sub === 'provider') {
      const name = rest[0] as AIProviderName;
      if (!name || !['openai', 'gemini'].includes(name)) {
        logger.error('Usage: config provider <openai|gemini>');
        return;
      }
      await configManager.setProvider(name);
      logger.success(`AI provider set to "${name}".`);
      return;
    }

    if (sub === 'alias') {
      const [action, alias, ...targetParts] = rest;
      if (action === 'set' && alias && targetParts.length) {
        await configManager.setAlias(alias, targetParts.join(' '));
        logger.success(`Alias "${alias}" → "${targetParts.join(' ')}" saved.`);
        return;
      }
      if (action === 'remove' && alias) {
        await configManager.removeAlias(alias);
        logger.success(`Alias "${alias}" removed.`);
        return;
      }
      logger.error('Usage: config alias set <name> <command>  |  config alias remove <name>');
      return;
    }

    if (sub === 'set') {
      const [key, ...valParts] = rest;
      const value = valParts.join(' ');
      if (key === 'banner' && (value === 'true' || value === 'false')) {
        await configManager.setBanner(value === 'true');
        logger.success(`Banner display set to ${value}.`);
        return;
      }
      if (key === 'animation' && (value === 'true' || value === 'false')) {
        ctx.config.preferences.showAnimation = value === 'true';
        await configManager.save();
        logger.success(`Startup animation set to ${value}.`);
        return;
      }
      if ((key === 'gemini-key' || key === 'geminikey') && value) {
        await configManager.setApiKey('gemini', value.trim());
        logger.success('Google Gemini API key saved to configuration.');
        return;
      }
      if ((key === 'openai-key' || key === 'openaikey') && value) {
        await configManager.setApiKey('openai', value.trim());
        logger.success('OpenAI API key saved to configuration.');
        return;
      }
      if (key === 'ascii' && value) {
        // If single line word, generate ASCII art; if multi-line, save raw
        const art = value.includes('\n') || value.includes('\\n')
          ? value.replace(/\\n/g, '\n')
          : generateAsciiFromText(value);
        await configManager.setAsciiArt(art);
        logger.success(`Custom ASCII banner updated for "${value}".`);
        return;
      }
      if (key === 'ascii-file' && value) {
        try {
          await configManager.setAsciiFile(value.trim());
          logger.success(`Loaded ASCII art from "${value}".`);
        } catch (err: any) {
          logger.error(`Failed to read ASCII file: ${err.message}`);
        }
        return;
      }
      if (key === 'username' && value) {
        ctx.config.username = value;
        await configManager.save();
        logger.success(`Username set to "${value}".`);
        return;
      }
      if (key === 'hostname' && value) {
        ctx.config.hostname = value;
        await configManager.save();
        logger.success(`Hostname set to "${value}".`);
        return;
      }
      if (key === 'timestampInPrompt' && (value === 'true' || value === 'false')) {
        ctx.config.preferences.timestampInPrompt = value === 'true';
        await configManager.save();
        logger.success(`Prompt timestamp set to ${value}.`);
        return;
      }
      logger.error('Unknown config key. Try: banner, animation, ascii, ascii-file, gemini-key, openai-key, username, hostname');
      return;
    }

    if (sub === 'reset') {
      await configManager.init();
      logger.success('Configuration reloaded from disk.');
      return;
    }

    logger.error(`Unknown config subcommand "${sub}". Try: get, set, provider, alias, reset`);
  },
};

const asciiCommand: CommandDefinition = {
  name: 'ascii',
  description: 'View, generate from text, or customize the ASCII art banner (e.g. ascii jaiki)',
  usage: 'ascii [jaiki | text <word> | set <word> | view | reset | file <filepath>]',
  category: 'appearance',
  handler: async (ctx) => {
    const [sub, ...rest] = ctx.args;

    if (!sub || sub === 'view' || sub === 'preview') {
      logger.blank();
      console.log(renderLogo(ctx.config.asciiArt));
      logger.blank();
      if (ctx.config.asciiArt) {
        logger.muted('Status: Using custom ASCII art.');
      } else {
        logger.muted('Status: Using default ZYRO ASCII logo.');
      }
      logger.muted('Tip: run "ascii <word>" or "ascii text <word>" to change banner, or "ascii reset" to restore default.');
      return;
    }

    if (sub === 'text' || sub === 'set' || sub === 'generate') {
      const inputWord = rest.join(' ').trim();
      if (!inputWord) {
        logger.error('Usage: ascii text <word/phrase>  (e.g. ascii text jaiki)');
        return;
      }
      const generated = generateAsciiFromText(inputWord);
      await configManager.setAsciiArt(generated);
      logger.success(`ASCII art generated for "${inputWord}" and saved as banner!`);
      logger.blank();
      console.log(renderLogo(generated));
      return;
    }

    if (sub === 'file') {
      const filePath = rest[0];
      if (!filePath) {
        logger.error('Usage: ascii file <filepath>');
        return;
      }
      if (!(await fs.pathExists(filePath))) {
        logger.error(`File not found: ${filePath}`);
        return;
      }
      try {
        await configManager.setAsciiFile(filePath);
        logger.success(`Loaded custom ASCII art from "${filePath}"!`);
        logger.blank();
        console.log(renderLogo(configManager.get().asciiArt));
      } catch (err: any) {
        logger.error(`Failed to read file: ${err.message}`);
      }
      return;
    }

    if (sub === 'raw') {
      const art = rest.join(' ');
      if (!art) {
        logger.error('Usage: ascii raw <text>');
        return;
      }
      const unescaped = art.replace(/\\n/g, '\n');
      await configManager.setAsciiArt(unescaped);
      logger.success('Custom raw ASCII art updated successfully!');
      logger.blank();
      console.log(renderLogo(unescaped));
      return;
    }

    if (sub === 'reset') {
      await configManager.setAsciiArt(undefined);
      ctx.config.asciiFile = undefined;
      await configManager.save();
      logger.success('Reset ASCII logo to default ZYRO wordmark.');
      logger.blank();
      console.log(renderLogo());
      return;
    }

    // Direct word syntax: e.g. "ascii jaiki" or "ascii MyCLI"
    const fullWord = ctx.args.join(' ').trim();
    const generated = generateAsciiFromText(fullWord);
    await configManager.setAsciiArt(generated);
    logger.success(`ASCII art generated for "${fullWord}" and saved as banner!`);
    logger.blank();
    console.log(renderLogo(generated));
  },
};

const themeCommand: CommandDefinition = {
  name: 'theme',
  description: 'View or change the active color theme',
  usage: 'theme [list|<name>]',
  category: 'appearance',
  handler: async (ctx) => {
    const arg = ctx.args[0];

    if (!arg || arg === 'list') {
      const active = getActiveTheme();
      logger.blank();
      for (const name of listThemeNames()) {
        const marker = name === active.name ? chalk.green(' ●') : '  ';
        logger.plain(`${marker} ${name}`);
      }
      logger.blank();
      return;
    }

    const themes = listThemeNames();
    if (!themes.includes(arg as ThemeName)) {
      logger.error(`Unknown theme "${arg}". Run "theme list" to see available themes.`);
      return;
    }

    await configManager.setTheme(arg as ThemeName);
    logger.success(`Theme changed to "${arg}".`);
  },
};

export const configCommands: CommandDefinition[] = [configCommand, themeCommand, asciiCommand];
