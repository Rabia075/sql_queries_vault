const pool = require('../config/db');
const jwt = require('jsonwebtoken');

// ✨ Imported utility functions
const { isEmailDuplicate, isStrongPassword, isValidEmail, encryptPassword } = require('../utils/authUtils');
const bcrypt = require('bcrypt');

const loginUser = async (req, res) => {  
  const { email, password } = req.body;

  try {  
      //console.log("📥 Login request received:", req.body);
    // Step 1: Check if user exists
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const user = result.rows[0];
    //console.log("👤 Logged-in user info:", user);

    // Step 2: Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Step 3: If student, find student_id
    let studentId = null;
    if (user.role === 'student') {
      const studentResult = await pool.query(
        'SELECT student_id FROM students WHERE user_id = $1',
        [user.user_id]
      );
      if (studentResult.rows.length > 0) {
        studentId = studentResult.rows[0].student_id;
      }
    }

    // Step 4: Generate token
    const token = jwt.sign(
      {
        id: user.user_id,
        role: user.role.toLowerCase(),
        email: user.email,
        studentId: studentId, // optional
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    //console.log("Token:", token);
    // Step 5: Return response
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.user_id,
        role: user.role,
        email: user.email,
        studentId: studentId,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { loginUser };