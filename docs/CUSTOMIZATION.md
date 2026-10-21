# Customization & Personalization Guide

Zyro CLI is built to be customized to match your aesthetic, workflow, and system setup.

---

## 🔤 Changing the ASCII Logo via Text Command

You do **not** need to manually draw or paste raw ASCII characters. Zyro CLI dynamically converts plain text into a stylized banner using Figlet:

### 1. Direct Word Syntax
Just pass the word you want:
```bash
ascii jaiki
```
Zyro will instantly generate and save the ASCII art:
```text
    _       _ _    _ 
   (_) __ _(_) | _(_)
   | |/ _` | | |/ / |
   | | (_| | |   <| |
  _/ |\__,_|_|_|\_\_|
 |__/                
```

### 2. Multi-Word / Explicit Syntax
```bash
ascii text "MY CLI"
```

### 3. Preview Active Banner
```bash
ascii view
```

### 4. Load from File
If you have custom ASCII art generated elsewhere:
```bash
ascii file ./my-art.txt
```

### 5. Reset to Default ZYRO Logo
To return to the default wordmark:
```bash
ascii reset
```

---

## 🚀 Setting Custom Launch Commands (`shortcut`)

Anyone can create their own custom command to launch Zyro CLI on their machine:

```bash
# Add a custom command (e.g. "term"):
shortcut add term
```
Now, simply typing `term` in PowerShell, CMD, or Terminal launches the CLI!

To delete the custom command:
```bash
shortcut remove term
```

---

## 🎨 Removing or Disabling the Banner

If you prefer a clean, minimal terminal without startup banners:

### 1. Disable Permanently via Configuration
```bash
config set banner false
```

### 2. Disable Startup Animation Only
Keep the ASCII wordmark and system info, but skip the boot animation:
```bash
config set animation false
```

### 3. One-Shot Suppression Flags
Launch the CLI with either `--no-banner` or `-q`:
```bash
zyro --no-banner
# or
zyro -q
```

To re-enable:
```bash
config set banner true
```

---

## 🌈 Theming & Palettes

Zyro CLI includes 8 curated color themes:
- `dark` (Default sleek modern dark mode)
- `light` (Clean high-contrast light mode)
- `matrix` (Classic retro green hacker aesthetic)
- `cyberpunk` (Vibrant neon magenta and cyan)
- `dracula` (Popular purple & pink developer palette)
- `nord` (Calm arctic blue theme)
- `tokyo-night` (Modern deep indigo night palette)
- `gruvbox` (Warm retro earthy tones)

Switch themes:
```bash
theme tokyo-night
```
List all available themes:
```bash
theme list
```

---

## ⚡ Command Aliases

Define custom command shortcuts inside the CLI:
```bash
config alias set gs "git status"
config alias set ll "ls -la"
config alias set gpt "ask"
```

Remove an alias:
```bash
config alias remove gs
```
