import { query } from '../config/database.js';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export const UserModel = {
  // Create a new user
  async create({ name, pin, role = 'helper' }) {
    const pinHash = await bcrypt.hash(pin, SALT_ROUNDS);
    const result = await query(
      `INSERT INTO users (name, pin_hash, role)
       VALUES ($1, $2, $3)
       RETURNING id, name, role, is_active, created_at`,
      [name, pinHash, role]
    );
    return result.rows[0];
  },

  // Verify PIN and return user
  async verifyPin(userId, pin) {
    const result = await query(
      `SELECT * FROM users WHERE id = $1 AND is_active = true`,
      [userId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const user = result.rows[0];
    const isValid = await bcrypt.compare(pin, user.pin_hash);

    if (!isValid) {
      return null;
    }

    // Return user without pin_hash
    const { pin_hash, ...userWithoutPin } = user;
    return userWithoutPin;
  },

  // Find user by ID
  async findById(id) {
    const result = await query(
      `SELECT id, name, role, is_active, created_at, updated_at
       FROM users
       WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  },

  // Get all users
  async findAll() {
    const result = await query(
      `SELECT id, name, role, is_active, created_at
       FROM users
       ORDER BY created_at ASC`,
      []
    );
    return result.rows;
  },

  // Update user
  async update(id, { name, role, isActive }) {
    const result = await query(
      `UPDATE users
       SET name = COALESCE($1, name),
           role = COALESCE($2, role),
           is_active = COALESCE($3, is_active)
       WHERE id = $4
       RETURNING id, name, role, is_active, created_at, updated_at`,
      [name, role, isActive, id]
    );
    return result.rows[0];
  },

  // Change PIN
  async changePin(id, newPin) {
    const pinHash = await bcrypt.hash(newPin, SALT_ROUNDS);
    const result = await query(
      `UPDATE users
       SET pin_hash = $1
       WHERE id = $2
       RETURNING id, name, role`,
      [pinHash, id]
    );
    return result.rows[0];
  },

  // Deactivate user
  async deactivate(id) {
    const result = await query(
      `UPDATE users
       SET is_active = false
       WHERE id = $1
       RETURNING id, name, role, is_active`,
      [id]
    );
    return result.rows[0];
  }
};

export default UserModel;
