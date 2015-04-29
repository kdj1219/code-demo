/**
 * Created by kongdaniel on 4/11/15.
 */

var express = require('express');

var app = express();

app.get('/', function(request, response) {
   response.sendfile(__dirname + "/index.html");
}).listen(8080);