//registrationAPI.js
const express = require('express');
const app = express();
const port = 3000;
require('dotenv').config();

const departmentRoutes   = require('./routes/departmentRoutes');
const studentRoutes      = require('./routes/studentRoutes');
const courseRoutes       = require('./routes/courseRoutes');
const instructorRoutes   = require('./routes/instructorRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const userRoutes         = require('./routes/userRoutes');
const loginRoutes        = require('./routes/loginRoutes');

app.use(express.json());

//Connect route
app.use('/api/departments', departmentRoutes);
app.use('/api/students', studentRoutes); 
app.use('/api/courses', courseRoutes); 
app.use('/api/instructors', instructorRoutes); 
app.use('/api/registrations', registrationRoutes); 
app.use('/api/users', userRoutes);
app.use('/api', loginRoutes);

//Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
