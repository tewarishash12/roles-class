const { findProject, findTask } = require('../db.js');

function populateProject(req, res, next) {
    const project = findProject(req.params.id);
    req.project = project;
    next();
}

function populateTask(req, res, next) {
    const task = findTask(req.params.id);
    req.task = task;
    next();
}


module.exports = {
    populateProject,
    populateTask,
}