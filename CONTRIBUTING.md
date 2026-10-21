# Contributing Guide

Thank you for your interest in contributing! We welcome contributions from developers of all skill levels.

---

## 🚀 Getting Started

1. **Fork the repository** on GitHub.
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/<your-username>/<repo-name>.git
   cd <repo-name>
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Build the project**:
   ```bash
   npm run build
   ```
5. **Run in development mode**:
   ```bash
   npm run dev
   ```

---

## 🛠️ Development Workflow

- Run linting:
  ```bash
  npm run lint
  ```
- Auto-fix linting issues:
  ```bash
  npm run lint:fix
  ```
- Format code with Prettier:
  ```bash
  npm run format
  ```
- Test changes locally as global CLI:
  ```bash
  npm link
  ```

---

## 📋 Pull Request Guidelines

1. Create a feature branch: `git checkout -b feat/your-feature-name`.
2. Commit your changes using Conventional Commits format (`feat: ...`, `fix: ...`, `docs: ...`).
3. Ensure the project builds cleanly with `npm run build`.
4. Open a Pull Request targeting the `main` branch with a clear description of your changes.
