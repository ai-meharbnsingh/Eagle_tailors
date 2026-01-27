import { query } from '../config/database.js';

export const BillModel = {
  // Create a new bill
  async create({
    bookId,
    customerId,
    folioNumber,
    imageUrl,
    thumbnailUrl,
    billDate,
    deliveryDate,
    totalAmount,
    advancePaid,
    status = 'pending',
    remarks,
    createdBy
  }) {
    const result = await query(
      `INSERT INTO bills (
         book_id, customer_id, folio_number, image_url, thumbnail_url,
         bill_date, delivery_date, total_amount, advance_paid, status, remarks,
         created_by, updated_by
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $12)
       RETURNING *`,
      [
        bookId, customerId, folioNumber, imageUrl, thumbnailUrl,
        billDate, deliveryDate, totalAmount, advancePaid, status, remarks,
        createdBy
      ]
    );
    return result.rows[0];
  },

  // Get bill by ID with customer info
  async findById(id) {
    const result = await query(
      `SELECT b.*,
              c.name as customer_name,
              c.address as customer_address,
              json_agg(DISTINCT jsonb_build_object('phone', cp.phone, 'is_primary', cp.is_primary))
              FILTER (WHERE cp.id IS NOT NULL) as customer_phones,
              bk.name as book_name,
              json_agg(DISTINCT jsonb_build_object(
                'id', bm.id,
                'garment_type_id', bm.garment_type_id,
                'garment_name', bm.garment_name,
                'measurements', bm.measurements,
                'confidence', bm.confidence,
                'remarks', bm.remarks,
                'unknown_values', bm.unknown_values,
                'is_auto_extracted', bm.is_auto_extracted,
                'is_verified', bm.is_verified
              )) FILTER (WHERE bm.id IS NOT NULL) as measurements
       FROM bills b
       INNER JOIN customers c ON b.customer_id = c.id
       LEFT JOIN customer_phones cp ON c.id = cp.customer_id
       INNER JOIN books bk ON b.book_id = bk.id
       LEFT JOIN bill_measurements bm ON b.id = bm.bill_id
       WHERE b.id = $1 AND b.is_deleted = false
       GROUP BY b.id, c.id, bk.id`,
      [id]
    );
    return result.rows[0];
  },

  // Search bills by folio number
  async findByFolio(folioNumber, bookId = null) {
    let queryText = `
      SELECT b.*,
             c.name as customer_name,
             c.address as customer_address,
             bk.name as book_name
      FROM bills b
      INNER JOIN customers c ON b.customer_id = c.id
      INNER JOIN books bk ON b.book_id = bk.id
      WHERE b.folio_number = $1 AND b.is_deleted = false
    `;
    const params = [folioNumber];

    if (bookId) {
      queryText += ` AND b.book_id = $2`;
      params.push(bookId);
    }

    queryText += ` ORDER BY b.created_at DESC`;

    const result = await query(queryText, params);
    return result.rows;
  },

  // Get all bills for a customer
  async findByCustomerId(customerId) {
    const result = await query(
      `SELECT b.*,
              bk.name as book_name,
              bk.is_current as is_current_book,
              COUNT(bm.id) as measurement_count
       FROM bills b
       INNER JOIN books bk ON b.book_id = bk.id
       LEFT JOIN bill_measurements bm ON b.id = bm.bill_id
       WHERE b.customer_id = $1 AND b.is_deleted = false
       GROUP BY b.id, bk.id
       ORDER BY b.bill_date DESC, b.created_at DESC`,
      [customerId]
    );
    return result.rows;
  },

  // Get all bills with filters
  async findAll({
    bookId = null,
    status = null,
    fromDate = null,
    toDate = null,
    limit = 50,
    offset = 0
  } = {}) {
    let queryText = `
      SELECT b.*,
             c.name as customer_name,
             bk.name as book_name,
             json_agg(DISTINCT jsonb_build_object('phone', cp.phone))
             FILTER (WHERE cp.id IS NOT NULL) as customer_phones
      FROM bills b
      INNER JOIN customers c ON b.customer_id = c.id
      LEFT JOIN customer_phones cp ON c.id = cp.customer_id
      INNER JOIN books bk ON b.book_id = bk.id
      WHERE b.is_deleted = false
    `;
    const params = [];
    let paramCount = 1;

    if (bookId) {
      queryText += ` AND b.book_id = $${paramCount}`;
      params.push(bookId);
      paramCount++;
    }

    if (status) {
      queryText += ` AND b.status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    if (fromDate) {
      queryText += ` AND b.bill_date >= $${paramCount}`;
      params.push(fromDate);
      paramCount++;
    }

    if (toDate) {
      queryText += ` AND b.bill_date <= $${paramCount}`;
      params.push(toDate);
      paramCount++;
    }

    queryText += `
      GROUP BY b.id, c.id, bk.id
      ORDER BY b.created_at DESC
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;
    params.push(limit, offset);

    const result = await query(queryText, params);
    return result.rows;
  },

  // Get bills due for delivery
  async findDueForDelivery(date = new Date()) {
    const result = await query(
      `SELECT b.*,
              c.name as customer_name,
              json_agg(DISTINCT jsonb_build_object('phone', cp.phone))
              FILTER (WHERE cp.id IS NOT NULL) as customer_phones,
              bk.name as book_name
       FROM bills b
       INNER JOIN customers c ON b.customer_id = c.id
       LEFT JOIN customer_phones cp ON c.id = cp.customer_id
       INNER JOIN books bk ON b.book_id = bk.id
       WHERE b.delivery_date <= $1
       AND b.status NOT IN ('delivered', 'cancelled')
       AND b.is_deleted = false
       GROUP BY b.id, c.id, bk.id
       ORDER BY b.delivery_date ASC`,
      [date]
    );
    return result.rows;
  },

  // Get pending payments
  async findPendingPayments() {
    const result = await query(
      `SELECT b.*,
              c.name as customer_name,
              json_agg(DISTINCT jsonb_build_object('phone', cp.phone))
              FILTER (WHERE cp.id IS NOT NULL) as customer_phones,
              bk.name as book_name
       FROM bills b
       INNER JOIN customers c ON b.customer_id = c.id
       LEFT JOIN customer_phones cp ON c.id = cp.customer_id
       INNER JOIN books bk ON b.book_id = bk.id
       WHERE b.balance_due > 0
       AND b.status != 'cancelled'
       AND b.is_deleted = false
       GROUP BY b.id, c.id, bk.id
       ORDER BY b.balance_due DESC`,
      []
    );
    return result.rows;
  },

  // Update bill
  async update(id, {
    billDate,
    deliveryDate,
    actualDeliveryDate,
    totalAmount,
    advancePaid,
    status,
    remarks,
    extractionStatus,
    rawExtraction,
    updatedBy
  }) {
    const result = await query(
      `UPDATE bills
       SET bill_date = COALESCE($1, bill_date),
           delivery_date = COALESCE($2, delivery_date),
           actual_delivery_date = COALESCE($3, actual_delivery_date),
           total_amount = COALESCE($4, total_amount),
           advance_paid = COALESCE($5, advance_paid),
           status = COALESCE($6, status),
           remarks = COALESCE($7, remarks),
           extraction_status = COALESCE($8, extraction_status),
           raw_extraction = COALESCE($9, raw_extraction),
           updated_by = $10
       WHERE id = $11 AND is_deleted = false
       RETURNING *`,
      [
        billDate, deliveryDate, actualDeliveryDate, totalAmount, advancePaid,
        status, remarks, extractionStatus, rawExtraction, updatedBy, id
      ]
    );
    return result.rows[0];
  },

  // Soft delete bill
  async softDelete(id, updatedBy) {
    const result = await query(
      `UPDATE bills
       SET is_deleted = true, updated_by = $2
       WHERE id = $1
       RETURNING *`,
      [id, updatedBy]
    );
    return result.rows[0];
  },

  // Restore bill
  async restore(id, updatedBy) {
    const result = await query(
      `UPDATE bills
       SET is_deleted = false, updated_by = $2
       WHERE id = $1
       RETURNING *`,
      [id, updatedBy]
    );
    return result.rows[0];
  },

  // Get statistics
  async getStats(bookId = null) {
    let queryText = `
      SELECT
        COUNT(*) as total_bills,
        SUM(total_amount) as total_value,
        SUM(advance_paid) as total_collected,
        SUM(balance_due) as total_pending,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_count,
        COUNT(CASE WHEN status = 'cutting' THEN 1 END) as cutting_count,
        COUNT(CASE WHEN status = 'stitching' THEN 1 END) as stitching_count,
        COUNT(CASE WHEN status = 'ready' THEN 1 END) as ready_count,
        COUNT(CASE WHEN status = 'delivered' THEN 1 END) as delivered_count,
        COUNT(CASE WHEN delivery_date < CURRENT_DATE AND status NOT IN ('delivered', 'cancelled') THEN 1 END) as overdue_count
      FROM bills
      WHERE is_deleted = false
    `;

    const params = [];
    if (bookId) {
      queryText += ` AND book_id = $1`;
      params.push(bookId);
    }

    const result = await query(queryText, params);
    return result.rows[0];
  }
};

export default BillModel;
