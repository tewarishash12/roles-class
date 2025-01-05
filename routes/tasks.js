const { PROJECTS, TASKS, USERS } = require('../db.js');
const router = require('express').Router();

router.get('/', (req, res) => {
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

router.get('/:id', (req, res) => {
    const task = TASKS.find(t => t.id === parseInt(req.params.id));
    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
});

router.delete('/:id', (req, res) => {
    const task = TASKS.find(t => t.id === parseInt(req.params.id));
    if (task === null) {
        return res.status(404).json({ error: 'Task not found' });
    }
    console.log("Marked task completed", task.id);
    res.status(204).send();
});

module.exports = router;