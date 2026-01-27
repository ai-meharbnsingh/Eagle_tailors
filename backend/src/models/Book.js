import { query } from '../config/database.js';

export const BookModel = {
  // Create a new book
  async create({ name, startSerial, endSerial, isCurrent = false }) {
    // If this is marked as current, unset all other current books
    if (isCurrent) {
      await query(`UPDATE books SET is_current = false WHERE is_current = true`);
    }

    const result = await query(
      `INSERT INTO books (name, start_serial, end_serial, is_current)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, startSerial, endSerial, isCurrent]
    );
    return result.rows[0];
  },

  // Get book by ID
  async findById(id) {
    const result = await query(
      `SELECT b.*,
              COUNT(bills.id) as bill_count,
              MAX(bills.folio_number) as last_folio
       FROM books b
       LEFT JOIN bills ON b.id = bills.book_id AND bills.is_deleted = false
       WHERE b.id = $1
       GROUP BY b.id`,
      [id]
    );
    return result.rows[0];
  },

  // Get current book
  async getCurrent() {
    const result = await query(
      `SELECT b.*,
              COUNT(bills.id) as bill_count,
              MAX(bills.folio_number) as last_folio
       FROM books b
       LEFT JOIN bills ON b.id = bills.book_id AND bills.is_deleted = false
       WHERE b.is_current = true
       GROUP BY b.id`,
      []
    );
    return result.rows[0];
  },

  // Get all books
  async findAll() {
    const result = await query(
      `SELECT b.*,
              COUNT(bills.id) as bill_count,
              MAX(bills.folio_number) as last_folio,
              MIN(bills.bill_date) as first_bill_date,
              MAX(bills.bill_date) as last_bill_date
       FROM books b
       LEFT JOIN bills ON b.id = bills.book_id AND bills.is_deleted = false
       GROUP BY b.id
       ORDER BY b.created_at DESC`,
      []
    );
    return result.rows;
  },

  // Update book
  async update(id, { name, startSerial, endSerial, isCurrent }) {
    // If setting as current, unset all others
    if (isCurrent) {
      await query(`UPDATE books SET is_current = false WHERE is_current = true AND id != $1`, [id]);
    }

    const result = await query(
      `UPDATE books
       SET name = COALESCE($1, name),
           start_serial = COALESCE($2, start_serial),
           end_serial = COALESCE($3, end_serial),
           is_current = COALESCE($4, is_current)
       WHERE id = $5
       RETURNING *`,
      [name, startSerial, endSerial, isCurrent, id]
    );
    return result.rows[0];
  },

  // Set book as current
  async setCurrent(id) {
    // Unset all current books
    await query(`UPDATE books SET is_current = false WHERE is_current = true`);

    // Set the specified book as current
    const result = await query(
      `UPDATE books SET is_current = true WHERE id = $1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  },

  // Get next available folio number
  async getNextFolioNumber(bookId) {
    const result = await query(
      `SELECT COALESCE(MAX(folio_number), 0) + 1 as next_folio
       FROM bills
       WHERE book_id = $1`,
      [bookId]
    );
    return result.rows[0].next_folio;
  },

  // Check if folio exists in book
  async folioExists(bookId, folioNumber) {
    const result = await query(
      `SELECT EXISTS(
         SELECT 1 FROM bills
         WHERE book_id = $1 AND folio_number = $2
       ) as exists`,
      [bookId, folioNumber]
    );
    return result.rows[0].exists;
  },

  // Delete book (only if no bills)
  async delete(id) {
    const result = await query(
      `DELETE FROM books
       WHERE id = $1 AND NOT EXISTS(SELECT 1 FROM bills WHERE book_id = $1)
       RETURNING *`,
      [id]
    );
    return result.rows[0];
  }
};

export default BookModel;
