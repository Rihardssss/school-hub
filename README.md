# SchoolHub

School management app: React (Vite) frontend and Express API backend.

## Quick start (local development)

Run these commands **one at a time** from the project root (`school-hub`):

```bash
git clone https://github.com/Rihardssss/school-hub.git
cd school-hub
```

Create `.env` (if this fails, see [Troubleshooting](#troubleshooting) below):

```bash
cp .env.example .env
```

Install dependencies:

```bash
npm install
npm install --prefix backend
```

Start the API (leave this terminal open):

```bash
npm start --prefix backend
```

In a **second terminal**, start the frontend:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).  
API docs: [http://localhost:8000/endpoints/](http://localhost:8000/endpoints/)

Demo login: `test@test.com` / `1234`

## Docker (optional)

Docker is only needed if you want PostgreSQL locally. The API currently uses in-memory data.

```bash
cp .env.example .env
docker compose up -d db
```

Do **not** put `# comments` on the same line as `docker compose` commands.

To run the full stack in Docker (build the frontend first):

```bash
npm run build
docker compose up -d --build
```

App: [http://localhost:8000](http://localhost:8000)

## Troubleshooting

### `cp: .env is not a directory`

You may have a **folder** named `.env` by mistake. Fix it:

```bash
rm -rf .env
cp .env.example .env
```

### `POSTGRES_* variable is not set`

Create `.env` from the example (see above). Docker reads variables from that file.

### `no such service: #`

You ran `docker compose` with `#` in the command (often from copying a comment). Use only:

```bash
docker compose up -d db
```

### Login / API does not work in dev

The frontend needs the backend on port **8000**. Start it with:

```bash
npm start --prefix backend
```

Then run `npm run dev` in another terminal.
