import os from 'os';

/**
 * Cross-platform helpers used throughout the CLI so no other module
 * needs to call `process.platform` directly.
 */

export type PlatformKind = 'windows' | 'mac' | 'linux' | 'unknown';

export function getPlatform(): PlatformKind {
  switch (process.platform) {
    case 'win32':
      return 'windows';
    case 'darwin':
      return 'mac';
    case 'linux':
      return 'linux';
    default:
      return 'unknown';
  }
}

export const isWindows = process.platform === 'win32';
export const isMac = process.platform === 'darwin';
export const isLinux = process.platform === 'linux';

/** Human-readable OS description, e.g. "Windows 11 (x64)". */
export function getOSDescription(): string {
  const platform = getPlatform();
  const release = os.release();
  const arch = os.arch();

  const label =
    platform === 'windows'
      ? 'Windows'
      : platform === 'mac'
        ? 'macOS'
        : platform === 'linux'
          ? 'Linux'
          : 'Unknown OS';

  return `${label} ${release} (${arch})`;
}

/** Returns the user's home directory in a cross-platform way. */
export function getHomeDir(): string {
  return os.homedir();
}
