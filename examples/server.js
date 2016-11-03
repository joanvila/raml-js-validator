var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');

var app = express();

app.use(bodyParser.json());

var router = express.Router();

var mainRouter = require('./routes/mainEndpoint');
app.use('/', mainRouter);
app.use('/tasks', mainRouter);

http.createServer(app).listen(8080, function(){
    console.log('Listening on port 8080');
});
