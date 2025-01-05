const { PROJECTS, TASKS, USERS } = require('../db.js');
const router = require('express').Router();

router.get('/', (req, res) => {
    const detailedTasks = TASKS.map(task => fillTaskDetails(task));
    res.json(detailedTasks);
});

router.get('/:id', (req, res) => {
    const task = TASKS.find(t => t.id === parseInt(req.params.id));
    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }
    res.json(fillTaskDetails(task));
});

router.delete('/:id', (req, res) => {
    const task = TASKS.find(t => t.id === parseInt(req.params.id));
    if (task === null) {
        return res.status(404).json({ error: 'Task not found' });
    }
    console.log("Marked task completed", task.id);
    res.status(204).send();
});

function fillTaskDetails(task) {
    const project = PROJECTS.find(p => p.id === task.projectId);
    const user = USERS.find(u => u.id === task.userId);
    const manager = project ? USERS.find(u => u.id === project.managerId) : null;
    return {
        ...task,
        projectName: project ? project.name : null,
        managerName: manager ? manager.name : null,
        userName: user ? user.username : null,
    };
}

module.exports = router;