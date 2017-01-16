'use strict';

const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Hello world!'
    });
});

router.get('/tasks', (req, res, next) => {
    res.status(200).json({
        tasks: [
            'Do something',
            'Another thing'
        ]
    });
});

router.get('/task/:taskid', (req, res, next) => {
    const taskId = req.params.taskid;

    if (typeof(taskId) !== 'undefined') res.status(200).json(taskId);
    else res.status(400).json('error');
});

router.get('/user/:userid/task/:taskid', (req, res, next) => {
    const userId = req.params.userid;
    const taskId = req.params.taskid;

    if (typeof(taskId) !== 'undefined' && typeof(userId) !== 'undefined') {
        res.status(200).json(taskId);
    } else {
        res.status(400).json('error');
    }
});

router.post('/task', (req, res, next) => {
    const name = req.body.name;
    const owner = req.body.owner;
    if (typeof(name) !== 'undefined' && typeof(owner) !== 'undefined') {
        res.status(200).json({
            name: name,
            owner: owner,
            created: true
        });
    } else {
        res.status(400).json('Task name and owner must be specified');
    }
});

router.get('/task/type/defined', (req, res, next) => {
    res.status(200).json({
        id: 1,
        name: 'Do things'
    });
});

router.get('/task', (req, res, next) => {
    res.status(200).json('ok');
});

// Endpoints with query parameters

router.get('/url/with/params', (req, res, next) => {
    const date_in = req.query.date_in;
    const date_out = req.query.date_out;
    if (date_in && date_out) {
        res.status(200).json([date_in, date_out]);
    } else {
        res.status(400).json('parameters not ok');
    }
});

module.exports = router;
