# Eagle Tailors - Build & Setup Instructions

## 🎯 Quick Start (5 Minutes)

### Prerequisites
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v14 or higher) - [Download](https://www.postgresql.org/download/)
- **Python** (v3.8 or higher) - [Download](https://www.python.org/downloads/)
- **Git** (optional) - [Download](https://git-scm.com/)

---

## 📦 Installation Steps

### Step 1: Install Dependencies

#### Option A: Automatic Setup (Windows)
```batch
cd Eagle_taliors
scripts\setup.bat
```

#### Option B: Manual Setup

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

**OCR Service:**
```bash
cd ocr-service
pip install -r requirements.txt
```

### Step 2: Setup Database

#### Create Database
```bash
# Using psql command line
createdb eagle_tailors

# Or using PostgreSQL GUI (pgAdmin)
# Create a new database named: eagle_tailors
```

#### Run Migrations
```bash
cd backend
node scripts/migrate.js
```

This will create all necessary tables and load default data.

### Step 3: Configure Environment

The `.env` file in the `backend` folder is already configured with defaults:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=eagle_tailors
DB_USER=postgres
DB_PASSWORD=postgres
PORT=3001
```

**IMPORTANT:** Update `DB_PASSWORD` to match your PostgreSQL password!

---

## 🚀 Running the Application

You need to start **3 services** (each in a separate terminal/command prompt):

### Terminal 1: Backend API
```bash
cd backend
npm run dev
```
Server will start at: http://localhost:3001

### Terminal 2: Frontend
```bash
cd frontend
npm run dev
```
App will open at: http://localhost:3000

### Terminal 3: OCR Service (Optional for Phase 2)
```bash
cd ocr-service
python main.py
```
Service will start at: http://localhost:5000

---

## 📱 Using the Application

1. Open browser and go to: **http://localhost:3000**
2. You'll see the Eagle Tailors home screen
3. Start by:
   - Creating a new book (Books page)
   - Adding customers (New Customer)
   - Uploading bills (Upload Bill)
   - Searching customers by phone/name

---

## 🗄️ Database Schema

The database is automatically created with these tables:
- `users` - User authentication
- `customers` - Customer master data
- `customer_phones` - Multiple phones per customer
- `books` - Physical ledger books
- `bills` - Individual bills with images
- `bill_measurements` - Measurement data
- `garment_types` - Standard garment types (pre-loaded)
- `audit_log` - Complete audit trail
- `system_settings` - App configuration

---

## 🔧 Troubleshooting

### PostgreSQL Connection Error
```
Error: Connection refused
```
**Solution:** Make sure PostgreSQL is running:
```bash
# Windows: Check Services
services.msc

# Or restart PostgreSQL
net stop postgresql-x64-14
net start postgresql-x64-14
```

### Port Already in Use
```
Error: Port 3000 is already in use
```
**Solution:** Kill the process or change the port in `vite.config.js`

### OCR Service Not Starting
```
ImportError: No module named 'paddleocr'
```
**Solution:** Reinstall Python dependencies:
```bash
pip install -r ocr-service/requirements.txt
```

### Database Migration Fails
```
Error: relation "customers" already exists
```
**Solution:** This means tables are already created. You can safely ignore this if the database was already set up.

---

## 🏗️ Project Structure

```
eagle-tailors/
├── backend/           # Node.js API
│   ├── src/
│   │   ├── config/    # Database config
│   │   ├── models/    # Data models
│   │   ├── controllers/  # Request handlers
│   │   ├── routes/    # API routes
│   │   └── middleware/   # Upload, auth, etc.
│   └── scripts/       # Migration scripts
│
├── frontend/          # React app
│   ├── src/
│   │   ├── pages/     # Main pages
│   │   ├── components/   # Reusable components
│   │   ├── services/  # API calls
│   │   └── assets/    # Images, styles
│   └── public/        # Static files
│
├── ocr-service/       # Python OCR
│   ├── main.py        # Flask app
│   └── requirements.txt  # Dependencies
│
├── database/          # SQL files
│   └── migrations/    # Schema migrations
│
├── uploads/           # Bill images (created automatically)
│   ├── bills/         # Original images
│   └── thumbnails/    # Compressed thumbnails
│
├── scripts/           # Utility scripts
│   └── setup.bat      # Windows setup
│
└── docs/              # Documentation
```

---

## 🌐 API Endpoints

### Customers
- `POST /api/customers` - Create customer
- `GET /api/customers` - Get all customers
- `GET /api/customers/search?q={query}&type={phone|name}` - Search
- `GET /api/customers/:id` - Get customer details
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete (soft)

### Bills
- `POST /api/bills` - Upload bill (with image)
- `GET /api/bills` - Get all bills
- `GET /api/bills/:id` - Get bill details
- `GET /api/bills/folio/:folio` - Search by folio
- `GET /api/bills/customer/:customerId` - Get customer bills
- `GET /api/bills/due-deliveries` - Get due deliveries
- `GET /api/bills/pending-payments` - Get pending payments
- `PUT /api/bills/:id` - Update bill
- `DELETE /api/bills/:id` - Delete (soft)

### Books
- `POST /api/books` - Create book
- `GET /api/books` - Get all books
- `GET /api/books/current` - Get current book
- `GET /api/books/:id/next-folio` - Get next folio number
- `PUT /api/books/:id/set-current` - Set as current book

### OCR
- `POST /ocr/extract` - Extract text from image
- `POST /ocr/extract-measurements` - Extract measurements

---

## 📊 Default Data

The system comes pre-loaded with:

### Garment Types:
- Shirt (शर्ट)
- Pant (पैंट)
- Coat (कोट)
- Blazer (ब्लेज़र)
- Kurta (कुर्ता)
- Pyjama (पजामा)

Each with standard measurement fields (L, CH, W, SH, etc.)

---

## 🔐 Security Notes

1. **Change Default Credentials:** Update the database password in `.env`
2. **PIN Authentication:** Implement user PIN system (planned for Phase 1B)
3. **Backup Strategy:** Implement daily backups (planned)
4. **Data Privacy:** All data stored locally, no cloud by default

---

## 🚀 Deployment

### Local Deployment (Recommended for Phase 1)
- Run on shop's laptop
- Access from phone via local WiFi
- No internet required
- Free hosting

### Cloud Deployment (Future)
If you need remote access later, you can deploy to:
- **Backend:** Railway, Render, or Heroku
- **Frontend:** Vercel or Netlify
- **Database:** Supabase or PostgreSQL on Railway
- **Estimated Cost:** ₹800-1500/month

---

## 📝 Common Tasks

### Create a New Book
```sql
INSERT INTO books (name, start_serial, is_current)
VALUES ('2025-26', 1, true);
```

### Reset Database (DANGER!)
```bash
dropdb eagle_tailors
createdb eagle_tailors
cd backend && node scripts/migrate.js
```

### Check Database Status
```bash
psql -U postgres -d eagle_tailors -c "\dt"
```

### View Recent Bills
```sql
SELECT b.folio_number, c.name, b.bill_date, b.total_amount
FROM bills b
JOIN customers c ON b.customer_id = c.id
ORDER BY b.created_at DESC
LIMIT 10;
```

---

## 🎓 Learning Resources

- **React:** https://react.dev/
- **Node.js:** https://nodejs.org/docs/
- **PostgreSQL:** https://www.postgresql.org/docs/
- **PaddleOCR:** https://github.com/PaddlePaddle/PaddleOCR

---

## 🐛 Reporting Issues

If you encounter any issues:
1. Check the troubleshooting section above
2. Review the console logs (browser and terminal)
3. Check database connectivity
4. Ensure all 3 services are running

---

## 📞 Support

For help with the system:
- Check the master plan: `eagle_tailors_master_plan_v1.1.md`
- Review this file
- Check console logs for errors

---

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] Backend API responds at http://localhost:3001/health
- [ ] Frontend loads at http://localhost:3000
- [ ] Can create a new book
- [ ] Can add a new customer
- [ ] Can upload a bill with image
- [ ] Can search for customer by phone
- [ ] Can view bill details with image
- [ ] Images are saved to `uploads/` folder

---

## 🎯 Next Steps

Once the basic system is running:

1. **Phase 1A (Weeks 1-2):** ✅ Complete
   - Core features working
   - Image upload and storage
   - Customer and bill management

2. **Phase 1B (Week 3):** Next
   - Implement PIN authentication
   - Add duplicate customer detection
   - Implement soft delete and restore

3. **Phase 2 (Weeks 4-6):** Future
   - Integrate OCR service
   - Add measurement extraction
   - Implement voice input

---

## 📄 License

This is a custom solution for Eagle Tailors, Meerut.
© 2026 Eagle Tailors. All rights reserved.
