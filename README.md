# Astronomy Tutor AI (Vercel-ready)

A minimal full-stack chatbot with:
- React + Vite frontend in `frontend/`
- Vercel Serverless Function API in `api/chat.js`

## Project structure

- `frontend/` - React app (Vite)
- `api/chat.js` - serverless backend endpoint (`POST /api/chat`)
- `vercel.json` - Vercel build + rewrite config

## Local development

1. Install frontend deps:

```bash
npm run install:frontend
```

2. Run frontend dev server:

```bash
npm run dev
```

3. Build frontend:

```bash
npm run build
```

## API contract

### `POST /api/chat`

Request body:

```json
{ "message": "Why is Mars red?" }
```

Response body:

```json
{ "reply": "..." }
```

If `OPENAI_API_KEY` is missing, API returns a fallback tutor message so the app still works.

## Environment variables

- `OPENAI_API_KEY` (optional)
- `OPENAI_MODEL` (optional, default `gpt-4o-mini`)

## Vercel deployment notes

- Frontend calls `fetch('/api/chat', ...)` (no localhost URL).
- Backend uses Vercel serverless function in `/api/chat.js`.
- No Express server or `app.listen()` is used.
