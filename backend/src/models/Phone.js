import { query } from '../config/database.js';

export const PhoneModel = {
  // Add phone to customer
  async create({ customerId, phone, isPrimary = false }) {
    try {
      const result = await query(
        `INSERT INTO customer_phones (customer_id, phone, is_primary)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [customerId, phone, isPrimary]
      );
      return result.rows[0];
    } catch (error) {
      // Handle unique constraint violation
      if (error.code === '23505') {
        throw new Error('Phone number already exists for another customer');
      }
      throw error;
    }
  },

  // Get all phones for a customer
  async findByCustomerId(customerId) {
    const result = await query(
      `SELECT * FROM customer_phones
       WHERE customer_id = $1
       ORDER BY is_primary DESC, created_at ASC`,
      [customerId]
    );
    return result.rows;
  },

  // Find customer by exact phone match
  async findCustomerByPhone(phone) {
    const result = await query(
      `SELECT cp.*, c.name as customer_name, c.address
       FROM customer_phones cp
       INNER JOIN customers c ON cp.customer_id = c.id
       WHERE cp.phone = $1 AND c.is_deleted = false`,
      [phone]
    );
    return result.rows[0];
  },

  // Set phone as primary
  async setPrimary(id, customerId) {
    // First, unset all primary phones for this customer
    await query(
      `UPDATE customer_phones
       SET is_primary = false
       WHERE customer_id = $1`,
      [customerId]
    );

    // Then set the specified phone as primary
    const result = await query(
      `UPDATE customer_phones
       SET is_primary = true
       WHERE id = $1 AND customer_id = $2
       RETURNING *`,
      [id, customerId]
    );
    return result.rows[0];
  },

  // Delete phone
  async delete(id) {
    const result = await query(
      `DELETE FROM customer_phones
       WHERE id = $1
       RETURNING *`,
      [id]
    );
    return result.rows[0];
  },

  // Check if phone exists
  async exists(phone) {
    const result = await query(
      `SELECT EXISTS(SELECT 1 FROM customer_phones WHERE phone = $1) as exists`,
      [phone]
    );
    return result.rows[0].exists;
  }
};

export default PhoneModel;
