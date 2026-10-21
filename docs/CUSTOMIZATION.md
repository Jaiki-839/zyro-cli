# Customization & Personalization Guide

The CLI is designed to be fully customizable to match your aesthetic and workflow preferences.

---

## 🎨 Removing or Disabling the Banner

If you prefer a clean, minimal terminal without splash screens or startup banners:

### 1. Disable Permanently via Configuration
Run inside the CLI:
```bash
config set banner false
```
Or directly from your terminal:
```bash
jaiki config set banner false
```

### 2. Disable Startup Animation Only
Keep the welcome box but disable the Ink animation:
```bash
config set animation false
```

### 3. One-Shot Suppression Flags
Launch the CLI with either `--no-banner` or `-q`:
```bash
jaiki --no-banner
# or
jaiki -q
```

To re-enable the banner at any time:
```bash
config set banner true
```

---

## 🔤 Customizing the ASCII Art Banner

Anyone can replace the default ASCII logo with their own name, tag, or custom ASCII art!

### Option 1: Set Custom Text Directly
Run:
```bash
ascii set "MY TERMINAL"
```
You can also use multi-line text by embedding `\n`:
```bash
ascii set "  __  __ _   _ ____  \n |  \/  | | | / ___| \n | |\/| | |_| \___ \ \n |_|  |_|\__,_|____/ "
```

### Option 2: Load ASCII Art from a Text File
If you have custom ASCII art generated from an ASCII generator (such as [patorjk.com/software/taag](http://patorjk.com/software/taag)):

1. Save your ASCII art into a text file (e.g. `mybanner.txt`).
2. Run:
```bash
ascii file ./mybanner.txt
```
The CLI will load your art and immediately display a live preview!

### Option 3: Reset Back to Default
To return to the default logo:
```bash
ascii reset
```

---

## 🌈 Theming & Palettes

The CLI includes 8 curated color themes:
- `dark` (Default sleek modern dark mode)
- `light` (Clean high-contrast light mode)
- `matrix` (Classic retro green hacker aesthetic)
- `cyberpunk` (Vibrant neon magenta and cyan)
- `dracula` (Popular purple & pink developer palette)
- `nord` (Calm arctic blue theme)
- `tokyo-night` (Modern deep indigo night palette)
- `gruvbox` (Warm retro earthy tones)

Switch themes on the fly:
```bash
theme tokyo-night
```
List all available themes:
```bash
theme list
```

---

## ⚡ Aliases

Define your own command shortcuts:
```bash
config alias set gs "git status"
config alias set ll "ls -la"
config alias set gpt "ask"
```

Remove an alias:
```bash
config alias remove gs
```
