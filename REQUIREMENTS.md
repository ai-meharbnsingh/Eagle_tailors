# Eagle Tailors - System Requirements

## Required Software

### 1. Node.js (v18 or higher)
**Status:** ✅ Already installed
- Used for: Backend API and Frontend build
- Download from: https://nodejs.org/

### 2. PostgreSQL (v14 or higher)
**Status:** ❌ NEEDS INSTALLATION
- Used for: Database
- Download from: https://www.postgresql.org/download/windows/
- **Installation Steps:**
  1. Download PostgreSQL 14+ installer
  2. Run installer
  3. Set password (remember it!)
  4. Default port: 5432
  5. Install pgAdmin (optional GUI tool)

### 3. Python (v3.8 or higher)
**Status:** Check with: `python --version`
- Used for: OCR Service (Phase 2)
- Download from: https://www.python.org/downloads/

## Installation Priority

### IMMEDIATE (to run the app now):
1. ✅ Node.js - Already done
2. ❌ PostgreSQL - **INSTALL THIS NOW**

### LATER (for Phase 2 OCR):
3. Python + PaddleOCR

## Alternative: SQLite Option (No PostgreSQL needed)

If you don't want to install PostgreSQL, we can use SQLite:
- Lightweight file-based database
- No server installation needed
- Good for testing/small deployments
- Would require minor code changes

Let me know if you want the SQLite version instead!
