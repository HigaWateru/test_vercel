# Serverless Backend Notes (Vercel)

Project now includes serverless API routes:
- /api/users
- /api/users/:id

Source files:
- api/users/index.js
- api/users/[id].js
- api/_lib/store.js

## Behavior

- GET /api/users: list users
- POST /api/users: create user
- GET /api/users/:id: get user by id
- PUT /api/users/:id: replace user
- PATCH /api/users/:id: partial update
- DELETE /api/users/:id: delete user

## Important Limitation

This serverless version keeps data in memory initialized from server/db.json.
Updates are not guaranteed to persist across cold starts/redeploys.
Use this for demo/prototype only.

## Frontend API Base URL

- Local development default: http://localhost:3000
- Production default: /api
- Override with VITE_API_BASE_URL if needed.
