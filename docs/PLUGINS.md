# Plugin Authoring Guide

The CLI features an extensible plugin system allowing anyone to build and distribute custom commands.

---

## 🛠️ Plugin Structure

A plugin is a CommonJS module exporting a `PluginModule` object:

```typescript
export interface PluginModule {
  name: string;
  version: string;
  description?: string;
  activate: (context: PluginContext) => void | Promise<void>;
  deactivate?: () => void | Promise<void>;
}
```

The `activate` hook receives a `PluginContext` with:
- `registerCommand(command)`: Registers a new CLI command
- `log(message)`: Outputs scoped log messages
- `config`: Access to current user configuration

---

## 📝 Example Plugin: `weather-plugin.js`

Save the following as `weather-plugin.js`:

```javascript
module.exports = {
  name: 'weather',
  version: '1.0.0',
  description: 'Display current weather for any city',

  activate(context) {
    context.registerCommand({
      name: 'weather',
      description: 'Get live weather report for a city',
      usage: 'weather <city>',
      category: 'devtools',
      handler: async (ctx) => {
        const city = ctx.args[0] || 'London';
        context.log(`Fetching weather for ${city}...`);
        
        try {
          const https = require('https');
          https.get(`https://wttr.in/${encodeURIComponent(city)}?format=3`, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
              console.log('\n  ⛅ ' + data.trim() + '\n');
            });
          });
        } catch (err) {
          console.error('Failed to fetch weather: ' + err.message);
        }
      },
    });
  },

  deactivate() {
    // Optional cleanup logic
  },
};
```

---

## 🚀 Installing & Testing

To install your plugin:
```bash
jaiki plugin install ./weather-plugin.js
```

List installed plugins:
```bash
jaiki plugin list
```

Run your new command:
```bash
jaiki weather Tokyo
```
