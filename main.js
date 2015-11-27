var http = require("http");
var express = require("express");
var compression = require('compression');
var modrewrite = require('connect-modrewrite');
var app = express();
app.use(compression({level: 9}));
app.use(modrewrite([
  '^[^\\.]*$ /index.html [L]'
]));
app.use(express.static(__dirname + '/dist'));
http.createServer(app).listen(process.env.PORT || 3000);
