// utils/authUtils.js
const bcrypt = require('bcrypt');
const pool = require('../config/db'); 

// =========================================
// Email Format Validation
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// =========================================
// Password Strength Validation
// -----------------------------------------
// At least 8 characters, including:
// - 1 lowercase, 1 uppercase, 1 digit, and 1 special character
function isStrongPassword(password) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);
}

// =========================================
// International Phone Format Validation
// Supports: Pakistan, India, US, UK
function isValidPhoneByCountry(phone, countryCode) {
  const patterns = {
    pk: /^\+92(3)[0-9]{9}$/,        // e.g. +923001234567
    in: /^\+91[6-9][0-9]{9}$/,      // e.g. +919876543210
    us: /^\+1[2-9][0-9]{9}$/,       // e.g. +14155552671
    uk: /^\+44[7][0-9]{9}$/,        // e.g. +447912345678
  };

  return patterns[countryCode]?.test(phone) || false;
}

// =========================================
// Password Encryption (Hashing)
async function encryptPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

// =========================================
// Check for Duplicate Email in Users Table
async function isEmailDuplicate(email) {
  try {
    const result = await pool.query(
      'SELECT * FROM Users WHERE email = $1',
      [email]
    );
    return result.rows.length > 0;
  } catch (err) {
    console.error('Error checking duplicate email:', err);
    throw err;
  }
}

module.exports = {
  isValidEmail,
  isStrongPassword,
  isValidPhoneByCountry,
  encryptPassword,
  isEmailDuplicate
};