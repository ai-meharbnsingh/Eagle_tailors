import { query } from '../config/database.js';

export const CustomerModel = {
  // Create a new customer
  async create({ name, address, notes, createdBy }) {
    const result = await query(
      `INSERT INTO customers (name, address, notes, created_by, updated_by)
       VALUES ($1, $2, $3, $4, $4)
       RETURNING *`,
      [name, address, notes, createdBy]
    );
    return result.rows[0];
  },

  // Get customer by ID
  async findById(id) {
    const result = await query(
      `SELECT c.*,
              json_agg(json_build_object('id', cp.id, 'phone', cp.phone, 'is_primary', cp.is_primary))
              FILTER (WHERE cp.id IS NOT NULL) as phones
       FROM customers c
       LEFT JOIN customer_phones cp ON c.id = cp.customer_id
       WHERE c.id = $1 AND c.is_deleted = false
       GROUP BY c.id`,
      [id]
    );
    return result.rows[0];
  },

  // Search customers by phone
  async findByPhone(phone) {
    const result = await query(
      `SELECT c.*,
              json_agg(json_build_object('id', cp.id, 'phone', cp.phone, 'is_primary', cp.is_primary))
              FILTER (WHERE cp.id IS NOT NULL) as phones
       FROM customers c
       INNER JOIN customer_phones cp ON c.id = cp.customer_id
       WHERE cp.phone LIKE $1 AND c.is_deleted = false
       GROUP BY c.id
       ORDER BY c.name
       LIMIT 20`,
      [`%${phone}%`]
    );
    return result.rows;
  },

  // Fuzzy search by name
  async searchByName(name) {
    const result = await query(
      `SELECT c.*,
              similarity(c.name, $1) as similarity_score,
              json_agg(json_build_object('id', cp.id, 'phone', cp.phone, 'is_primary', cp.is_primary))
              FILTER (WHERE cp.id IS NOT NULL) as phones
       FROM customers c
       LEFT JOIN customer_phones cp ON c.id = cp.customer_id
       WHERE c.is_deleted = false AND similarity(c.name, $1) > 0.3
       GROUP BY c.id
       ORDER BY similarity_score DESC
       LIMIT 20`,
      [name]
    );
    return result.rows;
  },

  // Get all customers with pagination
  async findAll(limit = 50, offset = 0) {
    const result = await query(
      `SELECT c.*,
              json_agg(json_build_object('id', cp.id, 'phone', cp.phone, 'is_primary', cp.is_primary))
              FILTER (WHERE cp.id IS NOT NULL) as phones
       FROM customers c
       LEFT JOIN customer_phones cp ON c.id = cp.customer_id
       WHERE c.is_deleted = false
       GROUP BY c.id
       ORDER BY c.created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    return result.rows;
  },

  // Update customer
  async update(id, { name, address, notes, updatedBy }) {
    const result = await query(
      `UPDATE customers
       SET name = COALESCE($1, name),
           address = COALESCE($2, address),
           notes = COALESCE($3, notes),
           updated_by = $4
       WHERE id = $5 AND is_deleted = false
       RETURNING *`,
      [name, address, notes, updatedBy, id]
    );
    return result.rows[0];
  },

  // Soft delete customer
  async softDelete(id, updatedBy) {
    const result = await query(
      `UPDATE customers
       SET is_deleted = true, updated_by = $2
       WHERE id = $1
       RETURNING *`,
      [id, updatedBy]
    );
    return result.rows[0];
  },

  // Restore deleted customer
  async restore(id, updatedBy) {
    const result = await query(
      `UPDATE customers
       SET is_deleted = false, updated_by = $2
       WHERE id = $1
       RETURNING *`,
      [id, updatedBy]
    );
    return result.rows[0];
  },

  // Find potential duplicates
  async findDuplicates(name, address) {
    const result = await query(
      `SELECT c.*,
              similarity(c.name, $1) as name_similarity,
              json_agg(json_build_object('id', cp.id, 'phone', cp.phone, 'is_primary', cp.is_primary))
              FILTER (WHERE cp.id IS NOT NULL) as phones
       FROM customers c
       LEFT JOIN customer_phones cp ON c.id = cp.customer_id
       WHERE c.is_deleted = false
       AND (similarity(c.name, $1) > 0.8 OR (c.address IS NOT NULL AND similarity(c.address, $2) > 0.7))
       GROUP BY c.id
       ORDER BY name_similarity DESC
       LIMIT 5`,
      [name, address || '']
    );
    return result.rows;
  },

  // Get customer statistics
  async getStats(customerId) {
    const result = await query(
      `SELECT
         COUNT(b.id) as total_bills,
         SUM(b.total_amount) as total_value,
         MIN(b.bill_date) as first_visit,
         MAX(b.bill_date) as last_visit,
         SUM(CASE WHEN b.status = 'pending' THEN 1 ELSE 0 END) as pending_orders,
         SUM(b.balance_due) as total_balance_due
       FROM bills b
       WHERE b.customer_id = $1 AND b.is_deleted = false`,
      [customerId]
    );
    return result.rows[0];
  }
};

export default CustomerModel;
