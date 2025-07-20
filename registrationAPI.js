const oracledb = require('oracledb');

async function connectToOracle() {
  try {
    const connection = await oracledb.getConnection({
      user: 'system',        
      password: '123',    
      connectString: 'localhost/XE'
    });

    console.log("Oracle DB successfully connected!");

    // Optional: ek choti query
    const result = await connection.execute(`SELECT * FROM dual`);
    console.log(result);

    await connection.close();
  } catch (err) {
    console.error("Connection failed:", err);
  }
}

connectToOracle();



const express = require('express');
const app = express();
app.use(express.json());
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    let connection;

    try {
        connection = await oracledb.getConnection({
            user: 'system',
            password: '123',
            connectString: 'localhost/XE'
        });

        const result = await connection.execute(
            `INSERT INTO users (name, email, password) VALUES (:name, :email, :password)`,
            { name, email, password },
            { autoCommit: true }
        );

        res.send("User registered successfully!");
    } catch (err) {
        console.error("Registration error:", err);
        res.status(500).send("Registration failed!");
    } finally {
        if (connection) {
            await connection.close();
        }
    }
});
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});