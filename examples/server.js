'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

const router = express.Router();

const mainRouter = require('./routes/mainEndpoint');
app.use('/', mainRouter);

http.createServer(app).listen(8080, function(){
    console.log('Listening on port 8080');
});
