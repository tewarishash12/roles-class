const express = require('express');
const tasksRouter = require('./routes/tasks.js');
const projectsRouter = require('./routes/projects.js');
const { USERS } = require('./db.js');
const { authMiddleware,authAdmin } = require('./middleware/auth.js');
require("dotenv").config();
const app = express();

// Middleware to parse JSON
app.use(express.json());
app.use(authMiddleware)

app.use('/tasks', tasksRouter);
app.use('/projects', projectsRouter);

app.get('/users',authAdmin, (req, res) => {
    console.log(req.user.username);
    return res.json(USERS);
});

// Start server
app.listen(process.env.MAIN_PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.MAIN_PORT}`);
});
