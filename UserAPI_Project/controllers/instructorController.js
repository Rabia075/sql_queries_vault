const pool = require('../config/db');
const bcrypt = require('bcrypt');

// Utility: Email format validator
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Utility: Password strength validator
const validatePassword = (password) => {
  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return strongPasswordRegex.test(password);
};


// =========================
// CREATE Instructor
const createInstructor = async (req, res) => {
  try {
    const { full_name, email, phone, department_id,password,user_id } = req.body;

    //Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    //Check duplicate email
    const existing = await pool.query('SELECT * FROM Instructors WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Instructor with this email already exists' });
    }
      //Password strength check
  if (!validatePassword(password)) {
    return res.status(400).send(
      "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
    );
  }
    //Encrypt password and insert
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
    const result = await pool.query(
      `INSERT INTO Instructors (full_name, email, phone, department_id,password,user_id)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [full_name, email, phone, department_id,password,user_id]
    );

    res.status(201).json({ message: 'Instructor created successfully', data: result.rows[0] });

  } catch (error) {
    console.error('Error creating instructor:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// =========================
// GET All Instructors (Admin only)
const getAllInstructors = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admins only.' });
  }

  try {
    const result = await pool.query('SELECT * FROM Instructors');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching instructors:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// =========================
// GET Instructor by ID (Admin only)
const getInstructorById = async (req, res) => {
  const { id } = req.params;

  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admins only.' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM Instructors WHERE instructor_id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Instructor not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error retrieving instructor by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// =========================
// GET Instructor by dynamic column & value (Admin only)
const getInstructorByColumn = async (req, res) => {
  const { column, value } = req.query;

  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admins only.' });
  }

  const allowedColumns = ['instructor_id', 'full_name', 'email', 'phone', 'department_id'];
  if (!allowedColumns.includes(column)) {
    return res.status(400).json({ error: 'Invalid column name' });
  }

  try {
    const result = await pool.query(
      `SELECT * FROM Instructors WHERE ${column} = $1`,
      [value]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No instructor found for given filter' });
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error filtering instructor:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// =========================
// GET Specific Column from Instructors by filter (Admin only)
const getColumnByColumn = async (req, res) => {
  const { filter_by, filter_value, select } = req.query;

  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admins only.' });
  }

  const allowedColumns = ['instructor_id', 'full_name', 'email', 'phone', 'department_id'];
  if (!allowedColumns.includes(filter_by) || !allowedColumns.includes(select)) {
    return res.status(400).json({ error: 'Invalid column name' });
  }

  try {
    const result = await pool.query(
      `SELECT ${select} FROM Instructors WHERE ${filter_by} = $1`,
      [filter_value]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No instructor found for given filter' });
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error getting column by column:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// =========================
// UPDATE Instructor by ID (Admin only)
const updateInstructor = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admins only.' });
  }

  try {
    const { id } = req.params;
    const { full_name, email, phone, department_id, password, user_id } = req.body;

    //Validate email
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    //Check duplicate email for other instructors
    const emailCheck = await pool.query(
      'SELECT * FROM Instructors WHERE email = $1 AND instructor_id != $2',
      [email, id]
    );
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Another instructor with this email already exists' });
    }
       //Hash new password if provided
        let hashedPassword = null;
        if (password) {
          if (!validatePassword(password)) {
            return res.status(400).send(
              "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
            );
          }
    
          const salt = await bcrypt.genSalt(10);
          hashedPassword = await bcrypt.hash(password, salt);
        }

    //Update instructor
    const result = await pool.query(
      `UPDATE Instructors
       SET full_name = $1, email = $2, phone = $3, department_id = $4, password = $5, user_id = $6
       WHERE instructor_id = $7 RETURNING *`,
      [full_name, email, phone, department_id, password, user_id, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Instructor not found' });
    }

    res.status(200).json({ message: 'Instructor updated successfully', data: result.rows[0] });

  } catch (error) {
    console.error('Error updating instructor:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// =========================
// DELETE Instructor by ID (Admin only)
const deleteInstructor = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admins only.' });
  }

  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM Instructors WHERE instructor_id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Instructor not found' });
    }

    res.status(200).json({ message: 'Instructor deleted successfully' });
  } catch (error) {
    console.error('Error deleting instructor:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};








// Get Instructor's Own Profile
// ==============================
const getMyProfile = async (req, res) => {
  try {
    //Extract the user_id from the authenticated token
    const userId = req.user.id;

    //console.log('👤 user_id from token:', userId);
    //Query the Instructors table to find the instructor's record based on user_id
    const result = await pool.query(
      'SELECT * FROM Instructors WHERE user_id = $1',
      [userId]
    );
    
    //console.log('📦 DB result:', result.rows);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Instructor not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving profile' });
  }
};


// Update Instructor's Own Profile
// ==============================
const updateMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { full_name, email, phone, department_id,password,user_id } = req.body;
     // Validate email
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Check duplicate email for other instructors
    const emailCheck = await pool.query(
      'SELECT * FROM Instructors WHERE email = $1 AND user_id != $2',
      [email, userId]
    );
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Another instructor with this email already exists' });
    }
       // Hash new password if provided
        let hashedPassword = null;
        if (password) {
          if (!validatePassword(password)) {
            return res.status(400).send(
              "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
            );
          }
    
          const salt = await bcrypt.genSalt(10);
          hashedPassword = await bcrypt.hash(password, salt);
        }

    //Update the instructor's own record based on user_id
    const result = await pool.query(
      `UPDATE Instructors
       SET full_name = $1, email = $2, phone = $3, department_id = $4, password = $5, user_id =$6
       WHERE user_id = $7 RETURNING *`,
      [full_name, email, phone, department_id, password, user_id, userId]
    );

    //If no record is found, return 404 Not Found
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Instructor not found' });
    }
    res.json({ message: 'Profile updated', data: result.rows[0] });
    } catch (err) {
    res.status(500).json({ message: 'Error retrieving profile' });
  }
};


// ==============================
// Get all students registered in the logged-in instructor's courses
// ==============================
const getMyStudents = async (req, res) => {
  try {
    const userId = req.user.id; // user_id from token
    //console.log("🎯 Logged-in user_id:", userId);

    // Step 1: Get instructor_id from Instructors table
    const instructorRes = await pool.query(
      `SELECT instructor_id FROM Instructors WHERE user_id = $1`,
      [userId]
    );

    if (instructorRes.rows.length === 0) {
      return res.status(404).json({ message: 'Instructor not found for this user.' });
    }

    const instructorId = instructorRes.rows[0].instructor_id;
    //console.log("✅ Matched instructor_id from DB:", instructorId);

    // Step 2: Get students registered in instructor's courses
    const query = `
      SELECT s.*
      FROM Students s
      JOIN Registrations r ON s.student_id = r.student_id
      JOIN Courses c ON r.course_id = c.course_id
      WHERE c.instructor_id = $1
    `;

    const result = await pool.query(query, [instructorId]);

    res.status(200).json(result.rows);

  } catch (error) {
    console.error('Error getting students for instructor:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Get courses assigned to the logged-in instructor
// ==============================
const getMyCourses = async (req, res) => {
  try {
    const userId = req.user.id;
    //console.log("🎯 Logged-in user_id:", userId);

    // 1. Get instructor_id from Instructors table using user_id
    const instructorRes = await pool.query(
      'SELECT instructor_id FROM Instructors WHERE user_id = $1',
      [userId]
    );

    if (instructorRes.rows.length === 0) {
      return res.status(404).json({ message: 'Instructor profile not found' });
    }

    const instructorId = instructorRes.rows[0].instructor_id;
    //console.log("✅ Matched instructor_id from DB:", instructorId);

    // 2. Get all courses where instructor_id matches
    const courseQuery = `
      SELECT * FROM Courses
      WHERE instructor_id = $1
    `;
    const result = await pool.query(courseQuery, [instructorId]);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error getting instructor courses:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



module.exports = {
  createInstructor,
  getAllInstructors,
  getInstructorById,
  getInstructorByColumn,
  getColumnByColumn,
  updateInstructor,
  deleteInstructor,
  getMyProfile,
  updateMyProfile,
  getMyStudents,
  getMyCourses
};