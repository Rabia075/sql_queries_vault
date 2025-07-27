const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const validatePassword = require('../utils/passwordValidator');

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!validatePassword(password)) {
    return res.status(400).send(
      "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
    );
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO users (name, email, password) VALUES ($1, $2, $3)`,
      [name, email, hashedPassword]
    );

    res.status(201).send("User registered successfully!");
  } catch (error) {
  console.error("Registration error:", error); 
  res.status(500).send(`Error registering user: ${error.message}`);
}
};

module.exports = { registerUser };