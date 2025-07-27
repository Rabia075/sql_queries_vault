const express = require('express');
const app = express();
const port = 3000;

const userRoutes = require('./routes/userRoutes');

app.use(express.json());

// Connect route
app.use('/api/users', userRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});