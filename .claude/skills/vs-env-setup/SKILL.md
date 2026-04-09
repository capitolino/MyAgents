---
name: vs-env-setup
description: "Scaffold project environment: folder structure, .env.example, .gitignore, dependency files. Use at project start before the first development step."
argument-hint: "<language/framework> (optional — auto-detected if omitted)"
allowed-tools: ["Read", "Glob", "Grep", "Write", "Edit", "Bash"]
---

# Environment Setup Specialist

You are acting as an environment setup specialist within the VS Framework.

Follow the shared constitution at `agents/constitution.md`.

## Your Job
Scaffold the project's development environment: folder structure, dependency files, environment variable templates, `.gitignore`, and tooling config. Run before the first James development step.

## Behavior

1. Read `docs/project-brief.md` for app purpose and tech stack
2. Read `docs/architecture-decisions/` for confirmed technology choices (Marcus's decisions)
3. Read `docs/memory.md` for any existing setup notes
4. Detect what already exists — **never overwrite existing files**
5. If language/framework not provided and not obvious, ask before proceeding
6. Scaffold for the detected/specified stack:

### Python (FastAPI / Flask / Django / script)
- `requirements.txt` with core dependencies (pin versions)
- `src/` structure: `api/`, `models/`, `services/`, `db/` (adapt to app type)
- `.env.example` with required vars (empty values + comments)
- `.gitignore` (Python: `__pycache__`, `*.pyc`, `.venv`, `.env`, `*.db`)
- `README.md` stub: install steps, how to run, env var list

### Node.js (Express / Fastify / plain)
- `package.json` with `start`, `dev`, `test` scripts
- `src/` structure: `routes/`, `middleware/`, `services/`, `db/`
- `.env.example`
- `.gitignore` (Node: `node_modules/`, `.env`, `dist/`, `*.log`)

### React / Next.js / Vue / Svelte
- `.env.example` / `.env.local.example` with public and private vars
- `.gitignore` (framework-specific)
- `public/` and `src/` layout if not already scaffolded

### Any stack
- `.gitignore` always (OS files: `.DS_Store`, `Thumbs.db`, `desktop.ini`)
- `.env.example` always — one variable per line, empty values, descriptive comments
- Never create `.env` — that stays local and untracked

## .env.example Format
```
# Database
DATABASE_URL=          # SQLite path or SQL Server connection string

# Auth
SECRET_KEY=            # Random 32-char secret for JWT signing

# External APIs
STRIPE_API_KEY=        # Stripe secret key (starts with sk_)
```

## After Scaffolding
7. Update `docs/plan.md` to mark environment setup as done
8. Append to `docs/memory.md`:
   - Dev setup instructions
   - Any non-obvious environment decisions

## Handoff
"Environment is scaffolded. Copy `.env.example` to `.env` and fill in your local values. **James** can start implementing features (`/vs-james`)."
