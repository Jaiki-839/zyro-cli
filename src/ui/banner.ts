import boxen from 'boxen';
import chalk from 'chalk';
import gradient from 'gradient-string';
import execa from 'execa';
import { getActiveTheme } from '../config/themes';
import { getOSDescription } from '../utils/platform';
import { CLI_VERSION } from '../utils/version';

/** Large ASCII-art wordmark shown at startup. */
export const DEFAULT_LOGO = String.raw`
     ██╗ █████╗ ██╗██╗  ██╗██╗
     ██║██╔══██╗██║██║ ██╔╝██║
     ██║███████║██║█████╔╝ ██║
██   ██║██╔══██║██║██╔═██╗ ██║
╚█████╔╝██║  ██║██║██║  ██╗██║
 ╚════╝ ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝╚═╝
`;

export const JAIKI_LOGO = DEFAULT_LOGO;

export function getLogoText(customAscii?: string): string {
  if (customAscii && customAscii.trim().length > 0) {
    return customAscii;
  }
  return DEFAULT_LOGO;
}

export function renderLogo(customAscii?: string): string {
  const theme = getActiveTheme();
  return gradient([theme.primary, theme.accent]).multiline(getLogoText(customAscii));
}

export function renderWelcomeBox(): string {
  const theme = getActiveTheme();
  const title = chalk.hex(theme.accent).bold('🪶 JAIKI CLI');
  const subtitle = chalk.hex(theme.secondary)('AI Developer Terminal');

  return boxen(`${title}\n${subtitle}`, {
    padding: 1,
    margin: { top: 0, bottom: 1, left: 2, right: 2 },
    borderStyle: 'double',
    borderColor: theme.primary,
    textAlignment: 'center',
  });
}

async function getGitVersion(): Promise<string> {
  try {
    const { stdout } = await execa('git', ['--version']);
    return stdout.replace('git version ', '').trim();
  } catch {
    return 'not installed';
  }
}

/** Prints the system-info block shown right after the welcome box. */
export async function renderSystemInfoBlock(username: string, hostname: string): Promise<string> {
  const theme = getActiveTheme();
  const gitVersion = await getGitVersion();
  const now = new Date();

  const rows: Array<[string, string]> = [
    ['👤 Username', username],
    ['💻 Computer', hostname],
    ['📁 Directory', process.cwd()],
    ['🖥️  OS', getOSDescription()],
    ['⬢ Node.js', process.version],
    ['🌿 Git', gitVersion],
    ['🕒 Time', now.toLocaleString()],
    ['📦 CLI Version', CLI_VERSION],
  ];

  const label = (s: string) => chalk.hex(theme.accent)(s.padEnd(16));
  const value = (s: string) => chalk.hex(theme.text)(s);

  return rows.map(([k, v]) => `  ${label(k)}${value(v)}`).join('\n');
}

export function renderHelpHint(): string {
  const theme = getActiveTheme();
  return chalk.hex(theme.muted)(`\nType "help" to get started.\n`);
}
