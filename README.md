# Astronomy Tutor AI

A minimal full-stack chatbot for simple astronomy questions.

## Project structure

- `backend` - Node.js API with one endpoint: `POST /api/chat`
- `frontend` - Plain HTML/CSS/JS chat UI

## Run the backend

```bash
cd backend
npm install
npm run dev
```

Backend starts on `http://localhost:3001`.
The backend uses only Node.js built-ins, so install is fast and should work even in restricted environments.
By default it binds to `0.0.0.0` (set `HOST` to override).

### Optional environment variables

- `OPENAI_API_KEY` (optional)
- `OPENAI_MODEL` (optional, default: `gpt-4o-mini`)
- `PORT` (optional, default: `3001`)

If `OPENAI_API_KEY` is not set, the backend returns a simulated tutor response so the app still works.

## Run the frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.
The frontend dev server also uses only Node.js built-ins for reliable local startup.
By default it binds to `0.0.0.0` (set `HOST` to override).

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
