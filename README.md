# dzthings-app-template

A personal full-stack app template for self-hosted projects on the dzthings home server. Every new app cloned from this template gets a Node/Express backend, a Vue 3 frontend, SQLite persistence, JWT auth out of the box, structured logging with a live log viewer, and a single-container Docker build that ships to GHCR via GitHub Actions. The goal is to go from idea to running container as fast as possible without reinventing infrastructure each time.

## Stack

- **Frontend** — Vue 3, Vite, Composition API (`<script setup>`), Pinia, Vue Router, Tailwind CSS (dark mode), PrimeVue with Aura preset, Iconify, PWA via vite-plugin-pwa
- **Backend** — Node.js, Express, better-sqlite3, JWT auth with httpOnly cookies, structured JSON logging with SSE streaming
- **Ops** — Multi-stage Dockerfile, GitHub Actions → GHCR, Portainer for deployment

## Local dev

```bash
cp .env.example .env        # fill in JWT_SECRET, ADMIN_PASSWORD at minimum
npm run install:all         # installs root + server + client deps
npm run dev                 # Express on :3000, Vite on :5173
```

Open `http://localhost:5173`. Log in with the credentials from your `.env`.

Other scripts:

```bash
npm run build   # production Vite build → client/dist/
npm start       # run server in production mode (serves built client)
```

## Creating a new app from this template

Use [`~/dev/new-app.sh`](../new-app.sh):

```bash
~/dev/new-app.sh my-new-app
```

The script will:
1. Create a private GitHub repo from this template
2. Clone it into `~/dev/my-new-app`
3. Detect the next available port from Portainer (3001+)
4. Write a pre-populated `.env` with a generated `JWT_SECRET`

After running, set `ADMIN_PASSWORD` in `.env`, customize the app, then push.

## Deployment

1. **Push to `main`** — GitHub Actions builds the multi-stage Docker image and pushes to `ghcr.io/jjdz/<repo-name>:latest` and `:<version>`
2. **Add a stack in Portainer** — point it to `ghcr.io/jjdz/<repo-name>:latest`, map the assigned port to `:3000`, set `env_file` to your `.env.<app-name>` in `/data/compose`
3. **Pull and start** — Portainer pulls the image and starts the container

Image is tagged with both `:latest` and the version from `client/package.json` on every push to `main`.

## Environment variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3000` | Port the Express server listens on |
| `DB_PATH` | `./data/db.sqlite` | Path to the SQLite database file (relative paths are resolved from the project root) |
| `JWT_SECRET` | — | Secret used to sign JWT tokens. Use `openssl rand -hex 32` to generate one |
| `ADMIN_USER` | `admin` | Username for the single admin account |
| `ADMIN_PASSWORD` | — | Password for the admin account |
| `CORS_ORIGIN` | _(empty)_ | Allowed CORS origin. Leave empty for same-origin only. Set to a URL (e.g. `https://app.example.com`) when frontend and backend are on different origins |
| `NODE_ENV` | `development` | Set to `production` in deployed containers. Controls static file serving and cookie `secure` flag |

## Version bumping

The version in `client/package.json` is the single source of truth. It's embedded in the built app (`__APP_VERSION__`) and used to tag the Docker image.

```bash
cd client
npm version patch   # 1.0.0 → 1.0.1
npm version minor   # 1.0.0 → 1.1.0
npm version major   # 1.0.0 → 2.0.0
```

Commit and push after bumping — the next Actions run will tag the image with the new version.
