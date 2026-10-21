/**
 * Example Jaiki CLI plugin.
 *
 * Install it with:
 *   plugins install ./examples/hello-plugin.js
 *
 * Then run:
 *   hello
 *   hello Jaiki
 *
 * A plugin is any CommonJS module that exports (or default-exports)
 * an object matching the `PluginModule` shape:
 *   { name, version, description?, activate(context), deactivate?() }
 *
 * `context.registerCommand(...)` lets you add new commands using the
 * exact same `CommandDefinition` shape as Jaiki CLI's built-ins.
 */

module.exports = {
  name: 'hello-plugin',
  version: '1.0.0',
  description: 'Adds a friendly "hello" command.',

  activate(context) {
    context.registerCommand({
      name: 'hello',
      description: 'Greet someone (added by hello-plugin)',
      usage: 'hello [name]',
      category: 'plugins',
      handler: (ctx) => {
        const name = ctx.args[0] || ctx.config.username || 'there';
        console.log(`👋 Hello, ${name}! This greeting was brought to you by hello-plugin.`);
      },
    });

    context.log('hello-plugin activated — try running "hello"');
  },

  deactivate() {
    // Optional cleanup logic goes here.
  },
};
