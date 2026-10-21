import { CommandDefinition } from '../types';
import { logger } from '../utils/logger';
import { pluginManager } from '../plugins/pluginManager';

const pluginsCommand: CommandDefinition = {
  name: 'plugins',
  description: 'Manage Jaiki CLI plugins',
  usage: 'plugins <install|remove|list|enable|disable> [args]',
  category: 'plugins',
  handler: async (ctx) => {
    const [sub, ...rest] = ctx.args;

    switch (sub) {
      case 'install': {
        const source = rest[0];
        if (!source) {
          logger.error('Usage: plugins install <path-to-plugin.js>');
          return;
        }
        try {
          const name = await pluginManager.install(source);
          logger.success(`Plugin "${name}" installed and enabled.`);
        } catch (err: any) {
          logger.error(err.message);
        }
        return;
      }

      case 'remove': {
        const name = rest[0];
        if (!name) {
          logger.error('Usage: plugins remove <name>');
          return;
        }
        try {
          await pluginManager.remove(name);
          logger.success(`Plugin "${name}" removed.`);
        } catch (err: any) {
          logger.error(err.message);
        }
        return;
      }

      case 'enable': {
        const name = rest[0];
        if (!name) {
          logger.error('Usage: plugins enable <name>');
          return;
        }
        try {
          await pluginManager.setEnabled(name, true);
          logger.success(`Plugin "${name}" enabled. Run "reload" to activate it.`);
        } catch (err: any) {
          logger.error(err.message);
        }
        return;
      }

      case 'disable': {
        const name = rest[0];
        if (!name) {
          logger.error('Usage: plugins disable <name>');
          return;
        }
        try {
          await pluginManager.setEnabled(name, false);
          logger.success(`Plugin "${name}" disabled.`);
        } catch (err: any) {
          logger.error(err.message);
        }
        return;
      }

      case 'list':
      default: {
        const list = pluginManager.list();
        if (list.length === 0) {
          logger.muted('No plugins installed. Use "plugins install <path>" to add one.');
          return;
        }
        logger.blank();
        for (const p of list) {
          const status = p.enabled ? '● enabled' : '○ disabled';
          logger.plain(`  ${p.name}@${p.version}  ${status}`);
          if (p.description) logger.muted(`    ${p.description}`);
        }
        logger.blank();
        return;
      }
    }
  },
};

export const pluginCommands: CommandDefinition[] = [pluginsCommand];
