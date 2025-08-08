const pool = require('../config/db');

// ==========================
// Create a new department (Public)
exports.createDepartment = async (req, res) => {
  const { department_name, department_code } = req.body;

  if (!department_name || !department_code) {
    return res.status(400).send("Both department_name and department_code are required");
  }

  try {
    const result = await pool.query(
      'INSERT INTO departments (department_name, department_code) VALUES ($1, $2) RETURNING *',
      [department_name, department_code]
    );
    res.status(201).json({ message: "Department created", department: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating department");
  }
};

// ==========================
// Get all departments (Admin only)
exports.getAllDepartments = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM departments');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving departments");
  }
};

// ==========================
// Get departments by filter (Admin only)
exports.getDepartmentsByColumn = async (req, res) => {
  console.log("Incoming /column route hit");
  console.log("Params received:", req.params);

  const { column, value } = req.params;

  const validColumns = ['department_id', 'department_name', 'department_code'];
  if (!validColumns.includes(column)) {
    console.warn("Invalid column attempted:", column);
    return res.status(400).send("Invalid column name");
  }

  try {
    const result = await pool.query(
      `SELECT * FROM departments WHERE ${column} = $1`,
      [value]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("No matching department found");
    }

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error in getDepartmentsByColumn:", err);
    res.status(500).send("Error retrieving department");
  }
};

// ==========================
// Get department by ID (Admin only)
exports.getDepartmentById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM departments WHERE department_id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Department not found");
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving department");
  }
};

// ==========================
// Get any specific column using any filter column (Admin only)
exports.getColumnByFilter = async (req, res) => {
  const { filter_by, filter_value, select } = req.query;

  if (!filter_by || !filter_value || !select) {
    return res.status(400).send("Required query parameters: filter_by, filter_value, select");
  }

  const validColumns = ['department_id', 'department_name', 'department_code'];
  if (!validColumns.includes(filter_by) || !validColumns.includes(select)) {
    return res.status(400).send("Invalid column name in query");
  }

  try {
    const query = `SELECT ${select} FROM departments WHERE ${filter_by} = $1`;
    const result = await pool.query(query, [filter_value]);

    if (result.rows.length === 0) {
      return res.status(404).send("No data found");
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("FULL ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// ==========================
// Update department by ID (Admin only)
exports.updateDepartment = async (req, res) => {
  const { id } = req.params;
  const { department_name, department_code } = req.body;

  try {
    if (!department_name && !department_code) {
      return res.status(400).send("At least one field (department_name or department_code) is required to update");
    }

    const updates = [];
    const values = [];
    let index = 1;

    if (department_name) {
      updates.push(`department_name = $${index++}`);
      values.push(department_name);
    }

    if (department_code) {
      updates.push(`department_code = $${index++}`);
      values.push(department_code);
    }

    values.push(id);

    const updateQuery = `
      UPDATE departments
      SET ${updates.join(', ')}
      WHERE department_id = $${index}
      RETURNING *
    `;

    const result = await pool.query(updateQuery, values);

    if (result.rows.length === 0) {
      return res.status(404).send("Department not found");
    }

    res.status(200).json({ message: "Department updated", department: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating department");
  }
};

// ==========================
// Delete department by ID (Admin only)
exports.deleteDepartment = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM departments WHERE department_id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Department not found");
    }

    res.status(200).json({
      message: "Department deleted successfully",
      department: result.rows[0]
    });
  } catch (err) {
    console.error("Error deleting department:", err);
    res.status(500).send("Error deleting department");
  }
};