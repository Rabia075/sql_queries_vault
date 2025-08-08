const pool = require('../config/db');

// ✨ Imported utility functions
const {
  isValidEmail,
  isStrongPassword,
  encryptPassword,
  isEmailDuplicate
} = require('../utils/authUtils');

// ==========================
// Create User
exports.createUser = async (req, res) => {
  const { username, password, role, email } = req.body;

  //Password strength check
  if (!isStrongPassword(password)) {
    return res.status(400).send(
      "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
    );
  }

  try {
    //Validate email_Format + Ensure email_Uniqueness(Avoid duplicate email)
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    const existingEmail = await isEmailDuplicate(email);
    if (existingEmail) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    //Encrypt password
    const hashedPassword = await encryptPassword(password);
    const result = await pool.query(
      'INSERT INTO Users (username, password, role, email) VALUES ($1, $2, $3, $4) RETURNING *',
      [username, hashedPassword, role, email]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==========================
// Get All Users (Admin only)
exports.getAllUsers = async (req, res) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admins only.' });
  }

  try {
    const result = await pool.query('SELECT user_id, username, role, email FROM Users');
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==========================
// Get Users by Column (Admin only)
// Example: /api/users/filter?column=username&value=admin
exports.getUserByColumn = async (req, res) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admins only.' });
  }
  const { column, value } = req.query;

  try {
    const result = await pool.query(
      `SELECT * FROM Users WHERE ${column} = $1`,
      [value]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No users found' });
    }
    res.status(200).json(result.rows);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==========================
// Get Column by Column (Admin only)
// Example: /api/users/column?select=username&where=role&value=admin
exports.getColumnByColumn = async (req, res) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admins only.' });
  }
  const { select, where, value } = req.query;

  try {
    const result = await pool.query(
      `SELECT ${select} FROM Users WHERE ${where} = $1`,
      [value]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No matching records found' });
    }
    res.status(200).json(result.rows);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==========================
// Get User by ID (Admin only)
exports.getUserById = async (req, res) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admins only.' });
  }
  const userId = req.params.id;

  try {
    const result = await pool.query('SELECT user_id, username, role, email FROM Users WHERE user_id = $1', [userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(result.rows[0]);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==========================
// Update User (Admin only)
exports.updateUser = async (req, res) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admins only.' });
  }
  const userId = req.params.id;
  const { username, password, role, email } = req.body;

  try {
    //Check if user exists
    const check = await pool.query('SELECT * FROM Users WHERE user_id = $1', [userId]);
    if (check.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    //Hash new password if provided
    let hashedPassword = null;
    if (password) {
      if (!isStrongPassword(password)) {
        return res.status(400).send(
          "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
        );
      }
      hashedPassword = await encryptPassword(password);
    }

    //Validate email_Format + Ensure email_Uniqueness(Avoid duplicate email)
    if (email && !isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    if (email) {
      const emailExists = await pool.query('SELECT * FROM Users WHERE email = $1 AND user_id != $2', [email, userId]);
      if (emailExists.rows.length > 0) {
        return res.status(400).json({ error: 'Email already in use' });
      }
    }

    //Update user
    const result = await pool.query(
      `UPDATE Users SET 
        username = COALESCE($1, username), 
        password = COALESCE($2, password), 
        role = COALESCE($3, role),
        email = COALESCE($4, email)
      WHERE user_id = $5 RETURNING user_id, username, role, email`,
      [username || null, hashedPassword, role || null, email || null, userId]
    );
    res.status(200).json(result.rows[0]);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==========================
// Delete User (Admin only)
exports.deleteUser = async (req, res) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admins only.' });
  }
  const userId = req.params.id;

  try {
    const result = await pool.query('DELETE FROM Users WHERE user_id = $1 RETURNING *', [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};