# ResponsivePortfolio

Personal portfolio for Ray Swan: a React frontend with Tailwind, plus an Express backend that manages uploads (optimize to WebP, assign to projects, JSON-backed catalog). See `IMAGE_MANAGEMENT_README.md` for the image workflow.

**Stack:** JavaScript, React (CRA), Tailwind, Express, Multer, Sharp. Frontend on Vercel (`frontend/vercel.json`).

## Run

```bash
# API (port 3001; frontend proxies here)
cd backend && npm install && npm start

# UI
cd frontend && npm install && npm start
```
