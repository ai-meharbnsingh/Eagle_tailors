# Eagle Tailors - Complete Build Instructions for Claude CLI

## MASTER INSTRUCTION

You are building a complete Tailor Shop Management System called "Eagle Tailors" (ईगल टेलर्स).

**YOUR MISSION:** Build the COMPLETE Phase 1 working application. Create ALL files, install ALL dependencies, setup the database, and ensure everything runs.

**IMPORTANT:** 
- Do NOT ask for confirmation. Just build everything.
- Create ALL files completely (no placeholders, no "// TODO")
- Install all dependencies automatically
- Run database setup automatically
- Test that everything works before finishing

---

## PROJECT OVERVIEW

**Business:** Tailoring shop in Meerut, India that takes customer measurements and creates custom garments.

**Current System:** Paper-based with Index Book + Bill Book (ledger)

**Digital System Goals:**
1. Upload photos of bills
2. Search customers by phone/folio number
3. View bill history across years
4. Enter measurements in standard forms
5. Automatic backup
6. PIN-based security

---

## TECH STACK (USE EXACTLY THIS)

| Layer | Technology |
|-------|------------|
| Backend | Node.js + Express + TypeScript |
| Frontend | React + Vite + TypeScript + Tailwind CSS |
| Database | PostgreSQL |
| Image Processing | Sharp (Node.js) |
| File Upload | Multer |
| State Management | React Context |
| Routing | React Router DOM v6 |

---

## PROJECT STRUCTURE (CREATE EXACTLY THIS)

```
eagle-tailors/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts
│   │   ├── controllers/
│   │   │   ├── customerController.ts
│   │   │   ├── bookController.ts
│   │   │   ├── billController.ts
│   │   │   ├── authController.ts
│   │   │   └── backupController.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   ├── upload.ts
│   │   │   └── errorHandler.ts
│   │   ├── models/
│   │   │   ├── Customer.ts
│   │   │   ├── Book.ts
│   │   │   ├── Bill.ts
│   │   │   └── AuditLog.ts
│   │   ├── routes/
│   │   │   ├── customerRoutes.ts
│   │   │   ├── bookRoutes.ts
│   │   │   ├── billRoutes.ts
│   │   │   ├── authRoutes.ts
│   │   │   └── backupRoutes.ts
│   │   ├── services/
│   │   │   ├── imageService.ts
│   │   │   ├── backupService.ts
│   │   │   └── searchService.ts
│   │   ├── utils/
│   │   │   ├── validators.ts
│   │   │   ├── helpers.ts
│   │   │   └── constants.ts
│   │   └── index.ts
│   ├── uploads/
│   │   ├── original/
│   │   ├── processed/
│   │   └── thumbnails/
│   ├── backups/
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   ├── Loading.tsx
│   │   │   │   ├── Toast.tsx
│   │   │   │   └── ConfidenceIndicator.tsx
│   │   │   ├── layout/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── BottomNav.tsx
│   │   │   │   └── Layout.tsx
│   │   │   ├── customer/
│   │   │   │   ├── CustomerCard.tsx
│   │   │   │   ├── CustomerForm.tsx
│   │   │   │   ├── CustomerSearch.tsx
│   │   │   │   └── DuplicateWarning.tsx
│   │   │   ├── bill/
│   │   │   │   ├── BillCard.tsx
│   │   │   │   ├── BillUploader.tsx
│   │   │   │   ├── ImageViewer.tsx
│   │   │   │   └── FolioInput.tsx
│   │   │   ├── measurement/
│   │   │   │   ├── GarmentSelector.tsx
│   │   │   │   ├── MeasurementForm.tsx
│   │   │   │   ├── MeasurementField.tsx
│   │   │   │   └── BillingForm.tsx
│   │   │   └── settings/
│   │   │       ├── BackupStatus.tsx
│   │   │       ├── ThemeToggle.tsx
│   │   │       └── PinChange.tsx
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── HomePage.tsx
│   │   │   ├── UploadBillPage.tsx
│   │   │   ├── SearchResultsPage.tsx
│   │   │   ├── BillDetailPage.tsx
│   │   │   ├── CustomerListPage.tsx
│   │   │   ├── CustomerDetailPage.tsx
│   │   │   ├── MeasurementEntryPage.tsx
│   │   │   ├── BookManagementPage.tsx
│   │   │   ├── SettingsPage.tsx
│   │   │   ├── BackupPage.tsx
│   │   │   └── AuditLogPage.tsx
│   │   ├── context/
│   │   │   ├── AuthContext.tsx
│   │   │   ├── ThemeContext.tsx
│   │   │   └── ToastContext.tsx
│   │   ├── hooks/
│   │   │   ├── useApi.ts
│   │   │   ├── useAuth.ts
│   │   │   ├── useCustomers.ts
│   │   │   ├── useBills.ts
│   │   │   └── useBooks.ts
│   │   ├── api/
│   │   │   ├── client.ts
│   │   │   ├── customers.ts
│   │   │   ├── bills.ts
│   │   │   ├── books.ts
│   │   │   ├── auth.ts
│   │   │   └── backup.ts
│   │   ├── utils/
│   │   │   ├── constants.ts
│   │   │   ├── formatters.ts
│   │   │   ├── validators.ts
│   │   │   └── imageCompressor.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── styles/
│   │   │   └── globals.css
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   │   └── icons/
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── vite.config.ts
├── database/
│   ├── schema.sql
│   ├── seed.sql
│   ├── migrations/
│   │   └── 001_initial.sql
│   └── setup.sh
├── scripts/
│   ├── start-all.sh
│   ├── stop-all.sh
│   ├── backup.sh
│   └── setup.sh
├── docs/
│   └── MASTER_PLAN.md
├── CLAUDE.md
├── README.md
├── .gitignore
└── docker-compose.yml (optional)
```

---

## DATABASE SCHEMA (CREATE EXACTLY THIS)

```sql
-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- BOOKS table
CREATE TABLE books (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    start_serial INTEGER NOT NULL DEFAULT 1,
    end_serial INTEGER,
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE,
    is_current BOOLEAN DEFAULT false,
    last_used_folio INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- CUSTOMERS table
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    name_normalized VARCHAR(255),
    address TEXT,
    locality VARCHAR(100),
    notes TEXT,
    is_deleted BOOLEAN DEFAULT false,
    deleted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_customers_name_trgm ON customers USING gin(name gin_trgm_ops);
CREATE INDEX idx_customers_normalized_trgm ON customers USING gin(name_normalized gin_trgm_ops);
CREATE INDEX idx_customers_not_deleted ON customers(id) WHERE is_deleted = false;

-- CUSTOMER_PHONES table
CREATE TABLE customer_phones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    phone VARCHAR(15) NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT unique_phone UNIQUE (phone)
);

CREATE INDEX idx_phones_phone ON customer_phones(phone);
CREATE INDEX idx_phones_customer ON customer_phones(customer_id);

-- GARMENT_TYPES table
CREATE TABLE garment_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE,
    name_hindi VARCHAR(50) NOT NULL,
    icon VARCHAR(10),
    field_sequence JSONB NOT NULL,
    field_names JSONB NOT NULL,
    field_names_hindi JSONB NOT NULL,
    display_order INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT true
);

-- BILLS table
CREATE TABLE bills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    book_id UUID NOT NULL REFERENCES books(id),
    customer_id UUID NOT NULL REFERENCES customers(id),
    folio_number INTEGER NOT NULL,
    image_url VARCHAR(500),
    thumbnail_url VARCHAR(500),
    original_image_url VARCHAR(500),
    bill_date DATE,
    delivery_date DATE,
    actual_delivery_date DATE,
    total_amount DECIMAL(10,2),
    advance_paid DECIMAL(10,2),
    balance_due DECIMAL(10,2),
    status VARCHAR(20) DEFAULT 'pending',
    remarks TEXT,
    is_deleted BOOLEAN DEFAULT false,
    deleted_at TIMESTAMP,
    deleted_by VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT unique_folio_per_book UNIQUE (book_id, folio_number)
);

CREATE INDEX idx_bills_book ON bills(book_id);
CREATE INDEX idx_bills_customer ON bills(customer_id);
CREATE INDEX idx_bills_folio ON bills(folio_number);
CREATE INDEX idx_bills_status ON bills(status);
CREATE INDEX idx_bills_not_deleted ON bills(id) WHERE is_deleted = false;

-- BILL_ITEMS table
CREATE TABLE bill_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bill_id UUID NOT NULL REFERENCES bills(id) ON DELETE CASCADE,
    garment_type_id UUID REFERENCES garment_types(id),
    garment_name VARCHAR(100),
    quantity INTEGER DEFAULT 1,
    price DECIMAL(10,2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- BILL_MEASUREMENTS table
CREATE TABLE bill_measurements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bill_id UUID NOT NULL REFERENCES bills(id) ON DELETE CASCADE,
    garment_type_id UUID REFERENCES garment_types(id),
    garment_name VARCHAR(100),
    measurements JSONB NOT NULL DEFAULT '{}',
    confidence JSONB,
    unknown_values JSONB,
    remarks TEXT,
    raw_text TEXT,
    is_auto_extracted BOOLEAN DEFAULT false,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- AUDIT_LOG table
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name VARCHAR(50) NOT NULL,
    record_id UUID NOT NULL,
    action VARCHAR(20) NOT NULL,
    user_role VARCHAR(20) NOT NULL,
    old_values JSONB,
    new_values JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_created ON audit_log(created_at);

-- APP_SETTINGS table
CREATE TABLE app_settings (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- BACKUPS table
CREATE TABLE backups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    backup_date TIMESTAMP NOT NULL,
    backup_path VARCHAR(500) NOT NULL,
    backup_type VARCHAR(20) NOT NULL,
    destination VARCHAR(50) NOT NULL,
    size_bytes BIGINT,
    bill_count INTEGER,
    status VARCHAR(20) NOT NULL,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Insert default settings
INSERT INTO app_settings (key, value) VALUES
    ('owner_pin', '"9876"'),
    ('helper_pin', '"1234"'),
    ('auto_backup_enabled', 'true'),
    ('auto_backup_time', '"23:00"'),
    ('theme', '"light"');

-- Insert garment types with measurements
INSERT INTO garment_types (name, name_hindi, icon, field_sequence, field_names, field_names_hindi, display_order) VALUES
('coat', 'कोट', '🧥', 
 '["L", "CH", "W", "H", "SH", "SL", "SR", "N", "BW", "CB", "FO"]',
 '{"L": "Length", "CH": "Chest", "W": "Waist", "H": "Hip", "SH": "Shoulder", "SL": "Sleeve Length", "SR": "Sleeve Round", "N": "Neck", "BW": "Back Width", "CB": "Cross Back", "FO": "Front Open"}',
 '{"L": "लम्बाई", "CH": "छाती", "W": "कमर", "H": "सीट", "SH": "कंधा", "SL": "आस्तीन", "SR": "आस्तीन गोल", "N": "गला", "BW": "पीठ", "CB": "क्रॉस बैक", "FO": "फ्रंट खुला"}',
 1),
('pant', 'पैंट', '👖',
 '["L", "W", "H", "TH", "K", "B", "F"]',
 '{"L": "Length", "W": "Waist", "H": "Hip", "TH": "Thigh", "K": "Knee", "B": "Bottom", "F": "Fork"}',
 '{"L": "लम्बाई", "W": "कमर", "H": "सीट", "TH": "जांघ", "K": "घुटना", "B": "मोहरी", "F": "फोर्क"}',
 2),
('blazer', 'ब्लेज़र', '🥼',
 '["L", "CH", "W", "H", "SH", "SL", "SR", "BW", "CB"]',
 '{"L": "Length", "CH": "Chest", "W": "Waist", "H": "Hip", "SH": "Shoulder", "SL": "Sleeve Length", "SR": "Sleeve Round", "BW": "Back Width", "CB": "Cross Back"}',
 '{"L": "लम्बाई", "CH": "छाती", "W": "कमर", "H": "हिप", "SH": "कंधा", "SL": "आस्तीन", "SR": "आस्तीन गोल", "BW": "पीठ", "CB": "क्रॉस बैक"}',
 3),
('shirt', 'शर्ट', '👔',
 '["L", "CH", "W", "SH", "SL", "SR", "N", "CF"]',
 '{"L": "Length", "CH": "Chest", "W": "Waist", "SH": "Shoulder", "SL": "Sleeve Length", "SR": "Sleeve Round", "N": "Neck", "CF": "Cuff"}',
 '{"L": "लम्बाई", "CH": "छाती", "W": "कमर", "SH": "कंधा", "SL": "आस्तीन", "SR": "आस्तीन गोल", "N": "गला", "CF": "कफ"}',
 4),
('kurta', 'कुर्ता', '👘',
 '["L", "CH", "W", "H", "SH", "SL", "SR", "N", "CK"]',
 '{"L": "Length", "CH": "Chest", "W": "Waist", "H": "Hip", "SH": "Shoulder", "SL": "Sleeve Length", "SR": "Sleeve Round", "N": "Neck", "CK": "Chaak"}',
 '{"L": "लम्बाई", "CH": "छाती", "W": "कमर", "H": "हिप", "SH": "कंधा", "SL": "आस्तीन", "SR": "आस्तीन गोल", "N": "गला", "CK": "चाक"}',
 5),
('pyjama', 'पजामा', '🩳',
 '["L", "W", "H", "TH", "K", "B"]',
 '{"L": "Length", "W": "Waist", "H": "Hip", "TH": "Thigh", "K": "Knee", "B": "Bottom"}',
 '{"L": "लम्बाई", "W": "कमर", "H": "सीट", "TH": "जांघ", "K": "घुटना", "B": "मोहरी"}',
 6),
('waistcoat', 'वेस्टकोट', '🎽',
 '["L", "CH", "W", "SH"]',
 '{"L": "Length", "CH": "Chest", "W": "Waist", "SH": "Shoulder"}',
 '{"L": "लम्बाई", "CH": "छाती", "W": "कमर", "SH": "कंधा"}',
 7);

-- Insert default book
INSERT INTO books (name, start_serial, is_current, start_date) VALUES
('2025-26', 1, true, '2025-04-01');
```

---

## API ENDPOINTS (IMPLEMENT ALL)

### Authentication
```
POST /api/auth/login          - Verify PIN, return role (owner/helper)
POST /api/auth/change-pin     - Change PIN (owner only)
GET  /api/auth/session        - Check current session
POST /api/auth/logout         - Clear session
```

### Customers
```
GET    /api/customers                    - List all (paginated, searchable)
GET    /api/customers/:id                - Get one with phones and bill count
POST   /api/customers                    - Create new customer
PUT    /api/customers/:id                - Update customer
DELETE /api/customers/:id                - Soft delete
POST   /api/customers/:id/phones         - Add phone number
DELETE /api/customers/:id/phones/:phoneId - Remove phone
GET    /api/customers/search             - Search by ?phone= or ?name= or ?locality=
GET    /api/customers/duplicates         - Check duplicates ?name=&locality=
POST   /api/customers/:id/merge/:targetId - Merge two customers
```

### Books
```
GET    /api/books              - List all books
GET    /api/books/current      - Get current book with stats
POST   /api/books              - Create new book
PUT    /api/books/:id          - Update book
PUT    /api/books/:id/close    - Close book (set end_date)
PUT    /api/books/:id/current  - Set as current book
GET    /api/books/:id/next-folio - Get next available folio number
GET    /api/books/:id/validate-folio/:folio - Check if folio is available
```

### Bills
```
GET    /api/bills                     - List bills (paginated, filterable)
GET    /api/bills/:id                 - Get bill with all details
POST   /api/bills                     - Create bill (multipart with image)
PUT    /api/bills/:id                 - Update bill
DELETE /api/bills/:id                 - Soft delete bill
GET    /api/bills/search              - Search by ?folio= 
GET    /api/bills/customer/:customerId - All bills for customer (all books)
PUT    /api/bills/:id/status          - Update status (pending/ready/delivered)
GET    /api/bills/today-delivery      - Bills due today
GET    /api/bills/pending-payment     - Bills with balance > 0
POST   /api/bills/:id/measurements    - Add/update measurements
GET    /api/bills/:id/image           - Get processed image
GET    /api/bills/:id/image/original  - Get original image
GET    /api/bills/:id/thumbnail       - Get thumbnail
```

### Measurements
```
GET    /api/garment-types              - List all garment types
POST   /api/bills/:id/measurements     - Save measurements for bill
GET    /api/customers/:id/last-measurements - Get last measurements by garment
```

### Backup
```
GET    /api/backup/status              - Get last backup info
POST   /api/backup/manual              - Trigger manual backup
GET    /api/backup/history             - List recent backups
POST   /api/backup/restore             - Restore from backup (owner only)
```

### Audit
```
GET    /api/audit                      - Get audit log (owner only, paginated)
GET    /api/audit/record/:id           - Get audit for specific record
```

### Settings
```
GET    /api/settings                   - Get all settings
PUT    /api/settings/:key              - Update setting (owner only)
```

---

## FRONTEND PAGES (IMPLEMENT ALL)

### 1. LoginPage
- 4-digit PIN entry with number pad
- Show error on wrong PIN
- Remember role in context
- Redirect to home on success

### 2. HomePage
```
┌─────────────────────────────────────┐
│ 🦅 Eagle Tailors         [Owner ▼] │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ 🔍 Search phone or folio...    │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌───────────┐ ┌───────────┐        │
│ │ 📷 Upload │ │ 👤 New    │        │
│ │   Bill    │ │ Customer  │        │
│ └───────────┘ └───────────┘        │
│ ┌───────────┐ ┌───────────┐        │
│ │ 📅 Today  │ │ ₹ Pending │        │
│ │ Delivery  │ │ Payments  │        │
│ │    (5)    │ │   (12)    │        │
│ └───────────┘ └───────────┘        │
│                                     │
│ Current Book: 2025-26              │
│ Last Folio: 2341                   │
│ Total Customers: 1,247             │
│                                     │
│ Recent Activity:                   │
│ • #2341 - Arun - 2 mins ago       │
│ • #2340 - Ramesh - 15 mins ago    │
└─────────────────────────────────────┘
```

### 3. UploadBillPage
- Camera button (use device camera)
- Gallery button (file picker)
- Image preview with crop/rotate
- Phone number input with instant customer lookup
- Folio number input with auto-suggestion and validation
- Bill date picker (default today)
- Delivery date picker
- Show customer preview card when found
- Show duplicate warning if similar customer exists
- Save button

### 4. SearchResultsPage
- Show customer info card
- List all bills grouped by book/year
- Each bill shows: folio, date, items, amount, status
- Tap bill to view details
- Show "No results" if not found

### 5. BillDetailPage
- Full-size zoomable image (pinch zoom on mobile)
- Bill info (folio, date, status)
- Customer info
- Items list
- Measurements (if entered)
- Billing info (total, advance, balance)
- Edit button
- Delete button (owner only)

### 6. CustomerListPage
- Alphabetical list with letter shortcuts
- Search box
- Each card shows: name, phone, last visit
- Tap to view details
- Add button

### 7. CustomerDetailPage
- Customer info (name, phones, address)
- Add phone button
- Bill history across all books
- Edit button
- Delete button (owner only)

### 8. MeasurementEntryPage
- Garment type selector (visual icons)
- Dynamic measurement form per garment
- Field labels in Hindi + English
- Numeric keyboard for measurements
- Support decimal (37.5)
- Remarks field per garment
- Copy from previous button
- Billing section (total, advance, balance)
- Save button

### 9. BookManagementPage
- List all books
- Current book highlighted
- Create new book button
- Set current button
- Close book button

### 10. SettingsPage
- Display mode toggle (Light/Dark/High Contrast)
- Backup status card
- Manual backup button
- Change PIN (owner only)
- View audit log (owner only)
- App info

### 11. BackupPage
- Last backup info
- Backup history list
- Manual backup button
- Restore button (owner only, with confirmation)

### 12. AuditLogPage (Owner only)
- List of all actions
- Filter by date, action type
- Show who did what when

---

## KEY FEATURES TO IMPLEMENT

### Image Handling
```typescript
// On upload:
1. Compress image client-side to max 1920px width, 85% quality
2. Send to backend
3. Backend saves original to /uploads/original/
4. Backend processes with Sharp:
   - Auto-rotate based on EXIF
   - Resize if needed
   - Enhance contrast
   - Save to /uploads/processed/
5. Generate thumbnail (300px) to /uploads/thumbnails/
6. Return URLs for all three
```

### Folio Validation
```typescript
// When folio entered:
1. Check if folio exists in current book → Block with error
2. Check if folio has gap from last → Warn but allow
3. Check if folio is too low for current book → Warn (maybe old bill?)
4. Auto-suggest: last_used_folio + 1
```

### Customer Duplicate Detection
```typescript
// When creating customer:
1. Normalize name (lowercase, trim, remove extra spaces)
2. Search existing by:
   - Exact phone match → Same customer
   - Name similarity > 80% (trigram) → Possible duplicate
   - Same locality + similar name → Possible duplicate
3. Show warning with merge option
```

### Soft Delete
```typescript
// On delete:
1. Set is_deleted = true, deleted_at = NOW()
2. Record in audit_log
3. Don't actually remove
4. Filter out deleted in normal queries
5. Owner can view/restore deleted items
```

### Backup System
```typescript
// Nightly backup (or manual):
1. pg_dump database to SQL file
2. Copy /uploads folder
3. Create timestamped folder
4. Compress to ZIP
5. Save to backup location
6. Record in backups table
7. Clean old backups (keep 7 daily, 4 weekly, 12 monthly)
```

---

## STYLING REQUIREMENTS

### Tailwind Config
```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        }
      }
    }
  }
}
```

### Theme Classes
```css
/* Light mode (default) */
.theme-light {
  --bg-primary: #ffffff;
  --bg-secondary: #f3f4f6;
  --text-primary: #111827;
  --text-secondary: #6b7280;
}

/* Dark mode */
.theme-dark {
  --bg-primary: #1f2937;
  --bg-secondary: #111827;
  --text-primary: #f9fafb;
  --text-secondary: #9ca3af;
}

/* High contrast mode (workshop) */
.theme-high-contrast {
  --bg-primary: #000000;
  --bg-secondary: #000000;
  --text-primary: #ffffff;
  --text-secondary: #ffffff;
  --text-numbers: #ffff00; /* Yellow for measurements */
  font-size: 1.25rem;
  font-weight: bold;
}
```

### Mobile-First
- All designs should work on 375px width minimum
- Use responsive breakpoints: sm:640px, md:768px, lg:1024px
- Touch-friendly buttons (min 44px height)
- Bottom navigation for mobile

---

## ENVIRONMENT VARIABLES

### Backend (.env)
```
PORT=3001
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/eagle_tailors
JWT_SECRET=eagle-tailors-secret-key-change-in-production
UPLOAD_DIR=./uploads
BACKUP_DIR=./backups
NODE_ENV=development
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3001/api
```

---

## BUILD & RUN COMMANDS

### Setup Script (scripts/setup.sh)
```bash
#!/bin/bash
echo "🦅 Setting up Eagle Tailors..."

# Create database
echo "📦 Creating database..."
psql -U postgres -c "CREATE DATABASE eagle_tailors;" 2>/dev/null || true

# Run schema
echo "📋 Running schema..."
psql -U postgres -d eagle_tailors -f database/schema.sql

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend && npm install

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd ../frontend && npm install

echo "✅ Setup complete!"
echo "Run 'npm run dev' in backend folder"
echo "Run 'npm run dev' in frontend folder"
```

### Start All Script (scripts/start-all.sh)
```bash
#!/bin/bash
echo "🦅 Starting Eagle Tailors..."

# Start backend
cd backend && npm run dev &
BACKEND_PID=$!

# Start frontend
cd ../frontend && npm run dev &
FRONTEND_PID=$!

echo "✅ Started!"
echo "Backend: http://localhost:3001"
echo "Frontend: http://localhost:5173"

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null" EXIT
wait
```

---

## TESTING CHECKLIST

After building, verify these work:

### Backend Tests
- [ ] POST /api/auth/login with correct PIN returns token
- [ ] POST /api/auth/login with wrong PIN returns 401
- [ ] GET /api/customers returns empty array initially
- [ ] POST /api/customers creates customer
- [ ] POST /api/customers/:id/phones adds phone
- [ ] GET /api/customers/search?phone=xxx finds customer
- [ ] GET /api/books/current returns default book
- [ ] POST /api/bills with image uploads successfully
- [ ] GET /api/bills/:id/thumbnail returns image
- [ ] Image processing creates all three versions

### Frontend Tests
- [ ] Login page accepts 4-digit PIN
- [ ] Home page shows after login
- [ ] Search finds customer by phone
- [ ] Upload page opens camera/gallery
- [ ] Image preview shows after capture
- [ ] Folio auto-suggests next number
- [ ] Customer lookup works when phone entered
- [ ] Bill saves successfully
- [ ] Bill detail shows zoomable image
- [ ] Measurement form shows correct fields per garment
- [ ] Settings page toggles theme
- [ ] App works on mobile browser

---

## FINAL DELIVERABLE

When complete, the user should be able to:

1. **Run setup script** → Database created with schema and seed data
2. **Start backend** → API running on port 3001
3. **Start frontend** → React app running on port 5173
4. **Open on phone browser** → http://[laptop-ip]:5173
5. **Login with PIN** → 9876 for owner, 1234 for helper
6. **Upload a bill photo** → Auto-enhanced and saved
7. **Search by phone** → Find customer and all bills
8. **Enter measurements** → Standard forms with all fields
9. **See bill history** → Across all years/books
10. **Backup data** → Manual backup works

---

## NOW BUILD EVERYTHING

Start building the complete application now. Create all files with full implementations. Do not use placeholders or TODOs. Make everything work end-to-end.

Begin with:
1. Create project folder structure
2. Setup database (create DB, run schema, seed data)
3. Build backend (all APIs, all features)
4. Build frontend (all pages, all components)
5. Test everything works
6. Create setup and start scripts

GO!
