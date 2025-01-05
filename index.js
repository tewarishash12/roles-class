const express = require('express');
const bodyParser = require('body-parser');
const { PROJECTS, TASKS, USERS } = require('./db.js');

const app = express();
const PORT = 5050;

// Middleware to parse JSON
app.use(bodyParser.json());

// CRUD Routes for Projects
app.get('/projects', (req, res) => {
    res.json(PROJECTS);
});

app.get('/projects/:id', (req, res) => {
    const project = PROJECTS.find(p => p.id === parseInt(req.params.id));
    if (!project) {
        return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
});

app.post('/projects', (req, res) => {
    const { name, managerId } = req.body;
    if (!name || !managerId) {
        return res.status(400).json({ error: 'Name and managerId are required' });
    }
    const newProject = {
        id: PROJECTS.length + 1,
        name,
        managerId,
    };
    PROJECTS.push(newProject);
    res.status(201).json(newProject);
});

app.post('/projects/:id/tasks', (req, res) => {
    const { name, userId } = req.body;
    const projectId = parseInt(req.params.id);
    if (!name || !projectId || !userId) {
        return res.status(400).json({ error: 'Name, projectId, and userId are required' });
    }
    const newTask = {
        id: TASKS.length + 1,
        name,
        projectId,
        userId,
    };
    TASKS.push(newTask);
    res.status(201).json(newTask);
});

app.delete('/projects/:id', (req, res) => {
    const project = PROJECTS.findIndex(p => p.id === parseInt(req.params.id));
    if (project === null) {
        return res.status(404).json({ error: 'Project not found' });
    }
    console.log("Marked project completed", project.id);
    res.status(204).send();
});

// CRUD Routes for Tasks
app.get('/tasks', (req, res) => {
    const detailedTasks = TASKS.map(task => {
        const project = PROJECTS.find(p => p.id === task.projectId);
        const user = USERS.find(u => u.id === task.userId);
        return {
            ...task,
            projectName: project ? project.name : null,
            managerName: project ? USERS.find(u => u.id === project.managerId)?.username : null,
            userName: user ? user.username : null,
        };
    });
    res.json(detailedTasks);
});

app.get('/tasks/:id', (req, res) => {
    const task = TASKS.find(t => t.id === parseInt(req.params.id));
    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
});

app.delete('/tasks/:id', (req, res) => {
    const task = TASKS.find(t => t.id === parseInt(req.params.id));
    if (task === null) {
        return res.status(404).json({ error: 'Task not found' });
    }
    console.log("Marked task completed", task.id);
    res.status(204).send();
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
