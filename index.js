const express = require('express');
const tasksRouter = require('./routes/tasks.js');
const projectsRouter = require('./routes/projects.js');

const app = express();
const PORT = 5050;

// Middleware to parse JSON
app.use(express.json());

app.use('/tasks', tasksRouter);
app.use('/projects', projectsRouter);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
