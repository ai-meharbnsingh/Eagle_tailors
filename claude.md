# Eagle Tailors Digitization Project

## Project Overview
Tailor shop management system with image upload, OCR, and customer management.

## Tech Stack
- Backend: Node.js + Express
- Frontend: React (Vite)
- Database: PostgreSQL
- OCR: Python + PaddleOCR
- Image Processing: OpenCV

## Project Structure
```
eagle-tailors/
├── backend/           # Node.js API
├── frontend/          # React app
├── ocr-service/       # Python OCR service
├── database/          # SQL migrations
├── docs/              # Documentation
└── scripts/           # Utility scripts
```

## Commands
- `npm run dev` - Start backend
- `npm run frontend` - Start frontend
- `python ocr-service/main.py` - Start OCR service

## Coding Standards
- Use TypeScript for backend and frontend
- Use async/await, no callbacks
- All API responses: { success: boolean, data?: any, error?: string }
- Hindi comments allowed for business logic

## Database
- PostgreSQL on localhost:5432
- Database name: eagle_tailors
- Use m
