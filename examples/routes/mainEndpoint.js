'use strict';

const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json('Hello world!');
});

router.get('/tasks', (req, res, next) => {
    res.status(200).json([
        'Do something',
        'Another thing'
    ]);
});

router.get('/task/:taskid', (req, res, next) => {
    let taskId = req.params.taskid;

    if (typeof(taskId) !== 'undefined') res.status(200).json(taskId);
    else res.status(400).json('error');
});

router.get('/user/:userid/task/:taskid', (req, res, next) => {
    let userId = req.params.userid;
    let taskId = req.params.taskid;

    if (typeof(taskId) !== 'undefined' && typeof(userId) !== 'undefined') {
        res.status(200).json(taskId);
    } else {
        res.status(400).json('error');
    }
});

router.post('/task', (req, res, next) => {
    res.status(200).json('ok');
});

router.get('/task', (req, res, next) => {
    res.status(200).json('ok');
});

// Endpoints with query parameters

router.get('/url/with/params', (req, res, next) => {
    let date_in = req.param('date_in');
    let date_out = req.param('date_out');
    if (date_in && date_out) {
        res.status(200).json([date_in, date_out]);
    } else {
        res.status(400).json('parameters not ok');
    }
});

module.exports = router;
