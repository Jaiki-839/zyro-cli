import { commandRegistry } from '../terminal/commandRegistry';
import { coreCommands } from './coreCommands';
import { fileCommands } from './fileCommands';
import { systemCommands } from './systemCommands';
import { networkCommands } from './networkCommands';
import { devToolCommands } from './devToolCommands';
import { aiCommands } from './aiCommands';
import { configCommands } from './configCommands';
import { pluginCommands } from './pluginCommands';

/** Registers every built-in command with the global command registry. */
export function registerBuiltinCommands(): void {
  commandRegistry.registerAll([
    ...coreCommands,
    ...fileCommands,
    ...systemCommands,
    ...networkCommands,
    ...devToolCommands,
    ...aiCommands,
    ...configCommands,
    ...pluginCommands,
  ]);
}
