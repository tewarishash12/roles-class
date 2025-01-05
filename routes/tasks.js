const { TASKS, fillTaskDetails } = require('../db.js');
const { populateTask } = require('../middleware/data.js');
const router = require('express').Router();

router.get('/', (req, res) => {
    const detailedTasks = TASKS.map(task => fillTaskDetails(task));
    res.json(detailedTasks);
});

router.get('/:id', populateTask, (req, res) => {
    if (!req.task) {
        return res.status(404).json({ error: 'Task not found' });
    }
    res.json(fillTaskDetails(req.task));
});

router.delete('/:id', populateTask, (req, res) => {
    if (req.task === null) {
        return res.status(404).json({ error: 'Task not found' });
    }
    console.log("Marked task completed", req.task.id);
    res.status(204).send();
});

module.exports = router;