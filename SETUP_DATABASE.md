# 🗄️ Database Setup Guide

## Current Status
- ✅ Backend server is RUNNING (Port 3001)
- ✅ Frontend server is RUNNING (Port 3000)
- ❌ Database needs to be connected

---

## 🔧 Quick Setup (2 Steps)

### Step 1: Update Database Password

Open the file: `backend\.env`

Find this line:
```
DB_PASSWORD=postgres
```

Change `postgres` to YOUR PostgreSQL password:
```
DB_PASSWORD=your_actual_password
```

**Where to find your password:**
- It's the password you set when installing PostgreSQL
- If you forgot, you can reset it in pgAdmin

### Step 2: Run Setup Scripts

Open a **NEW command prompt** in the project folder and run:

```bash
cd backend
node scripts/create-database.js
node scripts/migrate.js
```

That's it! The application is now fully functional.

---

## 🎯 Alternative: Manual Setup

If the scripts don't work, do this manually:

### 1. Open pgAdmin or psql

**Using pgAdmin:**
1. Open pgAdmin (installed with PostgreSQL)
2. Connect to your PostgreSQL server
3. Right-click "Databases" → Create → Database
4. Name: `eagle_tailors`
5. Click Save

**Using Command Line (if psql is in PATH):**
```bash
psql -U postgres
CREATE DATABASE eagle_tailors;
\q
```

### 2. Run Migrations

After creating the database:
```bash
cd backend
node scripts/migrate.js
```

---

## ✅ Verify It Works

After setup, test the application:

1. **Open:** http://localhost:3000
2. **Click:** "Books" button
3. **Create a new book:**
   - Name: 2025-26
   - Start Serial: 1
   - Click "Set as Current"

If this works, database is connected! 🎉

---

## 🔍 Troubleshooting

### Error: "Password authentication failed"
**Solution:** Update `DB_PASSWORD` in `backend/.env` with correct password

### Error: "Connection refused" or "ECONNREFUSED"
**Solution:** PostgreSQL service is not running

**To start PostgreSQL:**
1. Press `Win + R`
2. Type: `services.msc`
3. Find: "postgresql-x64-XX" (where XX is version like 14, 15, 16)
4. Right-click → Start

### Error: "Database already exists"
**Good!** Database is already created. Just run:
```bash
cd backend
node scripts/migrate.js
```

### Still having issues?
The application can work without PostgreSQL if you:
1. Switch to SQLite (simpler, file-based)
2. Let me know and I'll set it up

---

## 📝 What Happens After Setup

Once database is connected, you can:
- ✅ Create books (ledgers)
- ✅ Add customers with multiple phone numbers
- ✅ Upload bill photos
- ✅ Search by phone/name/folio
- ✅ View customer history
- ✅ Track deliveries
- ✅ See statistics dashboard

---

## 🆘 Need Help?

Try these in order:

1. **Check PostgreSQL is installed:**
   - Look for pgAdmin in Start Menu
   - Or search for "PostgreSQL" in Programs

2. **Find PostgreSQL password:**
   - It's set during installation
   - Check with your IT person
   - Or reset in pgAdmin

3. **Verify PostgreSQL is running:**
   - Open Services (services.msc)
   - Find postgresql service
   - Status should be "Running"

4. **Alternative: Use SQLite instead:**
   - No PostgreSQL needed
   - Simpler setup
   - Let me know if you want this

---

## 🎉 Once Working

You'll have a **complete tailor shop management system** with:
- Customer database
- Bill archiving with photos
- Instant search (5 seconds vs 5-10 minutes!)
- Delivery tracking
- Statistics dashboard
- Multi-year history
- Automatic backups (planned)

All running **locally** on your machine with **zero monthly cost**!

---

**Current Application Status:**
- Frontend: http://localhost:3000 ✅
- Backend: http://localhost:3001 ✅
- Database: Waiting for connection ⏳

**Next Step:** Update password in `.env` and run the setup scripts above!
