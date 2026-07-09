# Contributing to LeaveLedger

Thanks for your interest in contributing!

## Setup

See the [README](README.md) quick start.

## Workflow

1. Fork the repo and create a branch: `feat/your-feature` or `fix/your-bug`
2. Make your changes with clear, conventional commits (`feat:`, `fix:`, `docs:`)
3. Run `npm run lint`, `npm run test`, and `npm run build` before pushing
4. Open a PR with a description of what changed and why

## Code style

- TypeScript strict — no `any`
- Zod validation on every user input boundary
- Server-side authorization on every mutation
