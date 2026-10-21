import chalk from 'chalk';
import os from 'os';
import path from 'path';
import { getActiveTheme } from '../config/themes';
import { JaikiConfig } from '../types';

/** Collapses the home directory prefix into `~` like a POSIX shell prompt. */
function shortenPath(cwd: string): string {
  const home = os.homedir();
  if (cwd === home) return '~';
  if (cwd.startsWith(home + path.sep)) {
    return '~' + cwd.slice(home.length);
  }
  return cwd;
}

/** Builds the colored prompt string, e.g. "jaiki@chaibyte:~$ ". */
export function buildPrompt(config: JaikiConfig, cwd: string): string {
  const theme = getActiveTheme();
  const user = chalk.hex(theme.primary).bold(config.username);
  const at = chalk.hex(theme.muted)('@');
  const host = chalk.hex(theme.accent).bold(config.hostname);
  const sep = chalk.hex(theme.muted)(':');
  const dir = chalk.hex(theme.success)(shortenPath(cwd));
  const dollar = chalk.hex(theme.text).bold('$');

  const timestamp = config.preferences.timestampInPrompt
    ? chalk.hex(theme.muted)(`[${new Date().toLocaleTimeString()}] `)
    : '';

  return `${timestamp}${user}${at}${host}${sep}${dir}${dollar} `;
}
