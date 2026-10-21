import execa from 'execa';
import fs from 'fs-extra';
import { isWindows, isMac, isLinux } from '../utils/platform';

/**
 * Handles `open <target>` for applications, files, folders, and URLs
 * using the correct native mechanism per operating system.
 */

const URL_REGEX = /^(https?:\/\/|www\.)/i;

/** Known application aliases mapped to their platform-specific launch command. */
const APP_MAP: Record<string, { windows: string[]; mac: string[]; linux: string[] }> = {
  chrome: {
    windows: ['cmd', ['/c', 'start', '', 'chrome']],
    mac: ['open', ['-a', 'Google Chrome']],
    linux: ['google-chrome'],
  } as any,
  edge: {
    windows: ['cmd', ['/c', 'start', '', 'msedge']],
    mac: ['open', ['-a', 'Microsoft Edge']],
    linux: ['microsoft-edge'],
  } as any,
  firefox: {
    windows: ['cmd', ['/c', 'start', '', 'firefox']],
    mac: ['open', ['-a', 'Firefox']],
    linux: ['firefox'],
  } as any,
  vscode: {
    windows: ['cmd', ['/c', 'code']],
    mac: ['open', ['-a', 'Visual Studio Code']],
    linux: ['code'],
  } as any,
  notepad: {
    windows: ['notepad', []],
    mac: ['open', ['-a', 'TextEdit']],
    linux: ['gedit'],
  } as any,
  calculator: {
    windows: ['calc', []],
    mac: ['open', ['-a', 'Calculator']],
    linux: ['gnome-calculator'],
  } as any,
  cmd: {
    windows: ['cmd', []],
    mac: ['open', ['-a', 'Terminal']],
    linux: ['x-terminal-emulator'],
  } as any,
  powershell: {
    windows: ['powershell', []],
    mac: ['open', ['-a', 'Terminal']],
    linux: ['x-terminal-emulator'],
  } as any,
  explorer: {
    windows: ['explorer', ['.']],
    mac: ['open', ['.']],
    linux: ['xdg-open', ['.']],
  } as any,
};

/** Resolves a (command, args) pair for a given app map entry on the current OS. */
function resolveLauncher(entry: { windows: any; mac: any; linux: any }): [string, string[]] {
  const raw = isWindows ? entry.windows : isMac ? entry.mac : entry.linux;
  if (Array.isArray(raw) && Array.isArray(raw[1])) {
    return [raw[0], raw[1]];
  }
  if (typeof raw === 'string') {
    return [raw, []];
  }
  return [raw[0], []];
}

export type OpenResult = { success: boolean; message: string };

export async function openTarget(target: string): Promise<OpenResult> {
  if (!target) {
    return { success: false, message: 'Usage: open <app|file|folder|url>' };
  }

  const key = target.toLowerCase();

  // 1. URL
  if (URL_REGEX.test(target)) {
    const url = target.startsWith('www.') ? `https://${target}` : target;
    return runOpener(url);
  }

  // 2. Known application alias
  if (APP_MAP[key]) {
    const [cmd, args] = resolveLauncher(APP_MAP[key]);
    try {
      await execa(cmd, args, { shell: isWindows });
      return { success: true, message: `Launched "${key}".` };
    } catch (err: any) {
      return { success: false, message: `Failed to launch "${key}": ${err.message}` };
    }
  }

  // 3. Current directory shortcut
  if (target === '.') {
    return runOpener(process.cwd());
  }

  // 4. File or folder on disk
  const exists = await fs.pathExists(target);
  if (exists) {
    return runOpener(target);
  }

  return {
    success: false,
    message: `"${target}" is not a recognized app, and no such file or folder exists.`,
  };
}

async function runOpener(target: string): Promise<OpenResult> {
  try {
    if (isWindows) {
      await execa('cmd', ['/c', 'start', '', target], { shell: true });
    } else if (isMac) {
      await execa('open', [target]);
    } else if (isLinux) {
      await execa('xdg-open', [target]);
    } else {
      return { success: false, message: 'Unsupported platform for the open command.' };
    }
    return { success: true, message: `Opened "${target}".` };
  } catch (err: any) {
    return { success: false, message: `Failed to open "${target}": ${err.message}` };
  }
}
