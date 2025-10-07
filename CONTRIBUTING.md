# Contributing

Thanks for considering contributing! 🎉

## Development Setup
1. Clone the repo
2. Install dependencies:
   ```bash
   npm install --workspaces
   ```
3. Copy env template:
   ```bash
   cp .env.example server/.env
   ```
4. Run dev server:
   ```bash
   npm run dev
   ```
5. Open http://localhost:3000

## Project Structure
```
server/        Express + TypeScript backend
client/public  Static HTML form (served by Express)
```

## Submitting Changes
- Create a feature branch: `feat/short-description`
- Keep PRs focused and small
- Ensure `npm run build` passes (CI will check)

## Commit Messages
Use conventional commits if possible:
```
feat: add rate limiting
fix: correct email preview logging
chore: update dependencies
```

## Adding Dependencies
- Prefer lightweight, well-maintained packages
- Avoid unnecessary runtime deps

## Reporting Issues
Open a GitHub issue with:
- Expected behavior
- Actual behavior
- Steps to reproduce
- Environment (OS, Node version)

## Code Style
- Rely on TypeScript strictness
- Keep functions small and purposeful

## Future Ideas
- DB persistence
- Tests (Jest) + coverage
- Dockerfile + container publish

Happy hacking!
