import chalk from 'chalk';
import { getActiveTheme } from '../config/themes';

/**
 * Central logging utility. All command output should flow through
 * this module so that theme colors stay consistent across the app.
 */
class Logger {
  info(message: string): void {
    const theme = getActiveTheme();
    console.log(chalk.hex(theme.primary)(message));
  }

  success(message: string): void {
    const theme = getActiveTheme();
    console.log(chalk.hex(theme.success)(`✔ ${message}`));
  }

  warn(message: string): void {
    const theme = getActiveTheme();
    console.log(chalk.hex(theme.warning)(`⚠ ${message}`));
  }

  error(message: string): void {
    const theme = getActiveTheme();
    console.log(chalk.hex(theme.error)(`✖ ${message}`));
  }

  muted(message: string): void {
    const theme = getActiveTheme();
    console.log(chalk.hex(theme.muted)(message));
  }

  accent(message: string): void {
    const theme = getActiveTheme();
    console.log(chalk.hex(theme.accent)(message));
  }

  plain(message: string): void {
    console.log(message);
  }

  /** Prints a blank line. Small helper to keep output spacing consistent. */
  blank(): void {
    console.log('');
  }

  table(rows: Array<[string, string]>, colWidth = 18): void {
    const theme = getActiveTheme();
    for (const [key, value] of rows) {
      const label = chalk.hex(theme.accent)(key.padEnd(colWidth));
      console.log(`  ${label}${chalk.hex(theme.text)(value)}`);
    }
  }
}

export const logger = new Logger();
