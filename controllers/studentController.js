const pool = require('../config/db');
const validator = require('validator');
const bcrypt = require('bcrypt');
const verifyRoleAndOwnership = require('../middleware/verifyRoleAndOwnership'); //Add middleware


// Utility: Password strength validator
const validatePassword = (password) => {
  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return strongPasswordRegex.test(password);
};

// ==========================
// Add New Student
exports.createStudent = async (req, res) => {
  const {
    full_name, email, phone, gender,
    date_of_birth, address, department_id, password, user_id
  } = req.body;
  
   // Password strength check
  if (!validatePassword(password)) {
    return res.status(400).send(
      "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
    );
  }

  try {
    //Email format validation
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    //Encrypt password and insert
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
    const result = await pool.query(
      `INSERT INTO Students 
      (full_name, email, phone, gender, date_of_birth, address, department_id, password, user_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [full_name, email, phone, gender, date_of_birth, address, department_id, password, user_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    //Duplicate email check already handled using error code 23505
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Email already exists' });
    }

    console.error(err);
    res.status(500).json({ error: 'Failed to add student' });
  }
};

// ==========================
// Get All Students (Admin only)
exports.getAllStudents = [
  verifyRoleAndOwnership(['admin']),
  async (req, res) => {
    
    try {
      const result = await pool.query('SELECT * FROM Students');
      res.status(200).json(result.rows);
    
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to retrieve students' });
    }
  }
];

// ==========================
// Get Complete Student Record by Any Column (Admin only)
exports.getStudentByColumn = [
  verifyRoleAndOwnership(['admin']),
  async (req, res) => {
    const { filter_by, filter_value } = req.query;

    const validColumns = [
      'student_id', 'full_name', 'email', 'phone',
      'gender', 'date_of_birth', 'address', 'department_id', 'password', 'user_id'
    ];

    if (!filter_by || !filter_value) {
      return res.status(400).json({ error: 'filter_by and filter_value are required' });
    }

    if (!validColumns.includes(filter_by)) {
      return res.status(400).json({ error: 'Invalid column name' });
    }

    try {
      const result = await pool.query(
        `SELECT * FROM Students WHERE ${filter_by} = $1`,
        [filter_value]
      );

      // Record existence check
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'No student found' });
      }

      res.status(200).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error retrieving student' });
    }
  }
];

// ==========================
// Get Specific Column by Any Column (Admin only)
// Example: ?filter_by=email&filter_value=abc@gmail.com&select=full_name
exports.getStudentColumnByColumn = [
  verifyRoleAndOwnership(['admin']),
  async (req, res) => {
    const { filter_by, filter_value, select } = req.query;

    const validColumns = [
      'student_id', 'full_name', 'email', 'phone',
      'gender', 'date_of_birth', 'address', 'department_id', 'password', 'user_id'
    ];

    if (!filter_by || !filter_value || !select) {
      return res.status(400).json({ error: 'filter_by, filter_value and select are required' });
    }

    if (!validColumns.includes(filter_by) || !validColumns.includes(select)) {
      return res.status(400).json({ error: 'Invalid column name' });
    }

    try {
      const result = await pool.query(
        `SELECT ${select} FROM Students WHERE ${filter_by} = $1`,
        [filter_value]
      );

      // Record existence check
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'No data found' });
      }

      res.status(200).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error retrieving column' });
    }
  }
];

// ==========================
// Get Student by ID (Admin only)
exports.getStudentById = [
  verifyRoleAndOwnership(['admin']),
  async (req, res) => {
    const { id } = req.params;

    try {
      const result = await pool.query(
        'SELECT * FROM Students WHERE student_id = $1',
        [id]
      );

      // Record existence check
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Student not found' });
      }

      res.status(200).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to get student by ID' });
    }
  }
];

// ==========================
// Update Student by ID (Admin only)
exports.updateStudent = [
  verifyRoleAndOwnership(['admin']),
  async (req, res) => {
    const id = req.params.id;
    const {
      full_name, email, phone, gender,
      date_of_birth, address, department_id, password, user_id
    } = req.body;

    try {
      //Email format validation
      if (!validator.isEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
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

      const result = await pool.query(
        `UPDATE Students SET 
        full_name = $1,
        email = $2,
        phone = $3,
        gender = $4,
        date_of_birth = $5,
        address = $6,
        department_id = $7,
        password = $8,
        user_id = $9
        WHERE student_id = $10
        RETURNING *`,
        [full_name, email, phone, gender, date_of_birth, address, department_id, password, user_id, id]
      );

      //Record existence check before update
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Student not found' });
      }

      res.status(200).json(result.rows[0]);
    } catch (err) {
      //Duplicate email check
      if (err.code === '23505') {
        return res.status(400).json({ error: 'Email already exists' });
      }

      console.error(err);
      res.status(500).json({ error: 'Failed to update student' });
    }
  }
];

// ==========================
// Delete Student by ID (Admin only)
exports.deleteStudent = [
  verifyRoleAndOwnership(['admin']),
  async (req, res) => {
    const id = req.params.id;

    try {
      const result = await pool.query(
        'DELETE FROM Students WHERE student_id = $1 RETURNING *',
        [id]
      );

      // Record existence check before delete
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Student not found' });
      }

      res.status(200).json({ message: 'Student deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete student' });
    }
  }
];









// ==========================
// Get Own Profile(for logged-in student)
exports.seeOwnProfile = async (req, res) => {
  const student_id = req.user.studentId;

  try {
    const result = await pool.query(
      'SELECT * FROM Students WHERE student_id = $1',
      [student_id]
    );

    // Record existence check
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve student profile' });
  }
};
// ==========================
// Update Own Profile(for logged-in student)
exports.updateOwnProfile = async (req, res) => {
  const student_id = req.user.studentId;
  const {
    full_name, email, phone, gender,
    date_of_birth, address, department_id, password, user_id
  } = req.body;

  try {
    //Email format validation
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
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

    const result = await pool.query(
      `UPDATE Students SET 
        full_name = $1,
        email = $2,
        phone = $3,
        gender = $4,
        date_of_birth = $5,
        address = $6,
        department_id = $7,
        password = $8,
        user_id = $9
        WHERE student_id = $10
        RETURNING *`,
      [full_name, email, phone, gender, date_of_birth, address, department_id, password, user_id, student_id]
    );

    //Record existence check
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    //Duplicate email check
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Email already exists' });
    }

    console.error(err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};