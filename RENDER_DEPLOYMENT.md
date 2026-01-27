# Render.com Deployment Guide for Eagle Tailors

## Quick Deploy (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Eagle Tailors"
   git remote add origin https://github.com/YOUR_USERNAME/eagle-tailors.git
   git push -u origin main
   ```

2. **Deploy on Render**
   - Go to [render.com](https://render.com) and sign up/login
   - Click "New" > "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect `render.yaml` and set up everything

3. **Initialize Database**
   - After deployment, go to your database service
   - Click "Shell" tab
   - Run the SQL from `database/migrations/001_initial_schema.sql`

---

## Manual Deployment (Step by Step)

### Step 1: Create PostgreSQL Database

1. Go to Render Dashboard > New > PostgreSQL
2. Name: `eagle-tailors-db`
3. Database: `eagle_tailors`
4. User: `eagle_admin`
5. Plan: Free (or Starter for production)
6. Click "Create Database"
7. **Save the connection details!**

### Step 2: Deploy Backend

1. Go to Render Dashboard > New > Web Service
2. Connect your GitHub repo
3. Configure:
   - **Name:** `eagle-tailors-api`
   - **Root Directory:** `backend`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

4. Add Environment Variables:
   | Key | Value |
   |-----|-------|
   | NODE_ENV | production |
   | DB_HOST | (from database) |
   | DB_PORT | 5432 |
   | DB_NAME | eagle_tailors |
   | DB_USER | eagle_admin |
   | DB_PASSWORD | (from database) |
   | PORT | 3001 |

5. Click "Create Web Service"

### Step 3: Deploy Frontend

1. Go to Render Dashboard > New > Static Site
2. Connect your GitHub repo
3. Configure:
   - **Name:** `eagle-tailors-frontend`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`

4. Add Environment Variable:
   | Key | Value |
   |-----|-------|
   | VITE_API_URL | https://eagle-tailors-api.onrender.com |

5. Add Rewrite Rule (for React Router):
   - Source: `/*`
   - Destination: `/index.html`
   - Action: Rewrite

6. Click "Create Static Site"

---

## After Deployment

### Initialize Database Schema

1. Go to your PostgreSQL service on Render
2. Click "Shell" or use external tool with connection string
3. Run the contents of `database/migrations/001_initial_schema.sql`

### Test the Application

1. Visit your frontend URL (e.g., `https://eagle-tailors-frontend.onrender.com`)
2. Create a book first (required for uploads)
3. Add customers and bills

---

## Troubleshooting

### Backend not connecting to database?
- Check environment variables are set correctly
- Verify database is running (green status)
- Check logs for connection errors

### Frontend showing API errors?
- Verify `VITE_API_URL` is set to your backend URL
- Rebuild frontend after changing environment variables
- Check browser console for CORS errors

### Images not uploading?
- Note: Free tier has limited disk space
- Consider using Cloudinary or AWS S3 for image storage in production

---

## URLs After Deployment

- **Frontend:** `https://eagle-tailors-frontend.onrender.com`
- **Backend API:** `https://eagle-tailors-api.onrender.com`
- **Health Check:** `https://eagle-tailors-api.onrender.com/health`

Share the frontend URL with your brother!
