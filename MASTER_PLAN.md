# 🦅 Eagle Tailors Digitization Project
## ईगल टेलर्स, मेरठ - Master Plan Document

---

**Document Version:** 1.1  
**Date:** 27th January 2026  
**Prepared For:** Eagle Tailors, Sadar Bazar (Laxmi Narayan Dharamshala), Meerut Cantt.  
**Contact:** Ph: 2660605  

---

## 🎯 Paper Parity Guarantee

> **"This system never replaces your book. It only helps you find it faster."**

This is our core principle. The tailor continues to work exactly as before - writing measurements in the physical bill book. The digital system is a **smart photo album** that makes searching instant.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Current Manual System](#2-current-manual-system)
3. [Proposed Digital Solution](#3-proposed-digital-solution)
4. [Database Design](#4-database-design)
5. [Standard Measurement Formats](#5-standard-measurement-formats)
6. [Phase-wise Implementation Plan](#6-phase-wise-implementation-plan)
7. [User Interface Designs](#7-user-interface-designs)
8. [Smart Image Processing](#8-smart-image-processing)
9. [QR Code & Thermal Printing](#9-qr-code--thermal-printing)
10. [Data Safety & Backup](#10-data-safety--backup)
11. [Security & Access Control](#11-security--access-control)
12. [Deployment Strategy](#12-deployment-strategy)
13. [Owner Quick Reference (1-Page)](#13-owner-quick-reference-1-page)
14. [Cost Analysis](#14-cost-analysis)
15. [Risk Mitigation](#15-risk-mitigation)
16. [Appendix](#16-appendix)

---

## 1. Executive Summary

Eagle Tailors is a well-established tailoring business in Meerut operating with a traditional paper-based system. This document outlines a plan to create a **digital photo archive** of bills that enables instant search while preserving the familiar paper workflow.

### Core Philosophy

| Principle | Description |
|-----------|-------------|
| **Paper Parity** | System complements, never replaces the physical books |
| **Photo First** | Capture photo of bill → System extracts data |
| **Smart Fallback** | When OCR fails → Easy manual/voice entry |
| **Zero Friction** | No workflow change for tailor |
| **Offline First** | Works without internet |
| **Zero Cost** | No recurring fees for OCR or cloud |

### What Problem Are We Solving?

| Current Pain | Digital Solution |
|--------------|------------------|
| Finding old customer takes 5-10 minutes | Instant search by phone/name |
| Old books stored in godown, hard to access | All years searchable in one place |
| Customer changed phone number, can't find | Multiple phones linked to one customer |
| Handwriting faded or unclear | High-res photo preserved forever |
| Fire/water damage = total loss | Automatic backups |
| "Is my order ready?" calls | Customer can scan QR to check status |

### Key Features Summary

**Phase 1 (Weeks 1-3):**
- Upload bill photos from phone camera
- Search by phone number, folio, or name
- View bill images (zoomable)
- Customer history across all years/books
- Auto-suggest next folio number
- Duplicate customer detection

**Phase 2 (Weeks 4-6):**
- Auto-extract data from photos (free OCR)
- Hybrid entry: Auto + Manual + Voice
- Standard measurement forms
- Confidence indicators (🟢🟡🔴)
- Bulk upload for old books

**Phase 3+ (Future):**
- QR code on receipts
- Thermal printer integration
- Customer order tracking page
- Delivery & payment dashboards
- Custom ML model for better accuracy

---

## 2. Current Manual System

### 2.1 Index Book System

The Index Book is an alphabetically organized directory for quick customer lookup.

```
┌─────────────────────────────────────────────────────────────────┐
│                         INDEX BOOK                               │
│                    (Alphabetical Tabs A-Z)                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   Page "A":                                                      │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ Customer Name     │ Phone       │ Folio Numbers        │   │
│   ├───────────────────┼─────────────┼──────────────────────┤   │
│   │ Ankur Mittal      │ 9837311191  │ ⊘971  ⊘805  02      │   │
│   │ Ajit Kumar (Ad)   │ 9997047890  │ 08                   │   │
│   │ आदर्श गौड़         │ 9720077770  │ (pending)            │   │
│   │ Ankur Ahuja       │ 9219860006  │ ⊘22  ⊘699  1166     │   │
│   │ Arun Kumar Jain   │ 9412200595  │ ⊘537 ⊘1642 ⊘780 47  │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│   ⊘ = Crossed out (old entry, measurements updated)             │
│   Last number = Current active measurement set                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Main Ledger/Bill Book

Pre-printed carbon copy bill book with serial numbers (folio numbers).

**Bill Components:**

| Section | Hindi | Description |
|---------|-------|-------------|
| Serial Number | क्रमांक | Pre-printed (e.g., 2341) |
| Name & Address | नाम व पता श्री | Customer details |
| Date | तिथि | Order date |
| Delivery Date | दूरी तिथि | Expected delivery |
| Description | विवरण | Garment types & quantities |
| Total | योग | Total amount |
| Balance | बकाया | Amount due |

**Measurement Recording:**
- Written in free-form on the bill
- Uses shorthand: S (Shirt), EVD (Waistcoat), etc.
- Fractions: 37½, 36¼
- Diagrams and arrows for special notes

### 2.3 Book Lifecycle

New Index + Ledger pair started when:
- Current ledger is full (~2300-2500 entries)
- Financial year changes
- Business decision

**Multi-Year Reality:**
```
Year 2023-24          Year 2024-25          Year 2025-26
┌───────────┐        ┌───────────┐        ┌───────────┐
│ Book #1   │        │ Book #2   │        │ Book #3   │
│ 0001-2300 │        │ 0001-2400 │        │ 0001-2341 │
│ (CLOSED)  │        │ (CLOSED)  │        │ (CURRENT) │
└───────────┘        └───────────┘        └───────────┘
      │                    │                    │
      └────────────────────┴────────────────────┘
                           │
              Customer "Ankur" returns after 2 years
              Need to search all 3 books manually!
```

### 2.4 Current Workflow

**New Customer:**
1. Customer arrives → Take measurements
2. Write in bill book (next serial number)
3. Give carbon copy to customer
4. Add entry to Index book (name + phone + folio)

**Returning Customer (New Measurements):**
1. Search Index by name → Find current folio
2. Optionally check old measurements
3. Take new measurements → New bill entry
4. Update Index: Cross old folio, write new one

### 2.5 Pain Points

| Pain Point | Impact |
|------------|--------|
| Search time: 5-10 minutes | Customer waiting, lost business |
| Old books in storage | Cannot find old measurements |
| Illegible/faded writing | Measurement errors |
| No backup | Fire = complete business loss |
| Customer changed number | Cannot find their record |
| Multiple books to search | Very time consuming |
| "Is my order ready?" calls | Staff time wasted |

---

## 3. Proposed Digital Solution

### 3.1 Solution Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    HOW IT WORKS                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   TAILOR'S WORKFLOW (Unchanged):                                │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ 1. Write bill in physical book (as always)              │   │
│   │ 2. Give carbon copy to customer                         │   │
│   │ 3. Update index book                                    │   │
│   └─────────────────────────────────────────────────────────┘   │
│                           │                                      │
│                           │ NEW: Click photo with phone          │
│                           ▼                                      │
│   DIGITAL SYSTEM:                                                │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ 📷 Photo uploaded                                       │   │
│   │      ↓                                                  │   │
│   │ 🔍 Linked to customer (by phone number)                │   │
│   │      ↓                                                  │   │
│   │ 🤖 System extracts data (auto or manual)               │   │
│   │      ↓                                                  │   │
│   │ 💾 Searchable forever                                  │   │
│   └─────────────────────────────────────────────────────────┘   │
│                           │                                      │
│                           ▼                                      │
│   BENEFITS:                                                      │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ ✓ Find any customer in 5 seconds                       │   │
│   │ ✓ All years in one search                              │   │
│   │ ✓ Photo backup of every bill                           │   │
│   │ ✓ Works on phone + laptop                              │   │
│   │ ✓ Works offline                                        │   │
│   │ ✓ No monthly cost                                      │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Key Features by Phase

#### Phase 1: Digital Photo Archive (Weeks 1-3)

| Feature | Description |
|---------|-------------|
| **Customer Management** | Name, multiple phones, address |
| **Book Management** | Create books for each year/ledger |
| **Photo Upload** | Camera or gallery, any angle works |
| **Smart Search** | By phone, folio, name (fuzzy) |
| **Auto-Suggest Folio** | Prevents wrong number entry |
| **Duplicate Detection** | Warns if customer might exist |
| **Image Compression** | Saves storage automatically |
| **Zoomable View** | See bill details clearly |
| **History View** | All bills grouped by year |
| **High Contrast Mode** | Readable in workshop lighting |
| **Soft Delete** | Accidental deletions recoverable |
| **PIN Access** | Simple security |

#### Phase 2: Smart Data Extraction (Weeks 4-6)

| Feature | Description |
|---------|-------------|
| **Free OCR** | PaddleOCR (Hindi + English) |
| **Smart Processing** | Handles angled, shaky photos |
| **Fraction Handling** | 37½ → 37.5 automatically |
| **Confidence Scoring** | 🟢🟡🔴 visual indicators |
| **Hybrid Entry** | Auto-fill + manual correction |
| **Voice Input** | Say "Chest thirty seven point five" |
| **Measurement Forms** | Standard fields per garment |
| **Unknown Bucket** | Catch measurements that don't fit |
| **Region Tagging** | Tap image → Map to field |
| **Bulk Upload** | Digitize old books overnight |

#### Phase 3+: Advanced Features (Future)

| Feature | Description |
|---------|-------------|
| **QR Code Receipts** | Customer scans to track order |
| **Thermal Printing** | Print receipts, garment tags |
| **Status Tracking** | Cutting → Stitching → Ready |
| **Delivery Dashboard** | Today's pending deliveries |
| **Payment Tracker** | Pending balances report |
| **SMS/WhatsApp Alerts** | Delivery reminders |
| **Custom ML Model** | Higher accuracy with training |

### 3.3 Technology Stack

| Component | Technology | Why |
|-----------|------------|-----|
| **Database** | PostgreSQL | Robust, free, JSONB support |
| **Backend** | Node.js + Express | Fast, JavaScript ecosystem |
| **Frontend** | React.js | Responsive, component-based |
| **Image Storage** | Local filesystem | No cloud cost |
| **OCR Engine** | PaddleOCR | Best free Hindi+English |
| **Image Processing** | OpenCV (Python) | Handles real-world photos |
| **Voice Input** | Web Speech API | Free, works in Chrome |
| **QR Generation** | qrcode.js | Free library |

---

## 4. Database Design

### 4.1 Entity Relationship Diagram

```
┌─────────────┐         ┌─────────────────┐
│   BOOKS     │         │   CUSTOMERS     │
├─────────────┤         ├─────────────────┤
│ id (PK)     │         │ id (PK)         │
│ name        │    ┌───►│ name            │
│ start_serial│    │    │ address         │
│ end_serial  │    │    │ notes           │
│ is_current  │    │    │ is_deleted      │  ← Soft delete
└──────┬──────┘    │    └────────┬────────┘
       │           │             │
       │ 1:Many    │             │ 1:Many
       ▼           │             ▼
┌──────────────────┴───┐  ┌─────────────────┐
│       BILLS          │  │ CUSTOMER_PHONES │
├──────────────────────┤  ├─────────────────┤
│ id (PK)              │  │ id (PK)         │
│ book_id (FK)         │  │ customer_id(FK) │
│ customer_id (FK) ────┘  │ phone (UNIQUE)  │
│ folio_number         │  │ is_primary      │
│ image_url            │  └─────────────────┘
│ bill_date            │
│ delivery_date        │
│ total_amount         │
│ advance_paid         │
│ balance_due          │
│ status               │
│ remarks              │
│ extraction_status    │
│ raw_extraction       │  ← Immutable OCR backup
│ is_deleted           │  ← Soft delete
│ created_by           │  ← Audit
│ updated_by           │  ← Audit
└──────────┬───────────┘
           │
           │ 1:Many
           ▼
┌──────────────────────┐    ┌─────────────────┐
│   BILL_MEASUREMENTS  │    │  GARMENT_TYPES  │
├──────────────────────┤    ├─────────────────┤
│ id (PK)              │    │ id (PK)         │
│ bill_id (FK)         │    │ name            │
│ garment_type_id (FK)─┼───►│ name_hindi      │
│ measurements (JSON)  │    │ field_sequence  │
│ confidence (JSON)    │    │ icon            │  ← Visual icon
│ remarks              │    │ display_order   │
│ unknown_values       │    └─────────────────┘
│ is_auto_extracted    │
│ is_verified          │
└──────────────────────┘

┌──────────────────────┐
│     AUDIT_LOG        │  ← Track all changes
├──────────────────────┤
│ id (PK)              │
│ table_name           │
│ record_id            │
│ action (create/edit) │
│ old_values           │
│ new_values           │
│ user_pin             │
│ timestamp            │
└──────────────────────┘

┌──────────────────────┐
│       USERS          │  ← Simple PIN-based
├──────────────────────┤
│ id (PK)              │
│ name                 │
│ pin (4-digit)        │
│ role (owner/helper)  │
│ is_active            │
└──────────────────────┘
```

### 4.2 Key Table Details

#### CUSTOMERS Table
```sql
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    address TEXT,
    notes TEXT,
    is_deleted BOOLEAN DEFAULT false,  -- Soft delete
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

-- Fuzzy search index for name matching
CREATE INDEX idx_customers_name_trgm ON customers 
    USING gin(name gin_trgm_ops);
```

#### BILLS Table
```sql
CREATE TABLE bills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    book_id UUID NOT NULL REFERENCES books(id),
    customer_id UUID NOT NULL REFERENCES customers(id),
    folio_number INTEGER NOT NULL,
    image_url VARCHAR(500),
    thumbnail_url VARCHAR(500),
    bill_date DATE,
    delivery_date DATE,
    actual_delivery_date DATE,
    total_amount DECIMAL(10,2),
    advance_paid DECIMAL(10,2),
    balance_due DECIMAL(10,2) GENERATED ALWAYS AS 
        (total_amount - COALESCE(advance_paid, 0)) STORED,
    status VARCHAR(20) DEFAULT 'pending',
    remarks TEXT,
    extraction_status VARCHAR(20) DEFAULT 'pending',
    raw_extraction JSONB,  -- Immutable OCR output
    is_deleted BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    
    CONSTRAINT unique_folio_per_book UNIQUE (book_id, folio_number),
    CONSTRAINT valid_status CHECK (status IN 
        ('pending', 'cutting', 'stitching', 'ready', 'delivered', 'cancelled'))
);
```

#### BILL_MEASUREMENTS Table
```sql
CREATE TABLE bill_measurements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bill_id UUID NOT NULL REFERENCES bills(id) ON DELETE CASCADE,
    garment_type_id UUID REFERENCES garment_types(id),
    garment_name VARCHAR(100),  -- Fallback if type not matched
    measurements JSONB NOT NULL,  -- {"L": 28, "CH": 37.5, ...}
    confidence JSONB,  -- {"L": 95, "CH": 88, ...}
    remarks TEXT,  -- Garment-specific notes
    unknown_values JSONB,  -- Measurements that didn't fit schema
    is_auto_extracted BOOLEAN DEFAULT false,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 5. Standard Measurement Formats

All garments have a **fixed sequence** of measurements. This standardization helps OCR and manual entry.

### 5.1 Measurement Reference Table

#### COAT (कोट)
| # | Code | English | Hindi |
|---|------|---------|-------|
| 1 | L | Length | लम्बाई |
| 2 | CH | Chest | छाती |
| 3 | W | Waist | कमर |
| 4 | H | Hip/Seat | सीट |
| 5 | SH | Shoulder | कंधा |
| 6 | SL | Sleeve Length | आस्तीन |
| 7 | SR | Sleeve Round | आस्तीन गोल |
| 8 | N | Neck | गला |
| 9 | BW | Back Width | पीठ |
| 10 | CB | Cross Back | क्रॉस बैक |
| 11 | FO | Front Open | फ्रंट खुला |

#### PANT (पैंट)
| # | Code | English | Hindi |
|---|------|---------|-------|
| 1 | L | Length | लम्बाई |
| 2 | W | Waist | कमर |
| 3 | H | Hip/Seat | सीट |
| 4 | TH | Thigh | जांघ |
| 5 | K | Knee | घुटना |
| 6 | B | Bottom/Mori | मोहरी |
| 7 | F | Crotch/Fork | फोर्क |

#### SHIRT (शर्ट)
| # | Code | English | Hindi |
|---|------|---------|-------|
| 1 | L | Length | लम्बाई |
| 2 | CH | Chest | छाती |
| 3 | W | Waist | कमर |
| 4 | SH | Shoulder | कंधा |
| 5 | SL | Sleeve Length | आस्तीन |
| 6 | SR | Sleeve Round | आस्तीन गोल |
| 7 | N | Neck/Collar | गला |
| 8 | CF | Cuff | कफ |

#### BLAZER (ब्लेज़र)
| # | Code | English | Hindi |
|---|------|---------|-------|
| 1 | L | Length | लम्बाई |
| 2 | CH | Chest | छाती |
| 3 | W | Waist | कमर |
| 4 | H | Hip | हिप |
| 5 | SH | Shoulder | कंधा |
| 6 | SL | Sleeve Length | आस्तीन |
| 7 | SR | Sleeve Round | आस्तीन गोल |
| 8 | BW | Back Width | पीठ |
| 9 | CB | Cross Back | क्रॉस बैक |

#### KURTA (कुर्ता)
| # | Code | English | Hindi |
|---|------|---------|-------|
| 1 | L | Length | लम्बाई |
| 2 | CH | Chest | छाती |
| 3 | W | Waist | कमर |
| 4 | H | Hip | हिप |
| 5 | SH | Shoulder | कंधा |
| 6 | SL | Sleeve Length | आस्तीन |
| 7 | SR | Sleeve Round | आस्तीन गोल |
| 8 | N | Neck Opening | गला |
| 9 | CK | Slit/Chaak | चाक |

#### PYJAMA (पजामा)
| # | Code | English | Hindi |
|---|------|---------|-------|
| 1 | L | Length | लम्बाई |
| 2 | W | Waist | कमर |
| 3 | H | Hip/Seat | सीट |
| 4 | TH | Thigh | जांघ |
| 5 | K | Knee | घुटना |
| 6 | B | Bottom/Mori | मोहरी |
| 7 | NA | Naada Type | नाड़ा |

### 5.2 Visual Garment Icons

```
┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐
│  🧥    │  │  👔    │  │  👖    │  │  👕    │
│  Coat  │  │ Blazer │  │  Pant  │  │ Shirt  │
│  कोट   │  │ ब्लेज़र │  │  पैंट  │  │  शर्ट  │
└────────┘  └────────┘  └────────┘  └────────┘

┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐
│  👘    │  │  🩳    │  │  🎽    │  │  👕    │
│ Kurta  │  │ Pyjama │  │Waistcoat│ │ Safari │
│ कुर्ता  │  │ पजामा  │  │वेस्टकोट │  │ सफारी  │
└────────┘  └────────┘  └────────┘  └────────┘
```

---

## 6. Phase-wise Implementation Plan

### 6.1 Phase 1A: Core Digital System (Week 1-2)

**Goal:** Basic working app - upload photos, search, view

#### Features
- [ ] Customer CRUD with soft delete
- [ ] Multiple phones per customer
- [ ] Book management
- [ ] Photo upload (camera/gallery)
- [ ] Auto-compress images before upload
- [ ] Auto-suggest next folio number
- [ ] Warn if folio already exists
- [ ] Search by phone (exact + partial)
- [ ] Search by folio
- [ ] Search by name (fuzzy matching)
- [ ] Customer preview on phone entry
- [ ] Zoomable bill image view
- [ ] Customer history grouped by book
- [ ] Responsive design (mobile + laptop)
- [ ] High contrast mode toggle

#### Technical Tasks
```
Week 1:
├── Database setup (PostgreSQL)
├── Backend API (Node.js + Express)
│   ├── Customer APIs
│   ├── Phone APIs
│   ├── Book APIs
│   ├── Bill APIs
│   └── Search APIs
├── Frontend setup (React)
│   ├── Home screen
│   ├── Search component
│   └── Customer list

Week 2:
├── Photo handling
│   ├── Camera integration
│   ├── Client-side compression
│   ├── Upload to server
│   └── Thumbnail generation
├── Bill management screens
├── Customer history view
├── High contrast mode CSS
└── Testing on mobile
```

### 6.2 Phase 1B: Safety & Polish (Week 3)

**Goal:** Error prevention, security basics, duplicate handling

#### Features
- [ ] Duplicate customer detection (fuzzy name + area)
- [ ] Merge duplicate customers
- [ ] PIN-based access (4-digit)
- [ ] Owner vs Helper roles
- [ ] Soft delete for all records
- [ ] Audit log for edits
- [ ] Restore deleted records
- [ ] Form validation
- [ ] Error handling & user feedback

#### Duplicate Detection Logic
```
When adding new customer:
1. Check exact phone match → Existing customer found
2. Check fuzzy name match (>80% similarity) in same area
   → Show "Possible duplicate" warning
3. Let user choose: Merge or Create New
```

### 6.3 Phase 2A: Smart OCR (Week 4-5)

**Goal:** Auto-extract data from bill photos using free tools

#### Features
- [ ] Image preprocessing pipeline
- [ ] PaddleOCR integration (Hindi + English)
- [ ] Fraction/shorthand sanitizer
- [ ] Pattern matching (phone, date, amounts)
- [ ] Confidence scoring
- [ ] Store raw extraction as backup
- [ ] Background processing queue
- [ ] Bulk upload mode for old books

#### Image Processing Pipeline
```
INPUT: Any photo (handheld, angled, variable lighting)
         ↓
┌─────────────────────────────────────────────┐
│ PREPROCESSING (OpenCV)                      │
│ • Auto-rotate (detect orientation)          │
│ • Perspective correction (deskew)           │
│ • Adaptive brightness/contrast              │
│ • Shadow removal                            │
│ • Denoise                                   │
│ • Sharpen text regions                      │
└─────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────┐
│ OCR (PaddleOCR)                             │
│ • Detect text regions                       │
│ • Extract text (Hindi + English)            │
│ • Return with confidence scores             │
└─────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────┐
│ POST-PROCESSING                             │
│ • Fraction sanitizer (37½ → 37.5)          │
│ • Pattern matching (phone, dates)           │
│ • Map to measurement fields                 │
│ • Calculate confidence levels               │
└─────────────────────────────────────────────┘
         ↓
OUTPUT: Structured data with confidence scores
```

#### Fraction Sanitizer
```python
def sanitize_measurement(raw_text):
    """Convert tailor shorthand to decimals."""
    conversions = {
        r'(\d+)\s*[/-]\s*2': r'\1.5',     # 37-2 → 37.5
        r'(\d+)\s*½': r'\1.5',             # 37½ → 37.5
        r'(\d+)\s*[/-]\s*4': r'\1.25',    # 37-4 → 37.25
        r'(\d+)\s*¼': r'\1.25',            # 37¼ → 37.25
        r'(\d+)\s*[/-]\s*34': r'\1.75',   # 37-34 → 37.75
        r'(\d+)\s*¾': r'\1.75',            # 37¾ → 37.75
    }
    # Apply all conversions
    result = raw_text
    for pattern, replacement in conversions.items():
        result = re.sub(pattern, replacement, result)
    return result
```

### 6.4 Phase 2B: Hybrid Entry (Week 6)

**Goal:** Seamless mix of auto + manual + voice input

#### Features
- [ ] Confidence indicators (🟢🟡🔴)
- [ ] Auto-fill high confidence fields
- [ ] Editable fields for corrections
- [ ] Voice input button for each field
- [ ] Standard measurement forms
- [ ] "Unknown values" bucket
- [ ] Tap-to-map: Image region → Field
- [ ] Verification workflow
- [ ] Copy measurements from previous bill

#### Confidence Levels
| Level | Score | Display | Action |
|-------|-------|---------|--------|
| High | >80% | 🟢 Green | Auto-fill, no review needed |
| Medium | 50-80% | 🟡 Yellow | Auto-fill, suggest review |
| Low | <50% | 🔴 Red | Leave empty, manual/voice entry |

#### Voice Input
```
User taps 🎤 button next to "Chest" field
       ↓
System listens...
       ↓
User says: "thirty seven point five"
           OR "सैंतीस पॉइंट फाइव"
       ↓
System fills: 37.5
```

### 6.5 Phase 3: QR & Printing (Future)

**Goal:** Customer-facing features

#### Features
- [ ] Generate QR code per bill
- [ ] Customer tracking page (public, no login)
- [ ] Order status updates
- [ ] Thermal printer integration
- [ ] Print receipt with QR
- [ ] Print garment tags
- [ ] Print measurement cards

### 6.6 Phase 4: Business Intelligence (Future)

**Goal:** Dashboards and insights

#### Features
- [ ] Today's deliveries
- [ ] Overdue orders
- [ ] Pending payments
- [ ] Daily/monthly reports
- [ ] Customer statistics
- [ ] SMS/WhatsApp reminders

### 6.7 Phase 5: Custom ML (Future)

**Goal:** Higher accuracy through training

#### Approach
1. Collect 200-500 labeled bill images
2. Train custom model on shop's specific format
3. Fine-tune for tailor's handwriting
4. Deploy locally for offline use

---

## 7. User Interface Designs

### 7.1 Home Screen

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│   🦅 Eagle Tailors                                              │
│      ईगल टेलर्स, मेरठ                                           │
│                                                         [🌙/☀️] │ ← Dark/Light mode
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  🔍  Search phone, folio, or name...                   │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│   ┌────────────────────┐    ┌────────────────────┐              │
│   │                    │    │                    │              │
│   │   📷              │    │   👤              │              │
│   │   Upload Bill      │    │   New Customer     │              │
│   │   बिल अपलोड        │    │   नया ग्राहक        │              │
│   │                    │    │                    │              │
│   └────────────────────┘    └────────────────────┘              │
│                                                                  │
│   ┌────────────────────┐    ┌────────────────────┐              │
│   │                    │    │                    │              │
│   │   📚              │    │   📊              │              │
│   │   Books            │    │   Deliveries       │              │
│   │   किताबें          │    │   डिलीवरी          │              │
│   │                    │    │                    │              │
│   └────────────────────┘    └────────────────────┘              │
│                                                                  │
│   ─────────────────────────────────────────────────────────     │
│   📖 Current Book: 2025-26                                      │
│   📄 Next Folio: 2342                                           │
│   👥 Total Customers: 1,247                                     │
│   ─────────────────────────────────────────────────────────     │
│                                                                  │
│   Recent Uploads:                                                │
│   ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐                              │
│   │2341 │ │2340 │ │2339 │ │2338 │                              │
│   └─────┘ └─────┘ └─────┘ └─────┘                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 7.2 Upload Bill Screen

```
┌─────────────────────────────────────────────────────────────────┐
│  ←  Upload Bill / बिल अपलोड करें                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                                                         │   │
│   │              📷  Take Photo / फोटो लें                  │   │
│   │                                                         │   │
│   │              ─────── OR / या ───────                   │   │
│   │                                                         │   │
│   │              🖼️  Choose from Gallery                   │   │
│   │                  गैलरी से चुनें                          │   │
│   │                                                         │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│   Folio Number / फोलियो नंबर *                                  │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  2342                                          [Auto]  │   │
│   └─────────────────────────────────────────────────────────┘   │
│   💡 Auto-suggested. Change only if different.                  │
│                                                                  │
│   Phone Number / फोन नंबर *                                     │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  9412038234                                             │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ ✓ Customer Found / ग्राहक मिला:                         │   │
│   │   👤 Rishu Lal                                          │   │
│   │   📍 Sadar Bazar                                        │   │
│   │   📜 Previous: #2105 (Dec 2025), #1856 (Aug 2024)      │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│   Bill Date / बिल तिथि                                          │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  27/01/2026                                     📅      │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│   Delivery Date / डिलीवरी तिथि                                  │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  03/02/2026                                     📅      │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                                                         │   │
│   │                   💾  SAVE / सेव करें                   │   │
│   │                                                         │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 7.3 Search Results Screen

```
┌─────────────────────────────────────────────────────────────────┐
│  ←  Search Results                                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   👤 Ankur Mittal                                     [Edit]    │
│   📞 9837311191, 9412345678                                     │
│   📍 123, Sadar Bazar, Meerut                                   │
│                                                                  │
│   ─────────────────────────────────────────────────────────     │
│                                                                  │
│   📖 2025-26 (Current)                               2 bills    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ ┌─────┐                                                 │   │
│   │ │ 📷  │  #2320 │ 18 Jan 2026                           │   │
│   │ │     │  Coat, Pant │ ₹2,500                           │   │
│   │ └─────┘  Due: 29 Jan │ Status: 🟡 Stitching            │   │
│   │          Balance: ₹1,000                                │   │
│   ├─────────────────────────────────────────────────────────┤   │
│   │ ┌─────┐                                                 │   │
│   │ │ 📷  │  #2105 │ 05 Dec 2025                           │   │
│   │ │     │  2 Shirts │ ₹800                               │   │
│   │ └─────┘  ✅ Delivered                                   │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│   📖 2024-25                                          1 bill    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ ┌─────┐                                                 │   │
│   │ │ 📷  │  #1856 │ 15 Aug 2024                           │   │
│   │ │     │  Kurta Pyjama │ ₹1,200                         │   │
│   │ └─────┘  ✅ Delivered                                   │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│   📖 2023-24                                          1 bill    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ ┌─────┐                                                 │   │
│   │ │ 📷  │  #0245 │ 10 Nov 2023                           │   │
│   │ │     │  Blazer │ ₹1,800                               │   │
│   │ └─────┘  ✅ Delivered                                   │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│   ─────────────────────────────────────────────────────────     │
│   Total: 5 bills │ Value: ₹6,300 │ Customer since: Nov 2023    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 7.4 Hybrid Entry Screen (Phase 2)

```
┌─────────────────────────────────────────────────────────────────┐
│  ←  Extract Data / डेटा निकालें                     #2342      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────┐  ┌───────────────────────────────────┐ │
│  │                    │  │ BILL INFO                         │ │
│  │   [Bill Image]     │  │                                   │ │
│  │   Tap to zoom      │  │ Name:  [Rishu Lal       ] 🟢     │ │
│  │                    │  │ Phone: [9412038234     ] 🟢      │ │
│  │                    │  │ Folio: [2342           ] 🟢      │ │
│  │                    │  │ Date:  [27/01/2026     ] 🟡      │ │
│  └────────────────────┘  │ Deliv: [03/02/2026     ] 🔴 [🎤] │ │
│                          └───────────────────────────────────┘ │
│  🟢 Auto-detected  🟡 Please verify  🔴 Enter manually        │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│  📏 MEASUREMENTS                          [+ Add Garment ▼]    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ▼ 👕 SHIRT (शर्ट)                                    [🗑️]    │
│  ┌──────┬──────┬──────┬──────┬──────┬──────┬──────┬──────┐    │
│  │  L   │  CH  │  W   │  SH  │  SL  │  SR  │  N   │  CF  │    │
│  │लम्बाई│ छाती │ कमर  │ कंधा │आस्तीन│ गोल  │ गला  │  कफ  │    │
│  ├──────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┤    │
│  │ 28   │ 37.5 │ 36   │ 17   │ 15.5 │      │      │      │    │
│  │ 🟢   │ 🟢   │ 🟢   │ 🟡   │ 🟢   │ 🔴   │ 🔴   │ 🔴   │    │
│  │      │      │      │      │      │ [🎤] │ [🎤] │ [🎤] │    │
│  └──────┴──────┴──────┴──────┴──────┴──────┴──────┴──────┘    │
│  Remarks: [शर्ट नोर्मल फिटिंग                          ] 🟡   │
│                                                                  │
│  ▼ 👖 PANT (पैंट)                                     [🗑️]    │
│  ┌──────┬──────┬──────┬──────┬──────┬──────┬──────┐           │
│  │  L   │  W   │  H   │  TH  │  K   │  B   │  F   │           │
│  │लम्बाई│ कमर  │ सीट  │ जांघ │घुटना │मोहरी │फोर्क │           │
│  ├──────┼──────┼──────┼──────┼──────┼──────┼──────┤           │
│  │ 40   │ 34   │ 42   │      │      │ 17   │      │           │
│  │ 🟢   │ 🟢   │ 🟡   │ 🔴   │ 🔴   │ 🟢   │ 🔴   │           │
│  └──────┴──────┴──────┴──────┴──────┴──────┴──────┘           │
│                                                                  │
│  📦 Unknown Values (couldn't map):                              │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  "23", "EVD", "side cut"                                │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│  💰 BILLING                                                     │
│  ┌──────────────┬──────────────┬──────────────┐                │
│  │ Total (योग)  │Advance(अग्रिम)│Balance(बकाया)│                │
│  │ ₹2,500  🟢  │ ₹1,500  🟡  │ ₹1,000       │                │
│  └──────────────┴──────────────┴──────────────┘                │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│  📝 SPECIAL REMARKS                                             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ टेढ़ा कंधा - left side adjust                           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │               ✅ VERIFY & SAVE / सेव करें               │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 7.5 High Contrast Mode

```
┌─────────────────────────────────────────────────────────────────┐
│█████████████████████████████████████████████████████████████████│
│█                                                               █│
│█   🦅 EAGLE TAILORS                                    [☀️]   █│
│█                                                               █│
│█   ┌───────────────────────────────────────────────────────┐  █│
│█   │  🔍  SEARCH...                                       │  █│
│█   └───────────────────────────────────────────────────────┘  █│
│█                                                               █│
│█   SHIRT MEASUREMENTS:                                         █│
│█   ┌────────────────────────────────────────────────────────┐ █│
│█   │                                                        │ █│
│█   │   L: 28    CH: 37.5    W: 36    SH: 17               │ █│
│█   │                                                        │ █│
│█   │   SL: 15.5    N: 16    CF: 9                         │ █│
│█   │                                                        │ █│
│█   └────────────────────────────────────────────────────────┘ █│
│█                                                               █│
│█   (Large text, high contrast - readable from 3 feet)         █│
│█                                                               █│
│█████████████████████████████████████████████████████████████████│
└─────────────────────────────────────────────────────────────────┘
```

---

## 8. Smart Image Processing

### 8.1 Philosophy: Software Adapts, Not User

We do NOT require:
- ❌ Photo stands
- ❌ Fixed lighting
- ❌ Specific angles
- ❌ Special equipment

Instead, software handles real-world conditions:
- ✅ Handheld, shaky photos
- ✅ Various angles
- ✅ Different lighting
- ✅ Shadows, reflections
- ✅ Slightly blurry

### 8.2 Processing Pipeline

```python
import cv2
import numpy as np

def process_bill_image(image_path):
    """
    Process any real-world bill photo for optimal OCR.
    Handles: rotation, skew, lighting, shadows, blur.
    """
    
    # Read image
    img = cv2.imread(image_path)
    
    # 1. AUTO-ROTATE (detect if upside down or sideways)
    # Using text orientation detection
    
    # 2. PERSPECTIVE CORRECTION (deskew angled shots)
    # Detect bill edges and transform to rectangle
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    edges = cv2.Canny(gray, 50, 150)
    contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, 
                                    cv2.CHAIN_APPROX_SIMPLE)
    # Find largest rectangle and transform
    
    # 3. ADAPTIVE BRIGHTNESS/CONTRAST
    # Handle variable lighting
    lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
    l = clahe.apply(l)
    img = cv2.merge([l, a, b])
    img = cv2.cvtColor(img, cv2.COLOR_LAB2BGR)
    
    # 4. SHADOW REMOVAL
    # Using morphological operations
    dilated = cv2.dilate(gray, np.ones((7,7), np.uint8))
    bg = cv2.medianBlur(dilated, 21)
    diff = 255 - cv2.absdiff(gray, bg)
    
    # 5. DENOISE
    denoised = cv2.fastNlMeansDenoising(diff, None, 10, 7, 21)
    
    # 6. SHARPEN TEXT REGIONS
    kernel = np.array([[-1,-1,-1], [-1,9,-1], [-1,-1,-1]])
    sharpened = cv2.filter2D(denoised, -1, kernel)
    
    # 7. BINARIZE (black text on white background)
    _, binary = cv2.threshold(sharpened, 0, 255, 
                               cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    
    return binary
```

### 8.3 Multiple OCR Passes

If first pass has low confidence:
1. Try different preprocessing parameters
2. Try EasyOCR as fallback
3. Return best result

```python
def extract_with_fallback(image_path):
    """Try multiple OCR approaches for best results."""
    
    results = []
    
    # Pass 1: PaddleOCR with default preprocessing
    result1 = paddle_ocr(preprocess_default(image_path))
    results.append(result1)
    
    # Pass 2: PaddleOCR with aggressive preprocessing
    result2 = paddle_ocr(preprocess_aggressive(image_path))
    results.append(result2)
    
    # Pass 3: EasyOCR as fallback
    result3 = easy_ocr(image_path)
    results.append(result3)
    
    # Return result with highest overall confidence
    return max(results, key=lambda r: r['avg_confidence'])
```

### 8.4 Client-Side Image Compression

Before upload, compress on phone to save storage and bandwidth:

```javascript
async function compressImage(file, maxWidth = 1920, quality = 0.85) {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = () => {
            let width = img.width;
            let height = img.height;
            
            // Resize if too large
            if (width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
            }
            
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
            
            // Compress to JPEG
            canvas.toBlob(resolve, 'image/jpeg', quality);
        };
        
        img.src = URL.createObjectURL(file);
    });
}

// Results:
// Original: 4-8 MB (phone camera)
// Compressed: 300-500 KB
// Quality: Still good for OCR
// Storage savings: 90%+
```

---

## 9. QR Code & Thermal Printing

### 9.1 QR Code Workflow (Phase 3+)

```
┌─────────────────────────────────────────────────────────────────┐
│                    QR CODE SYSTEM                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   STEP 1: Bill Created                                          │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ System generates unique tracking URL:                   │   │
│   │ https://eagle.local/track/2342-x7k9m2                  │   │
│   │                                                         │   │
│   │ QR code encodes this URL                               │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│   STEP 2: Receipt Printed                                       │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  ┌─────────────────────────────────────────────┐       │   │
│   │  │  🦅 EAGLE TAILORS                           │       │   │
│   │  │  ─────────────────────────────              │       │   │
│   │  │  Bill No: 2342                              │       │   │
│   │  │  Name: Ankur Mittal                         │       │   │
│   │  │  Date: 27/01/2026                           │       │   │
│   │  │  Items: Coat, Pant                          │       │   │
│   │  │  Delivery: 03/02/2026                       │       │   │
│   │  │  ─────────────────────────────              │       │   │
│   │  │  Total: ₹2,500                              │       │   │
│   │  │  Paid:  ₹1,500                              │       │   │
│   │  │  Due:   ₹1,000                              │       │   │
│   │  │  ─────────────────────────────              │       │   │
│   │  │       ┌─────────┐                           │       │   │
│   │  │       │▓▓▓▓▓▓▓▓▓│  Scan to track           │       │   │
│   │  │       │▓▓▓▓▓▓▓▓▓│  your order              │       │   │
│   │  │       │▓▓▓▓▓▓▓▓▓│                          │       │   │
│   │  │       └─────────┘                           │       │   │
│   │  │  ─────────────────────────────              │       │   │
│   │  │  Thank you! धन्यवाद!                        │       │   │
│   │  └─────────────────────────────────────────────┘       │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│   STEP 3: Customer Scans at Home                                │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                                                         │   │
│   │  🦅 Eagle Tailors - Order #2342                        │   │
│   │  ─────────────────────────────                         │   │
│   │                                                         │   │
│   │  Customer: Ankur Mittal                                 │   │
│   │  Items: Coat, Pant                                      │   │
│   │                                                         │   │
│   │  STATUS:                                                │   │
│   │  ✅ Order Placed      - 27 Jan 2026                    │   │
│   │  ✅ Cutting Complete  - 28 Jan 2026                    │   │
│   │  🔄 Stitching         - In Progress                    │   │
│   │  ⏳ Finishing         - Pending                        │   │
│   │  ⏳ Ready for Pickup  - Expected: 03 Feb               │   │
│   │                                                         │   │
│   │  ─────────────────────────────                         │   │
│   │  Balance Due: ₹1,000                                   │   │
│   │  ─────────────────────────────                         │   │
│   │  📞 Questions? Call: 2660605                           │   │
│   │                                                         │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 9.2 Thermal Printer Options

| Printer | Price (₹) | Features |
|---------|-----------|----------|
| Generic 58mm USB | 2,000-3,000 | Basic, reliable |
| Generic 58mm Bluetooth | 2,500-4,000 | Wireless |
| Generic 80mm | 4,000-6,000 | Wider receipts |
| EPSON TM-T82 | 8,000-12,000 | Professional grade |

**Recommended:** Generic 58mm Bluetooth (₹3,000-4,000)
- Works with phone and laptop
- No cables needed
- Good quality for receipts

### 9.3 Print Types

| Type | Use Case | Size |
|------|----------|------|
| **Customer Receipt** | Give to customer with QR | 58mm x ~100mm |
| **Garment Tag** | Attach to garment | 58mm x ~30mm |
| **Measurement Card** | Tailor reference | 58mm x ~80mm |

**Garment Tag:**
```
┌─────────────────────┐
│ #2342 | COAT        │
│ Ankur M | 03 Feb    │
│ Balance: ₹1,000     │
└─────────────────────┘
```

---

## 10. Data Safety & Backup

### 10.1 Backup Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│                    BACKUP SYSTEM                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   AUTOMATIC (Daily):                                             │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                                                         │   │
│   │   Every night at 2 AM:                                 │   │
│   │   1. Database exported to SQL file                     │   │
│   │   2. Images folder compressed                          │   │
│   │   3. Backup saved to: /backups/YYYY-MM-DD/            │   │
│   │   4. Keep last 30 days of backups                      │   │
│   │   5. Auto-delete older backups                         │   │
│   │                                                         │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│   EXTERNAL (Weekly - Manual):                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                                                         │   │
│   │   Every Sunday:                                        │   │
│   │   1. Plug in USB drive                                 │   │
│   │   2. Click "Backup to USB" button                      │   │
│   │   3. System copies latest backup to USB                │   │
│   │   4. Store USB in different location (fire safety)     │   │
│   │                                                         │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│   CLOUD (Optional):                                              │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                                                         │   │
│   │   If internet available:                               │   │
│   │   1. Click "Sync to Cloud" button                      │   │
│   │   2. Uploads encrypted backup to Google Drive          │   │
│   │   3. Uses owner's personal Google account              │   │
│   │   4. Free up to 15 GB                                  │   │
│   │                                                         │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│   RESTORE:                                                       │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                                                         │   │
│   │   If laptop crashes:                                   │   │
│   │   1. Install system on new laptop                      │   │
│   │   2. Click "Restore from USB/Cloud"                    │   │
│   │   3. Select backup date                                │   │
│   │   4. System restores database + images                 │   │
│   │   5. Back in business in 30 minutes                    │   │
│   │                                                         │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 10.2 Storage Estimation

| Item | Size per Unit | Monthly Volume | Monthly Storage |
|------|---------------|----------------|-----------------|
| Bill Image | 400 KB (compressed) | 200 bills | 80 MB |
| Thumbnail | 20 KB | 200 bills | 4 MB |
| Database | - | - | ~10 MB |
| **Total** | - | - | **~100 MB/month** |

**Annual:** ~1.2 GB
**5 Years:** ~6 GB

A basic 256 GB laptop can store 40+ years of data.

---

## 11. Security & Access Control

### 11.1 PIN-Based Access

Simple 4-digit PIN (no complex passwords):

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│                    🦅 Eagle Tailors                             │
│                                                                  │
│                    Enter PIN / पिन डालें                         │
│                                                                  │
│                    ┌─┐ ┌─┐ ┌─┐ ┌─┐                             │
│                    │●│ │●│ │●│ │ │                             │
│                    └─┘ └─┘ └─┘ └─┘                             │
│                                                                  │
│                    ┌───┐ ┌───┐ ┌───┐                           │
│                    │ 1 │ │ 2 │ │ 3 │                           │
│                    └───┘ └───┘ └───┘                           │
│                    ┌───┐ ┌───┐ ┌───┐                           │
│                    │ 4 │ │ 5 │ │ 6 │                           │
│                    └───┘ └───┘ └───┘                           │
│                    ┌───┐ ┌───┐ ┌───┐                           │
│                    │ 7 │ │ 8 │ │ 9 │                           │
│                    └───┘ └───┘ └───┘                           │
│                          ┌───┐                                  │
│                          │ 0 │                                  │
│                          └───┘                                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 11.2 Roles & Permissions

| Action | Owner | Helper |
|--------|-------|--------|
| Search customers | ✅ | ✅ |
| View bills | ✅ | ✅ |
| Upload new bill | ✅ | ✅ |
| Add customer | ✅ | ✅ |
| Edit customer | ✅ | ❌ |
| Delete anything | ✅ | ❌ |
| Restore deleted | ✅ | ❌ |
| View audit log | ✅ | ❌ |
| Manage users | ✅ | ❌ |
| Backup/Restore | ✅ | ❌ |
| Settings | ✅ | ❌ |

### 11.3 Audit Log

Every change is logged:

```
┌─────────────────────────────────────────────────────────────────┐
│  Audit Log / बदलाव रिकॉर्ड                                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  27 Jan 2026, 4:32 PM                                           │
│  User: Owner (PIN: 1234)                                        │
│  Action: Edited Customer                                         │
│  Customer: Ankur Mittal                                          │
│  Change: Phone added (9876543210)                               │
│                                                                  │
│  ─────────────────────────────────────────────────────────      │
│                                                                  │
│  27 Jan 2026, 3:15 PM                                           │
│  User: Helper (PIN: 5678)                                       │
│  Action: Uploaded Bill                                           │
│  Bill: #2342 for Rishu Lal                                      │
│                                                                  │
│  ─────────────────────────────────────────────────────────      │
│                                                                  │
│  27 Jan 2026, 11:20 AM                                          │
│  User: Owner (PIN: 1234)                                        │
│  Action: Deleted Bill (Soft)                                    │
│  Bill: #2340 (marked as deleted, recoverable)                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 11.4 Soft Delete

Nothing is permanently deleted immediately:

```
When user clicks "Delete":
1. Record marked as is_deleted = true
2. Record hidden from normal views
3. Record kept in database for 90 days
4. Owner can restore from "Deleted Items"
5. After 90 days: Permanent deletion (optional)
```

---

## 12. Deployment Strategy

### 12.1 Phase 1: Local Deployment (Recommended)

```
┌─────────────────────────────────────────────────────────────────┐
│                    LOCAL DEPLOYMENT                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   SHOP LAPTOP                                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                                                         │   │
│   │   PostgreSQL Database                                   │   │
│   │         ↓                                               │   │
│   │   Node.js Backend (port 3001)                          │   │
│   │         ↓                                               │   │
│   │   React Frontend (port 3000)                           │   │
│   │         ↓                                               │   │
│   │   Images: /home/eagle/uploads/                         │   │
│   │   Backups: /home/eagle/backups/                        │   │
│   │                                                         │   │
│   │   Access: http://localhost:3000                        │   │
│   │                                                         │   │
│   └─────────────────────────────────────────────────────────┘   │
│                     │                                            │
│                     │ Same WiFi Network                          │
│                     ▼                                            │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │   MOBILE PHONE                                          │   │
│   │   Access: http://192.168.1.X:3000                      │   │
│   │   (Laptop's local IP address)                          │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│   ✅ Benefits:                                                   │
│   • No hosting cost                                             │
│   • No internet required                                        │
│   • Data stays in shop                                          │
│   • Fast performance                                            │
│   • Full privacy                                                │
│                                                                  │
│   ⚠️ Requirements:                                               │
│   • Laptop must be ON to use                                    │
│   • Phone must be on same WiFi                                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 12.2 Future: Cloud Deployment (Optional)

If remote access needed later:

| Service | Free Tier | Paid |
|---------|-----------|------|
| Database: Supabase | 500 MB | ₹500/mo |
| Backend: Railway | 500 hours/mo | ₹300/mo |
| Frontend: Vercel | Unlimited | Free |
| Images: Cloudinary | 25 GB | ₹500/mo |

**Estimated cloud cost:** ₹800-1,500/month

---

## 13. Owner Quick Reference (1-Page)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│   🦅 EAGLE TAILORS - QUICK GUIDE / त्वरित गाइड                  │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   📷 UPLOAD NEW BILL / नया बिल अपलोड                            │
│   ─────────────────────────────────────────                     │
│   1. Click "Upload Bill" button                                 │
│   2. Take photo of bill                                         │
│   3. Enter phone number                                         │
│   4. Folio number auto-fills                                    │
│   5. Click SAVE                                                 │
│                                                                  │
│   🔍 SEARCH CUSTOMER / ग्राहक खोजें                              │
│   ─────────────────────────────────────────                     │
│   • Type phone number (full or partial)                         │
│   • OR type folio number                                        │
│   • OR type customer name                                       │
│   • Results show instantly                                      │
│                                                                  │
│   👤 NEW CUSTOMER / नया ग्राहक                                   │
│   ─────────────────────────────────────────                     │
│   • If phone not found, system asks to create                   │
│   • Enter name and address                                      │
│   • Can add multiple phone numbers later                        │
│                                                                  │
│   📱 USING ON PHONE / फोन पर उपयोग                               │
│   ─────────────────────────────────────────                     │
│   • Connect to shop WiFi                                        │
│   • Open browser                                                │
│   • Go to: 192.168.1.X:3000                                    │
│   • (Ask for exact address)                                     │
│                                                                  │
│   💾 BACKUP / बैकअप                                              │
│   ─────────────────────────────────────────                     │
│   • Automatic every night                                       │
│   • Weekly: Plug USB, click "Backup to USB"                    │
│                                                                  │
│   ❓ PROBLEM? / समस्या?                                          │
│   ─────────────────────────────────────────                     │
│   • Restart the laptop                                          │
│   • Check WiFi connection                                       │
│   • Contact support                                             │
│                                                                  │
│   🔐 PINs:                                                       │
│   • Owner: ____                                                 │
│   • Helper: ____                                                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 14. Cost Analysis

### 14.1 One-Time Costs

| Item | Cost (₹) | Required? |
|------|----------|-----------|
| Development | Your time | Yes |
| Laptop (if new) | 25,000-35,000 | If not available |
| USB Drive (128GB) | 500-800 | Yes (for backup) |
| **Phase 1 Total** | **500-800** | - |
| Thermal Printer | 3,000-4,000 | Phase 3+ |
| Thermal Paper (10 rolls) | 300-400 | Phase 3+ |

### 14.2 Monthly Recurring Costs

| Item | Cost (₹) |
|------|----------|
| Hosting | 0 (local) |
| OCR | 0 (free tools) |
| Cloud backup | 0 (Google Drive free) |
| **Total Monthly** | **₹0** |

### 14.3 Comparison with Alternatives

| Solution | Setup | Monthly | Customization |
|----------|-------|---------|---------------|
| **This System** | ₹800 | ₹0 | Full |
| Generic Tailor Software | ₹5,000-15,000 | ₹500-1,000 | Limited |
| Cloud AI OCR | - | ₹2,000-5,000 | Limited |
| Manual Only | ₹0 | ₹0 | None |

---

## 15. Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Laptop dies** | High | USB backup weekly, cloud backup optional |
| **Wrong folio entered** | Medium | Auto-suggest, warn if exists |
| **Duplicate customers** | Medium | Fuzzy matching, merge feature |
| **OCR accuracy low** | Medium | Hybrid mode, voice input fallback |
| **Staff resistance** | Medium | Parallel operation, no workflow change |
| **Accidental deletion** | Medium | Soft delete, 90-day recovery |
| **Unauthorized access** | Low | PIN protection, audit log |
| **Storage full** | Low | Image compression, 40+ years capacity |

---

## 16. Appendix

### A. Glossary

| Term | Meaning |
|------|---------|
| Folio Number | Serial number on bill (2341, 2342...) |
| Index Book | Alphabetical customer directory |
| Ledger/Bill Book | Main book with measurements and orders |
| OCR | Optical Character Recognition (reading text from images) |
| Soft Delete | Marking as deleted but keeping in database |
| Fuzzy Match | Finding similar names even with spelling differences |

### B. Sample JSON Structures

**Customer:**
```json
{
  "id": "uuid",
  "name": "Ankur Mittal",
  "address": "123, Sadar Bazar, Meerut",
  "phones": [
    {"phone": "9837311191", "is_primary": true},
    {"phone": "9412345678", "is_primary": false}
  ]
}
```

**Bill:**
```json
{
  "id": "uuid",
  "folio_number": 2342,
  "customer_id": "customer-uuid",
  "book_id": "book-uuid",
  "bill_date": "2026-01-27",
  "delivery_date": "2026-02-03",
  "total_amount": 2500,
  "advance_paid": 1500,
  "balance_due": 1000,
  "status": "stitching",
  "measurements": [
    {
      "garment_type": "shirt",
      "measurements": {"L": 28, "CH": 37.5, "W": 36, "SH": 17},
      "confidence": {"L": 95, "CH": 88, "W": 92, "SH": 75},
      "remarks": "नोर्मल फिटिंग"
    }
  ]
}
```

### C. Hardware Requirements

**Minimum:**
- Laptop: Any with 4GB RAM, 128GB storage
- Phone: Any Android/iPhone with camera
- WiFi: Any home router

**Recommended:**
- Laptop: 8GB RAM, 256GB SSD
- Phone: Good camera (12MP+)
- WiFi: Dual-band router

---

## Document History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 27 Jan 2026 | Initial document |
| 1.1 | 27 Jan 2026 | Added: QR codes, thermal printing, backup strategy, security, duplicate detection, voice input, high contrast mode, expert feedback incorporation |

---

**Core Principle:**

> **"This system never replaces your book. It only helps you find it faster."**

---

*Document prepared for Eagle Tailors, Meerut*
*Confidential - Internal Use Only*
