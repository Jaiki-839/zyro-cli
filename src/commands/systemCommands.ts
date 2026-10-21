import execa from 'execa';
import ora from 'ora';
import { CommandDefinition } from '../types';
import { logger } from '../utils/logger';
import { getOSDescription } from '../utils/platform';
import {
  getCpuInfo,
  getRamInfo,
  getUptime,
  getDiskInfo,
  getBatteryInfo,
  getProcessList,
  getOpenPorts,
  getFullSystemSummary,
} from '../services/systemInfo';
import { CLI_VERSION } from '../utils/version';

const systeminfoCommand: CommandDefinition = {
  name: 'systeminfo',
  description: 'Show a full system information summary',
  category: 'system',
  handler: () => {
    const s = getFullSystemSummary();
    logger.table([
      ['OS', s.os],
      ['Hostname', s.hostname],
      ['Platform', s.platform],
      ['Architecture', s.arch],
      ['Node.js', s.nodeVersion],
      ['CPU', `${s.cpu.model} (${s.cpu.cores} cores)`],
      ['RAM', `${s.ram.usedGB} GB / ${s.ram.totalGB} GB used`],
      ['Uptime', s.uptime],
      ['Home', s.homeDir],
    ]);
  },
};

const statusCommand: CommandDefinition = {
  name: 'status',
  description: 'Show a quick status snapshot of Jaiki CLI',
  category: 'system',
  handler: (ctx) => {
    logger.table([
      ['CLI Version', CLI_VERSION],
      ['Theme', ctx.config.theme],
      ['AI Provider', ctx.config.provider],
      ['Plugins loaded', String(ctx.config.plugins.filter((p) => p.enabled).length)],
      ['Working dir', ctx.cwd],
    ]);
  },
};

const timeCommand: CommandDefinition = {
  name: 'time',
  description: 'Show the current time',
  category: 'system',
  handler: () => {
    logger.plain(new Date().toLocaleTimeString());
  },
};

const dateCommand: CommandDefinition = {
  name: 'date',
  description: 'Show the current date',
  category: 'system',
  handler: () => {
    logger.plain(new Date().toDateString());
  },
};

const calcCommand: CommandDefinition = {
  name: 'calc',
  description: 'Evaluate a basic arithmetic expression',
  usage: 'calc <expression>  (e.g. calc 2 + 2 * 3)',
  category: 'system',
  handler: (ctx) => {
    const expr = ctx.args.join(' ');
    if (!expr) {
      logger.error('Usage: calc <expression>');
      return;
    }
    // Only allow digits, operators, parentheses, decimal points and whitespace.
    if (!/^[\d\s+\-*/().]+$/.test(expr)) {
      logger.error('Invalid expression. Only numbers and + - * / ( ) are allowed.');
      return;
    }
    try {
      // eslint-disable-next-line no-new-func
      const result = Function(`"use strict"; return (${expr});`)();
      logger.success(`${expr} = ${result}`);
    } catch {
      logger.error('Could not evaluate expression.');
    }
  },
};

const cpuCommand: CommandDefinition = {
  name: 'cpu',
  description: 'Show CPU information',
  category: 'system',
  handler: () => {
    const cpu = getCpuInfo();
    logger.table([
      ['Model', cpu.model],
      ['Cores', String(cpu.cores)],
      ['Speed', `${cpu.speedMHz} MHz`],
      ['Load', cpu.loadPercent >= 0 ? `${cpu.loadPercent}%` : 'n/a on Windows'],
    ]);
  },
};

const ramCommand: CommandDefinition = {
  name: 'ram',
  description: 'Show memory (RAM) usage',
  category: 'system',
  handler: () => {
    const ram = getRamInfo();
    logger.table([
      ['Total', `${ram.totalGB} GB`],
      ['Used', `${ram.usedGB} GB (${ram.usedPercent}%)`],
      ['Free', `${ram.freeGB} GB`],
    ]);
  },
};

const diskCommand: CommandDefinition = {
  name: 'disk',
  description: 'Show disk usage',
  category: 'system',
  handler: async () => {
    const spinner = ora('Reading disk usage...').start();
    const info = await getDiskInfo();
    spinner.stop();
    logger.plain(info);
  },
};

const batteryCommand: CommandDefinition = {
  name: 'battery',
  description: 'Show battery status (laptops only)',
  category: 'system',
  handler: async () => {
    const info = await getBatteryInfo();
    if (!info) {
      logger.muted('No battery detected, or battery info is unavailable on this system.');
      return;
    }
    logger.plain(info);
  },
};

const uptimeCommand: CommandDefinition = {
  name: 'uptime',
  description: 'Show system uptime',
  category: 'system',
  handler: () => {
    logger.plain(getUptime());
  },
};

const processesCommand: CommandDefinition = {
  name: 'processes',
  aliases: ['ps'],
  description: 'List running processes',
  usage: 'processes [limit]',
  category: 'system',
  handler: async (ctx) => {
    const limit = parseInt(ctx.args[0], 10) || 20;
    const spinner = ora('Fetching processes...').start();
    const list = await getProcessList(limit);
    spinner.stop();
    logger.plain(list);
  },
};

const portsCommand: CommandDefinition = {
  name: 'ports',
  description: 'Show open network ports and listening processes',
  category: 'system',
  handler: async () => {
    const spinner = ora('Scanning ports...').start();
    const info = await getOpenPorts();
    spinner.stop();
    logger.plain(info);
  },
};

const doctorCommand: CommandDefinition = {
  name: 'doctor',
  description: 'Diagnose your environment for common issues',
  category: 'system',
  handler: async (ctx) => {
    logger.blank();
    logger.info('Running Jaiki CLI environment diagnostics...');
    logger.blank();

    const checks: Array<{ label: string; pass: boolean; detail?: string }> = [];

    checks.push({
      label: 'Node.js >= 18',
      pass: parseInt(process.version.slice(1), 10) >= 18,
      detail: process.version,
    });

    try {
      await execa('git', ['--version']);
      checks.push({ label: 'Git installed', pass: true });
    } catch {
      checks.push({ label: 'Git installed', pass: false, detail: 'not found in PATH' });
    }

    checks.push({
      label: 'OpenAI API key configured',
      pass: Boolean(process.env.OPENAI_API_KEY),
      detail: process.env.OPENAI_API_KEY ? undefined : 'OPENAI_API_KEY not set',
    });
    checks.push({
      label: 'Gemini API key configured',
      pass: Boolean(process.env.GEMINI_API_KEY),
      detail: process.env.GEMINI_API_KEY ? undefined : 'GEMINI_API_KEY not set',
    });
    checks.push({ label: `AI provider "${ctx.config.provider}" active`, pass: true });

    for (const check of checks) {
      if (check.pass) {
        logger.success(`${check.label}${check.detail ? ` (${check.detail})` : ''}`);
      } else {
        logger.warn(`${check.label}${check.detail ? ` — ${check.detail}` : ''}`);
      }
    }

    logger.blank();
    logger.plain(`OS: ${getOSDescription()}`);
    logger.blank();
  },
};

export const systemCommands: CommandDefinition[] = [
  systeminfoCommand,
  statusCommand,
  timeCommand,
  dateCommand,
  calcCommand,
  cpuCommand,
  ramCommand,
  diskCommand,
  batteryCommand,
  uptimeCommand,
  processesCommand,
  portsCommand,
  doctorCommand,
];
