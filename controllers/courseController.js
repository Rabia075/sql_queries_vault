const pool = require('../config/db');

// ==========================
// Create a New Course (Public Route)
exports.createCourse = async (req, res) => {  
  
  try {
    const { course_name, course_code, credit_hours, department_id, instructor_id } = req.body;
    
    //Validate credit_hours
    if (credit_hours < 1 || credit_hours > 6) {
      return res.status(400).json({ error: 'Credit hours must be between 1 and 6.' });
    }
    const result = await pool.query(
      `INSERT INTO Courses (course_name, course_code, credit_hours, department_id, instructor_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [course_name, course_code, credit_hours, department_id, instructor_id]
    );
    res.status(201).json({ message: 'Course created successfully', data: result.rows[0] });
  
  } catch (error) {
    if (error.code === '23505' && error.detail.includes('course_code')) {
      return res.status(400).json({ error: 'Course code must be unique. This code already exists.' });
    }
    res.status(500).json({ error: 'Failed to create course', details: error.message });
  }
};


// ==========================
// Get All Courses (Admin Only)
exports.getAllCourses = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admins only.' });
  }
  
  try {
    const result = await pool.query(`SELECT * FROM Courses`);
    res.status(200).json(result.rows);
  
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch courses', details: error.message });
  }
};


// ==========================
// Get Courses by Query Filters (Admin Only)
exports.getCoursesByFilters = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admins only.' });
  }
  
  try {
    const filters = [];
    const values = [];
    let index = 1;
    //Dynamic filtering using query params
    for (let key in req.query) {
      filters.push(`${key} = $${index++}`);
      values.push(req.query[key]);
    }
    if (filters.length === 0) {
      return res.status(400).json({ error: 'No filters provided in query parameters.' });
    }
    const query = `SELECT * FROM Courses WHERE ${filters.join(' AND ')}`;
    const result = await pool.query(query, values);
    res.status(200).json(result.rows);
  
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch courses', details: error.message });
  }
};

// ==========================
// Get Single record by ID (Admin Only)
exports.getCourseById = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admins only.' });
  }
  const { id } = req.params;
  
  try {
    const result = await pool.query(`SELECT * FROM Courses WHERE course_id = $1`, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.status(200).json(result.rows[0]);
  
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch course', details: error.message });
  }
};

// ==========================
// Get Specific Column by Filter Column (Admin Only)
// Example: ?filter_by=course_code&filter_value=CS101&select=course_name
exports.getColumnByFilter = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admins only.' });
  }  
  const { filter_by, filter_value, select } = req.query;
  if (!filter_by || !filter_value || !select) {
    return res.status(400).send("Required query parameters: filter_by, filter_value, select");
  }
  
  const validColumns = ['course_id', 'course_name', 'course_code', 'credit_hours', 'department_id', 'instructor_id'];
  if (!validColumns.includes(filter_by) || !validColumns.includes(select)) {
    return res.status(400).send("Invalid column name in query");
  }
  try {
    const query = `SELECT ${select} FROM Courses WHERE ${filter_by} = $1`;
    const result = await pool.query(query, [filter_value]);

    if (result.rows.length === 0) {
      return res.status(404).send("No data found");
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve data', details: error.message });
  }
};

// ==========================
// Update Course by ID (Admin Only)
exports.updateCourse = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admins only.' });
  }

  try {
    const id = req.params.id;
    const { course_name, course_code, credit_hours, department_id, instructor_id } = req.body;

    if (credit_hours < 1 || credit_hours > 6) {
      return res.status(400).json({ error: 'Credit hours must be between 1 and 6.' });
    }

    // Check existence before update
    const existing = await pool.query(`SELECT * FROM Courses WHERE course_id = $1`, [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const result = await pool.query(
      `UPDATE Courses
       SET course_name = $1, course_code = $2, credit_hours = $3, department_id = $4, instructor_id = $5
       WHERE course_id = $6 RETURNING *`,
      [course_name, course_code, credit_hours, department_id, instructor_id, id]
    );
    res.status(200).json({ message: 'Course updated successfully', data: result.rows[0] });

  } catch (error) {
    if (error.code === '23505' && error.detail.includes('course_code')) {
      return res.status(400).json({ error: 'Course code must be unique. This code already exists.' });
    }
    res.status(500).json({ error: 'Failed to update course', details: error.message });
  }
};

// ==========================
// Delete Course by ID (Admin Only)
exports.deleteCourse = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admins only.' });
  }
  try {
    const id = req.params.id;

    // Check existence before update
    const result = await pool.query(`DELETE FROM Courses WHERE course_id = $1 RETURNING *`, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.status(200).json({ message: 'Course deleted successfully', data: result.rows[0] });

  } catch (error) {
    res.status(500).json({ error: 'Failed to delete course', details: error.message });
  }
};