-- Eagle Tailors Database Schema
-- Version: 1.0
-- Date: 2026-01-27

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For fuzzy text search

-- ============================================================================
-- USERS TABLE
-- ============================================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    pin_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('owner', 'helper')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- CUSTOMERS TABLE
-- ============================================================================
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    address TEXT,
    notes TEXT,
    is_deleted BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

-- Index for fuzzy name search
CREATE INDEX idx_customers_name_trgm ON customers USING gin(name gin_trgm_ops);
CREATE INDEX idx_customers_active ON customers(is_deleted) WHERE is_deleted = false;

-- ============================================================================
-- CUSTOMER_PHONES TABLE
-- ============================================================================
CREATE TABLE customer_phones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    phone VARCHAR(15) NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT unique_phone UNIQUE (phone)
);

CREATE INDEX idx_customer_phones_customer_id ON customer_phones(customer_id);
CREATE INDEX idx_customer_phones_phone ON customer_phones(phone);

-- ============================================================================
-- BOOKS TABLE
-- ============================================================================
CREATE TABLE books (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    start_serial INTEGER NOT NULL,
    end_serial INTEGER,
    is_current BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Ensure only one current book
CREATE UNIQUE INDEX idx_books_current ON books(is_current) WHERE is_current = true;

-- ============================================================================
-- GARMENT_TYPES TABLE
-- ============================================================================
CREATE TABLE garment_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    name_hindi VARCHAR(100),
    field_sequence JSONB NOT NULL, -- Array of field definitions
    icon VARCHAR(50),
    display_order INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- BILLS TABLE
-- ============================================================================
CREATE TABLE bills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
    balance_due DECIMAL(10,2) GENERATED ALWAYS AS (total_amount - COALESCE(advance_paid, 0)) STORED,
    status VARCHAR(20) DEFAULT 'pending',
    remarks TEXT,
    extraction_status VARCHAR(20) DEFAULT 'pending',
    raw_extraction JSONB,
    is_deleted BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),

    CONSTRAINT unique_folio_per_book UNIQUE (book_id, folio_number),
    CONSTRAINT valid_status CHECK (status IN
        ('pending', 'cutting', 'stitching', 'ready', 'delivered', 'cancelled')),
    CONSTRAINT valid_extraction_status CHECK (extraction_status IN
        ('pending', 'processing', 'completed', 'failed', 'manual'))
);

CREATE INDEX idx_bills_customer_id ON bills(customer_id);
CREATE INDEX idx_bills_book_id ON bills(book_id);
CREATE INDEX idx_bills_folio_number ON bills(folio_number);
CREATE INDEX idx_bills_status ON bills(status) WHERE is_deleted = false;
CREATE INDEX idx_bills_delivery_date ON bills(delivery_date) WHERE is_deleted = false;

-- ============================================================================
-- BILL_MEASUREMENTS TABLE
-- ============================================================================
CREATE TABLE bill_measurements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bill_id UUID NOT NULL REFERENCES bills(id) ON DELETE CASCADE,
    garment_type_id UUID REFERENCES garment_types(id),
    garment_name VARCHAR(100),
    measurements JSONB NOT NULL,
    confidence JSONB,
    remarks TEXT,
    unknown_values JSONB,
    is_auto_extracted BOOLEAN DEFAULT false,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_bill_measurements_bill_id ON bill_measurements(bill_id);

-- ============================================================================
-- AUDIT_LOG TABLE
-- ============================================================================
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,
    action VARCHAR(20) NOT NULL CHECK (action IN ('create', 'update', 'delete', 'restore')),
    old_values JSONB,
    new_values JSONB,
    user_id UUID REFERENCES users(id),
    timestamp TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_log_table_record ON audit_log(table_name, record_id);
CREATE INDEX idx_audit_log_timestamp ON audit_log(timestamp DESC);

-- ============================================================================
-- BACKUPS TABLE
-- ============================================================================
CREATE TABLE backups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    backup_type VARCHAR(20) NOT NULL CHECK (backup_type IN ('auto', 'manual', 'usb', 'cloud')),
    file_path VARCHAR(500) NOT NULL,
    size_bytes BIGINT,
    status VARCHAR(20) DEFAULT 'completed',
    created_at TIMESTAMP DEFAULT NOW(),
    created_by UUID REFERENCES users(id)
);

CREATE INDEX idx_backups_created_at ON backups(created_at DESC);

-- ============================================================================
-- SYSTEM_SETTINGS TABLE
-- ============================================================================
CREATE TABLE system_settings (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP DEFAULT NOW(),
    updated_by UUID REFERENCES users(id)
);

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_books_updated_at BEFORE UPDATE ON books
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bills_updated_at BEFORE UPDATE ON bills
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bill_measurements_updated_at BEFORE UPDATE ON bill_measurements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to log changes (audit trail)
CREATE OR REPLACE FUNCTION log_audit()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'DELETE') THEN
        INSERT INTO audit_log(table_name, record_id, action, old_values, user_id)
        VALUES (TG_TABLE_NAME, OLD.id, 'delete', row_to_json(OLD), NULL);
        RETURN OLD;
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO audit_log(table_name, record_id, action, old_values, new_values, user_id)
        VALUES (TG_TABLE_NAME, NEW.id, 'update', row_to_json(OLD), row_to_json(NEW), NEW.updated_by);
        RETURN NEW;
    ELSIF (TG_OP = 'INSERT') THEN
        INSERT INTO audit_log(table_name, record_id, action, new_values, user_id)
        VALUES (TG_TABLE_NAME, NEW.id, 'create', row_to_json(NEW), NEW.created_by);
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Apply audit triggers
CREATE TRIGGER audit_customers AFTER INSERT OR UPDATE OR DELETE ON customers
    FOR EACH ROW EXECUTE FUNCTION log_audit();

CREATE TRIGGER audit_bills AFTER INSERT OR UPDATE OR DELETE ON bills
    FOR EACH ROW EXECUTE FUNCTION log_audit();

-- ============================================================================
-- INITIAL DATA
-- ============================================================================

-- Insert default garment types
INSERT INTO garment_types (name, name_hindi, field_sequence, icon, display_order) VALUES
('SHIRT', 'शर्ट', '[
    {"code": "L", "name": "Length", "name_hindi": "लम्बाई", "order": 1},
    {"code": "CH", "name": "Chest", "name_hindi": "छाती", "order": 2},
    {"code": "W", "name": "Waist", "name_hindi": "कमर", "order": 3},
    {"code": "SH", "name": "Shoulder", "name_hindi": "कंधा", "order": 4},
    {"code": "SL", "name": "Sleeve Length", "name_hindi": "आस्तीन", "order": 5},
    {"code": "SR", "name": "Sleeve Round", "name_hindi": "आस्तीन गोल", "order": 6},
    {"code": "N", "name": "Neck", "name_hindi": "गला", "order": 7},
    {"code": "CF", "name": "Cuff", "name_hindi": "कफ", "order": 8}
]'::jsonb, '👕', 1),

('PANT', 'पैंट', '[
    {"code": "L", "name": "Length", "name_hindi": "लम्बाई", "order": 1},
    {"code": "W", "name": "Waist", "name_hindi": "कमर", "order": 2},
    {"code": "H", "name": "Hip", "name_hindi": "सीट", "order": 3},
    {"code": "TH", "name": "Thigh", "name_hindi": "जांघ", "order": 4},
    {"code": "K", "name": "Knee", "name_hindi": "घुटना", "order": 5},
    {"code": "B", "name": "Bottom", "name_hindi": "मोहरी", "order": 6},
    {"code": "F", "name": "Fork", "name_hindi": "फोर्क", "order": 7}
]'::jsonb, '👖', 2),

('COAT', 'कोट', '[
    {"code": "L", "name": "Length", "name_hindi": "लम्बाई", "order": 1},
    {"code": "CH", "name": "Chest", "name_hindi": "छाती", "order": 2},
    {"code": "W", "name": "Waist", "name_hindi": "कमर", "order": 3},
    {"code": "H", "name": "Hip", "name_hindi": "सीट", "order": 4},
    {"code": "SH", "name": "Shoulder", "name_hindi": "कंधा", "order": 5},
    {"code": "SL", "name": "Sleeve Length", "name_hindi": "आस्तीन", "order": 6},
    {"code": "SR", "name": "Sleeve Round", "name_hindi": "आस्तीन गोल", "order": 7},
    {"code": "N", "name": "Neck", "name_hindi": "गला", "order": 8},
    {"code": "BW", "name": "Back Width", "name_hindi": "पीठ", "order": 9},
    {"code": "CB", "name": "Cross Back", "name_hindi": "क्रॉस बैक", "order": 10},
    {"code": "FO", "name": "Front Open", "name_hindi": "फ्रंट खुला", "order": 11}
]'::jsonb, '🧥', 3),

('BLAZER', 'ब्लेज़र', '[
    {"code": "L", "name": "Length", "name_hindi": "लम्बाई", "order": 1},
    {"code": "CH", "name": "Chest", "name_hindi": "छाती", "order": 2},
    {"code": "W", "name": "Waist", "name_hindi": "कमर", "order": 3},
    {"code": "H", "name": "Hip", "name_hindi": "हिप", "order": 4},
    {"code": "SH", "name": "Shoulder", "name_hindi": "कंधा", "order": 5},
    {"code": "SL", "name": "Sleeve Length", "name_hindi": "आस्तीन", "order": 6},
    {"code": "SR", "name": "Sleeve Round", "name_hindi": "आस्तीन गोल", "order": 7},
    {"code": "BW", "name": "Back Width", "name_hindi": "पीठ", "order": 8},
    {"code": "CB", "name": "Cross Back", "name_hindi": "क्रॉस बैक", "order": 9}
]'::jsonb, '👔', 4),

('KURTA', 'कुर्ता', '[
    {"code": "L", "name": "Length", "name_hindi": "लम्बाई", "order": 1},
    {"code": "CH", "name": "Chest", "name_hindi": "छाती", "order": 2},
    {"code": "W", "name": "Waist", "name_hindi": "कमर", "order": 3},
    {"code": "H", "name": "Hip", "name_hindi": "हिप", "order": 4},
    {"code": "SH", "name": "Shoulder", "name_hindi": "कंधा", "order": 5},
    {"code": "SL", "name": "Sleeve Length", "name_hindi": "आस्तीन", "order": 6},
    {"code": "SR", "name": "Sleeve Round", "name_hindi": "आस्तीन गोल", "order": 7},
    {"code": "N", "name": "Neck Opening", "name_hindi": "गला", "order": 8},
    {"code": "CK", "name": "Slit", "name_hindi": "चाक", "order": 9}
]'::jsonb, '👘', 5),

('PYJAMA', 'पजामा', '[
    {"code": "L", "name": "Length", "name_hindi": "लम्बाई", "order": 1},
    {"code": "W", "name": "Waist", "name_hindi": "कमर", "order": 2},
    {"code": "H", "name": "Hip", "name_hindi": "सीट", "order": 3},
    {"code": "TH", "name": "Thigh", "name_hindi": "जांघ", "order": 4},
    {"code": "K", "name": "Knee", "name_hindi": "घुटना", "order": 5},
    {"code": "B", "name": "Bottom", "name_hindi": "मोहरी", "order": 6},
    {"code": "NA", "name": "Naada Type", "name_hindi": "नाड़ा", "order": 7}
]'::jsonb, '🩳', 6);

-- Insert default system settings
INSERT INTO system_settings (key, value, description) VALUES
('high_contrast_mode', 'false', 'Enable high contrast mode for better visibility'),
('auto_backup_enabled', 'true', 'Enable automatic daily backups'),
('auto_backup_time', '"02:00"', 'Time for automatic backups (24-hour format)'),
('backup_retention_days', '30', 'Number of days to keep backups'),
('ocr_confidence_threshold_high', '80', 'Confidence threshold for high confidence (green)'),
('ocr_confidence_threshold_medium', '50', 'Confidence threshold for medium confidence (yellow)');

-- Create default owner user (PIN: 1234, change after first login)
-- Note: This should be changed via the application after first setup
INSERT INTO users (name, pin_hash, role) VALUES
('Owner', '$2b$10$YourHashedPinHere', 'owner');

COMMENT ON TABLE users IS 'System users with PIN-based authentication';
COMMENT ON TABLE customers IS 'Customer master data with soft delete support';
COMMENT ON TABLE customer_phones IS 'Multiple phone numbers per customer';
COMMENT ON TABLE books IS 'Physical ledger books with folio ranges';
COMMENT ON TABLE bills IS 'Individual bills with measurements and images';
COMMENT ON TABLE bill_measurements IS 'Structured measurement data per garment';
COMMENT ON TABLE garment_types IS 'Standard garment types with measurement templates';
COMMENT ON TABLE audit_log IS 'Complete audit trail of all changes';
COMMENT ON TABLE backups IS 'Backup history tracking';
COMMENT ON TABLE system_settings IS 'Application configuration settings';
