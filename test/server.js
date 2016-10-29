var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var cors = require('cors');

var app = express();
app.use(cors());

app.use(bodyParser.json());

var router = express.Router();

var mainRouter = require('./routes/mainEndpoint');
app.use('/', mainRouter);

http.createServer(app).listen(8080, function(){
    console.log('Listening on port 8080');
});
