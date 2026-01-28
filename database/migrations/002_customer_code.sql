-- Migration: Add customer_code to customers table
-- Version: 2.0
-- Date: 2026-01-28

-- Add customer_code column
ALTER TABLE customers ADD COLUMN IF NOT EXISTS customer_code VARCHAR(10) UNIQUE;

-- Create sequence for customer code numbers (starting from 1)
CREATE SEQUENCE IF NOT EXISTS customer_code_seq START WITH 1 INCREMENT BY 1;

-- Function to generate customer code like ET-000001
CREATE OR REPLACE FUNCTION generate_customer_code()
RETURNS VARCHAR(10) AS $$
DECLARE
    next_num INTEGER;
    new_code VARCHAR(10);
BEGIN
    next_num := nextval('customer_code_seq');
    new_code := 'ET-' || LPAD(next_num::TEXT, 6, '0');
    RETURN new_code;
END;
$$ LANGUAGE plpgsql;

-- Update existing customers with codes (if any exist without codes)
DO $$
DECLARE
    cust RECORD;
BEGIN
    FOR cust IN SELECT id FROM customers WHERE customer_code IS NULL ORDER BY created_at
    LOOP
        UPDATE customers SET customer_code = generate_customer_code() WHERE id = cust.id;
    END LOOP;
END $$;

-- Create index for fast lookup by customer_code
CREATE INDEX IF NOT EXISTS idx_customers_code ON customers(customer_code);

-- Add trigger to auto-generate code on insert
CREATE OR REPLACE FUNCTION set_customer_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.customer_code IS NULL THEN
        NEW.customer_code := generate_customer_code();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_customer_code ON customers;
CREATE TRIGGER trigger_set_customer_code
    BEFORE INSERT ON customers
    FOR EACH ROW
    EXECUTE FUNCTION set_customer_code();

-- Comment for documentation
COMMENT ON COLUMN customers.customer_code IS 'Unique customer identifier in format ET-XXXXXX';
