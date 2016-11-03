var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json('Hello world!');
});

router.get('/tasks', (req, res, next) => {
    res.status(200).json([
        'Do something',
        'Another thing'
    ]);
});

module.exports = router;
