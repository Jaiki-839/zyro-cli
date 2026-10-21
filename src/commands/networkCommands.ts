import execa from 'execa';
import ora from 'ora';
import { CommandDefinition } from '../types';
import { logger } from '../utils/logger';
import { getNetworkInterfaces, getLocalIPv4 } from '../services/systemInfo';
import { isWindows } from '../utils/platform';

const networkCommand: CommandDefinition = {
  name: 'network',
  description: 'List all network interfaces',
  category: 'network',
  handler: () => {
    const interfaces = getNetworkInterfaces().filter((i) => i.family === 'IPv4');
    if (interfaces.length === 0) {
      logger.muted('No network interfaces found.');
      return;
    }
    for (const iface of interfaces) {
      logger.table([[iface.name, `${iface.address}${iface.internal ? ' (internal)' : ''}`]]);
    }
  },
};

const ipCommand: CommandDefinition = {
  name: 'ip',
  description: 'Show your local IP address',
  category: 'network',
  handler: () => {
    const ip = getLocalIPv4();
    logger.plain(ip ?? 'No external IPv4 address found.');
  },
};

const pingCommand: CommandDefinition = {
  name: 'ping',
  description: 'Ping a host to check connectivity',
  usage: 'ping <host>',
  category: 'network',
  handler: async (ctx) => {
    const host = ctx.args[0];
    if (!host) {
      logger.error('Usage: ping <host>');
      return;
    }
    const countFlag = isWindows ? '-n' : '-c';
    const spinner = ora(`Pinging ${host}...`).start();
    try {
      const { stdout } = await execa('ping', [countFlag, '4', host]);
      spinner.stop();
      logger.plain(stdout);
    } catch (err: any) {
      spinner.stop();
      logger.error(`Ping failed: ${err.shortMessage || err.message}`);
    }
  },
};

const wifiCommand: CommandDefinition = {
  name: 'wifi',
  description: 'Show Wi-Fi network status',
  category: 'network',
  handler: async () => {
    const spinner = ora('Checking Wi-Fi status...').start();
    try {
      if (isWindows) {
        const { stdout } = await execa('netsh', ['wlan', 'show', 'interfaces']);
        spinner.stop();
        logger.plain(stdout);
      } else if (process.platform === 'darwin') {
        const { stdout } = await execa(
          '/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport',
          ['-I']
        );
        spinner.stop();
        logger.plain(stdout);
      } else {
        const { stdout } = await execa('iwconfig', []);
        spinner.stop();
        logger.plain(stdout);
      }
    } catch {
      spinner.stop();
      logger.warn(
        'Could not read Wi-Fi status on this system (tool unavailable or no Wi-Fi adapter).'
      );
    }
  },
};

export const networkCommands: CommandDefinition[] = [
  networkCommand,
  ipCommand,
  pingCommand,
  wifiCommand,
];
