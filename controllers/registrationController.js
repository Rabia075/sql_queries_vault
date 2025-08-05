const pool = require('../config/db');

// =======================================
// Create a new registration
const createRegistration = async (req, res) => {
  try {
    const { student_id, course_id, status } = req.body;

    const existing = await pool.query(
      `SELECT * FROM Registrations WHERE student_id = $1 AND course_id = $2`,
      [student_id, course_id]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Student is already registered for this course' });
    }

    const result = await pool.query(
      `INSERT INTO Registrations (student_id, course_id, status)
       VALUES ($1, $2, $3) RETURNING *`,
      [student_id, course_id, status]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating registration:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// =======================================
// Get all registrations (Admin only)
const getAllRegistrations = async (req, res) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin only access' });
  }

  try {
    const result = await pool.query('SELECT * FROM Registrations');
    res.status(200).json(result.rows);
  
  } catch (error) {
    console.error('Error fetching registrations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// =======================================
// Get registration by ID (Admin only)
const getRegistrationById = async (req, res) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin only access' });
  }

  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT * FROM Registrations WHERE registration_id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Registration not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching registration by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// =======================================
// Get full record by any column (Admin only)
const getRegistrationByColumn = async (req, res) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin only access' });
  }

  try {
    const { column, value } = req.query;

    const result = await pool.query(
      `SELECT * FROM Registrations WHERE ${column} = $1`,
      [value]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No records found for this filter' });
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error filtering registrations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// =======================================
// Get specific column by another column (Admin only)
const getColumnByColumn = async (req, res) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin only access' });
  }

  try {
    const { select, where, value } = req.query;

    const result = await pool.query(
      `SELECT ${select} FROM Registrations WHERE ${where} = $1`,
      [value]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No record found' });
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error retrieving specific column:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// =======================================
// Update registration by ID (Admin only)
const updateRegistration = async (req, res) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin only access' });
  }

  try {
    const { id } = req.params;
    const { student_id, course_id, status } = req.body;

    const check = await pool.query(
      `SELECT * FROM Registrations WHERE registration_id = $1`,
      [id]
    );
    if (check.rows.length === 0) {
      return res.status(404).json({ error: 'Registration not found' });
    }

    const result = await pool.query(
      `UPDATE Registrations
       SET student_id = $1, course_id = $2, status = $3
       WHERE registration_id = $4 RETURNING *`,
      [student_id, course_id, status, id]
    );

    res.status(200).json({ message: 'Updated successfully', data: result.rows[0] });
  } catch (error) {
    console.error('Error updating registration:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// =======================================
// Delete registration by ID (Admin only)
const deleteRegistration = async (req, res) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin only access' });
  }

  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM Registrations WHERE registration_id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Registration not found' });
    }

    res.status(200).json({ message: 'Registration deleted successfully' });
  } catch (error) {
    console.error('Error deleting registration:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};










const getCoursesForLoggedInStudent = async (req, res) => {
  try {
    const studentId = req.user.studentId; //Match with JWT payload

    const result = await pool.query(
      `
      SELECT 
        c.course_id,
        c.course_name,
        c.course_code,
        c.credit_hours,
        d.department_name,
        i.full_name AS instructor_name
      FROM 
        registrations r
      JOIN 
        courses c ON r.course_id = c.course_id
      JOIN 
        departments d ON c.department_id = d.department_id
      LEFT JOIN 
        instructors i ON c.instructor_id = i.instructor_id
      WHERE 
        r.student_id = $1
      `,
      [studentId]
    );

    res.status(200).json({ courses: result.rows });
  } catch (error) {
    console.error('Error in getCoursesForLoggedInStudent:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createRegistration,
  getAllRegistrations,
  getRegistrationById,
  getRegistrationByColumn,
  getColumnByColumn,
  updateRegistration,
  deleteRegistration,
  getCoursesForLoggedInStudent
};