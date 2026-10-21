import { CommandDefinition } from '../types';

/**
 * Central registry mapping command names/aliases to their definitions.
 * Built-in command modules and plugins both register through this
 * single API, keeping the dispatch logic in repl.ts trivial.
 */
class CommandRegistry {
  private commands: Map<string, CommandDefinition> = new Map();

  register(command: CommandDefinition): void {
    this.commands.set(command.name.toLowerCase(), command);
    for (const alias of command.aliases ?? []) {
      this.commands.set(alias.toLowerCase(), command);
    }
  }

  registerAll(commands: CommandDefinition[]): void {
    for (const cmd of commands) this.register(cmd);
  }

  resolve(name: string): CommandDefinition | undefined {
    return this.commands.get(name.toLowerCase());
  }

  has(name: string): boolean {
    return this.commands.has(name.toLowerCase());
  }

  /** Returns every unique command definition (deduplicated across aliases). */
  getAllUnique(): CommandDefinition[] {
    return Array.from(new Set(this.commands.values()));
  }

  getAllNames(): string[] {
    return Array.from(this.commands.keys());
  }
}

export const commandRegistry = new CommandRegistry();
