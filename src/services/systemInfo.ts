import os from 'os';
import execa from 'execa';
import { getOSDescription, isWindows, isMac } from '../utils/platform';

/**
 * Gathers system information using Node's built-in `os` module wherever
 * possible (fully cross-platform) and falls back to shelling out to
 * native tools for details Node cannot provide directly (battery, disk).
 */

export interface CpuInfo {
  model: string;
  cores: number;
  speedMHz: number;
  loadPercent: number;
}

export function getCpuInfo(): CpuInfo {
  const cpus = os.cpus();
  const model = cpus[0]?.model?.trim() ?? 'Unknown CPU';
  const speedMHz = cpus[0]?.speed ?? 0;

  // Rough instantaneous load estimate from the 1-minute load average
  // (loadavg is not meaningful on Windows, so we guard for that).
  const [load1] = os.loadavg();
  const loadPercent = isWindows ? -1 : Math.min(100, Math.round((load1 / cpus.length) * 100));

  return { model, cores: cpus.length, speedMHz, loadPercent };
}

export interface RamInfo {
  totalGB: string;
  freeGB: string;
  usedGB: string;
  usedPercent: string;
}

export function getRamInfo(): RamInfo {
  const total = os.totalmem();
  const free = os.freemem();
  const used = total - free;
  const toGB = (b: number) => (b / 1024 ** 3).toFixed(2);

  return {
    totalGB: toGB(total),
    freeGB: toGB(free),
    usedGB: toGB(used),
    usedPercent: ((used / total) * 100).toFixed(1),
  };
}

export function getUptime(): string {
  const seconds = os.uptime();
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const parts: string[] = [];
  if (days) parts.push(`${days}d`);
  if (hours) parts.push(`${hours}h`);
  parts.push(`${minutes}m`);
  return parts.join(' ');
}

export interface DiskInfo {
  raw: string;
}

/** Returns raw disk usage output from the platform's native tool. */
export async function getDiskInfo(): Promise<string> {
  try {
    if (isWindows) {
      const { stdout } = await execa('wmic', ['logicaldisk', 'get', 'size,freespace,caption']);
      return stdout.trim();
    }
    const { stdout } = await execa('df', ['-h']);
    return stdout.trim();
  } catch {
    return 'Disk information unavailable on this system.';
  }
}

/** Returns battery percentage/status where available, or null if no battery. */
export async function getBatteryInfo(): Promise<string | null> {
  try {
    if (isMac) {
      const { stdout } = await execa('pmset', ['-g', 'batt']);
      return stdout.trim();
    }
    if (isWindows) {
      const { stdout } = await execa('wmic', [
        'path',
        'Win32_Battery',
        'get',
        'EstimatedChargeRemaining',
      ]);
      return stdout.trim();
    }
    // Linux — try upower first, fall back to /sys/class/power_supply
    const { stdout } = await execa('upower', [
      '-i',
      '/org/freedesktop/UPower/devices/battery_BAT0',
    ]);
    return stdout.trim();
  } catch {
    return null;
  }
}

export interface NetworkInterfaceSummary {
  name: string;
  address: string;
  family: string;
  internal: boolean;
  mac: string;
}

export function getNetworkInterfaces(): NetworkInterfaceSummary[] {
  const interfaces = os.networkInterfaces();
  const results: NetworkInterfaceSummary[] = [];

  for (const [name, addrs] of Object.entries(interfaces)) {
    if (!addrs) continue;
    for (const addr of addrs) {
      results.push({
        name,
        address: addr.address,
        family: addr.family,
        internal: addr.internal,
        mac: addr.mac,
      });
    }
  }

  return results;
}

export function getLocalIPv4(): string | null {
  const interfaces = getNetworkInterfaces();
  const match = interfaces.find((i) => i.family === 'IPv4' && !i.internal);
  return match ? match.address : null;
}

/** Returns a list of running processes (top N by nothing in particular — a raw system snapshot). */
export async function getProcessList(limit = 20): Promise<string> {
  try {
    if (isWindows) {
      const { stdout } = await execa('tasklist', []);
      return stdout
        .split('\n')
        .slice(0, limit + 3)
        .join('\n');
    }
    const { stdout } = await execa('ps', ['-eo', 'pid,comm,%cpu,%mem', '--sort=-%cpu']);
    return stdout
      .split('\n')
      .slice(0, limit + 1)
      .join('\n');
  } catch {
    return 'Process list unavailable on this system.';
  }
}

/** Cross-platform "what's listening on which ports" snapshot. */
export async function getOpenPorts(): Promise<string> {
  try {
    if (isWindows) {
      const { stdout } = await execa('netstat', ['-ano']);
      return stdout;
    }
    const { stdout } = await execa('lsof', ['-i', '-P', '-n']);
    return stdout;
  } catch {
    try {
      const { stdout } = await execa('netstat', ['-tulpn']);
      return stdout;
    } catch {
      return 'Port information unavailable (try running with elevated permissions).';
    }
  }
}

export function getFullSystemSummary() {
  return {
    os: getOSDescription(),
    hostname: os.hostname(),
    platform: process.platform,
    arch: process.arch,
    nodeVersion: process.version,
    cpu: getCpuInfo(),
    ram: getRamInfo(),
    uptime: getUptime(),
    homeDir: os.homedir(),
  };
}
