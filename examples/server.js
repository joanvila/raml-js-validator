'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');

let app = express();

app.use(bodyParser.json());

let router = express.Router();

let mainRouter = require('./routes/mainEndpoint');
app.use('/', mainRouter);

http.createServer(app).listen(8080, function(){
    console.log('Listening on port 8080');
});
